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
  if (cells.length === 0) return [];

  cells.sort((a, b) => a.row - b.row || a.col - b.col);

  const groups = [];
  let currentGroup = [cells[0]];

  for (let i = 1; i < cells.length; i++) {
    const prev = cells[i - 1];
    const curr = cells[i];

    const isConnected =
      (curr.row === prev.row && curr.col === prev.col + 1) ||
      (curr.row === prev.row + 1 &&
        prev.col === CONFIG.contentCols - 1 &&
        curr.col === 0);

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

function classifyBlockShape(group) {
  const rows = new Set(group.map((c) => c.row));
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const totalRows = maxRow - minRow + 1;

  const fullColCount = CONFIG.contentCols;

  const rowDetails = {};
  for (let r = minRow; r <= maxRow; r++) {
    const colsInRow = group
      .filter((c) => c.row === r)
      .map((c) => c.col)
      .sort((a, b) => a - b);
    if (colsInRow.length > 0) {
      rowDetails[r] = {
        start: colsInRow[0],
        end: colsInRow[colsInRow.length - 1],
        count: colsInRow.length,
        isFull: colsInRow.length === fullColCount,
      };
    }
  }

  const firstRowData = rowDetails[minRow];
  const lastRowData = rowDetails[maxRow];

  if (totalRows === 1) {
    return {
      type: 1,
      data: {
        row: minRow,
        startCol: firstRowData.start,
        endCol: firstRowData.end,
      },
    };
  }

  let allFull = true;
  for (let r = minRow; r <= maxRow; r++) {
    if (!rowDetails[r].isFull) {
      allFull = false;
      break;
    }
  }
  if (allFull) {
    return {
      type: 1,
      data: {
        row: minRow,
        startCol: 0,
        endCol: fullColCount - 1,
        spanRows: totalRows,
      },
    };
  }

  if (totalRows === 2 && !firstRowData.isFull && !lastRowData.isFull) {
    if (firstRowData.end === fullColCount - 1 && lastRowData.start === 0) {
      return {
        type: 2,
        data: {
          row1: minRow,
          startCol1: firstRowData.start,
          row2: maxRow,
          endCol2: lastRowData.end,
        },
      };
    }
  }

  if (firstRowData.isFull && lastRowData.start === 0 && !lastRowData.isFull) {
    let middleAllFull = true;
    for (let r = minRow + 1; r < maxRow; r++) {
      if (!rowDetails[r].isFull) {
        middleAllFull = false;
        break;
      }
    }
    if (middleAllFull) {
      return {
        type: 3,
        data: {
          startRow: minRow,
          endRow: maxRow,
          lastRowEndCol: lastRowData.end,
          fullRowsCount: totalRows - 1,
        },
      };
    }
  }

  if (
    !firstRowData.isFull &&
    firstRowData.end === fullColCount - 1 &&
    lastRowData.isFull
  ) {
    let middleAllFull = true;
    for (let r = minRow + 1; r < maxRow; r++) {
      if (!rowDetails[r].isFull) {
        middleAllFull = false;
        break;
      }
    }
    if (middleAllFull) {
      return {
        type: 4,
        data: {
          startRow: minRow,
          endRow: maxRow,
          firstRowStartCol: firstRowData.start,
          fullRowsCount: totalRows - 1,
        },
      };
    }
  }

  if (
    !firstRowData.isFull &&
    firstRowData.end === fullColCount - 1 &&
    !lastRowData.isFull &&
    lastRowData.start === 0
  ) {
    let middleAllFull = true;
    for (let r = minRow + 1; r < maxRow; r++) {
      if (!rowDetails[r].isFull) {
        middleAllFull = false;
        break;
      }
    }

    if (middleAllFull && maxRow - minRow > 1) {
      return {
        type: 5,
        data: {
          startRow: minRow,
          endRow: maxRow,
          firstRowStartCol: firstRowData.start,
          lastRowEndCol: lastRowData.end,
        },
      };
    }
  }

  console.warn("Unclassified shape, defaulting to bounding box logic", group);
  return {
    type: 1,
    data: {
      row: minRow,
      startCol: firstRowData.start,
      endCol: lastRowData.end,
      spanRows: totalRows,
    },
  };
}

function generateGroupPath(group) {
  const shape = classifyBlockShape(group);
  const { colWidth, rowHeight, cornerRadius: r, contentCols } = CONFIG;
  const fullWidth = contentCols * colWidth;

  let d = "";
  let textPos = { x: 0, y: 0 };

  switch (shape.type) {
    case 1: {
      const { row, startCol, endCol, spanRows } = shape.data;
      const actualRows = spanRows || 1;

      const x1 = startCol * colWidth;
      const x2 = (endCol + 1) * colWidth;
      const height = actualRows * rowHeight;

      d = `M${x1 + r},0 H${x2 - r} Q${x2},0 ${x2},${r} V${height - r} Q${x2},${height} ${x2 - r},${height} H${x1 + r} Q${x1},${height} ${x1},${height - r} V${r} Q${x1},0 ${x1 + r},0 Z`;

      textPos.x = (x1 + x2) / 2;
      textPos.y = height / 2;
      break;
    }

    case 2: {
      const { row1, startCol1, row2, endCol2 } = shape.data;

      const x1_part1 = startCol1 * colWidth;
      const x2_part1 = fullWidth;
      const x1_part2 = 0;
      const x2_part2 = (endCol2 + 1) * colWidth;

      const y1 = 0;
      const y2 = rowHeight;

      d += `M${x1_part1 + r},${y1} `;
      d += `H${x2_part1 - r} Q${x2_part1},${y1} ${x2_part1},${y1 + r} `;
      d += `V${y2} `;
      d += `H${x1_part1} `;
      d += `Q${x1_part1},${y2} ${x1_part1},${y2 - r} `;
      d += `V${y1 + r} Q${x1_part1},${y1} ${x1_part1 + r},${y1} `;

      d += ` M${x1_part2},${y2} `;
      d += `H${x2_part2 - r} `;
      d += `Q${x2_part2},${y2} ${x2_part2},${y2 + r} `;
      d += `V${y2 + rowHeight - r} `;
      d += `Q${x2_part2},${y2 + rowHeight} ${x2_part2 - r},${y2 + rowHeight} `;
      d += `H${x1_part2 + r} `;
      d += `Q${x1_part2},${y2 + rowHeight} ${x1_part2},${y2 + rowHeight - r} `;
      d += `V${y2 + r} `;
      d += `Q${x1_part2},${y2} ${x1_part2 + r},${y2} Z`;

      textPos = { x: -1, y: -1, type: "multi" };
      break;
    }

    case 3: {
      const { startRow, endRow, lastRowEndCol } = shape.data;
      const totalRows = endRow - startRow + 1;
      const totalH = totalRows * rowHeight;

      const partWidth = (lastRowEndCol + 1) * colWidth;
      const fullRowsCount = totalRows - 1;
      const fullRowsHeight = fullRowsCount * rowHeight;

      const x_turn = partWidth;
      const y_trans = fullRowsHeight;

      d = `M${r},0 `;
      d += `H${fullWidth - r} Q${fullWidth},0 ${fullWidth},${r} `;
      d += `V${y_trans} `;
      d += `H${x_turn + r} `;
      d += `Q${x_turn},${y_trans} ${x_turn},${y_trans + r} `;
      d += `V${totalH - r} `;
      d += `Q${x_turn},${totalH} ${x_turn - r},${totalH} `;
      d += `H${r} `;
      d += `Q0,${totalH} 0,${totalH - r} `;
      d += `V${r} Q0,0 ${r},0 Z`;

      textPos.x = fullWidth / 2;
      textPos.y = fullRowsHeight / 2;
      break;
    }

    case 4: {
      const { startRow, endRow, firstRowStartCol } = shape.data;
      const totalRows = endRow - startRow + 1;
      const totalH = totalRows * rowHeight;

      const x_start = firstRowStartCol * colWidth;
      const fullRowsCount = totalRows - 1;
      const fullRowsHeight = fullRowsCount * rowHeight;

      const y_transition = totalH - fullRowsHeight;

      d += `M${x_start + r},0 `;
      d += `H${fullWidth - r} Q${fullWidth},0 ${fullWidth},${r} `;
      d += `V${totalH - r} `;
      d += `Q${fullWidth},${totalH} ${fullWidth - r},${totalH} `;
      d += `H${r} `;
      d += `Q0,${totalH} 0,${totalH - r} `;
      d += `V${y_transition + r} `;
      d += `Q0,${y_transition} ${r},${y_transition} `;
      d += `H${x_start - r} `;
      d += `Q${x_start},${y_transition} ${x_start},${y_transition - r} `;
      d += `V${r} Q${x_start},0 ${x_start + r},0 Z`;

      textPos.x = fullWidth / 2;
      textPos.y = y_transition + fullRowsHeight / 2;
      break;
    }

    case 5: {
      const { startRow, endRow, firstRowStartCol, lastRowEndCol } = shape.data;
      const totalRows = endRow - startRow + 1;
      const totalH = totalRows * rowHeight;

      const x_start = firstRowStartCol * colWidth;
      const x_end = (lastRowEndCol + 1) * colWidth;

      const y_top = 1 * rowHeight;
      const y_bot = totalH - 1 * rowHeight;

      d = `M${x_start + r},0 `;
      d += `H${fullWidth - r} Q${fullWidth},0 ${fullWidth},${r} `;
      d += `V${y_bot - r} `;
      d += `V${y_bot} `;
      d += `H${x_end + r} `;
      d += `Q${x_end},${y_bot} ${x_end},${y_bot + r} `;
      d += `V${totalH - r} `;
      d += `Q${x_end},${totalH} ${x_end - r},${totalH} `;
      d += `H${r} `;
      d += `Q0,${totalH} 0,${totalH - r} `;
      d += `V${y_top + r} `;
      d += `Q0,${y_top} ${r},${y_top} `;
      d += `H${x_start - r} `;
      d += `Q${x_start},${y_top} ${x_start},${y_top - r} `;
      d += `V${r} Q${x_start},0 ${x_start + r},0 Z`;

      textPos.x = fullWidth / 2;

      if (totalRows >= 3) {
        const middleRowsCount = totalRows - 2;
        const middleHeight = middleRowsCount * rowHeight;
        textPos.y = y_top + middleHeight / 2;
      } else {
        textPos.y = y_top / 2;
      }
      break;
    }
  }

  return { d, textPos };
}

function generateBlockSVG(block) {
  const { name, range, url, short, status } = block;
  const [startHex, endHex] = range.split("..");
  const startCode = hexToDec(startHex);
  const endCode = hexToDec(endHex);

  const cells = analyzeBlockCells(startCode, endCode);
  if (cells.length === 0) return "";

  const cellGroups = groupConnectedCells(cells);
  const baseRow = cells[0].row;
  const baseY = baseRow * CONFIG.rowHeight;

  let classes = "re";
  if (status.includes("Published")) {
    classes += " publ";
  }
  if (status.includes("Accepted for publication")) {
    classes += " acpt";
  }
  if (status.includes("Provisionally assigned")) {
    classes += " prov";
  }
  if (status.includes("Roadmapped")) {
    classes += " rdmp";
  }
  if (status.includes("Tentative")) {
    classes += " tent";
  }
  if (status.includes("Unallocated")) {
    classes += " free";
  }
  if (status.includes("right-to-left")) {
    classes += " rtl";
  }
  if (status.includes("control characters")) {
    classes += " ctrl";
  }
  if (status.includes("noncharacters")) {
    classes += " nc";
  }

  let svgContent = `<g class="${classes}" transform="translate(0, ${baseY})" data-from="${startCode}" data-to="${endCode}" onmouseenter="rmtooltip(this)">
        <desc>${name}</desc>`;

  cellGroups.forEach((group) => {
    const result = generateGroupPath(group);

    svgContent += `<path d="${result.d}" />`;

    if (result.textPos.type === "multi") {
      const { row1, startCol1, row2, endCol2 } = classifyBlockShape(group).data;
      const { colWidth, rowHeight } = CONFIG;

      const x1 = (startCol1 * colWidth + CONFIG.contentCols * colWidth) / 2;
      const y1 = rowHeight / 2;
      svgContent += `<a href="${url}"><text x="${x1}" y="${y1}" text-anchor="middle" dominant-baseline="middle">${short}</text></a>`;

      const x2 = (0 + (endCol2 + 1) * colWidth) / 2;
      const y2 = rowHeight + rowHeight / 2;
      svgContent += `<a href="${url}"><text x="${x2}" y="${y2}" text-anchor="middle" dominant-baseline="middle">${short}</text></a>`;
    } else {
      svgContent += `<a href="${url}"><text x="${result.textPos.x}" y="${result.textPos.y}" text-anchor="middle" dominant-baseline="middle">${short}</text></a>`;
    }
  });

  svgContent += `</g>`;
  return svgContent;
}

function getUniqueRowsFromBlocks(blocks) {
  const rows = new Set();
  blocks.forEach((block) => {
    const [startHex, endHex] = block.range.split("..");
    const startCode = hexToDec(startHex);
    const endCode = hexToDec(endHex);
    const startRow = Math.floor(
      startCode / (CONFIG.contentCols * CONFIG.codePerCell),
    );
    const endRow = Math.floor(
      endCode / (CONFIG.contentCols * CONFIG.codePerCell),
    );

    for (let row = startRow; row <= endRow; row++) {
      rows.add(row);
    }
  });

  const sortedRows = Array.from(rows).sort((a, b) => a - b);
  return sortedRows;
}

function generateRoadmapSVG(blocks) {
  const container = document.getElementById("unicode-roadmap-container");
  if (!container) return;

  const rows = getUniqueRowsFromBlocks(blocks);
  if (rows.length === 0) {
    container.innerHTML = "<p>No blocks to display</p>";
    return;
  }

  const rowMap = new Map();
  let displayRowIndex = 0;
  rows.forEach((rowNum, index) => {
    rowMap.set(rowNum, displayRowIndex);
    if (index < rows.length - 1 && rows[index + 1] - rowNum > 1) {
      displayRowIndex++;
    }
    displayRowIndex++;
  });

  const svgHeight = displayRowIndex * CONFIG.rowHeight;

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
    const [startHex, endHex] = block.range.split("..");
    const startCode = hexToDec(startHex);
    const endCode = hexToDec(endHex);
    const startRow = Math.floor(
      startCode / (CONFIG.contentCols * CONFIG.codePerCell),
    );
    const displayStartRow = rowMap.get(startRow) * CONFIG.rowHeight;

    const originalSVG = generateBlockSVG(block);
    const transformedSVG = originalSVG.replace(
      /transform="translate\(0, (\d+\.?\d*)\)"/,
      `transform="translate(0, ${displayStartRow})"`,
    );
    svgContent += transformedSVG;
  });

  svgContent += `</g>`;
  svgContent += generateRowLabels(rows, rowMap);
  svgContent += `</svg>`;
  container.innerHTML = svgContent;
}

function generateRowLabels(rows, rowMap) {
  let labels = "";
  rows.forEach((rowNum) => {
    const displayRow = rowMap.get(rowNum);
    const hexLabel = decToHex4(rowNum * CONFIG.codePerCell);
    const yPos = displayRow * CONFIG.rowHeight + CONFIG.rowHeight / 2;
    labels += `<text class="cp" x="30" y="${yPos}" text-anchor="middle" dominant-baseline="middle">${hexLabel}</text>`;
  });
  return labels;
}
