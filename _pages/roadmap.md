---
layout: post
title: Roadmap
category: pages
---

<style>
    body {
        display: flex
    }

    div#tooltip {
        display: none;
        position: absolute;
        border: solid 1px black;
        background: white;
        padding: 0.5em;
        max-width: 400px;
        z-index: 1000;
        pointer-events: none;
        font-size: 1.5rem;
    }

    div#tooltip span.hdr {
        font-weight: 600
    }

    div#tooltip div.sep {
        border-top: solid 1px black;
        margin-top: 0.1em;
        padding-top: 0.1em
    }

    div.plane {
        height: calc(100vh - 200px);
        font-size: 2rem;
        overflow-y: auto;
        position: relative;
    }

    div.sticktop {
        position: sticky;
        top: 0;
    }

    div.stickbottom {
        position: sticky;
        bottom: 0;
    }

    path {
        stroke-width: 1px;
        stroke: black;
        fill: white;
    }

    .shadow path {
        filter: drop-shadow(2px 2px 2px gray);
    }

    rect.cp {
        fill: white;
        stroke: black;
        stroke-width: 1px;
    }

    /* statuses */

    span.publ {
        background: #BBDDFF
    }

    g.publ path,
    g.publ rect {
        fill: #BBDDFF
    }

    span.publ.rtl {
        background: #CCCCFF
    }

    g.publ.rtl path,
    g.publ.rtl rect {
        fill: #CCCCFF
    }

    span.acpt {
        color: #007F0A;
    }

    g.acpt text {
        fill: #007F0A;
    }

    g.acpt path,
    g.acpt rect {
        fill: white
    }

    span.prov {
        color: #007F0A;
    }

    g.prov text {
        fill: #007F0A;
    }

    g.prov path,
    g.prov rect {
        fill: white
    }

    span.rdmp {
        color: #0000DD;
    }

    g.rdmp text {
        fill: #0000DD;
    }

    g.rdmp path,
    g.rdmp rect {
        fill: white
    }

    span.tent {
        color: #DD0000
    }

    g.tent text {
        fill: #DD0000
    }

    g.tent path,
    g.tent rect {
        filter: none;
        opacity: 0.66
    }

    g.tent.rtl path,
    g.tent.rtl rect {
        filter: none;
        opacity: 0.33
    }

    span.free {
        color: #000000
    }

    g.free text {
        fill: #000000
    }

    g.free path,
    g.free rect {
        fill: white;
        stroke: none;
        filter: none;
        opacity: 0.66
    }

    g.free.rtl path,
    g.free.rtl rect {
        opacity: 0.33
    }

    /* flags */

    span.ctrl {
        background: #F0F0F0
    }

    g.ctrl path,
    g.ctrl rect {
        fill: #F0F0F0
    }

    span.nc {
        background: #F0F0F0
    }

    g.nc path,
    g.nc rect {
        fill: #F0F0F0
    }

    span.rtl {
        background: #FFFFCC
    }

    g.rtl path,
    g.rtl rect {
        fill: #FFFFCC
    }

    svg {
        display: block
    }

    svg a:hover text {
        text-decoration: underline
    }

    #conventions {
        margin-top: 1em
    }

    #sidenav {
        position: fixed;
        top: 1em;
        left: 1em
    }

    #sidenav a {
        text-decoration: none
    }

    @media (max-width: 1400px) {
        #sidenav {
            position: static
        }

        #sidenav div {
            display: inline
        }

        #sidenav div:nth-child(n+2)::before {
            content: '•'
        }

        .cps {
            display: none
        }
    }

    @media (max-width: 2000px) {
        .exp {
            display: none
        }
    }
</style>

