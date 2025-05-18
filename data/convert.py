import csv
import json
from pathlib import Path

import yaml

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


def md_to_yaml(
    md_dir: Path = repo_dir / "_scripts",
    data_dir: Path = repo_dir / "data_yaml",
) -> None:
    """Convert Markdown files to YAML files, grouping by last part of stem."""

    md_files: list[Path] = list(md_dir.glob("*.md"))
    grouped_content: dict[str, list[dict[str, list[list[str]]]]] = {}

    for md_file in md_files:
        key: str = md_file.stem.split("-")[-1]
        entries: list[dict[str, list[list[str]]]] = []
        with md_file.open(encoding="utf-8") as file:
            lines: list[str] = file.readlines()
        current_image: str | None = None

        for line in lines:
            if line.startswith("!["):
                image_name: str = line.split("](")[0].split("![")[1]
                current_image = image_name
                entries.append({image_name: []})
            elif "<div class=" in line and current_image:
                content: list[str] = [item.split(">")[-1] for item in line.split("</p>")]
                entries[-1][current_image].append([f".{content[0]}", f".{content[1]}"])
        if key not in grouped_content:
            grouped_content[key] = []
        grouped_content[key].extend(entries)

    for key, content in grouped_content.items():
        yaml_file: Path = data_dir / f"{key}.yaml"
        with yaml_file.open("w", encoding="utf-8") as file:
            yaml.dump(content, file, allow_unicode=True, sort_keys=False, indent=2)


if __name__ == "__main__":
    csv_to_json()
    txt_to_json()
    md_to_yaml()
