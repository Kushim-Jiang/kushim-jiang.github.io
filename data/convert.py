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
        file.write(custom_dump(ordered))


def custom_dump(obj, indent=2):
    compact_json = json.dumps(obj, separators=(",", ":"), indent=indent, ensure_ascii=False)
    parsed = json.loads(compact_json)

    def encode_with_condition(o):
        if isinstance(o, dict):
            if len(o) >= 10:
                items = []
                for k, v in o.items():
                    k_str = json.dumps(k, ensure_ascii=False)
                    v_str = encode_with_condition(v)
                    items.append(f"{' ' * indent}{k_str}: {v_str}")
                return "{\n" + ",\n".join(items) + "\n}"
            else:
                items = []
                for k, v in o.items():
                    k_str = json.dumps(k, ensure_ascii=False)
                    v_str = encode_with_condition(v)
                    items.append(f"{k_str}: {v_str}")
                return "{" + ", ".join(items) + "}"
        elif isinstance(o, list):
            if len(o) >= 10:
                items = []
                for item in o:
                    items.append(" " * indent + encode_with_condition(item))
                return "[\n" + ",\n".join(items) + "\n]"
            else:
                items = []
                for item in o:
                    items.append(encode_with_condition(item))
                return "[" + ", ".join(items) + "]"
        else:
            return json.dumps(o, ensure_ascii=False)

    return encode_with_condition(parsed)


if __name__ == "__main__":
    csv_to_json()
    md_to_json()
