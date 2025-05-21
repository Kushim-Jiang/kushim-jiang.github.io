import csv
import json
import re
from collections import OrderedDict
from pathlib import Path

repo_dir = Path(__file__).parent.parent


def csv_to_json(
    csv_file: Path = repo_dir / "data" / "record.csv",
    json_file: Path = repo_dir / "assets" / "record.json",
) -> None:
    """Convert a CSV file to a JSON file."""
    with csv_file.open("r", encoding="utf-8-sig") as csv_f:
        csv_reader = csv.DictReader(csv_f)
        result = [{key: value for key, value in row.items() if value} for row in csv_reader]
    with json_file.open("w", encoding="utf-8") as json_f:
        json.dump(result, json_f, ensure_ascii=False, indent=2)


def txt_to_json(
    txt_dir: Path = repo_dir.parent / "abstract-shape" / "input",
    json_file: Path = repo_dir / "assets" / "abstract.json",
) -> None:
    """Convert multiple TXT files to a single JSON file."""
    file_names = ["main", "a", "b", "ci", "gh"]
    replacements = {
        "“": "「",
        "”": "」",
        "‘": "『",
        "’": "』",
        "SW": "《说文解字》",
        "GY": "《广韵》",
        "CY": "《常用漢字表》（日本）",
        "ZG": "《中国语言资源保护工程汉语方言用字规范》",
        "JY": "《集韵》",
        "WS": "《和製漢字の辞典（2014）》",
        "FY": "《汉语方言大字典》",
    }
    result = []

    for file_name in file_names:
        file_path = txt_dir / f"abstract_{file_name}.txt"
        with file_path.open("r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                parts = line.split("\t") + [""] * 4
                character, src_one, src_two, comment = parts[:4]

                if src_one.startswith("*"):
                    src_one = f"{character}({src_one.removeprefix('*')})"
                if src_two.startswith("*"):
                    src_two = f"{character}({src_two.removeprefix('*')})"

                for old, new in replacements.items():
                    comment = comment.replace(old, new)

                entry = {"char": character, "src1": src_one}
                if src_two:
                    entry["src2"] = src_two
                if comment:
                    entry["comm"] = comment
                result.append(entry)

    with json_file.open("w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)


def md_to_json(
    md_dir: Path = repo_dir / "_scripts",
    json_file: Path = repo_dir / "assets" / "scripts.json",
) -> None:
    """Convert all Markdown files to a single JSON file, extracting letter.html includes and grouping by icon key."""

    md_files: list[Path] = list(md_dir.glob("*.md"))
    result: dict[str, list[dict[str, str]]] = {}

    icon_re = re.compile(r"""{%\s*include\s+icon\.html\s+([^%]+)%}""")
    letter_re = re.compile(r"""{%\s*include\s+letter\.html\s+([^%]+)%}""")
    param_re = re.compile(r'(\w+)="([^"]*)"')

    for md_file in md_files:
        current_key = None
        with md_file.open(encoding="utf-8") as file:
            for line in file:
                icon_m = icon_re.search(line)
                if icon_m:
                    params = dict(param_re.findall(icon_m.group(1)))
                    language = params.get("language", "")
                    script = params.get("script", "")
                    year = params.get("year", "")
                    key_parts = [language, script, year]
                    key = "-".join([part for part in key_parts if part])
                    current_key = key if key else None
                    continue

                letter_m = letter_re.search(line)
                if letter_m and current_key:
                    params = dict(param_re.findall(letter_m.group(1)))
                    if current_key not in result:
                        result[current_key] = []
                    result[current_key].append(params)

    ordered = OrderedDict(sorted(result.items()))
    json_file.parent.mkdir(parents=True, exist_ok=True)
    with json_file.open("w", encoding="utf-8") as file:
        json.dump(ordered, file, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    csv_to_json()
    txt_to_json()
    md_to_json()
