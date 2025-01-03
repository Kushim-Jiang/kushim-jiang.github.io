import csv
import json


def csv_to_json(csv_file, json_file):
    with open(csv_file, mode="r", encoding="utf-8-sig") as csv_f:
        csv_reader = csv.DictReader(csv_f)
        result = []
        for row in csv_reader:
            filtered_row = {key: value for key, value in row.items() if value}
            result.append(filtered_row)
        with open(json_file, mode="w", encoding="utf-8") as json_f:
            json.dump(result, json_f, ensure_ascii=False, indent=2)


csv_file = "data/record.csv"
json_file = "assets/record.json"
csv_to_json(csv_file, json_file)
