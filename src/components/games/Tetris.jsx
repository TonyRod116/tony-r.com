import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

// Tetris Game Implementation with Magic T Piece (based on original code)
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_COUNT = BOARD_WIDTH * BOARD_HEIGHT;

// Helper functions to avoid wrap-around issues
const rOf = (idx) => Math.floor(idx / BOARD_WIDTH);
const cOf = (idx) => idx % BOARD_WIDTH; // signed modulo: for idx<0 returns negative (good!)

// Utility function for top center position
const topCenterPos = () => Math.floor(BOARD_WIDTH / 2);

// Subtle modern inner-gradient buttons
function gradientButtonStyle(from, to, border = 'rgba(255,255,255,0.16)') {
  return {
    backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
    border: `1px solid ${border}`,
    boxShadow: 'inset 0 1px 0 rgba(253, 253, 253, 0.12)',
    filter: 'saturate(1.2) contrast(1.1) brightness(1.0)',
    color: '#fff'
  };
}

// Neon helpers for modern AI look
function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function neonCellStyle(color) {
  const { r, g, b } = hexToRgb(color);
  const rgba = (a) => `rgba(${r}, ${g}, ${b}, ${a})`;
  return {
    backgroundImage: `linear-gradient(135deg, ${rgba(0.95)} 0%, ${rgba(0.45)} 100%)`,
    boxShadow: `0 0 8px ${rgba(0.7)}, 0 0 16px ${rgba(0.4)}, inset 0 0 6px ${rgba(0.5)}`,
    border: `1px solid ${rgba(0.6)}`,
    backgroundColor: 'transparent'
  };
}

// Neon glow only (keeps existing backgroundImage like GIF)
function neonGlowOnly(color) {
  const { r, g, b } = hexToRgb(color);
  const rgba = (a) => `rgba(${r}, ${g}, ${b}, ${a})`;
  return {
    boxShadow: `0 0 8px ${rgba(0.7)}, 0 0 16px ${rgba(0.4)}, inset 0 0 6px ${rgba(0.5)}`,
    border: `1px solid ${rgba(0.6)}`
  };
}

// Tetris pieces with original colors and classes
const PIECES = {
  L: {
    className: 'blueShape',
    color: '#1F51FF',
    rotations: [
      [-(BOARD_WIDTH*2), -BOARD_WIDTH, 0, 1],
      [-(BOARD_WIDTH)+1, -(BOARD_WIDTH)-1, -(BOARD_WIDTH), -1],      
      [-(BOARD_WIDTH*2) -1, -(BOARD_WIDTH*2), -(BOARD_WIDTH), 0], 
      [-(BOARD_WIDTH)+1, -(BOARD_WIDTH)-1, -(BOARD_WIDTH), -(BOARD_WIDTH*2)+1],  
    ]
  },
  Li: {
    className: 'redShape',
    color: '#FF007F',
    rotations: [
      [-(BOARD_WIDTH*2) +1, -(BOARD_WIDTH) +1, 0, 1], 
      [-(BOARD_WIDTH*2) -1, -(BOARD_WIDTH) -1, -(BOARD_WIDTH), -(BOARD_WIDTH) +1,],
      [-(BOARD_WIDTH*2), -(BOARD_WIDTH*2) +1, -(BOARD_WIDTH), 0],
      [-(BOARD_WIDTH) -1, -(BOARD_WIDTH), -(BOARD_WIDTH) +1, 1],
    ]
  },
  S: {
    className: 'greenShape',
    color: '#39FF14',
    rotations: [
      [-(BOARD_WIDTH*2), -BOARD_WIDTH, -(BOARD_WIDTH)+1, 1],
      [-(BOARD_WIDTH*2) +1, -(BOARD_WIDTH*2), -(BOARD_WIDTH) -1, -(BOARD_WIDTH)],
      [-(BOARD_WIDTH*2), -BOARD_WIDTH, -(BOARD_WIDTH)+1, 1],
      [-(BOARD_WIDTH*2) +1, -(BOARD_WIDTH*2), -(BOARD_WIDTH) -1, -(BOARD_WIDTH)],
    ]
  },
  Si: {
    className: 'yellowShape',
    color: '#F7FF00',
    rotations: [
      [-(BOARD_WIDTH*2) +1, -(BOARD_WIDTH) +1, -(BOARD_WIDTH), 0],
      [-(BOARD_WIDTH) -1, -(BOARD_WIDTH), 0, 1],
      [-(BOARD_WIDTH*2) +1, -(BOARD_WIDTH) +1, -(BOARD_WIDTH), 0],
      [-(BOARD_WIDTH) -1, -(BOARD_WIDTH), 0, 1],
    ]
  },
  M: {
    className: 'purpleShape',
    color: '#7C3AED',
    rotations: [
      [-(BOARD_WIDTH*2), -BOARD_WIDTH, -(BOARD_WIDTH) + 1, 0],
      [-(BOARD_WIDTH), -(BOARD_WIDTH)-1, -(BOARD_WIDTH) + 1, 0],
      [-(BOARD_WIDTH*2), -(BOARD_WIDTH)-1, -(BOARD_WIDTH), 0],
      [-(BOARD_WIDTH*2), -(BOARD_WIDTH) -1, -(BOARD_WIDTH), -(BOARD_WIDTH) + 1],
    ]
  },
  O: {
    className: 'orangeShape',
    color: '#FF6B00',
    rotations: [
      [-(BOARD_WIDTH), -BOARD_WIDTH+1, 0, 1],
      [-(BOARD_WIDTH), -BOARD_WIDTH+1, 0, 1],
      [-(BOARD_WIDTH), -BOARD_WIDTH+1, 0, 1],
      [-(BOARD_WIDTH), -BOARD_WIDTH+1, 0, 1],
    ]
  },
  I: {
    className: 'pinkShape',
    color: '#FF00FF',
    rotations: [
      [-(BOARD_WIDTH*2), -BOARD_WIDTH, 0, BOARD_WIDTH],
      [-1, 0, 1, 2],
      [-(BOARD_WIDTH*2), -BOARD_WIDTH, 0, BOARD_WIDTH],
      [-1, 0, 1, 2],
    ]
  },
  T: {
    className: 'magicShape',
    color: '#06b6d4',
    rotations: [
      [-(BOARD_WIDTH*2)-1, -1, 0, 1, BOARD_WIDTH],
      [-(BOARD_WIDTH*2), -(BOARD_WIDTH*2) +2, -(BOARD_WIDTH) -1, -(BOARD_WIDTH), 0],
      [-(BOARD_WIDTH*2), -(BOARD_WIDTH) -1, -(BOARD_WIDTH), -(BOARD_WIDTH) +1, BOARD_WIDTH +1],
      [-(BOARD_WIDTH*2) +1, -(BOARD_WIDTH) +1, -(BOARD_WIDTH) +2,  +1, -1], 
    ]
  }
};

const PIECE_NAMES = Object.keys(PIECES);

// Helper function for Next Piece preview
function getPreviewCells(name) {
  const offs = PIECES[name].rotations[0]; // preview con rotación 0

  // Conversión correcta a (r,c) con resto "euclidiano"
  const cells = offs.map(off => {
    const r = Math.floor(off / BOARD_WIDTH);
    const c = off - r * BOARD_WIDTH;  // <- NO usar off % BOARD_WIDTH
    return { r, c };
  });

  // Normaliza a origen (0,0)
  const minR = Math.min(...cells.map(x => x.r));
  const minC = Math.min(...cells.map(x => x.c));
  const norm = cells.map(({ r, c }) => ({ r: r - minR, c: c - minC }));

  // Calcular dimensiones de la pieza
  const maxR = Math.max(...norm.map(x => x.r));
  const maxC = Math.max(...norm.map(x => x.c));
  const pieceHeight = maxR + 1;
  const pieceWidth = maxC + 1;

  // Centrar en grid 5x5
  const offsetR = Math.floor((5 - pieceHeight) / 2);
  const offsetC = Math.floor((5 - pieceWidth) / 2);

  // Aplicar offset de centrado
  const centered = norm.map(({ r, c }) => ({ 
    r: r + offsetR, 
    c: c + offsetC 
  }));

  // Filtrar para asegurar que esté dentro del grid 5x5
  return centered.filter(({ r, c }) => r >= 0 && r < 5 && c >= 0 && c < 5);
}

// AI Implementation
class TetrisAI {
  constructor() {
    this.magicT = true; // Enable magic T mechanic
  }

  // Apply Magic T dissolution (reusable function)
  applyMagicTDissolution(next, basePos, coords, name = 'T') {
    // Place T cells and let each cell fall vertically
    for (let i = 0; i < coords.length; i++) {
      const idx = basePos + coords[i];
      let r = Math.floor(idx / BOARD_WIDTH);
      let c = idx % BOARD_WIDTH;

      if (r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
        next[r][c] = name;
        // Vertical drop cell by cell
        let dropIdx = idx;
        while (true) {
          const nextIdx = dropIdx + BOARD_WIDTH;
          const nr = Math.floor(nextIdx / BOARD_WIDTH);
          const nc = nextIdx % BOARD_WIDTH;
          if (nr >= BOARD_HEIGHT) break;
          if (nc < 0 || nc >= BOARD_WIDTH) break;
          if (next[nr][nc] !== null) break;
          dropIdx = nextIdx;
          next[nr][nc] = name;
        }
      }
    }
  }

