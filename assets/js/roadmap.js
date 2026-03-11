const CONFIG = {
  colWidth: 60,
  rowHeight: 40,
  cornerRadius: 5,
  xOffset: 60,
  svgBaseWidth: 1020,
  contentCols: 16,
  codePerCell: 16,
};

function hexToDec(hexStr) {
  return hexStr ? parseInt(hexStr.replace("U+", ""), 16) : 0;
}

function decToHex4(dec) {
  return dec.toString(16).toUpperCase().padStart(4, "0");
}

function analyzeBlockCells(startCode, endCode) {
  const cells = [];
  const startCellIdx = Math.floor(startCode / CONFIG.codePerCell);
  const endCellIdx = Math.floor(endCode / CONFIG.codePerCell);

  for (let cellIdx = startCellIdx; cellIdx <= endCellIdx; cellIdx++) {
    const row = Math.floor(cellIdx / CONFIG.contentCols);
    const col = cellIdx % CONFIG.contentCols;
    cells.push({ row, col });
  }

  return cells;
}

function groupConnectedCells(cells) {
  const groups = [];
  if (cells.length === 0) return groups;

  cells.sort((a, b) => a.row - b.row || a.col - b.col);

  let currentGroup = [cells[0]];
  for (let i = 1; i < cells.length; i++) {
    const prev = cells[i - 1];
    const curr = cells[i];

    const isConnected = (curr.row === prev.row && curr.col === prev.col + 1) || (curr.row === prev.row + 1 && curr.col === 0 && prev.col === CONFIG.contentCols - 1);

    if (isConnected) {
      currentGroup.push(curr);
    } else {
      groups.push(currentGroup);
      currentGroup = [curr];
    }
  }
  groups.push(currentGroup);

  return groups;
}

function generateGroupPath(group) {
  const { colWidth, rowHeight, cornerRadius: r } = CONFIG;
  const first = group[0];
  const last = group[group.length - 1];

  const baseRow = first.row;
  const relRows = last.row - baseRow;

  const firstRowCols = group.filter((c) => c.row === baseRow);
  const firstCol = firstRowCols[0].col;
  const lastColFirstRow = firstRowCols[firstRowCols.length - 1].col;

  const lastRowCols = group.filter((c) => c.row === last.row);
  const firstColLastRow = lastRowCols[0].col;
  const lastColLastRow = lastRowCols[lastRowCols.length - 1].col;

  let d = "";

  if (relRows === 0) {
    const x1 = firstCol * colWidth;
    const x2 = (lastColFirstRow + 1) * colWidth;
    d = `M${x1 + r},0 H${x2 - r} Q${x2},0 ${x2},${r} V${rowHeight - r} Q${x2},${rowHeight} ${x2 - r},${rowHeight} H${x1 + r} Q${x1},${rowHeight} ${x1},${rowHeight - r} V${r} Q${x1},0 ${x1 + r},0`;
  } else {
    const fullWidth = CONFIG.contentCols * colWidth;
    const x1FirstRow = firstCol * colWidth;
    const x2LastRow = (lastColLastRow + 1) * colWidth;

    d += `M${x1FirstRow + r},0 `;
    d += `H${fullWidth - r} Q${fullWidth},0 ${fullWidth},${r} `;
    d += `V${relRows * rowHeight + r} `;
    d += `H${x2LastRow - r} Q${x2LastRow},${relRows * rowHeight + r} ${x2LastRow},${relRows * rowHeight + r + 2} `;
    d += `V${(relRows + 1) * rowHeight - r} `;
    d += `Q${x2LastRow},${(relRows + 1) * rowHeight} ${x2LastRow - r},${(relRows + 1) * rowHeight} `;
    d += `H${r} Q0,${(relRows + 1) * rowHeight} 0,${(relRows + 1) * rowHeight - r} `;
    d += `V${rowHeight - r} Q0,${rowHeight} ${r},${rowHeight} `;
    d += `H${x1FirstRow - r} Q${x1FirstRow},${rowHeight} ${x1FirstRow},${rowHeight - r} `;
    d += `V${r} Q${x1FirstRow},0 ${x1FirstRow + r},0 Z`;
  }

  return d.trim();
}

function generateBlockSVG(block) {
  const { name, range, status } = block;
  const [startHex, endHex] = range.split("..");
  const startCode = hexToDec(startHex);
  const endCode = hexToDec(endHex);

  const cells = analyzeBlockCells(startCode, endCode);
  const cellGroups = groupConnectedCells(cells);

  const baseRow = cells[0].row;
  const baseY = baseRow * CONFIG.rowHeight;
  const pdfId = decToHex4(startCode);
  const pdfLink = `https://www.unicode.org/charts/PDF/U${pdfId}.pdf`;

  let classes = "re publ";
  if (name.includes("C0 Controls")) classes += " ctrl";

  let svgContent = `<g class="${classes}" transform="translate(0, ${baseY})" data-from="${startCode}" data-to="${endCode}" onmouseenter="rmtooltip(this)">
        <desc>${name}</desc>`;

  cellGroups.forEach((group, idx) => {
    const pathData = generateGroupPath(group);
    svgContent += `<path d="${pathData}" />`;

    const groupRows = [...new Set(group.map((c) => c.row))];
    const groupCols = [...new Set(group.map((c) => c.col))];
    const relRow = Math.floor(groupRows.length / 2);
    const centerCol = (Math.min(...groupCols) + Math.max(...groupCols) + 1) / 2;
    const centerX = centerCol * CONFIG.colWidth;
    const centerY = relRow * CONFIG.rowHeight + CONFIG.rowHeight / 2;

    svgContent += `<a href="${pdfLink}">
            <text x="${centerX}" y="${centerY}" text-anchor="middle" dominant-baseline="middle">${name}</text>
        </a>`;
  });

  svgContent += `</g>`;
  return svgContent;
}

function generateRoadmapSVG(blocks) {
  const container = document.getElementById("unicode-roadmap-container");
  if (!container) return;

  let maxCode = 0;
  blocks.forEach((b) => {
    const end = hexToDec(b.range.split("..")[1]);
    if (end > maxCode) maxCode = end;
  });
  const totalRows = Math.floor(maxCode / (CONFIG.contentCols * CONFIG.codePerCell)) + 1;
  const svgHeight = totalRows * CONFIG.rowHeight;

  let svgContent = `
        <svg width="100%" viewBox="0 0 ${CONFIG.svgBaseWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="hash" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                    <rect width="2" height="4" fill="silver" />
                </pattern>
            </defs>
            
            <g transform="translate(${CONFIG.xOffset}, 0)">
                <rect class="unalloc" width="${CONFIG.contentCols * CONFIG.colWidth}" height="${svgHeight}" fill="url(#hash)" />
    `;

  blocks.forEach((block) => {
    svgContent += generateBlockSVG(block);
  });

  svgContent += `</g>`;
  svgContent += generateRowLabelsInCol0(totalRows);
  svgContent += `</svg>`;
  container.innerHTML = svgContent;
}

function generateRowLabelsInCol0(count) {
  let labels = "";
  for (let i = 0; i < count; i++) {
    const hexLabel = decToHex4(i * CONFIG.contentCols * CONFIG.codePerCell);
    const yPos = i * CONFIG.rowHeight + CONFIG.rowHeight / 2;
    labels += `<text class="cp" x="30" y="${yPos}" text-anchor="middle" dominant-baseline="middle">${hexLabel}</text>`;
  }
  return labels;
}

window.rmtooltip = function (el) {};
