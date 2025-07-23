---
layout: post
title: Abstract Shape
category: tools
---

<style>
    input[type="text"] {
        padding: 8px;
        margin-bottom: 10px;
        width: 300px;
    }

    code {
        font-size: 1em !important;
    }

    @font-face {
        font-family: "ob";
        src: url("/assets/fonts/ZihuiSongJGW.ttf");
    }
    
    s-ob {
        font-family: "ob";
        font-size: 160% !important;
    }
</style>

<input type="text" id="search-box" placeholder="Search..." oninput="handleInput()">

<div id="results-blocks"></div>

<script>
    let ENTRIES = [];
    let VARIANTS = {};

    function loadRecords() {
        fetch("{{ '/assets/abstract.json' | relative_url }}")
            .then(response => response.json())
            .then(data => {
                ENTRIES = Array.isArray(data.entries) ? data.entries : [];
                VARIANTS = typeof data.variants === 'object' ? data.variants : {};
                GETA = typeof data.geta === 'object' ? data.geta : {};
                OB = typeof data.ob === 'object' ? data.ob : {};
            })
            .catch(error => console.error('Error loading ENTRIES:', error));
    }

    async function handleInput() {
        const val = document.getElementById('search-box').value;
        if (!val.trim()) {
            document.getElementById('results-blocks').innerHTML = '';
            return;
        }

        await loadRecords();
        const charsSet = new Set(Array.from(val).filter(c => c.trim() !== ''));
        let visitedCharsSet = new Set();
        const chars = Array.from(charsSet).sort((a, b) => a.codePointAt(0) - b.codePointAt(0));
        createBlocksForInput(chars, charsSet, visitedCharsSet);
    }

    function emphasize(str, charsSet) {
        if (!str) return '';
        return Array.from(String(str)).map(c =>
            charsSet.has(c) ? `<span style="color:#1976d2;">${c}</span>` : c
        ).join('');
    }

    function extractBrackets(str) {
        if (typeof str !== 'string') return [];
        return str.match(/\[[^\]]+\]/g) || [];
    }

    /*****************************
     * @args `entry`, an entry from `abstract.json > entries`
     * @args `div`, a `div` element to show the abstract shape expression
     ****************************/
    function writeExpression(entry, div) {
        if (!entry.char) {
            div.innerHTML += `<code>${entry.ids}</code>`;
        } else if (entry.ids) {
            div.innerHTML += `<code>|${entry.char}| &lt; ${entry.ids}</code>`;
        } else if (entry.is) {
            div.innerHTML += `<code>|${entry.char}| → |${entry.is}|</code>`;
        } else {
            div.innerHTML += `<code>|${entry.char}|</code>`;
        }
        if (entry.refer) {
            div.innerHTML += `<code> ~ ${entry.refer}</code>`;
        }
        if (entry.to) {
            div.innerHTML += `<code> * |${entry.to}|</code>`;
        }

        if (entry.note) {
            const noteDiv = document.createElement('div');
            noteDiv.textContent = entry.note;
            noteDiv.style.marginLeft = '2em';
            noteDiv.style.color = '#666';
            noteDiv.style.fontSize = '0.95em';
            div.appendChild(document.createElement('br'));
            div.appendChild(noteDiv);
        }

        Object.entries(GETA).forEach(([getaKey, getaValue]) => {
            if ((entry.ids && entry.ids.includes(getaKey)) ||
                (entry.note && entry.note.includes(getaKey))) {
                const noteDiv = document.createElement('div');
                noteDiv.innerHTML += `❗ <code>|${getaKey}|</code> ${getaValue}</span>`;
                noteDiv.style.marginLeft = '2em';
                noteDiv.style.color = '#666';
                noteDiv.style.fontSize = '0.95em';
                div.appendChild(noteDiv);
            }
        });
    }

    /*****************************
     * @args `abs_ids`: str, an decomposed abstract IDS included in the `abstract.json > variants`
     * @args `block`: <div>, a `div` element to show the abstract shape expression
     * @args `charsSet`: set[str], a set built from user input
     * @args `size`: float, specifies the `font-size`
     * @args `isIdsShown`: bool, whether to show the IDS
     ****************************/
    function writeTitle(block, abs_ids, charsSet, size, isIdsShown) {
        let variantStr = VARIANTS[abs_ids] || '';
        let [str1, str2 = ''] = variantStr.split('@');
        if (!str1) {
            str1 = "X";
        }

        const title = document.createElement('span');
        let str1Style = `font-weight:bold;font-size:${size}em;`;

        const emphasizedStr1 = emphasize(str1, charsSet);
        let str2Arr = str2 ? str2.split(',') : [];
        const emphasizedStr2 = str2Arr.length > 0
            ? str2Arr.map(s => emphasize(s.trim(), charsSet)).join(', ')
            : '';

        title.innerHTML =
            `<span style="${str1Style}">${emphasizedStr1}</span>` +
            (str2 ? ` <span style="font-size:${size}em;color:#666;">(${emphasizedStr2})</span>` : '');
        if (isIdsShown) {
            title.innerHTML += ` <span style="font-size:1em;vertical-align:middle;"><code>${abs_ids}</code></span>`;
        }

        let obStr = OB[abs_ids] || '';


        function writeOB(obStr) {
            let [obStr1, obStr2 = ''] = obStr.split('@');

            function parseObStr(str) {
                if (!str) return null;
                const chars = Array.from(str);
                if (chars.length < 5) return null;

                const nonBmpChar = chars[0];
                const bmpChars = chars.slice(1, 5).join('');
                return { nonBmpChar, bmpChars };
            }
            
            function generateSpan({ nonBmpChar, bmpChars }) {
                return `<span title="《甲骨文字詁林》第${bmpChars}号。">${nonBmpChar}</span>`;
            }
            
            let result = '';
            const obStr1Data = parseObStr(obStr1);
            if (obStr1Data) {
                result += ` <span style="font-family:Alegreya,ob;${str1Style}">${generateSpan(obStr1Data)}</span>`
            }
            
            if (obStr2) {
                const obStr2Groups = [];
                const chars = Array.from(obStr2);
                
                for (let i = 0; i < chars.length; i += 5) {
                    const group = chars.slice(i, i + 5).join('');
                    const groupData = parseObStr(group);
                    if (groupData) {
                        obStr2Groups.push(groupData);
                    }
                }
                
                const obStr2Html = obStr2Groups.map(generateSpan).join('');
                result += ` <span style="font-family:Alegreya,ob;font-size:${size}em;color:#666;">(${obStr2Html})</span>`;
            }

            return result;
        }

        title.innerHTML += writeOB(obStr);
        block.appendChild(title);
    }

    /*****************************
     * @args `abs_ids`: str, an decomposed abstract IDS included in the `abstract.json > variants`
     * @args `entry`, an entry from `abstract.json > entries`
     * @args `charsSet`: set[str], a set built from user input
     * @args `size`: float, specifies the `font-size`
     * @args `isIdsShown`: bool, whether to show the IDS
     ****************************/
    function writeX(block, entry, charsSet, size, isIdsShown) {
        const str1 = entry.char;
        const str2 = '';
        const abs_ids = 'X';

        const title = document.createElement('span');
        let str1Style = `font-weight:bold;font-size:${size}em;`;

        const emphasizedStr1 = emphasize(str1, charsSet);
        let str2Arr = str2 ? str2.split(',') : [];
        const emphasizedStr2 = str2Arr.length > 0
            ? str2Arr.map(s => emphasize(s.trim(), charsSet)).join(', ')
            : '';

        title.innerHTML =
            `<span style="${str1Style}">${emphasizedStr1}</span>` +
            (str2 ? ` <span style="font-size:${size}em;color:#666;">(${emphasizedStr2})</span>` : '');
        if (isIdsShown) {
            title.innerHTML += ` <span style="font-size:1em;vertical-align:middle;"><code>${abs_ids}</code></span>`;
        }
        block.appendChild(title);

        if (entry.note) {
            const noteDiv = document.createElement('div');
            noteDiv.textContent = entry.note;
            noteDiv.style.marginLeft = '2em';
            noteDiv.style.color = '#666';
            noteDiv.style.fontSize = '0.95em';
            block.appendChild(document.createElement('br'));
            block.appendChild(noteDiv);
        }

        Object.entries(GETA).forEach(([getaKey, getaValue]) => {
            if ((abs_ids && abs_ids.includes(getaKey)) ||
                (entry.note && entry.note.includes(getaKey))) {
                const noteDiv = document.createElement('div');
                noteDiv.innerHTML += `❗ <code>|${getaKey}|</code> ${getaValue}</span>`;
                noteDiv.style.marginLeft = '2em';
                noteDiv.style.color = '#666';
                noteDiv.style.fontSize = '0.95em';
                block.appendChild(noteDiv);
            }
        });
    }

    /*****************************
     * create a `div` according to an entry from `abstract.json > entries`
     * the `div` include the expression and the note
     ****************************/
    function createEntryDiv(entry) {
        const div = document.createElement('div');
        div.style.marginTop = '8px';
        div.style.padding = '6px';
        div.style.border = '1px solid #f0f0f0';
        div.style.borderRadius = '6px';
        div.style.background = '#fafcff';

        writeExpression(entry, div);
        return div;
    }

    /*****************************
     * create a `div` according to an entry from `abstract.json > entries`
     * the `div` include the title (with expression) and many `div` for all the variants
     ****************************/
    function createSubBlock(subEntry, charsSet, visitedCharsSet) {
        let abs_ids = subEntry.new_ids || subEntry.ids;
        const variantStr = VARIANTS[abs_ids] || '';
        let [str1, str2 = ''] = variantStr.split('@');

        const block = document.createElement('div');
        block.style.marginLeft = `2em`;
        block.style.marginTop = '4px';
        block.style.padding = '4px 4px 4px 8px';
        block.style.borderLeft = '2px solid rgb(224,224,224)';
        block.style.background = '#f6f8fa';

        if (abs_ids) {
            writeTitle(block, abs_ids, charsSet, 1.2, true);
            block.appendChild(document.createElement('br'));
        } else {
            writeX(block, subEntry, charsSet, 1.2, true);
        }

        if (abs_ids) {
            const relatedEntries = ENTRIES.filter(item =>
                item.ids === abs_ids || item.new_ids === abs_ids || (item.is && variantStr.includes(item.is))
            );

            let idsList = [abs_ids];
            relatedEntries.forEach(item => {
                block.appendChild(createEntryDiv(item));
                if (item.refer) idsList.push(item.refer);
                if (item.to) {
                    Object.entries(VARIANTS).forEach(([key, value]) => {
                        if (value.includes(item.to)) idsList.push(key);
                    });
                }
            });

            let newIdsList = []
            idsList.forEach(ids => {
                if (!newIdsList.includes(ids)) {
                    newIdsList.push(ids);
                }
            })

            createSubBlocks(newIdsList, charsSet, visitedCharsSet, block);
        }
        return block;
    }

    /*****************************
     * recursively create all the sub-blocks for a list of decomposed IDS
     ****************************/
    function createSubBlocks(ids, charsSet, visitedCharsSet, parentDiv) {
        if (!ids) return;
        const brackets = Array.isArray(ids) ? ids.filter(Boolean) : [ids];

        function processEntries(entries) {
            if (entries) {
                entries.forEach(entry => {
                    if (entry.new_ids || entry.ids) {
                        if (!visitedCharsSet.has(entry.new_ids || entry.ids)) {
                            visitedCharsSet.add(entry.new_ids || entry.ids);
                            parentDiv.appendChild(createSubBlock(entry, charsSet, visitedCharsSet));
                        }
                    }
                });
            }
        }

        // search for refer
        brackets.forEach(bracketStr => {
            const variantStr = VARIANTS[bracketStr] || '';
            const subEntries = ENTRIES.filter(r => variantStr.includes(r.is));
            processEntries(subEntries);
        });

        brackets.forEach(bracketStr => {
            const subEntries = ENTRIES.filter(r => (r.new_ids || r.ids) === bracketStr);
            processEntries(subEntries);
        });

        // search for complex ids
        brackets.forEach(bracketStr => {
            const allMatchingEntries = ENTRIES.filter(r =>
                bracketStr.includes(r.new_ids || r.ids) && (r.new_ids || r.ids) !== `[${r.char}]` && (r.new_ids || r.ids) !== bracketStr
            );
            const subEntries = allMatchingEntries.filter(entry => {
                const entryIds = entry.new_ids || entry.ids;
                return !allMatchingEntries.some(otherEntry => {
                    const otherIds = otherEntry.new_ids || otherEntry.ids;
                    return otherIds !== entryIds && otherIds.includes(entryIds);
                });
            });
            processEntries(subEntries);
        });

        // search for simple ids
        brackets.forEach(bracketStr => {
            const subEntries = ENTRIES.filter(r =>
            (((bracketStr.includes(r.new_ids || r.ids) && (r.new_ids || r.ids) === `[${r.char}]`) ||
                (bracketStr.includes(`[${r.char}]`) && r.x)) && !visitedCharsSet.has(r.new_ids || r.ids))
            );
            processEntries(subEntries);
        })
    }

    /*****************************
     * create a `div` block according to a key-value pair from `abstract.json > variants`
     * the key is the decomposed abstract shape expression, the values is main form @ variant forms
     ****************************/
    function createBlock(abs_ids, char, charsSet, visitedCharsSet, container) {
        if (visitedCharsSet.has(abs_ids)) return;
        visitedCharsSet.add(abs_ids);
        const variantStr = VARIANTS[abs_ids] || '';

        const block = document.createElement('div');
        block.style.marginBottom = '1em';
        block.style.border = '1px solid #eee';
        block.style.padding = '10px';
        block.style.borderRadius = '8px';

        writeTitle(block, abs_ids, charsSet, 1.8, true);
        block.appendChild(document.createElement('br'));

        if (abs_ids) {
            const relatedEntries = ENTRIES.filter(item =>
                item.ids === abs_ids || item.new_ids === abs_ids || (item.is && variantStr.includes(item.is))
            );

            let idsList = [abs_ids];
            relatedEntries.forEach(item => {
                block.appendChild(createEntryDiv(item));
                if (item.refer) idsList.push(item.refer);
                if (item.to) {
                    Object.entries(VARIANTS).forEach(([k, value]) => {
                        if (value.includes(item.to)) idsList.push(k);
                    });
                }
            });

            createSubBlocks(idsList, charsSet, visitedCharsSet, block);
        }
        container.appendChild(block);
    }

    /*****************************
     * according to user input, generate many `div` block for abstract shape
     * in the `abstract.json > variants`, find all the key-value pair that include the user input
     * and for each key-value pair, generate a `div` block
     ****************************/
    function createBlocksForInput(chars, charsSet, visitedCharsSet) {
        const container = document.getElementById('results-blocks');
        container.innerHTML = '';

        Object.entries(VARIANTS).forEach(([key, value]) => {
            chars.forEach(char => {
                if (value && value.includes && value.includes(char)) {
                    createBlock(key, char, charsSet, visitedCharsSet, container);
                }
            });
        });
    }

    window.onload = function () {
        loadRecords();
        document.getElementById('search-box').addEventListener('input', handleInput);
    }
</script>
