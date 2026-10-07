# GitHub Issues

## #1 — Transliteration parser

- URL: https://github.com/Kushim-Jiang/kushim-jiang.github.io/issues/1
- State: OPEN

The code to parse the transliteration system:

````python
def decompose(s: str):
    result = []
    current_part = ""
    for char in s:
        if char in "abcdefghijklmnopqrstuvwxyz¹²³⁴⁵⁶⁷⁸⁹":
            if current_part:
                result.append(current_part)
            current_part = char
        else:
            current_part += char
    if current_part:
        result.append(current_part)
    return result
````

## #2 — Note block

- URL: https://github.com/Kushim-Jiang/kushim-jiang.github.io/issues/2
- State: OPEN

````html
<style>
    note {
        display: block;
        border: 1px solid;
        padding: 1em 1.5em;
        margin: 1.5em 0em;
    }
</style>

<note>
    Note that ...
</note>
````
