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
</style>

<input type="text" id="search-box" placeholder="Search..." oninput="filterRecords()">
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

    function loadRecords() {
        fetch("{{ '/assets/record.json' | relative_url }}")
            .then(response => response.json())
            .then(data => {
                records = data;
            })
            .catch(error => console.error('Error loading records:', error));
    }

    function displayRecords(recordsToDisplay) {
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
                    cell.title = parts[1];
                } else {
                    cell.textContent = value;
                }
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    }

    function filterRecords() {
        const searchQuery = document.getElementById('search-box').value.toLowerCase();
        if (!searchQuery) {
            document.querySelector('#results-table tbody').innerHTML = '';
            return;
        }
        const filteredRecords = records.filter(record => {
            return keys.some(key => {
                const value = record[key] || '';
                return value.toLowerCase().includes(searchQuery);
            });
        });
        displayRecords(filteredRecords);
    }

    loadRecords();
</script>