<script>
    function padLeft(str, length, char = '0') {
        while (str.length < length) {
            str = char + str;
        }
        return str;
    }

    let roadmapZhData = [];
    document.addEventListener('DOMContentLoaded', () => {
        fetch('/assets/json/roadmap_zh.json')
            .then(response => {
                if (!response.ok) throw new Error('Roadmap zh JSON file loading failed');
                return response.json();
            })
            .then(data => {
                roadmapZhData = data;
                console.log('Chinese roadmap data loading completed:', roadmapZhData);
            })
            .catch(err => console.error('Error loading roadmap zh:', err));

        fetch('/assets/json/roadmap.json')
            .then(response => response.json())
            .then(data => {
                generateRoadmapSVG(data.data);
            })
            .catch(err => console.error('Error loading roadmap:', err));
    });

    function rmtooltip(entry) {
        var tooltip = document.getElementById('tooltip');
        var ttname = document.getElementById('ttname');
        var ttrange = document.getElementById('ttrange');
        var ttcps = document.getElementById('ttcps');
        var ttcols = document.getElementById('ttcols');
        var ttstatus = document.getElementById('ttstatus');
        
        let ttChineseName = document.getElementById('ttchinesename');
        let ttNote = document.getElementById('ttnote');
        if (!ttChineseName) {
            ttChineseName = document.createElement('div');
            ttChineseName.id = 'ttchinesename';
            ttstatus.parentNode.parentNode.insertBefore(ttChineseName, ttstatus.parentNode);
        }
        if (!ttNote) {
            ttNote = document.createElement('div');
            ttNote.id = 'ttnote';
            ttstatus.parentNode.parentNode.insertBefore(ttNote, ttstatus.parentNode);
        }

        if (!entry || !entry.firstElementChild || !entry.firstElementChild.innerHTML) {
            tooltip.style.display = "none";
            return;
        }

        var from = parseInt(entry.dataset.from);
        var to = parseInt(entry.dataset.to);
        var originalName = entry.firstElementChild.innerHTML;

        ttname.innerHTML = originalName;
        ttrange.innerText = "U+" + padLeft(from.toString(16).toUpperCase(), 4, '0') + ".." + "U+" + padLeft(to.toString(16).toUpperCase(), 4, '0');
        ttcps.innerText = (to - from + 1);
        ttcols.innerText = Math.ceil((to - from + 1) / 16);

        let chineseInfo = roadmapZhData.find(item => item.name === originalName) || {};
        let chineseName = chineseInfo['zh-cn'] || '';
        let note = chineseInfo.note || '';
        
        ttChineseName.innerHTML = chineseName;
        ttNote.innerHTML = note;

        var flags = [];
        ttstatus.innerHTML = "";

        for (var cls of entry.classList) {
            switch (cls) {
                case "publ": ttstatus.innerHTML = "Published"; break;
                case "acpt": ttstatus.innerHTML = "Accepted for publication"; break;
                case "prov": ttstatus.innerHTML = "Provisionally assigned"; break;
                case "rdmp": ttstatus.innerHTML = "Roadmapped"; break;
                case "tent": ttstatus.innerHTML = "Tentative"; break;
                case "free": ttstatus.innerHTML = "Unallocated"; break;
                case "rtl": flags.push("right-to-left"); break;
                case "ctrl": flags.push("control characters"); break;
                case "nc": flags.push("noncharacters"); break;
            }
        }

        if (flags.length > 0) {
            var flagStr = "(" + flags.join(", ") + ")";
            if (ttstatus.innerHTML) {
                ttstatus.innerHTML += " " + flagStr;
            } else {
                ttstatus.innerHTML = flagStr;
            }
        }

        var e = window.event || event; 
        if (!e) return;

        const blocks = document.querySelectorAll('g.re');
        let isHoveringBlock = false;
        tooltip.style.position = "fixed";

        blocks.forEach(block => {
            block.addEventListener('mouseenter', () => {
                isHoveringBlock = true;
                tooltip.style.display = "block";
            });
            block.addEventListener('mouseleave', () => {
                isHoveringBlock = false;
                tooltip.style.display = "none";
            });
        });

        document.addEventListener('mousemove', (e) => {
            if (!isHoveringBlock) return;

            const offsetX = 10;
            const offsetY = 10;
            tooltip.style.left = (e.clientX + offsetX) + "px";
            tooltip.style.top = (e.clientY + offsetY) + "px";
        });
    }
</script>

