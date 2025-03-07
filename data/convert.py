import csv
import json
import os


def csv_to_json(csv_file="data/record.csv", json_file="assets/record.json"):
    with open(csv_file, mode="r", encoding="utf-8-sig") as csv_f:
        csv_reader = csv.DictReader(csv_f)
        result = []
        for row in csv_reader:
            filtered_row = {key: value for key, value in row.items() if value}
            result.append(filtered_row)
        with open(json_file, mode="w", encoding="utf-8") as json_f:
            json.dump(result, json_f, ensure_ascii=False, indent=2)


def txt_to_json(txt_dir="../abstract-shape/input/", json_file="assets/abstract.json"):
    file_names = ["main", "a", "b", "ci", "gh"]
    result = []
    for file_name in file_names:
        file_path = os.path.join(txt_dir, f"abstract_{file_name}.txt")
        with open(file_path, "r", encoding="utf-8") as f:
            while line := f.readline():
                line = line.removesuffix("\n")
                parts = line.split("\t") + [""] * 4
                character, src_one, src_two, comment = parts[0], parts[1], parts[2], parts[3]
                if src_one.startswith("*"):
                    src_one = character + "(" + src_one.removeprefix("*") + ")"
                if src_two.startswith("*"):
                    src_two = character + "(" + src_two.removeprefix("*") + ")"
                # parse comment
                comment = (
                    comment.replace("“", "「")
                    .replace("”", "」")
                    .replace("‘", "『")
                    .replace("’", "』")
                    .replace("SW", "《说文解字》")
                    .replace("GY", "《广韵》")
                    .replace("CY", "《常用漢字表》（日本）")
                    .replace("ZG", "《中国语言资源保护工程汉语方言用字规范》")
                    .replace("JY", "《集韵》")
                    .replace("WS", "《和製漢字の辞典（2014）》")
                    .replace("FY", "《汉语方言大字典》")
                )
                # write
                entry = {"char": character, "src1": src_one}
                if src_two:
                    entry["src2"] = src_two
                if comment:
                    entry["comm"] = comment
                result.append(entry)
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    csv_to_json()
    txt_to_json()
