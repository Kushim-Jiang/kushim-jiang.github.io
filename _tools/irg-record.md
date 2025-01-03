---
layout: post
title: IRG Records
category: tools
---

<style>
    table, th, td {
        border: 1px solid black;
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
    tbody > tr > td:nth-child(6), tbody > tr > td:nth-child(4) {
        text-wrap-mode: nowrap;
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
            <th>Doc</th>
            <th>Row</th>
            <th>Char</th>
            <th>IDS</th>
            <th>Evidence</th>
            <th>Src Ref</th>
            <th>Comment</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>

<script>
    let records = [];
    const keys = ['doc', 'no', 'char', 'ids', 'evi', 'ref', 'comment'];
    const recordsPerPage = 20;
    let currentPage = 1;
    let filteredRecords = [];

    function loadRecords() {
        fetch("{{ '/assets/record.json' | relative_url }}")
            .then(response => response.json())
            .then(data => {
                records = data;
            })
            .catch(error => console.error('Error loading records:', error));
    }

    function displayRecords(page) {
        const startIndex = (page - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const recordsToDisplay = filteredRecords.slice(startIndex, endIndex);

        const tableBody = document.querySelector('#results-table tbody');
        tableBody.innerHTML = '';

        recordsToDisplay.forEach(record => {
            const row = document.createElement('tr');

            keys.forEach(key => {
                const cell = document.createElement('td');
                const value = record[key] || '';
                if (key === 'doc' && value) {
                    const link = document.createElement('a');
                    link.href = 'https://www.unicode.org/cgi-bin/GetMatchingIRGDocs.pl?' + value;
                    link.textContent = 'N' + value;
                    cell.appendChild(link);
                } else if (key === 'evi' && value.includes('@')) {
                    const parts = value.split('@');
                    cell.textContent = parts[0];
                    cell.style.color = "#4183c4";
                    cell.title = parts[1].replace(/\$/g, "\n");
                } else {
                    cell.textContent = value;
                }
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    }

    function createPagination() {
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
                displayRecords(currentPage);
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

    function filterRecords() {
        const searchQuery = document.getElementById('search-box').value.toLowerCase();

        if (!searchQuery) {
            document.querySelector('#results-table tbody').innerHTML = '';
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        filteredRecords = records.filter(record => {
            return keys.some(key => {
                const value = record[key] || '';
                return value.toLowerCase().includes(searchQuery);
            });
        });

        currentPage = 1;
        displayRecords(currentPage);
        createPagination();
    }

    loadRecords();
</script>