<div class="plane shadow">
    <div class="sticktop">
        <svg width="100%" viewBox="0 0 1025 20" xmlns="http://www.w3.org/2000/svg">
            <rect class="cp" width="60" height="20" x="60" rx="5" ry="5" /><text class="cp" x="90" y="10" text-anchor="middle" dominant-baseline="middle">0</text>
            <rect class="cp" width="60" height="20" x="120" rx="5" ry="5" /><text class="cp" x="150" y="10" text-anchor="middle" dominant-baseline="middle">1</text>
            <rect class="cp" width="60" height="20" x="180" rx="5" ry="5" /><text class="cp" x="210" y="10" text-anchor="middle" dominant-baseline="middle">2</text>
            <rect class="cp" width="60" height="20" x="240" rx="5" ry="5" /><text class="cp" x="270" y="10" text-anchor="middle" dominant-baseline="middle">3</text>
            <rect class="cp" width="60" height="20" x="300" rx="5" ry="5" /><text class="cp" x="330" y="10" text-anchor="middle" dominant-baseline="middle">4</text>
            <rect class="cp" width="60" height="20" x="360" rx="5" ry="5" /><text class="cp" x="390" y="10" text-anchor="middle" dominant-baseline="middle">5</text>
            <rect class="cp" width="60" height="20" x="420" rx="5" ry="5" /><text class="cp" x="450" y="10" text-anchor="middle" dominant-baseline="middle">6</text>
            <rect class="cp" width="60" height="20" x="480" rx="5" ry="5" /><text class="cp" x="510" y="10" text-anchor="middle" dominant-baseline="middle">7</text>
            <rect class="cp" width="60" height="20" x="540" rx="5" ry="5" /><text class="cp" x="570" y="10" text-anchor="middle" dominant-baseline="middle">8</text>
            <rect class="cp" width="60" height="20" x="600" rx="5" ry="5" /><text class="cp" x="630" y="10" text-anchor="middle" dominant-baseline="middle">9</text>
            <rect class="cp" width="60" height="20" x="660" rx="5" ry="5" /><text class="cp" x="690" y="10" text-anchor="middle" dominant-baseline="middle">A</text>
            <rect class="cp" width="60" height="20" x="720" rx="5" ry="5" /><text class="cp" x="750" y="10" text-anchor="middle" dominant-baseline="middle">B</text>
            <rect class="cp" width="60" height="20" x="780" rx="5" ry="5" /><text class="cp" x="810" y="10" text-anchor="middle" dominant-baseline="middle">C</text>
            <rect class="cp" width="60" height="20" x="840" rx="5" ry="5" /><text class="cp" x="870" y="10" text-anchor="middle" dominant-baseline="middle">D</text>
            <rect class="cp" width="60" height="20" x="900" rx="5" ry="5" /><text class="cp" x="930" y="10" text-anchor="middle" dominant-baseline="middle">E</text>
            <rect class="cp" width="60" height="20" x="960" rx="5" ry="5" /><text class="cp" x="990" y="10" text-anchor="middle" dominant-baseline="middle">F</text>
        </svg>
    </div>

    <div id="unicode-roadmap-container" style="overflow-x: auto;">
        <p style="text-align:center; padding: 20px;">Please refresh this page</p>
    </div>

    <div class="stickbottom">
        <svg width="100%" viewBox="0 0 1025 20" xmlns="http://www.w3.org/2000/svg">
            <rect class="cp" width="60" height="20" x="60" rx="5" ry="5" /><text class="cp" x="90" y="10" text-anchor="middle" dominant-baseline="middle">0</text>
            <rect class="cp" width="60" height="20" x="120" rx="5" ry="5" /><text class="cp" x="150" y="10" text-anchor="middle" dominant-baseline="middle">1</text>
            <rect class="cp" width="60" height="20" x="180" rx="5" ry="5" /><text class="cp" x="210" y="10" text-anchor="middle" dominant-baseline="middle">2</text>
            <rect class="cp" width="60" height="20" x="240" rx="5" ry="5" /><text class="cp" x="270" y="10" text-anchor="middle" dominant-baseline="middle">3</text>
            <rect class="cp" width="60" height="20" x="300" rx="5" ry="5" /><text class="cp" x="330" y="10" text-anchor="middle" dominant-baseline="middle">4</text>
            <rect class="cp" width="60" height="20" x="360" rx="5" ry="5" /><text class="cp" x="390" y="10" text-anchor="middle" dominant-baseline="middle">5</text>
            <rect class="cp" width="60" height="20" x="420" rx="5" ry="5" /><text class="cp" x="450" y="10" text-anchor="middle" dominant-baseline="middle">6</text>
            <rect class="cp" width="60" height="20" x="480" rx="5" ry="5" /><text class="cp" x="510" y="10" text-anchor="middle" dominant-baseline="middle">7</text>
            <rect class="cp" width="60" height="20" x="540" rx="5" ry="5" /><text class="cp" x="570" y="10" text-anchor="middle" dominant-baseline="middle">8</text>
            <rect class="cp" width="60" height="20" x="600" rx="5" ry="5" /><text class="cp" x="630" y="10" text-anchor="middle" dominant-baseline="middle">9</text>
            <rect class="cp" width="60" height="20" x="660" rx="5" ry="5" /><text class="cp" x="690" y="10" text-anchor="middle" dominant-baseline="middle">A</text>
            <rect class="cp" width="60" height="20" x="720" rx="5" ry="5" /><text class="cp" x="750" y="10" text-anchor="middle" dominant-baseline="middle">B</text>
            <rect class="cp" width="60" height="20" x="780" rx="5" ry="5" /><text class="cp" x="810" y="10" text-anchor="middle" dominant-baseline="middle">C</text>
            <rect class="cp" width="60" height="20" x="840" rx="5" ry="5" /><text class="cp" x="870" y="10" text-anchor="middle" dominant-baseline="middle">D</text>
            <rect class="cp" width="60" height="20" x="900" rx="5" ry="5" /><text class="cp" x="930" y="10" text-anchor="middle" dominant-baseline="middle">E</text>
            <rect class="cp" width="60" height="20" x="960" rx="5" ry="5" /><text class="cp" x="990" y="10" text-anchor="middle" dominant-baseline="middle">F</text>
        </svg>
    </div>

</div>

<script src="/assets/js/roadmap.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        fetch('/assets/json/roadmap.json')
            .then(response => response.json())
            .then(data => {
                generateRoadmapSVG(data.data);
            })
            .catch(err => console.error('Error loading roadmap:', err));
    });
</script>

<div id="tooltip">
    <div><span class="hdr">Full Name:</span> <span id="ttname"></span></div>
    <div><span class="hdr">Range:</span> <span id="ttrange"></span></div>
    <div><span class="hdr">Codepoints:</span> <span id="ttcps"></span></div>
    <div><span class="hdr">Columns:</span> <span id="ttcols"></span></div>
    <div><span class="hdr">Status:</span> <span id="ttstatus"></span></div>
    <div class="sep"></div>
    <div><span class="hdr">Chinese Name:</span> <span id="ttchinesename"></span></div>
    <div><span class="hdr" style="color: #ccc;">Note:</span> <span id="ttnote" style="color: #ccc;"></span></div>
</div>