  // Get all possible placements for a piece
  allPlacementsFor(matrix, shapeName) {
    console.log(`🔍 allPlacementsFor called for ${shapeName} (Magic T: ${this.magicT})`);
    // SAFETY CHECK: Validate inputs
    if (!matrix || !Array.isArray(matrix) || matrix.length !== BOARD_HEIGHT) {
      console.error('Invalid matrix in allPlacementsFor:', matrix);
      return [];
    }
    
    if (!PIECES[shapeName]) {
      console.error('Invalid shape name in allPlacementsFor:', shapeName);
      return [];
    }
    
    if (!PIECES[shapeName].rotations || !Array.isArray(PIECES[shapeName].rotations)) {
      console.error('Invalid rotations in allPlacementsFor for shape:', shapeName);
      return [];
    }
    
    const placements = [];
    const rotations = PIECES[shapeName].rotations;
    
    for (let rotationIndex = 0; rotationIndex < rotations.length; rotationIndex++) {
      // SAFETY CHECK: Validate rotation
      if (!rotations[rotationIndex] || !Array.isArray(rotations[rotationIndex])) {
        console.error(`Invalid rotation at index ${rotationIndex} for shape ${shapeName}:`, rotations[rotationIndex]);
        continue;
      }
      
      let validPlacementsForRotation = 0;
      for (let col = 0; col < BOARD_WIDTH; col++) {
        // Hard filter: no probar paredes con T mágica (columnas 0-1 y 8-9)
        if (shapeName === 'T' && (col <= 1 || col >= 8)) {
          console.log(`🚫 Skipping Magic T placement in column ${col} (forbidden)`);
          continue;
        }
        
        const result = this.simulateDrop(matrix, shapeName, rotationIndex, col);
        if (result) {
          placements.push({
            ...result,
            col,
            rotationIndex
          });
          validPlacementsForRotation++;
        }
      }
      console.log(`🔄 Rotation ${rotationIndex} for ${shapeName}: ${validPlacementsForRotation} valid placements`);
    }
    
    console.log(`📊 Total placements for ${shapeName}: ${placements.length}`);
    return placements;
  }

  // Simulate drop with magic T mechanic (based on original stoppedShape logic)
  simulateDrop(matrix, shapeName, rotationIndex, startCol) {
    // SAFETY CHECK: Validate matrix structure
    if (!matrix || !Array.isArray(matrix) || matrix.length !== BOARD_HEIGHT) {
      console.error('Invalid matrix structure in simulateDrop:', matrix);
      return null;
    }
    
    // SAFETY CHECK: Validate each row
    for (let i = 0; i < matrix.length; i++) {
      if (!matrix[i] || !Array.isArray(matrix[i]) || matrix[i].length !== BOARD_WIDTH) {
        console.error(`Invalid row ${i} in matrix:`, matrix[i]);
        return null;
      }
    }
    
    // Base spawn position at top row
    let pos = startCol; // absolute index with row 0, column=startCol
    
    // SAFETY CHECK: Validate piece and rotation
    if (!PIECES[shapeName]) {
      console.error('Invalid shape name:', shapeName);
      return null;
    }
    
    if (!PIECES[shapeName].rotations || !Array.isArray(PIECES[shapeName].rotations)) {
      console.error('Invalid rotations for shape:', shapeName, PIECES[shapeName]);
      return null;
    }
    
    if (rotationIndex < 0 || rotationIndex >= PIECES[shapeName].rotations.length) {
      console.error('Invalid rotation index:', rotationIndex, 'for shape:', shapeName);
      return null;
    }
    
      const coords = PIECES[shapeName].rotations[rotationIndex];
    
    // SAFETY CHECK: Validate coords array
    if (!coords || !Array.isArray(coords)) {
      console.error('Invalid coords for shape:', shapeName, 'rotation:', rotationIndex, 'coords:', coords);
      return null;
    }
    
    // SAFETY CHECK: Validate each coord
      for (let i = 0; i < coords.length; i++) {
      if (typeof coords[i] !== 'number' || isNaN(coords[i])) {
        console.error(`Invalid coord at index ${i}:`, coords[i], 'for shape:', shapeName);
        return null;
      }
    }
      
    // PREVALIDATE lateral bounds - strict check (no fragmented placements)
    for (let i = 0; i < coords.length; i++) {
      const offRow = Math.floor(coords[i] / BOARD_WIDTH);
      const offCol = coords[i] % BOARD_WIDTH; // Use signed modulo to avoid wrap-around
      const c = startCol + offCol;
      if (c < 0 || c >= BOARD_WIDTH) {
        return null; // Any cell out of bounds → invalid placement
      }
    }

    // EXTRA: si es T mágica, no permitir que NINGUNA celda toque 0, 1, 8 o 9
    if (this.magicT && shapeName === 'T') {
      for (let i = 0; i < coords.length; i++) {
        const idx = pos + coords[i];
        const c = cOf(idx);
        if (c <= 1 || c >= 8) return null; // veto duro: evita 0/1/8/9
      }
    }

    // Drop until collision using absolute indices
    while (true) {
      let canDrop = true;
      for (let i = 0; i < coords.length; i++) {
        const idxBelow = (pos + coords[i]) + BOARD_WIDTH;
        const rBelow = Math.floor(idxBelow / BOARD_WIDTH);
        const cBelow = idxBelow % BOARD_WIDTH; // Use signed modulo
        
        // Below the board -> cannot drop
        if (rBelow >= BOARD_HEIGHT) { canDrop = false; break; }
        // Lateral bounds must always hold
        if (cBelow < 0 || cBelow >= BOARD_WIDTH) { canDrop = false; break; }
        // If inside the board, check collision
        if (rBelow >= 0 && matrix[rBelow][cBelow] !== null) { canDrop = false; break; }
      }
      
      if (!canDrop) break;
      pos += BOARD_WIDTH;
    }

    // Clone matrix and apply landing using base row/col + relative offsets
    const next = matrix.map(row => {
      if (!row || !Array.isArray(row)) {
        console.error('Invalid row during cloning:', row);
        return Array(BOARD_WIDTH).fill(null);
      }
      return [...row];
    });

    // FINAL STRICT BOUNDS CHECK (no fragmented placements)
    const finalCells = [];
      for (let i = 0; i < coords.length; i++) {
      const idx = pos + coords[i];
      const r = Math.floor(idx / BOARD_WIDTH);
      const c = idx % BOARD_WIDTH; // signed modulo
      if (c < 0 || c >= BOARD_WIDTH) return null;     // lateral OOB → invalid
      if (r >= BOARD_HEIGHT) return null;             // below board → invalid
      if (r < 0) return null;                         // above board → invalid
      finalCells.push([r, c]);
    }

    // EXTRA: con T mágica, veto si alguna celda toca 0, 1, 8 o 9
    if (this.magicT && shapeName === 'T') {
      if (finalCells.some(([, c]) => c <= 1 || c >= 8)) return null; // evita 0/1/8/9
    }

    if (this.magicT && shapeName === 'T') {
      let highestRow = BOARD_HEIGHT;
      // Paint all cells (already validated)
      for (let i = 0; i < finalCells.length; i++) {
        const [r, c] = finalCells[i];
        next[r][c] = shapeName;
        
        // Reconstruct idx from r,c for vertical drop
        let dropIdx = (finalCells[i][0] * BOARD_WIDTH) + finalCells[i][1];
        while (true) {
          const nextIdx = dropIdx + BOARD_WIDTH;
          const nr = Math.floor(nextIdx / BOARD_WIDTH);
          const nc = nextIdx % BOARD_WIDTH;
          if (nr >= BOARD_HEIGHT) break;
          if (nc < 0 || nc >= BOARD_WIDTH) break;
          if (next[nr][nc] !== null) break;
          dropIdx = nextIdx;
          next[nr][nc] = shapeName;
        }
        const dropRow = Math.floor(dropIdx / BOARD_WIDTH);
        if (dropRow < highestRow) highestRow = dropRow;
      }
    } else {
      for (let i = 0; i < finalCells.length; i++) {
        const [r, c] = finalCells[i];
        next[r][c] = shapeName;
      }
    }

    // Clear lines and count how many
    let linesCleared = 0;
    for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
      if (next[r].every(v => v !== null)) {
        next.splice(r, 1);
        next.unshift(Array(BOARD_WIDTH).fill(null));
        linesCleared++;
        r++;
      }
    }

