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

<div id="progress-container" style="width: 100%; background-color: #f0f0f0; height: 5px; display: none;">
    <div id="progress-bar" style="height: 100%; background-color: #4CAF50; width: 0%;"></div>
</div>

<div id="results-blocks"></div>

<script src="{{ '/assets/js/abstract_shape.js' | relative_url }}"></script>
