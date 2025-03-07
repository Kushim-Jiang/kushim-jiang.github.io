---
layout: post
title: Abstract Shape
category: tools
---

<style>
    table, th, td {
        border-collapse: collapse;
        padding: 5px;
    }
    th {
        text-align: left;
    }
    input[type="text"] {
        padding: 8px;
        margin-bottom: 10px;
        width: 300px;
    }
    .evi-cell {
        position: relative;
    }
    #pagination {
        margin-top: 10px;
    }
    .page-button {
        display: inline-block;
        margin: 0 5px;
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        background-color: #f9f9f9;
    }
    .page-button.active {
        background-color: #007BFF;
        color: white;
    }
    .page-button:hover {
        background-color: #007BFF;
        color: white;
    }
    .ellipsis {
        margin: 0 5px;
        color: #666;
        cursor: default;
    }
</style>

<input type="text" id="search-box" placeholder="Search..." oninput="filterRecords()">
<span id="pagination"></span>
<table id="results-table">
    <thead>
        <tr>
            <th>Character</th>
            <th colspan="2">Abstract Shape</th>
            <th>Comment</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>

<script>
    let records = [];
    const keys = ['char', 'src1', 'src2', 'comm'];
    const recordsPerPage = 20;
    let currentPage = 1;
    let filteredRecords = [];

    function loadRecords() {
        fetch("{{ '/assets/abstract.json' | relative_url }}")
            .then(response => response.json())
            .then(data => {
                records = data;
            })
            .catch(error => console.error('Error loading records:', error));
    }

    function displayRecords(page, searchQuery) {
        const startIndex = (page - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const recordsToDisplay = filteredRecords.slice(startIndex, endIndex);

        const tableBody = document.querySelector('#results-table tbody');
        tableBody.innerHTML = '';

        recordsToDisplay.forEach(record => {
        const row = document.createElement('tr');
        
        keys.forEach(key => {
            const cell = document.createElement('td');
            cell.textContent = record[key] || '';
            
            if (key === 'char') {
                if (record.char === searchQuery) {
                    cell.style.color = '#0066cc';
                }
                if (record.src1 && (record.src1 === record.char || record.src1.startsWith(record.char + '('))) {
                    cell.style.fontWeight = '700';
                }
            }
            
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
    }

    function createPagination(searchQuery) {
        const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
        const paginationDiv = document.getElementById('pagination');
        paginationDiv.innerHTML = '';

        if (totalPages <= 1) return;

        function addButton(page, label, isActive = false) {
            const button = document.createElement('span');
            button.textContent = label;
            button.className = 'page-button';
            if (isActive) {
                button.classList.add('active');
            }

            button.addEventListener('click', () => {
                currentPage = page;
                displayRecords(currentPage, searchQuery);
                createPagination();
            });

            paginationDiv.appendChild(button);
        }

        function addEllipsis() {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'ellipsis';
            paginationDiv.appendChild(ellipsis);
        }

        addButton(1, '1', currentPage === 1);

        if (currentPage > 3) {
            addEllipsis();
        }

        if (currentPage > 2) {
            addButton(currentPage - 1, '<');
        }

        if (currentPage > 1) {
            addButton(currentPage, currentPage.toString(), true);
        }

        if (currentPage < totalPages - 1) {
            addButton(currentPage + 1, '>');
        }

        if (currentPage < totalPages - 2) {
            addEllipsis();
        }

        if (currentPage < totalPages) {
            addButton(totalPages, totalPages.toString(), currentPage === totalPages);
        }
    }

    function extractUniqueChars(str) {
        return [...new Set(str.split(''))].filter(c => c.trim() !== '');
    }

    function filterRecords() {
        const searchQuery = document.getElementById('search-box').value.trim().toLowerCase();
        if (!searchQuery) {
            document.querySelector('#results-table tbody').innerHTML = '';
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        const primaryMatches = records.filter(record => 
            record.char.toLowerCase().includes(searchQuery)
        );

        const addedRecords = new Set();
        const processedChars = new Set();

        primaryMatches.forEach(record => {
            addedRecords.add(record);
            extractChars(record.src1 + record.src2).forEach(c => {
                const normalized = c.toLowerCase();
                if (!processedChars.has(normalized)) {
                    processedChars.add(normalized);
                }
            });
        });

        const charQueue = Array.from(processedChars);
        while (charQueue.length > 0) {
            const currentChar = charQueue.shift();
            records.forEach(record => {
                if (
                    !addedRecords.has(record) &&
                    record.char.toLowerCase().includes(currentChar)
                ) {
                    addedRecords.add(record);
                    extractChars(record.src1 + record.src2).forEach(c => {
                        const normalized = c.toLowerCase();
                        if (!processedChars.has(normalized)) {
                            processedChars.add(normalized);
                            charQueue.push(normalized);
                        }
                    });
                }
            });
        }

        const existingChars = new Set([...addedRecords].map(r => r.char.toLowerCase()));
        records.forEach(record => {
            if (addedRecords.has(record)) return;

            const str1 = (record.str1 || '').toLowerCase();
            const str2 = (record.str2 || '').toLowerCase();
            const isMatch = [...existingChars].some(char => 
                str1 === char || str2 === char ||
                str1 === `=${char}` || str2 === `=${char}` ||
                str1 === `*${char}` || str2 === `*${char}`
            );
            if (isMatch) addedRecords.add(record);
        });

        filteredRecords = [...addedRecords];

        currentPage = 1;
        displayRecords(currentPage, searchQuery);
        createPagination(searchQuery);
    }

    function extractChars(str) {
        const chars = Array.from(str.normalize());    
        return [...new Set(chars)].filter(c => {
            const code = c.codePointAt(0);
            return code > 0x1F && !/\s/.test(c) && !(code >= 0xD800 && code <= 0xDFFF);
        });
    }

    loadRecords();
</script>
