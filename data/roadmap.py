from datetime import datetime
import json
import requests
from lxml import etree
from urllib.parse import urljoin

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
        print(f"⚠️ cannot find target element：{url}")
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
        result.append({"name": name, "range": range_str, "cps": cps, "cols": cols, "status": status})
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
    with open("assets/roadmap.json", "w", encoding="utf-8") as f:
        json.dump(
            {"date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "data": all_data}, f, ensure_ascii=False, indent=2
        )
