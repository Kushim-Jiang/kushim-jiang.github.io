import argparse
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from typing import TypedDict
from urllib.parse import urljoin

import requests
from lxml import etree  # type: ignore

BASE_URL = "https://sew.unicode.org/roadmaps"
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "Mozilla/5.0"})


def _pad_left(s: str, length: int, char: str = "0") -> str:
    return s.rjust(length, char).upper()


def _parse_roadmap_page(url: str) -> list:
    response = SESSION.get(url)
    response.raise_for_status()
    tree = etree.HTML(response.text)
    result = []
    entries = tree.cssselect("#container > div.plane.shadow > svg > g > g")
    if not entries:
        print(f"⚠️ cannot find target element: {url}")
        return result
    for entry in entries:
        if entry is None:
            continue
        from_cp = int(entry.get("data-from", 0))
        to_cp = int(entry.get("data-to", 0))
        range_str = f"U+{_pad_left(hex(from_cp)[2:], 4)}..U+{_pad_left(hex(to_cp)[2:], 4)}"
        cps = to_cp - from_cp + 1
        cols = (cps + 15) // 16
        name_elem = entry.find(".//*[1]")
        name = name_elem.text.strip() if (name_elem.text is not None) else "Unknown"
        if name == "Unknown":
            print(f"⚠️ cannot find name for entry: {from_cp}..{to_cp}")
            continue

        # short name
        short = ""
        text_elem = entry.find(".//text")
        if text_elem is not None:
            short = text_elem.text.strip()

        status = "Unallocated"
        flags = []
        for cls in entry.get("class", "").split():
            if cls == "publ":
                status = "Published"
            elif cls == "acpt":
                status = "Accepted for publication"
            elif cls == "prov":
                status = "Provisionally assigned"
            elif cls == "rdmp":
                status = "Roadmapped"
            elif cls == "tent":
                status = "Tentative"
            elif cls == "free":
                status = "Unallocated"
            elif cls == "rtl":
                flags.append("right-to-left")
            elif cls == "ctrl":
                flags.append("control characters")
            elif cls == "nc":
                flags.append("noncharacters")
        if flags:
            status += f" ({', '.join(flags)})"

        # url
        url = ""
        a_elem = entry.find(".//a")
        if a_elem is not None:
            url = a_elem.get("href")

        item = {
            "name": name,
            "short": short,
            "range": range_str,
            "cps": cps,
            "cols": cols,
            "url": url,
            "status": status,
        }

        result.append(item)
    return result


def _get_roadmap_links() -> list:
    response = SESSION.get(BASE_URL)
    response.raise_for_status()
    tree = etree.HTML(response.text)
    links = tree.cssselect("#sidenav a[href]")
    return [urljoin(BASE_URL, link.get("href")) for link in links if urljoin(BASE_URL, link.get("href")) != BASE_URL]


def parse_roadmap() -> None:
    sub_links = _get_roadmap_links()
    print(f"🔗 found {len(sub_links)} subpages")
    all_data = []
    for idx, link in enumerate(sub_links, 1):
        print(f"📄 parsing {idx}/{len(sub_links)}：{link}")
        all_data.extend(_parse_roadmap_page(link))
    print(f"\n✅ parsed {len(all_data)} blocks of encoding data")
    with open("assets/json/roadmap.json", "w", encoding="utf-8") as f:
        json.dump(
            {"date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "data": all_data},
            f,
            ensure_ascii=False,
            indent=2,
        )


class RoadmapBlock(TypedDict):
    name: str
    range: str
    cps: int
    cols: int
    status: str


class Roadmap(TypedDict):
    date: str
    data: list[RoadmapBlock]


def _load_roadmap(dir: str) -> Roadmap:
    with open(dir, "r", encoding="utf-8") as f:
        return json.load(f)


def get_names(roadmap: Roadmap, dump: bool = False) -> list[str]:
    result = []
    for block in roadmap["data"]:
        name = block["name"]
        if name not in result:
            result.append(name)
    result.sort()
    if dump:
        with open("assets/roadmap.txt", "w", encoding="utf-8") as f:
            f.write("\n".join(result))
    return result


def get_names_from_file(dir: str, dump: bool = False) -> None:
    roadmap = _load_roadmap(dir)
    names = get_names(roadmap, dump)

    existing_data = {}
    try:
        with open("assets/json/roadmap_zh.json", "r", encoding="utf-8") as f:
            for item in json.load(f):
                existing_data[item["name"]] = item
    except FileNotFoundError:
        pass

    dicts = []
    for name in names:
        if name in existing_data:
            dicts.append(existing_data[name])
        else:
            dicts.append({"name": name, "zh-cn": "", "note": ""})

    dicts.sort(key=lambda x: x["name"])
    with open("assets/json/roadmap_zh.json", "w", encoding="utf-8") as f:
        json.dump(dicts, f, ensure_ascii=False, indent=2)


def check_missing_names() -> None:
    roadmap = _load_roadmap("assets/json/roadmap.json")
    roadmap_names = get_names(roadmap)

    with open("assets/json/roadmap_zh.json", "r", encoding="utf-8") as f:
        roadmap_zh = json.load(f)
    roadmap_zh_names = [item["name"] for item in roadmap_zh]

    missing_names = [name for name in roadmap_names if name not in roadmap_zh_names]

    if missing_names:
        print("⚠️ name not in roadmap_zh.json:")
        for name in missing_names:
            print(f"- {name}")
    else:
        print("✅ all names in roadmap.json are in roadmap_zh.json")


class BrokenLink(TypedDict):
    url: str
    reason: str
    names: list[str]


def _check_url(url: str, timeout: int = 20) -> tuple[bool, str]:
    try:
        response = SESSION.head(url, timeout=timeout, allow_redirects=True)
        if response.status_code in (403, 405, 501):
            response = SESSION.get(url, timeout=timeout, allow_redirects=True, stream=True)
    except requests.RequestException as exc:
        return False, type(exc).__name__
    if response.status_code >= 400:
        return False, f"HTTP {response.status_code}"
    return True, f"HTTP {response.status_code}"


def check_links(roadmap: Roadmap | None = None, workers: int = 8, timeout: int = 20) -> list[BrokenLink]:
    if roadmap is None:
        roadmap = _load_roadmap("assets/json/roadmap.json")

    url_names: dict[str, list[str]] = {}
    for block in roadmap["data"]:
        url = block.get("url") or ""
        if not url:
            continue
        url_names.setdefault(url, []).append(block["name"])

    print(f"🔗 checking {len(url_names)} link(s) ...")
    broken: list[BrokenLink] = []
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(_check_url, url, timeout): url for url in url_names}
        for future in as_completed(futures):
            url = futures[future]
            ok, reason = future.result()
            if not ok:
                broken.append({"url": url, "reason": reason, "names": url_names[url]})
    broken.sort(key=lambda item: item["url"])

    if broken:
        print(f"⚠️ {len(broken)} unreachable link(s):")
        for item in broken:
            print(f"- [{item['reason']}] {item['url']}  <- {', '.join(item['names'])}")
    else:
        print("✅ all links in roadmap.json are reachable")
    return broken


def main() -> None:
    parser = argparse.ArgumentParser(description="Unicode roadmap utilities")
    parser.add_argument(
        "--check-links",
        action="store_true",
        help="only check that every link in assets/json/roadmap.json is reachable",
    )
    args = parser.parse_args()

    if args.check_links:
        check_links()
        return

    parse_roadmap()
    get_names_from_file("assets/json/roadmap.json")
    check_missing_names()


if __name__ == "__main__":
    main()