    return { matrix: next, linesCleared, pos, rotationIndex };
  }

  // Calculate board features for evaluation
  calculateFeatures(matrix) {
    const features = {
      holes: 0,
      bumpiness: 0,
      wells: 0,
      height: 0,
      lines: 0,
      sideWalls: 0, // New: penalize side walls
      centerBalance: 0 // New: encourage center filling
    };

    // Calculate heights
    const heights = Array(BOARD_WIDTH).fill(0);
    for (let col = 0; col < BOARD_WIDTH; col++) {
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        if (matrix[row][col]) {
          heights[col] = BOARD_HEIGHT - row;
          break;
        }
      }
    }

    features.height = Math.max(...heights);
    
    // Additional aggressive height penalty - penalize any height above 8
    if (features.height > 8) {
      features.height += (features.height - 8) * 3; // Even more exponential penalty for high walls
    }
    
    // Moderate penalty for side wall formation
    const leftWallHeight2 = heights[0];
    const rightWallHeight2 = heights[BOARD_WIDTH - 1];
    const centerHeights2 = heights.slice(1, BOARD_WIDTH - 1);
    const avgCenterHeight2 = centerHeights2.reduce((sum, h) => sum + h, 0) / centerHeights2.length;
    
    // Moderate penalty if side walls are forming
    if (leftWallHeight2 > avgCenterHeight2 + 2) {
      features.height += (leftWallHeight2 - avgCenterHeight2) * 2; // Moderate penalty
    }
    if (rightWallHeight2 > avgCenterHeight2 + 2) {
      features.height += (rightWallHeight2 - avgCenterHeight2) * 2; // Moderate penalty
    }

    // Calculate holes
    for (let col = 0; col < BOARD_WIDTH; col++) {
      let foundBlock = false;
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        if (matrix[row][col]) {
          foundBlock = true;
        } else if (foundBlock) {
          features.holes++;
        }
      }
    }

    // Calculate bumpiness
    for (let i = 0; i < BOARD_WIDTH - 1; i++) {
      features.bumpiness += Math.abs(heights[i] - heights[i + 1]);
    }

    // Calculate wells (improved detection)
    for (let col = 1; col < BOARD_WIDTH - 1; col++) {
      const leftHeight = heights[col - 1];
      const centerHeight = heights[col];
      const rightHeight = heights[col + 1];
      
      if (centerHeight < leftHeight && centerHeight < rightHeight) {
        const wellDepth = Math.min(leftHeight, rightHeight) - centerHeight;
        features.wells += wellDepth * wellDepth; // Square the depth for exponential penalty
      }
    }

    // Calculate side walls penalty (detect walls on left and right sides) - MORE AGGRESSIVE
    const leftWallHeight = heights[0];
    const rightWallHeight = heights[BOARD_WIDTH - 1];
    const centerHeights = heights.slice(1, BOARD_WIDTH - 1);
    const avgCenterHeight = centerHeights.reduce((sum, h) => sum + h, 0) / centerHeights.length;
    
    // Much more aggressive: penalize if side walls are even slightly higher than center
    if (leftWallHeight > avgCenterHeight + 1) {
      features.sideWalls += (leftWallHeight - avgCenterHeight) * 3; // Increased multiplier
    }
    if (rightWallHeight > avgCenterHeight + 1) {
      features.sideWalls += (rightWallHeight - avgCenterHeight) * 3; // Increased multiplier
    }
    
    // Additional penalty for extreme side walls (columns 0, 1, 8, 9)
    const extremeSideColumns = [0, 1, 8, 9];
    const extremeSideHeight = extremeSideColumns.reduce((sum, col) => sum + heights[col], 0) / extremeSideColumns.length;
    if (extremeSideHeight > avgCenterHeight + 0.5) {
      features.sideWalls += (extremeSideHeight - avgCenterHeight) * 5; // Heavy penalty for extreme sides
    }

    // Calculate center balance (encourage filling center columns)
    const centerColumns = [3, 4, 5, 6]; // Middle columns
    const sideColumns = [0, 1, 2, 7, 8, 9]; // Side columns
    const avgCenterHeight3 = centerColumns.reduce((sum, col) => sum + heights[col], 0) / centerColumns.length;
    const avgSideHeight = sideColumns.reduce((sum, col) => sum + heights[col], 0) / sideColumns.length;
    
    // Reward if center is higher than sides (good for line completion)
    features.centerBalance = avgCenterHeight3 - avgSideHeight;

    return features;
  }

  // Evaluate board state
  evaluateBoard(matrix, linesCleared, shapeName = null, placementCol = null) {
    const features = this.calculateFeatures(matrix);
    
    // ULTRA-FOCUSED scoring weights - prioritize holes and lines above ALL
    const weights = {
      lines: 1000,
      holes: -500,
      bumpiness: -5,
      wells: -10,
      height: -5,
      sideWalls: -220,   // más duro
      centerBalance: 25  // el centro pesa de verdad
    };

    let score = linesCleared * weights.lines +
           features.holes * weights.holes +
           features.bumpiness * weights.bumpiness +
           features.wells * weights.wells +
                features.height * weights.height +
                features.sideWalls * weights.sideWalls +
                features.centerBalance * weights.centerBalance;

    // Penalización adicional si las columnas extremas quedan más altas que el centro
    {
      const heights = Array.from({length: BOARD_WIDTH}, (_, c) => {
        for (let r = 0; r < BOARD_HEIGHT; r++) if (matrix[r][c]) return BOARD_HEIGHT - r;
        return 0;
      });
      const extremeCols = [0,1,8,9].map(c => heights[c]);
      const centerCols  = [3,4,5,6].map(c => heights[c]);
      const diff = (extremeCols.reduce((a,b)=>a+b,0)/4) - (centerCols.reduce((a,b)=>a+b,0)/4);
      if (diff > 0) score -= diff * 50; // castigo proporcional
    }

    // Castigo si el centro (3..6) queda sensiblemente más bajo que los lados (pozo)
    {
      const heights = Array.from({length: BOARD_WIDTH}, (_, c) => {
        for (let r = 0; r < BOARD_HEIGHT; r++) if (matrix[r][c]) return BOARD_HEIGHT - r;
        return 0;
      });
      const center = [3,4,5,6].map(c => heights[c]);
      const sides  = [0,1,2,7,8,9].map(c => heights[c]);
      const avgCenter = center.reduce((a,b)=>a+b,0)/center.length;
      const avgSides  = sides.reduce((a,b)=>a+b,0)/sides.length;
      const gap = Math.max(0, avgSides - avgCenter); // lados > centro
      score -= gap * 80; // castigo fuerte
    }

    // Penalización genérica para colocaciones cerca de pared
    if (placementCol != null) {
      if (placementCol <= 1 || placementCol >= BOARD_WIDTH-2) score -= 300; // borde
      if (placementCol === 0 || placementCol === BOARD_WIDTH-1) score -= 500; // pared pura
    }

    // ABSOLUTE BAN for Magic T placement in wall columns
    if (this.magicT && shapeName === 'T' && placementCol !== null) {
      // COMPLETE BAN: Magic T cannot be placed in wall columns (0, 9)
      if (placementCol === 0 || placementCol === 9) {
        score -= 10000; // ABSOLUTE BAN - should never be chosen
        return score; // Return immediately to avoid any other calculations
      }
      // Heavy penalty for placing Magic T in near-wall columns (1, 8)
      else if (placementCol === 1 || placementCol === 8) {
        score -= 2000; // más duro
      }
      // Moderate penalty for placing Magic T in outer columns (2, 7)
      else if (placementCol === 2 || placementCol === 7) {
        score -= 200; // Moderate penalty for outer Magic T placement
      }
      // Large bonus for placing Magic T in center columns (3, 4, 5, 6)
      else if (placementCol >= 3 && placementCol <= 6) {
        score += 300; // Large bonus for center Magic T placement
      }
      
      // Additional penalty if Magic T would create side walls after dissolution
      const magicTEffect = this.evaluateMagicTEffect(matrix, placementCol);
      score += magicTEffect; // This will be negative if it creates side walls
      
      // MASSIVE bonus if Magic T could complete lines in center
      const linePotential = this.evaluateMagicTLinePotential(matrix, placementCol);
      score += linePotential; // This will be positive if it could complete lines
    }

    return score;
  }

  // Evaluate the effect of Magic T placement on side walls
  evaluateMagicTEffect(matrix, placementCol) {
    // Simulate Magic T dissolution effect
    const heights = Array(BOARD_WIDTH).fill(0);
    for (let col = 0; col < BOARD_WIDTH; col++) {
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        if (matrix[row][col]) {
          heights[col] = BOARD_HEIGHT - row;
          break;
        }
      }
    }
    
    // Estimate the effect of Magic T dissolution
    // Magic T tends to fill columns more evenly, so we check if it would help balance
    const centerColumns = [3, 4, 5, 6];
    const sideColumns = [0, 1, 2, 7, 8, 9];
    
    const avgCenterHeight = centerColumns.reduce((sum, col) => sum + heights[col], 0) / centerColumns.length;
    const avgSideHeight = sideColumns.reduce((sum, col) => sum + heights[col], 0) / sideColumns.length;
    
    // If placing Magic T in center would help balance (reduce side wall effect)
    if (placementCol >= 3 && placementCol <= 6) {
      return 25; // Moderate bonus for center placement
    }
    
    // If placing Magic T in sides would worsen the imbalance
    if (placementCol <= 1 || placementCol >= 8) {
      return -75; // Moderate penalty for side placement
    }
    
    // Light penalty for near-sides
    if (placementCol === 2 || placementCol === 7) {
      return -25; // Light penalty for near-side placement
    }
    
    return 0; // Neutral for other positions
  }

  // Evaluate how well a piece fits in a position (avoids holes, fills gaps)
  evaluatePieceFit(matrix, shapeName, placementCol) {
    if (!shapeName || placementCol === null) return 0;
    
    // Calculate current heights
    const heights = Array(BOARD_WIDTH).fill(0);
    for (let col = 0; col < BOARD_WIDTH; col++) {
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        if (matrix[row][col]) {
          heights[col] = BOARD_HEIGHT - row;
          break;
        }
      }
    }
    
    // Check if placing piece in this column would fill gaps or create holes
    const pieceRotations = PIECES[shapeName]?.rotations;
    if (!pieceRotations) return 0;
    
    let bestFit = 0;
    
    // Check all rotations for this column
    for (let rotationIndex = 0; rotationIndex < pieceRotations.length; rotationIndex++) {
      const coords = pieceRotations[rotationIndex];
      let fitScore = 0;
      
      // Simulate piece placement
      for (let i = 0; i < coords.length; i++) {
        const offRow = Math.floor(coords[i] / BOARD_WIDTH);
        const offCol = coords[i] % BOARD_WIDTH; // Use signed modulo to avoid wrap-around
        const targetCol = placementCol + offCol;
        
        if (targetCol >= 0 && targetCol < BOARD_WIDTH) {
          const currentHeight = heights[targetCol];
          const pieceHeight = BOARD_HEIGHT - offRow; // Where piece would land
          
          // MASSIVE bonus for filling gaps (piece lands lower than current height)
          if (pieceHeight < currentHeight) {
            fitScore += (currentHeight - pieceHeight) * 5; // MASSIVE bonus for good fit
          }
          // Heavy penalty for creating holes (piece lands much higher than current height)
          else if (pieceHeight > currentHeight + 1) {
            fitScore -= (pieceHeight - currentHeight) * 10; // Heavy penalty for bad fit
          }
          // Small penalty for creating small holes
          else if (pieceHeight > currentHeight) {
            fitScore -= (pieceHeight - currentHeight) * 3; // Small penalty for small holes
          }
        }
      }
      
      bestFit = Math.max(bestFit, fitScore);
    }
    
    return bestFit;
  }

  // Special evaluation for Magic T - check if it would create completed lines
  evaluateMagicTLinePotential(matrix, placementCol) {
    if (!this.magicT || placementCol === null) return 0;
    
    // Calculate current heights
    const heights = Array(BOARD_WIDTH).fill(0);
    for (let col = 0; col < BOARD_WIDTH; col++) {
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        if (matrix[row][col]) {
          heights[col] = BOARD_HEIGHT - row;
          break;
        }
      }
    }
    
    // Check if Magic T in center would help complete lines
    if (placementCol >= 3 && placementCol <= 6) {
      // Check if center columns are close to completing lines
      const centerColumns = [3, 4, 5, 6];
      const centerHeights = centerColumns.map(col => heights[col]);
      const minCenterHeight = Math.min(...centerHeights);
      const maxCenterHeight = Math.max(...centerHeights);
      
      // If center columns are close in height, Magic T could complete a line
      if (maxCenterHeight - minCenterHeight <= 2 && minCenterHeight > 5) {
        return 500; // MASSIVE bonus for potential line completion
      }
    }
    
    return 0;
  }

  // Suggest best move
  suggestBestMove(matrix, currentPiece, nextPiece = null) {
    // SAFETY CHECK: Validate inputs
    if (!matrix || !Array.isArray(matrix) || matrix.length !== BOARD_HEIGHT) {
      console.error('Invalid matrix in suggestBestMove:', matrix);
      return null;
    }
    
    if (!currentPiece || !PIECES[currentPiece]) {
      console.error('Invalid currentPiece in suggestBestMove:', currentPiece);
      return null;
    }
    
    console.log(`🎯 AI evaluating ${currentPiece} piece with ${PIECES[currentPiece].rotations.length} rotations`);
    const placements = this.allPlacementsFor(matrix, currentPiece);
    console.log(`📊 Found ${placements.length} valid placements for ${currentPiece}`);
    
    if (placements.length === 0) return null;

    let bestMove = placements[0];
    let bestScore = -Infinity;

    for (const placement of placements) {
      let score = this.evaluateBoard(placement.matrix, placement.linesCleared, currentPiece, placement.col);
      
      // LOOK-AHEAD: si conozco la siguiente pieza, simulo su mejor jugada
      if (nextPiece) {
        const replies = this.allPlacementsFor(placement.matrix, nextPiece);
        if (replies.length) {
          let bestReply = -Infinity;
          for (const r of replies) {
            const s = this.evaluateBoard(r.matrix, r.linesCleared, nextPiece, r.col);
            if (s > bestReply) bestReply = s;
          }
          const LAMBDA = 0.6; // peso del siguiente turno
          score += LAMBDA * bestReply;
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = placement;
      }
    }

    return bestMove;
  }

  // Toggle magic T
  toggleMagicT() {
    this.magicT = !this.magicT;
    return this.magicT;
  }
}

export default function Tetris() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  
  const [board, setBoard] = useState(() => 
    Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(null))
  );
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  
  // Memoize preview cells to avoid recalculating 16 times per render
  const previewCells = useMemo(
    () => (nextPiece ? getPreviewCells(nextPiece) : []),
    [nextPiece]
  );
  
  const [currentPosition, setCurrentPosition] = useState(topCenterPos());
  const [currentRotation, setCurrentRotation] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [blinkingLines, setBlinkingLines] = useState([]);
  const [isBlinking, setIsBlinking] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [magicTEnabled, setMagicTEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [stats, setStats] = useState({
    gamesPlayed: parseInt(localStorage.getItem('tetris_games') || '0'),
    aiMoves: parseInt(localStorage.getItem('tetris_ai_moves') || '0'),
    maxScore: parseInt(localStorage.getItem('tetris_maxScore') || '0')
  });
  const [aiBusy, setAiBusy] = useState(false);

  const aiRef = useRef(new TetrisAI());
  const ai = aiRef.current;

  // Helper function for unified collision detection - FIXED with hardcoded 10
  const wouldCollide = useCallback((matrix, name, rot, pos, dx, dy) => {
    if (!name) return true;
    const offs = PIECES[name].rotations[rot];

    // Calcular posición base después del movimiento
    const newPos = pos + dx + dy * BOARD_WIDTH;
    const basePosR = rOf(newPos);
    const basePosC = cOf(newPos);

    for (const off of offs) {
      // Calcular la posición absoluta sumando el offset directamente
      const targetIdx = newPos + off;
      const r = rOf(targetIdx);
      const c = cOf(targetIdx);

      // Verificar límites verticales
      if (r >= BOARD_HEIGHT) return true;
      if (r < 0) continue; // Por encima del tablero, ignorar

      // Verificar límites horizontales
      if (c < 0 || c >= BOARD_WIDTH) return true;

      // Verificar colisión con bloques existentes
      if (matrix[r][c] !== null) return true;
    }
    return false;
  }, []);

  // Simple distance check - prevent rotation if any cell appears more than 4 cells away
  const canRotateWithDistanceCheck = useCallback((name, rot, pos) => {
    if (!name) return false;
    const offs = PIECES[name].rotations[rot];
    
    // Get current piece position
    const baseRow = rOf(pos);
    const baseCol = cOf(pos);
    
    // Check each cell of the rotated piece
    for (const off of offs) {
      const idx = pos + off;
      const r = rOf(idx);
      const c = cOf(idx);
      
      // Calculate distance from base position
      const distance = Math.abs(c - baseCol);
      
      // If any cell is more than 4 cells away, don't allow rotation
      if (distance > 4) {
    return false; 
      }
      
      // Also check if cell would be outside board bounds
      if (c < 0 || c >= BOARD_WIDTH) {
        return false;
      }
    }
    
    return true;
  }, []);

  // Rotation-specific placement check: allow r<0 but still enforce lateral bounds - FIXED with hardcoded 10
  const canRotateAt = useCallback((matrix, name, rot, pos) => {
    if (!name) return false;
    const offs = PIECES[name].rotations[rot];

    for (const off of offs) {
      // Compute absolute cell index, then row/col via helpers
      const idx = pos + off;
      const r = rOf(idx);
      const c = cOf(idx);

      // Horizontal bounds must always hold
      if (c < 0 || c >= BOARD_WIDTH) return false;
      // Below board invalid
      if (r >= BOARD_HEIGHT) return false;
      // Collisions only once inside the board
      if (r >= 0 && matrix[r][c] !== null) return false;
    }
    return true;
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    const newBoard = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(null));
    setBoard(newBoard);
    setCurrentPosition(topCenterPos());
    setCurrentRotation(0);
    setGameOver(false);
    setScore(0);
    setLines(0);
    setLevel(1);
    setAiSuggestion(null);
    setGameStarted(true);

    // Spawn the first piece automatically
      const pieceName = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
    setCurrentPiece(pieceName);
    
    // Generate next piece
    const nextPieceName = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
    setNextPiece(nextPieceName);
    
    // Start music if not muted and user has interacted
    if (audioRef.current && !isMuted && userHasInteracted) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch(() => {
        // Silently ignore audio errors
      });
    }
  }, [ai, userHasInteracted]);



  // Drop piece
  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || !gameStarted || aiBusy) return;

    if (wouldCollide(board, currentPiece, currentRotation, currentPosition, 0, 1)) {
      // Piece has landed - apply magic T logic
      const newBoard = board.map(row => [...row]);
      
      if (magicTEnabled && currentPiece === 'T') {
        // MAGIC T DISSOLUTION: based on original stoppedShape logic
        const coords = PIECES['T'].rotations[currentRotation];
        let highestRow = 20; // HARDCODED 20 instead of BOARD_HEIGHT
        
        for (let i = 0; i < coords.length; i++) {
          const cellIdx = currentPosition + coords[i];
          const row = rOf(cellIdx);
          const col = cOf(cellIdx);
          
          // Bounds check before accessing board
          if (row >= 0 && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH) {
          // Mark the T cell where it lands
            newBoard[row][col] = currentPiece;
          
          // Fall vertically filling until hitting occupied or ground
          let dropPos = cellIdx;
            while (dropPos + BOARD_WIDTH < CELL_COUNT) {
              const nextIdx = dropPos + BOARD_WIDTH;
              const nextRow = rOf(nextIdx);
              const nextCol = cOf(nextIdx);
              if (newBoard[nextRow][nextCol] !== null) break;
            dropPos += BOARD_WIDTH;
              const dropRow = rOf(dropPos);
              const dropCol = cOf(dropPos);
              newBoard[dropRow][dropCol] = currentPiece;
          }
          
          const finalRow = rOf(dropPos);
          if (finalRow < highestRow) highestRow = finalRow;
          }
        }
        
        // Calculate score based on height (from original code)
        let sumPoints = 2;
        if (highestRow >= 19) sumPoints = 2;
        else if (highestRow >= 18) sumPoints = 4;
        else if (highestRow >= 17) sumPoints = 6;
        else if (highestRow >= 16) sumPoints = 8;
        else if (highestRow >= 15) sumPoints = 10;
        else if (highestRow >= 14) sumPoints = 12;
        else if (highestRow >= 13) sumPoints = 14;
        else if (highestRow >= 12) sumPoints = 16;
        else if (highestRow >= 11) sumPoints = 18;
        else if (highestRow >= 10) sumPoints = 20;
        else if (highestRow >= 9) sumPoints = 23;
        else if (highestRow >= 8) sumPoints = 27;
        else if (highestRow >= 7) sumPoints = 35;
        else if (highestRow >= 6) sumPoints = 40;
        else if (highestRow >= 5) sumPoints = 45;
        else if (highestRow >= 4) sumPoints = 50;
        else if (highestRow >= 3) sumPoints = 60;
        else if (highestRow >= 2) sumPoints = 70;
        else sumPoints = 75;
        
        setScore(prev => prev + sumPoints);
      } else {
        // Normal behavior - FIXED with hardcoded values
        const coords = PIECES[currentPiece].rotations[currentRotation];
        let highestRow = 20; // HARDCODED 20 instead of BOARD_HEIGHT
        
        for (let i = 0; i < coords.length; i++) {
          const cellIdx = currentPosition + coords[i];
          const row = rOf(cellIdx);
          const col = cOf(cellIdx);
          
          // Bounds check before accessing board
          if (row >= 0 && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH) {
            newBoard[row][col] = currentPiece;
          if (row < highestRow) highestRow = row;
          }
        }
        
        // Calculate score based on height (from original code)
        let sumPoints = 2;
        if (highestRow >= 19) sumPoints = 2;
        else if (highestRow >= 18) sumPoints = 4;
        else if (highestRow >= 17) sumPoints = 6;
        else if (highestRow >= 16) sumPoints = 8;
        else if (highestRow >= 15) sumPoints = 10;
        else if (highestRow >= 14) sumPoints = 12;
        else if (highestRow >= 13) sumPoints = 14;
        else if (highestRow >= 12) sumPoints = 16;
        else if (highestRow >= 11) sumPoints = 18;
        else if (highestRow >= 10) sumPoints = 20;
        else if (highestRow >= 9) sumPoints = 23;
        else if (highestRow >= 8) sumPoints = 27;
        else if (highestRow >= 7) sumPoints = 35;
        else if (highestRow >= 6) sumPoints = 40;
        else if (highestRow >= 5) sumPoints = 45;
        else if (highestRow >= 4) sumPoints = 50;
        else if (highestRow >= 3) sumPoints = 60;
        else if (highestRow >= 2) sumPoints = 70;
        else sumPoints = 75;
        
        setScore(prev => prev + sumPoints);
      }
      
      // Check for completed rows
      let rowsToDelete = [];
      for (let i = 0; i < BOARD_HEIGHT; i++) {
        if (newBoard[i].every(v => v !== null)) {
          rowsToDelete.push(i);
        }
      }
      
      if (rowsToDelete.length > 0) {
        // Start blinking animation for completed lines
        setBlinkingLines(rowsToDelete);
        setIsBlinking(true);
        
        // After blinking, remove lines and update score
        setTimeout(() => {
        setScore(prev => prev + rowsToDelete.length * 100);
        setLines(prev => prev + rowsToDelete.length);
        setLevel(prev => Math.floor((lines + rowsToDelete.length) / 10) + 1);
        
        // Remove completed rows
        rowsToDelete.forEach(rowIdx => {
          newBoard.splice(rowIdx, 1);
            newBoard.unshift(Array(BOARD_WIDTH).fill(null));
        });
          
          setBoard(newBoard);
          setBlinkingLines([]);
          setIsBlinking(false);
        }, 1000); // Blink for 1 second
      }
      
      setBoard(newBoard);
      
      // Update stats
      if (aiEnabled) {
        setStats(prev => {
          const newStats = { ...prev, aiMoves: prev.aiMoves + 1 };
          localStorage.setItem('tetris_ai_moves', newStats.aiMoves.toString());
          return newStats;
        });
      }
      
      // decidir siguiente pieza y comprobar spawn
      const next = nextPiece || PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
      const spawnPos = topCenterPos();
      const canSpawn = !wouldCollide(newBoard, next, 0, spawnPos, 0, 0);
      
      if (!canSpawn) {
        setGameOver(true);
        // Update games played count
        setStats(prev => {
          const newStats = { ...prev, gamesPlayed: prev.gamesPlayed + 1 };
          localStorage.setItem('tetris_games', newStats.gamesPlayed.toString());
          return newStats;
        });
        return;
      }
      
      // colocar siguiente pieza y generar la otra
      setCurrentPiece(next);
      setCurrentPosition(spawnPos);
      setCurrentRotation(0);
      setNextPiece(PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)]);
    } else {
      // Move piece down
      setCurrentPosition(prev => prev + 10); // HARDCODED 10 instead of BOARD_WIDTH
    }
  }, [currentPiece, currentRotation, currentPosition, gameOver, gameStarted, board, magicTEnabled, aiEnabled, lines, nextPiece, wouldCollide]);

  // Move piece
  const movePiece = useCallback((direction) => {
    if (!currentPiece || gameOver || !gameStarted || aiBusy) return;

    let newPosition = currentPosition;
    let newRotation = currentRotation;

    switch (direction) {
      case 'left': {
        // Check if any cell of the piece would go out of bounds or wrap around - FIXED with hardcoded 10
        const coords = PIECES[currentPiece].rotations[currentRotation];
        const basePosR = Math.floor(currentPosition / 10); // HARDCODED 10
        const basePosC = currentPosition - basePosR * 10; // HARDCODED 10
        let canMoveLeft = true;
        
        for (let i = 0; i < coords.length; i++) {
          const cellIdx = currentPosition + coords[i];
          const cellR = Math.floor(cellIdx / 10); // HARDCODED 10
          const cellC = cellIdx - cellR * 10; // HARDCODED 10
          
          // Check if cell is at left edge
          if (cellC === 0) {
            canMoveLeft = false;
            break;
          }
          
          // Check distance constraint (max 3 cells away from base)
          const distance = Math.abs(cellC - basePosC);
          if (distance > 3) {
            canMoveLeft = false;
            break;
          }
        }
        
        if (canMoveLeft && !wouldCollide(board, currentPiece, currentRotation, currentPosition, -1, 0)) {
          newPosition = currentPosition - 1;
        }
        break;
      }
      case 'right': {
        // Check if any cell of the piece would go out of bounds or wrap around - FIXED with hardcoded 10
        const coords = PIECES[currentPiece].rotations[currentRotation];
        const basePosR = Math.floor(currentPosition / 10); // HARDCODED 10
        const basePosC = currentPosition - basePosR * 10; // HARDCODED 10
        let canMoveRight = true;
        
        for (let i = 0; i < coords.length; i++) {
          const cellIdx = currentPosition + coords[i];
          const cellR = Math.floor(cellIdx / 10); // HARDCODED 10
          const cellC = cellIdx - cellR * 10; // HARDCODED 10
          
          // Check if cell is at right edge
          if (cellC === 9) { // HARDCODED 9 instead of BOARD_WIDTH - 1
            canMoveRight = false;
            break;
          }
          
          // Check distance constraint (max 3 cells away from base)
          const distance = Math.abs(cellC - basePosC);
          if (distance > 3) {
            canMoveRight = false;
            break;
          }
        }
        
        if (canMoveRight && !wouldCollide(board, currentPiece, currentRotation, currentPosition, 1, 0)) {
          newPosition = currentPosition + 1;
        }
        break;
      }
      case 'drop': {
        // Hard drop: baja hasta que no pueda bajar más y fija inmediatamente - FIXED with hardcoded 10
        let finalPos = currentPosition;
        while (!wouldCollide(board, currentPiece, currentRotation, finalPos, 0, 1)) {
          finalPos += 10; // HARDCODED 10 instead of BOARD_WIDTH
        }
        // Actualizar posición temporalmente para el drop
        setCurrentPosition(finalPos);
        setCurrentRotation(currentRotation);
        // Esperar a que el estado se actualice y luego fijar
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            dropPiece();
          });
        });
        return; // No ejecutar el código de abajo
      }
      case 'rotate': {
        const nextRotation = (currentRotation + 1) % PIECES[currentPiece].rotations.length;

        // FIRST: Check distance limit (4 cells max)
        if (!canRotateWithDistanceCheck(currentPiece, nextRotation, currentPosition)) {
          console.log(`Rotation blocked: piece would extend more than 4 cells away`);
          break;
        }

        // SECOND: Check for collisions
        if (!canRotateAt(board, currentPiece, nextRotation, currentPosition)) {
          console.log(`Rotation blocked: collision detected`);
          break;
        }

        // If we get here, rotation is allowed
        console.log(`Rotation allowed`);
        newRotation = nextRotation;
        break;
      }
    }

    if (newPosition !== currentPosition || newRotation !== currentRotation) {
      setCurrentPosition(newPosition);
      setCurrentRotation(newRotation);
    }
  }, [currentPiece, currentPosition, currentRotation, gameOver, gameStarted, board, dropPiece, wouldCollide, canRotateAt, canRotateWithDistanceCheck]);

  // AI move
  const makeAIMove = useCallback(() => {
    console.log('=== AI MOVE ATTEMPT ===');
    console.log('aiBusy:', aiBusy);
    console.log('aiSuggestion:', aiSuggestion);
    console.log('gameOver:', gameOver);
    console.log('gameStarted:', gameStarted);
    console.log('currentPiece:', currentPiece);
    
    if (aiBusy) {
      console.log('❌ AI Move blocked: already busy');
      return;
    }
    if (!aiSuggestion || gameOver || !gameStarted || !currentPiece) {
      console.log('❌ AI Move blocked: invalid state');
      return;
    }
    
    console.log('✅ AI Move starting...');
    setAiBusy(true);

    try {
      console.log('🔍 Starting AI suggestion validation...');
      
      // STRICT VALIDATION: Check if AI suggestion is valid before applying
      const pieceRotations = PIECES[currentPiece]?.rotations;
      if (!pieceRotations) { 
        console.log('❌ No piece rotations found');
        setAiBusy(false); 
        return; 
      }
      
      const coords = pieceRotations[aiSuggestion.rotationIndex];
      const pos = aiSuggestion.pos;
      
      console.log('📊 Validation details:');
      console.log('- currentPiece:', currentPiece);
      console.log('- rotationIndex:', aiSuggestion.rotationIndex);
      console.log('- pos:', pos);
      console.log('- coords:', coords);
      
      // Validate that all piece cells are within board bounds
      let isValidPlacement = true;
      for (let i = 0; i < coords.length; i++) {
        const idx = pos + coords[i];
        const row = Math.floor(idx / BOARD_WIDTH);
        const col = idx - row * BOARD_WIDTH; // Evita wrap con índices negativos
        
        console.log(`  Cell ${i}: offset=${coords[i]}, idx=${idx}, finalRow=${row}, finalCol=${col}`);
        
        // Check bounds strictly
        if (row < 0 || row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH) {
          console.log(`❌ AI suggestion invalid: cell at row=${row}, col=${col} is out of bounds`);
          isValidPlacement = false;
          break;
        }
      }
      
      if (!isValidPlacement) {
        console.log('❌ AI suggestion rejected: invalid placement');
        setAiBusy(false);
        return;
      }
      
      // === HARD BAN: Magic T touching edges at cell level ===
      if (currentPiece === 'T') {
        // Recalcula celdas finales igual que en el log
        const cellCols = [];
        for (let i = 0; i < coords.length; i++) {
          const idx = pos + coords[i];
          const r = Math.floor(idx / BOARD_WIDTH);
          const c = idx % BOARD_WIDTH; // mismo cálculo que arriba
          // fuera del tablero => inválido
          if (r < 0 || r >= BOARD_HEIGHT) { 
            console.log('❌ AI suggestion rejected: Magic T cell out of bounds');
            setAiBusy(false);
            return; 
          }
          cellCols.push(c);
        }
        // Veto: si cualquier celda cae en 0 o 9 (y opcionalmente 1 u 8)
        const touchesEdge = cellCols.some(c => c === 0 || c === BOARD_WIDTH - 1);
        const touchesNear = cellCols.some(c => c === 1 || c === BOARD_WIDTH - 2);
        if (touchesEdge || touchesNear) {
          console.log('❌ AI suggestion rejected: Magic T would touch walls');
          setAiBusy(false);
          return; // abortar el AI move
        }
      }
      
      console.log('✅ AI suggestion validation passed');

      const finalBoard = aiSuggestion.matrix;
      console.log('📋 Final board dimensions:', finalBoard.length, 'x', finalBoard[0]?.length);
      
      setStats(prev => {
        const newStats = { ...prev, aiMoves: prev.aiMoves + 1 };
        localStorage.setItem('tetris_ai_moves', newStats.aiMoves.toString());
        return newStats;
      });

      if (aiSuggestion.linesCleared > 0) {
        console.log('🎯 Lines cleared:', aiSuggestion.linesCleared);
        const tempBoard = board.map(row => [...row]);
        const pieceRotations = PIECES[currentPiece]?.rotations;
        if (!pieceRotations) { setAiBusy(false); return; }
        const coords = pieceRotations[aiSuggestion.rotationIndex];
        const pos = aiSuggestion.pos;

        console.log('🎮 Applying piece to temp board...');
        for (let i = 0; i < coords.length; i++) {
          const idx = pos + coords[i];
          const row = Math.floor(idx / BOARD_WIDTH);
          const col = idx % BOARD_WIDTH;
          console.log(`  Applying cell ${i} at row=${row}, col=${col}`);
          if (row >= 0 && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH) {
            tempBoard[row][col] = currentPiece;
            console.log(`  ✅ Cell applied successfully`);
          } else {
            console.log(`  ❌ Cell out of bounds!`);
          }
        }

        const completedRows = [];
        for (let r = 0; r < BOARD_HEIGHT; r++) {
          if (tempBoard[r].every(cell => cell !== null)) {
            completedRows.push(r);
          }
        }

        console.log('📊 Completed rows:', completedRows);
        console.log('🔄 Setting board to temp board...');
        setBoard(tempBoard);
        setBlinkingLines(completedRows);
        setIsBlinking(true);

    setTimeout(() => {
          console.log('⏰ Timeout: Setting final board...');
          console.log('📋 Final board dimensions:', finalBoard.length, 'x', finalBoard[0]?.length);
          setBoard(finalBoard);
          setBlinkingLines([]);
          setIsBlinking(false);

          setScore(prev => prev + aiSuggestion.linesCleared * 100 + 10); // 10 points per piece + line bonus
          setLines(prev => {
            const total = prev + aiSuggestion.linesCleared;
            setLevel(Math.floor(total / 10) + 1);
            return total;
          });

          const next = nextPiece || PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
          console.log('🎲 Next piece for AI move (with lines):', next);
          console.log('🎲 Current nextPiece state (with lines):', nextPiece);
          const spawnPos = topCenterPos();
          const canSpawn = !wouldCollide(finalBoard, next, 0, spawnPos, 0, 0);

          if (!canSpawn) {
            setGameOver(true);
            setStats(prev => {
              const newStats = { ...prev, gamesPlayed: prev.gamesPlayed + 1 };
              localStorage.setItem('tetris_games', newStats.gamesPlayed.toString());
              return newStats;
            });
            setAiBusy(false);
            return;
          }

          setCurrentPiece(next);
          setCurrentPosition(spawnPos);
          setCurrentRotation(0);
          setNextPiece(PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)]);
          console.log('🎲 Generated new nextPiece:', PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)]);
          setAiBusy(false);
        }, 1000);
      } else {
        console.log('📋 No lines cleared, setting final board directly...');
        console.log('📋 Final board dimensions:', finalBoard.length, 'x', finalBoard[0]?.length);
        setBoard(finalBoard);

        // Add points for placing piece (even without lines)
        setScore(prev => prev + 10); // 10 points per piece

        const next = nextPiece || PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
        console.log('🎲 Next piece for AI move:', next);
        console.log('🎲 Current nextPiece state:', nextPiece);
        const spawnPos = topCenterPos();
        const canSpawn = !wouldCollide(finalBoard, next, 0, spawnPos, 0, 0);

        if (!canSpawn) {
          setGameOver(true);
          setStats(prev => {
            const newStats = { ...prev, gamesPlayed: prev.gamesPlayed + 1 };
            localStorage.setItem('tetris_games', newStats.gamesPlayed.toString());
            return newStats;
          });
          setAiBusy(false);
          return;
        }

        setCurrentPiece(next);
        setCurrentPosition(spawnPos);
        setCurrentRotation(0);
        setNextPiece(PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)]);
        console.log('🎲 Generated new nextPiece (no lines):', PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)]);
        setAiBusy(false);
      }
    } catch (e) {
      console.error('💥 AI Move error:', e);
      console.error('Error stack:', e.stack);
      setAiBusy(false);
    }
    
    // SAFETY TIMEOUT: Ensure aiBusy is always reset after 5 seconds
    setTimeout(() => {
      console.log('⏰ Safety timeout: resetting aiBusy');
      setAiBusy(false);
    }, 5000);
    
    console.log('=== AI MOVE COMPLETED ===');
  }, [aiBusy, aiSuggestion, gameOver, gameStarted, currentPiece, nextPiece, board, wouldCollide]);

  // Toggle magic T
  const toggleMagicT = useCallback(() => {
    const newValue = !magicTEnabled;
    setMagicTEnabled(newValue);
    aiRef.current.magicT = newValue;
  }, [magicTEnabled]);

  // Handle first user interaction to enable audio
  const handleFirstInteraction = useCallback(() => {
    if (!userHasInteracted) {
      setUserHasInteracted(true);
      // Try to start music if not muted
      if (audioRef.current && !isMuted) {
        audioRef.current.volume = 0.2;
        audioRef.current.play().catch(() => {
          // Silently ignore if still can't play
        });
      }
    }
  }, [userHasInteracted, isMuted]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    handleFirstInteraction(); // Ensure user interaction is recorded
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
    setIsMuted(!isMuted);
  }, [isMuted, handleFirstInteraction]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      handleFirstInteraction(); // Record user interaction
      if (gameOver || !gameStarted) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          dropPiece();
          break;
        case 'ArrowUp':
          e.preventDefault();
          movePiece('rotate');
          break;
        case ' ':
          e.preventDefault();
          movePiece('drop');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, dropPiece, gameOver, gameStarted, handleFirstInteraction]);

  // Auto-drop
  useEffect(() => {
    if (gameOver || !gameStarted || aiBusy) return;

    const interval = setInterval(() => {
      dropPiece();
    }, 1000 / level);

    return () => clearInterval(interval);
  }, [dropPiece, level, gameOver, gameStarted, aiBusy]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Blinking effect for completed lines
  useEffect(() => {
    if (blinkingLines.length > 0) {
      const interval = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 150); // Blink every 150ms
      
      return () => clearInterval(interval);
    }
  }, [blinkingLines]);

  // Update max score when game ends
  useEffect(() => {
    if (gameOver && score > 0) {
      setStats(prev => {
        const newMaxScore = Math.max(prev.maxScore, score);
        if (newMaxScore > prev.maxScore) {
          localStorage.setItem('tetris_maxScore', newMaxScore.toString());
          return { ...prev, maxScore: newMaxScore };
        }
        return prev;
      });
    }
  }, [gameOver, score]);

  // Generate AI suggestion when AI is enabled and there's a current piece
  useEffect(() => {
    // Only proceed if AI is enabled
    if (!aiEnabled) {
      console.log('🤖 AI Suggestion Effect skipped: AI disabled');
      setAiSuggestion(null);
      return;
    }
    
    console.log('🤖 AI Suggestion Effect triggered:');
    console.log('- aiEnabled:', aiEnabled);
    console.log('- currentPiece:', currentPiece);
    console.log('- gameOver:', gameOver);
    console.log('- gameStarted:', gameStarted);
    
    if (currentPiece && !gameOver && gameStarted) {
      // FORCE regeneration for Magic T to ensure valid suggestions
      if (currentPiece === 'T' && aiSuggestion && (aiSuggestion.col <= 1 || aiSuggestion.col >= 8)) {
        console.log('🔄 Forcing regeneration for Magic T - previous suggestion was invalid');
        setAiSuggestion(null);
      }
      
      // SAFETY CHECK: Validate board structure before passing to AI
      if (!board || !Array.isArray(board) || board.length !== BOARD_HEIGHT) {
        console.error('❌ Invalid board structure:', board);
        setAiSuggestion(null);
        return;
      }
      
      for (let i = 0; i < board.length; i++) {
        if (!board[i] || !Array.isArray(board[i]) || board[i].length !== BOARD_WIDTH) {
          console.error(`❌ Invalid board row ${i}:`, board[i]);
          setAiSuggestion(null);
          return;
        }
      }
      
      console.log('✅ Board structure validated');
      console.log('🎯 Generating AI suggestion...');
      console.log('🔍 About to call ai.suggestBestMove with:', { currentPiece, nextPiece });
      
      // ALWAYS regenerate for Magic T to ensure valid suggestions
      if (currentPiece === 'T') {
        console.log('🎯 Magic T detected - ensuring valid suggestion generation');
      }
      
      const suggestion = ai.suggestBestMove(board, currentPiece, nextPiece);
      console.log('📋 AI suggestion generated:', suggestion);
      
      // ADDITIONAL VALIDATION: Check if suggestion is valid
      if (suggestion) {
        const pieceRotations = PIECES[currentPiece]?.rotations;
        if (pieceRotations) {
          const coords = pieceRotations[suggestion.rotationIndex];
          const pos = suggestion.pos;
          
          // Validate that all piece cells are within board bounds
          let isValidSuggestion = true;
          for (let i = 0; i < coords.length; i++) {
            const idx = pos + coords[i];
            const row = Math.floor(idx / BOARD_WIDTH);
            const col = idx % BOARD_WIDTH;
            
            // Check bounds strictly
            if (row < 0 || row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH) {
              console.log(`AI suggestion invalid: cell at row=${row}, col=${col} is out of bounds`);
              isValidSuggestion = false;
              break;
            }
          }
          
          if (isValidSuggestion) {
            setAiSuggestion(suggestion);
          } else {
            console.log('AI suggestion rejected: invalid placement');
            setAiSuggestion(null);
          }
        } else {
          setAiSuggestion(null);
        }
      } else {
        setAiSuggestion(null);
      }
    } else if (!aiEnabled) {
      setAiSuggestion(null);
    }
  }, [aiEnabled, currentPiece, board, gameOver, gameStarted, ai]);

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece && gameStarted && !aiBusy) {
      const coords = PIECES[currentPiece].rotations[currentRotation];
      for (let i = 0; i < coords.length; i++) {
        const cellIdx = currentPosition + coords[i];
        const row = rOf(cellIdx);
        const col = cOf(cellIdx);
        if (row >= 0 && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH) {
          displayBoard[row][col] = currentPiece; // Store piece name instead of just true
        }
      }
    }
    
    return displayBoard;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 pt-32">
      {/* Audio */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/assets/ttris/TetrisStrings.mp3" type="audio/mpeg" />
      </audio>
      
      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Game Over!
            </h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Final Score:</span>
                <span className="font-bold text-gray-900 dark:text-white">{score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Lines:</span>
                <span className="font-bold text-gray-900 dark:text-white">{lines}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Level:</span>
                <span className="font-bold text-gray-900 dark:text-white">{level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Max Score:</span>
                <span className="font-bold text-gray-900 dark:text-white">{stats.maxScore}</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={initializeGame}
                className="px-6 py-3 rounded-lg font-bold transition-transform active:scale-95"
                style={gradientButtonStyle('rgba(99,102,241,0.95)', 'rgba(59,130,246,0.95)')}
              >
                Play Again
              </button>
            <button
              onClick={() => navigate('/ai')}
                className="px-6 py-3 rounded-lg font-bold transition-transform active:scale-95"
                style={gradientButtonStyle('rgba(107,114,128,0.95)', 'rgba(55,65,81,0.95)')}
            >
                Back to AI Lab
            </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <img 
              src="/assets/ttris/T-Tris2.PNG" 
              alt="T-Tris Logo" 
              className="h-16 sm:h-20 md:h-24 w-auto"
            />
            <button
              onClick={() => navigate('/ai')}
              className="px-4 py-2 rounded-lg transition-transform text-sm sm:text-base active:scale-95"
              style={gradientButtonStyle('rgba(107,114,128,0.95)', 'rgba(55,65,81,0.95)')}
            >
              {t('aiLab.games.tetris.backToAI')}
            </button>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('aiLab.games.tetris.longDescription')}
          </p>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-2xl mx-auto">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
                 <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <button
                      onClick={() => setAiEnabled(!aiEnabled)}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                        aiEnabled
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {aiEnabled ? t('aiLab.games.tetris.aiOn') : t('aiLab.games.tetris.aiOff')}
                    </button>
                    <button
                      onClick={toggleMagicT}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                        magicTEnabled
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {magicTEnabled ? t('aiLab.games.tetris.magicTOn') : t('aiLab.games.tetris.magicTOff')}
                    </button>
                   <button
                     onClick={toggleMute}
                     className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                       isMuted
                         ? 'bg-red-600 hover:bg-red-700 text-white'
                         : 'bg-blue-600 hover:bg-blue-700 text-white'
                     }`}
                   >
                     {isMuted ? '🔇 Mute' : '🔊 Music'}
                    </button>
                </div>

                {/* Next Piece (mobile only, shown above the board) */}
                {nextPiece && (
                  <div className="sm:hidden bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
                      Next Piece
                    </h3>
                    <div className="flex justify-center">
                      <div
                        className="bg-gray-900 rounded-lg p-3 border-2 border-gray-700"
                    style={{
                      display: 'grid',
                          gridTemplateColumns: 'repeat(5, 20px)',
                          gridTemplateRows: 'repeat(5, 20px)',
                          gap: '1px'
                        }}
                      >
                        {Array.from({ length: 25 }, (_, i) => {
                          const r = Math.floor(i / 5);
                          const c = i % 5;
                          const filled = previewCells.some(p => p.r === r && p.c === c);
                          return (
                            <div
                              key={i}
                          style={{
                                width: 20,
                                height: 20,
                                ...(filled
                                  ? (nextPiece === 'T'
                                      ? {
                                          backgroundImage: 'url(/assets/ttris/PRGif.gif)',
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                          borderRadius: 2,
                                          ...neonGlowOnly(PIECES['T'].color)
                                        }
                                      : { ...neonCellStyle(PIECES[nextPiece].color), borderRadius: 2 })
                                  : { backgroundColor: 'transparent', border: '1px solid transparent', borderRadius: 2 })
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tetris Board */}
                <div className="rounded-lg p-3 bg-gray-900 overflow-hidden">
                  <div
                    className="mx-auto grid gap-[1px] bg-gray-800 p-[1px] rounded overflow-hidden"
                    style={{
                      '--cell':'24px',
                      display:'grid',
                      gridTemplateColumns:`repeat(${BOARD_WIDTH}, var(--cell))`,
                      gridTemplateRows:`repeat(${BOARD_HEIGHT}, var(--cell))`,
                      width:`calc(var(--cell) * ${BOARD_WIDTH} + ${BOARD_WIDTH - 1}px + 2px)`,
                      height:`calc(var(--cell) * ${BOARD_HEIGHT} + ${BOARD_HEIGHT - 1}px + 2px)`,
                    }}
                  >
                    {renderBoard().flatMap((row, r) =>
                      row.map((cell, c) => {
                        const isBlinkingRow = blinkingLines.includes(r);
                        const shouldShow = !isBlinkingRow || (isBlinkingRow && isBlinking);
                        
                        return (
                          <div key={`${r}-${c}`}
                              className="rounded-sm"
                              style={{
                                ...(shouldShow && cell
                                  ? (cell === 'T'
                                      ? {
                                          backgroundImage: 'url(/assets/ttris/PRGif.gif)',
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                          ...neonGlowOnly(PIECES['T'].color)
                                        }
                                      : neonCellStyle(PIECES[cell].color))
                                  : { backgroundColor: 'rgba(17,24,39,0.9)' }),
                                opacity: isBlinkingRow ? (isBlinking ? 1 : 0.3) : 1,
                                transition: 'opacity 0.1s ease-in-out'
                              }}/>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
                  <button
                    onClick={() => { handleFirstInteraction(); movePiece('left'); }}
                    className="px-4 py-3 rounded-lg font-bold transition-transform active:scale-95"
                    style={gradientButtonStyle('rgba(64, 108, 201, 0.95)', 'rgba(30,64,175,0.95)')}
                  >
                    ←
                  </button>
                  <button
                    onClick={() => { handleFirstInteraction(); movePiece('rotate'); }}
                    className="px-4 py-3 rounded-lg font-bold transition-transform active:scale-95"
                    style={gradientButtonStyle('rgba(57, 190, 106, 0.95)', 'rgba(8, 112, 79, 0.95)')}
                  >
                    ↻
                  </button>
                  <button
                    onClick={() => { handleFirstInteraction(); movePiece('right'); }}
                    className="px-4 py-3 rounded-lg font-bold transition-transform active:scale-95"
                    style={gradientButtonStyle('rgba(64, 108, 201, 0.95)', 'rgba(30,64,175,0.95)')}
                  >
                    →
                  </button>
                  <button
                    onClick={() => { handleFirstInteraction(); dropPiece(); }}
                    className="px-4 py-3 rounded-lg font-bold transition-transform active:scale-95"
                    style={gradientButtonStyle('rgba(241, 55, 55, 0.95)', 'rgba(124, 21, 21, 0.95)')}
                  >
                    ↓
                  </button>
                {aiEnabled && aiSuggestion && (
                    <button
                      onClick={() => { handleFirstInteraction(); makeAIMove(); }}
                      className="px-4 py-3 rounded-lg font-bold transition-transform active:scale-95"
                      style={gradientButtonStyle('rgba(0,168,255,0.98)', 'rgba(7, 79, 187, 0.98)')}
                    >
                      🤖 AI
                    </button>
                )}
                </div>

                {/* Mobile Controls Info removed per request */}
              </div>
            </div>

            {/* Game Info */}
            <div className="space-y-4 sm:space-y-6">
              {/* Score */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {t('aiLab.games.tetris.score')}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t('aiLab.games.tetris.points')}</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t('aiLab.games.tetris.lines')}</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{lines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t('aiLab.games.tetris.level')}</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{level}</span>
                  </div>
                </div>
              </div>

              {/* Next Piece */}
              {nextPiece && (
                <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
                    Next Piece
                  </h3>
                  <div className="flex justify-center">
                    <div 
                      className="bg-gray-900 rounded-lg p-3 border-2 border-gray-700"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 20px)',
                        gridTemplateRows: 'repeat(5, 20px)',
                        gap: '1px'
                      }}
                    >
                      {Array.from({ length: 25 }, (_, i) => {
                        const r = Math.floor(i / 5);
                        const c = i % 5;
                        const filled = previewCells.some(p => p.r === r && p.c === c);
                        return (
                          <div
                            key={i}
                            style={{
                              width: 20,
                              height: 20,
                              ...(filled
                                ? (nextPiece === 'T'
                                    ? {
                                        backgroundImage: 'url(/assets/ttris/PRGif.gif)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        borderRadius: 2,
                                        ...neonGlowOnly(PIECES['T'].color)
                                      }
                                    : { ...neonCellStyle(PIECES[nextPiece].color), borderRadius: 2 })
                                : { backgroundColor: 'transparent', border: '1px solid transparent', borderRadius: 2 })
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {t('aiLab.games.tetris.stats')}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t('aiLab.games.tetris.gamesPlayed')}</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{stats.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t('aiLab.games.tetris.aiMoves')}</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{stats.aiMoves}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Max Score</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{stats.maxScore}</span>
                  </div>
                </div>
              </div>

              {/* Start Game */}
              {!gameStarted && (
              <div className="text-center">
                <button
                  onClick={initializeGame}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
                >
                    {t('aiLab.games.tetris.startGame') || 'Start Game'}
                </button>
              </div>
              )}

              {/* New Game */}
              <div className="text-center">
              <button
                onClick={initializeGame}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
              >
                  {t('aiLab.games.tetris.newGame')}
              </button>
            </div>
          </div>
          </div>

      </div>
    </div>
  );
}