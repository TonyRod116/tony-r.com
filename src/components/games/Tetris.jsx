import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

// Tetris Game Implementation with Magic T Piece (based on original code)
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_COUNT = BOARD_WIDTH * BOARD_HEIGHT;

// Helper functions to avoid wrap-around issues
const rOf = (idx) => Math.floor(idx / BOARD_WIDTH);
const cOf = (idx) => ((idx % BOARD_WIDTH) + BOARD_WIDTH) % BOARD_WIDTH;

// Relative offset helpers
const relROf = (off) => Math.trunc(off / BOARD_WIDTH);
const relCOf = (off) => off % BOARD_WIDTH;

// Euclidean column (avoids wrap and negative remainders)
const ecOf = (idx) => ((idx % BOARD_WIDTH) + BOARD_WIDTH) % BOARD_WIDTH;

// Utility function for top center position
const topCenterPos = () => ({ r: 0, c: Math.floor(BOARD_WIDTH / 2) });

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

// Helper function for unified collision detection
const wouldCollide = (matrix, name, rot, r, c, dx, dy) => {
  if (!name || !matrix) return true;
  const pieceData = PIECES[name];
  if (!pieceData || !pieceData.rotations || !pieceData.rotations[rot]) return true;
  const offs = pieceData.rotations[rot];
  
  for (let i = 0; i < offs.length; i++) {
    const off = offs[i];
    const colOff = ((off + 5) % BOARD_WIDTH + BOARD_WIDTH) % BOARD_WIDTH - 5;
    const rowOff = (off - colOff) / BOARD_WIDTH;
    
    const nr = r + rowOff + dy;
    const nc = c + colOff + dx;

    // Check bottom boundary
    if (nr >= BOARD_HEIGHT) return true;
    // Check horizontal boundary
    if (nc < 0 || nc >= BOARD_WIDTH) return true;
    
    // Check board collision only for valid rows
    if (nr >= 0 && matrix[nr][nc] !== null) return true;
  }
  return false;
};

// Simplified placement check for rotation
const canRotateAt = (matrix, name, rot, r, c) => {
  return !wouldCollide(matrix, name, rot, r, c, 0, 0);
};

// Helper function for Next Piece preview
function getPreviewCells(name) {
  const offs = PIECES[name].rotations[0]; // preview with rotation 0

  // Correct conversion to (r,c) with "euclidean" remainder
  const cells = offs.map(off => {
    const r = Math.floor(off / BOARD_WIDTH);
    const c = off - r * BOARD_WIDTH;  // <- DON'T use off % BOARD_WIDTH
    return { r, c };
  });

  // Normalize to origin (0,0)
  const minR = Math.min(...cells.map(x => x.r));
  const minC = Math.min(...cells.map(x => x.c));
  const norm = cells.map(({ r, c }) => ({ r: r - minR, c: c - minC }));

  // Calculate piece dimensions
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

  // Filter to ensure it's within the 5x5 grid
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
      let c = ecOf(idx);

      if (r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
        next[r][c] = name;
        // Vertical drop cell by cell
        let dropIdx = idx;
        while (true) {
          const nextIdx = dropIdx + BOARD_WIDTH;
          const nr = Math.floor(nextIdx / BOARD_WIDTH);
          const nc = ecOf(nextIdx);
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
    if (!matrix || matrix.length !== BOARD_HEIGHT || !PIECES[shapeName]) return [];
    
    const placements = [];
    const rotations = PIECES[shapeName].rotations;
    
    for (let rotIdx = 0; rotIdx < rotations.length; rotIdx++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        // Validation: Ensure all cells start within horizontal bounds
        const offs = rotations[rotIdx];
        let ok = true;
        for (const off of offs) {
          const c = col + relCOf(off);
          if (c < 0 || c >= BOARD_WIDTH) { ok = false; break; }
        }
        if (!ok) continue;

        const result = this.simulateDrop(matrix, shapeName, rotIdx, col);
        if (result) {
          placements.push({ ...result, col, rotationIndex: rotIdx });
        }
      }
    }
    return placements;
  }

  // Simulate drop with correct wrap-around prevention
  simulateDrop(matrix, shapeName, rotIdx, startCol) {
    if (!matrix || !PIECES[shapeName] || rotIdx >= PIECES[shapeName].rotations.length) return null;
    
    const coords = PIECES[shapeName].rotations[rotIdx];
    let posRow = 0;
    
    // Find the spawn row (just above the board)
    for (const off of coords) {
      const r = relROf(off);
      if (r < posRow) posRow = r;
    }
    posRow = Math.abs(posRow);

    // Drop logic
    let r = posRow;
    while (r < BOARD_HEIGHT) {
      let canDrop = true;
      for (const off of coords) {
        const nr = r + relROf(off) + 1;
        const nc = startCol + relCOf(off);
        if (nr >= BOARD_HEIGHT || (nr >= 0 && matrix[nr][nc] !== null)) {
          canDrop = false;
          break;
        }
      }
      if (!canDrop) break;
      r++;
    }

    const next = matrix.map(row => [...row]);
    const finalCells = coords.map(off => [r + relROf(off), startCol + relCOf(off)]);

    // Veto if any cell lands above board
    if (finalCells.some(([row]) => row < 0)) return null;

    if (this.magicT && shapeName === 'T') {
      for (const [row, col] of finalCells) {
        next[row][col] = shapeName;
        // Vertical sand drop
        let dr = row;
        while (dr + 1 < BOARD_HEIGHT && next[dr + 1][col] === null) {
          next[dr][col] = null;
          dr++;
          next[dr][col] = shapeName;
        }
      }
    } else {
      for (const [row, col] of finalCells) {
        next[row][col] = shapeName;
      }
    }

    let linesCleared = 0;
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (next[row].every(v => v !== null)) {
        next.splice(row, 1);
        next.unshift(Array(BOARD_WIDTH).fill(null));
        linesCleared++;
        row++;
      }
    }

    return { matrix: next, linesCleared, pos: r * BOARD_WIDTH + startCol, rotationIndex: rotIdx };
  }

  // Calculate board features for evaluation
  calculateFeatures(matrix) {
    const heights = Array(BOARD_WIDTH).fill(0);
    for (let c = 0; c < BOARD_WIDTH; c++) {
      for (let r = 0; r < BOARD_HEIGHT; r++) {
        if (matrix[r][c]) {
          heights[c] = BOARD_HEIGHT - r;
          break;
        }
      }
    }

    let holes = 0;
    for (let c = 0; c < BOARD_WIDTH; c++) {
      let blockFound = false;
      for (let r = 0; r < BOARD_HEIGHT; r++) {
        if (matrix[r][c]) blockFound = true;
        else if (blockFound) holes++;
      }
    }

    let bumpiness = 0;
    for (let c = 0; c < BOARD_WIDTH - 1; c++) {
      bumpiness += Math.abs(heights[c] - heights[c + 1]);
    }

    let wells = 0;
    for (let c = 0; c < BOARD_WIDTH; c++) {
      const leftH = c === 0 ? BOARD_HEIGHT : heights[c - 1];
      const rightH = c === BOARD_WIDTH - 1 ? BOARD_HEIGHT : heights[c + 1];
      if (heights[c] < leftH && heights[c] < rightH) {
        wells += Math.min(leftH, rightH) - heights[c];
      }
    }

    return {
      height: Math.max(...heights),
      holes,
      bumpiness,
      wells
    };
  }

  // Evaluate board state
  evaluateBoard(matrix, linesCleared) {
    const f = this.calculateFeatures(matrix);
    
    // Heuristic weights from Pierre Dellacherie's algorithm or similar
    const weights = {
      lines: 8.0,
      height: -4.5,
      holes: -9.5,
      bumpiness: -1.8,
      wells: -1.0
    };

    return (linesCleared * weights.lines) +
           (f.height * weights.height) +
           (f.holes * weights.holes) +
           (f.bumpiness * weights.bumpiness) +
           (f.wells * weights.wells);
  }

  // Removed: evaluateMagicTEffect - no longer needed since we don't penalize Magic T position

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
        const offCol = ecOf(coords[i]); // Use signed modulo to avoid wrap-around
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

  // Removed: evaluateMagicTLinePotential - no longer needed since we don't penalize Magic T position

  // Suggest best move
  suggestBestMove(matrix, currentPiece, nextPiece = null) {
    // SAFETY CHECK: Validate inputs
    if (!matrix || !Array.isArray(matrix) || matrix.length !== BOARD_HEIGHT) {
      return null;
    }
    
    if (!currentPiece || !PIECES[currentPiece]) {
      return null;
    }
    
    const placements = this.allPlacementsFor(matrix, currentPiece);
    
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
  const [isDissolving, setIsDissolving] = useState(false);

  const aiRef = useRef(new TetrisAI());
  const ai = aiRef.current;

  // Finalize turn logic (line clearing, scoring, spawning)
  const finishTurn = useCallback((newBoard, highestRow) => {
    // Points based on height (simplified from original logic)
    const sumPoints = Math.max(2, 75 - (highestRow * 3));
    setScore(prev => prev + sumPoints);
    
    let rowsToDelete = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      if (newBoard[i].every(v => v !== null)) {
        rowsToDelete.push(i);
      }
    }
    
    const onTurnComplete = (finalBoard) => {
      setBoard(finalBoard);

      // Update stats
      if (aiEnabled) {
        setStats(prev => {
          const newStats = { ...prev, aiMoves: prev.aiMoves + 1 };
          localStorage.setItem('tetris_ai_moves', newStats.aiMoves.toString());
          return newStats;
        });
      }

      const next = nextPiece || PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
      const spawnPos = topCenterPos();
      const canSpawn = !wouldCollide(finalBoard, next, 0, spawnPos.r, spawnPos.c, 0, 0);

      if (!canSpawn) {
        setGameOver(true);
        setStats(prev => {
          const newStats = { ...prev, gamesPlayed: prev.gamesPlayed + 1 };
          localStorage.setItem('tetris_games', newStats.gamesPlayed.toString());
          return newStats;
        });
        return;
      }

      setCurrentPiece(next);
      setCurrentPosition(spawnPos);
      setCurrentRotation(0);
      setNextPiece(PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)]);
      setIsDissolving(false);
    };
    if (rowsToDelete.length > 0) {
      setBlinkingLines(rowsToDelete);
      setIsBlinking(true);
      
      setTimeout(() => {
        setScore(prev => prev + rowsToDelete.length * 100);
        setLines(prev => {
          const newTotal = prev + rowsToDelete.length;
          setLevel(Math.floor(newTotal / 10) + 1);
          return newTotal;
        });
        
        const filteredBoard = newBoard.filter((_, i) => !rowsToDelete.includes(i));
        while (filteredBoard.length < BOARD_HEIGHT) {
          filteredBoard.unshift(Array(BOARD_WIDTH).fill(null));
        }
        
        setBlinkingLines([]);
        setIsBlinking(false);
        onTurnComplete(filteredBoard);
      }, 500);
    } else {
      onTurnComplete(newBoard);
    }
  }, [aiEnabled, nextPiece, board, lines]);



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
    if (!currentPiece || gameOver || !gameStarted || aiBusy || isDissolving) return;

    if (wouldCollide(board, currentPiece, currentRotation, currentPosition.r, currentPosition.c, 0, 1)) {
      const initialBoard = board.map(row => [...row]);
      const coords = PIECES[currentPiece].rotations[currentRotation];
      const baseR = currentPosition.r;
      const baseC = currentPosition.c;
      
      if (magicTEnabled && currentPiece === 'T') {
        setIsDissolving(true);
        let currentAnimationBoard = initialBoard;

        // Start with the initial placement of the piece
        coords.forEach(off => {
          const colOff = ((off + 5) % BOARD_WIDTH + BOARD_WIDTH) % BOARD_WIDTH - 5;
          const rowOff = (off - colOff) / BOARD_WIDTH;
          const r = baseR + rowOff;
          const c = baseC + colOff;
          if (r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
            currentAnimationBoard[r][c] = currentPiece;
          }
        });
        setBoard([...currentAnimationBoard.map(row => [...row])]);

        const animateStep = () => {
          let moved = false;
          const nextBoard = currentAnimationBoard.map(row => [...row]);

          // Move all 'T' pieces down row by row (sand logic)
          for (let r = BOARD_HEIGHT - 2; r >= 0; r--) {
            for (let c = 0; c < BOARD_WIDTH; c++) {
              if (nextBoard[r][c] === 'T' && nextBoard[r + 1][c] === null) {
                nextBoard[r + 1][c] = 'T';
                nextBoard[r][c] = null;
                moved = true;
              }
            }
          }

          if (moved) {
            currentAnimationBoard = nextBoard;
            setBoard([...nextBoard.map(row => [...row])]);
            setTimeout(animateStep, 40); // Dissolve speed
          } else {
            // Find highest row for scoring
            let highestRow = BOARD_HEIGHT;
            for (let r = 0; r < BOARD_HEIGHT; r++) {
              if (nextBoard[r].some(v => v === 'T')) {
                highestRow = r;
                break;
              }
            }
            finishTurn(nextBoard, highestRow);
          }
        };

        setTimeout(animateStep, 40);
      } else {
        // Normal behavior
        const newBoard = board.map(row => [...row]);
        let highestRow = BOARD_HEIGHT;
        for (const off of coords) {
          const colOff = ((off + 5) % BOARD_WIDTH + BOARD_WIDTH) % BOARD_WIDTH - 5;
          const rowOff = (off - colOff) / BOARD_WIDTH;
          const r = baseR + rowOff;
          const c = baseC + colOff;
          if (r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
            newBoard[r][c] = currentPiece;
            if (r < highestRow) highestRow = r;
          }
        }
        finishTurn(newBoard, highestRow);
      }
    } else {
      // Move piece down
      setCurrentPosition(prev => ({ ...prev, r: prev.r + 1 }));
    }
  }, [currentPiece, currentRotation, currentPosition, gameOver, gameStarted, board, magicTEnabled, aiEnabled, isDissolving, finishTurn]);

  // Move piece
  const movePiece = useCallback((direction) => {
    if (!currentPiece || gameOver || !gameStarted || aiBusy || isDissolving) return;

    let newPos = { ...currentPosition };
    let newRotation = currentRotation;

    switch (direction) {
      case 'left': {
        if (!wouldCollide(board, currentPiece, currentRotation, currentPosition.r, currentPosition.c, -1, 0)) {
          newPos.c = currentPosition.c - 1;
        }
        break;
      }
      case 'right': {
        if (!wouldCollide(board, currentPiece, currentRotation, currentPosition.r, currentPosition.c, 1, 0)) {
          newPos.c = currentPosition.c + 1;
        }
        break;
      }
      case 'drop': {
        let finalR = currentPosition.r;
        while (!wouldCollide(board, currentPiece, currentRotation, finalR, currentPosition.c, 0, 1)) {
          finalR++;
        }
        
        const newBoard = board.map(row => [...row]);
        const pieceRotations = PIECES[currentPiece]?.rotations;
        if (!pieceRotations) return;
        const coords = pieceRotations[currentRotation];
        let highestRow = BOARD_HEIGHT;
        
        for (const off of coords) {
          const colOff = ((off + 5) % BOARD_WIDTH + BOARD_WIDTH) % BOARD_WIDTH - 5;
          const rowOff = (off - colOff) / BOARD_WIDTH;
          const r = finalR + rowOff;
          const c = currentPosition.c + colOff;
          if (r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
            newBoard[r][c] = currentPiece;
            if (r < highestRow) highestRow = r;
          }
        }
        
        finishTurn(newBoard, highestRow);
        return;
      }
      case 'rotate': {
        const nextRotation = (currentRotation + 1) % PIECES[currentPiece].rotations.length;
        if (!wouldCollide(board, currentPiece, nextRotation, currentPosition.r, currentPosition.c, 0, 0)) {
          newRotation = nextRotation;
        }
        break;
      }
    }

    if (newPos.r !== currentPosition.r || newPos.c !== currentPosition.c || newRotation !== currentRotation) {
      setCurrentPosition(newPos);
      setCurrentRotation(newRotation);
    }
  }, [currentPiece, currentPosition, currentRotation, gameOver, gameStarted, board, dropPiece, isDissolving]);
  // AI move
  const makeAIMove = useCallback(() => {
    if (aiBusy || isDissolving || gameOver || !gameStarted || !currentPiece) return;

    let suggestionToUse = aiSuggestion;
    if (!suggestionToUse) {
      if (!aiEnabled) return;
      const suggestion = ai.suggestBestMove(board, currentPiece, nextPiece);
      if (suggestion) {
        setAiSuggestion(suggestion);
        suggestionToUse = suggestion;
      } else {
        return;
      }
    }
    
    setAiBusy(true);

    try {
      const pieceRotations = PIECES[currentPiece]?.rotations;
      if (!pieceRotations || !suggestionToUse) { 
        setAiBusy(false); 
        return; 
      }
      
      const coords = pieceRotations[suggestionToUse.rotationIndex];
      const baseR = Math.floor(suggestionToUse.pos / BOARD_WIDTH);
      const baseC = ((suggestionToUse.pos % BOARD_WIDTH) + BOARD_WIDTH) % BOARD_WIDTH;
      
      // Validate that all piece cells are within board bounds
      let isValidPlacement = true;
      for (const off of coords) {
        const colOff = ((off + 5) % BOARD_WIDTH + BOARD_WIDTH) % BOARD_WIDTH - 5;
        const rowOff = (off - colOff) / BOARD_WIDTH;
        const r = baseR + rowOff;
        const c = baseC + colOff;
        
        if (r < 0 || r >= BOARD_HEIGHT || c < 0 || c >= BOARD_WIDTH) {
          isValidPlacement = false;
          break;
        }
      }
      
      if (!isValidPlacement) {
        setAiBusy(false);
        return;
      }
      
      // Magic T placement rules
      if (currentPiece === 'T') {
        const cellCols = coords.map(off => baseC + (off % BOARD_WIDTH));
        const minC = Math.min(...cellCols);
        const maxC = Math.max(...cellCols);
        if (minC < 2 || maxC > 7) {
          setAiBusy(false);
          return;
        }
      }
      
      // Apply rotation and position visually before placing
      setCurrentRotation(suggestionToUse.rotationIndex);
      const targetC = ((suggestionToUse.pos % BOARD_WIDTH) + BOARD_WIDTH) % BOARD_WIDTH;
      setCurrentPosition({ r: currentPosition.r, c: targetC });
    
      // Delay to show the target position before dropping
      setTimeout(() => {
        if (currentPiece === 'T' && magicTEnabled) {
          // Trigger the animated dissolution logic
          dropPiece();
          setAiBusy(false);
        } else {
          // Direct placement for other pieces or if magic T is disabled
          const finalBoard = suggestionToUse.matrix;
          setBoard(finalBoard);
          
          setStats(prev => {
            const newStats = { ...prev, aiMoves: prev.aiMoves + 1 };
            localStorage.setItem('tetris_ai_moves', newStats.aiMoves.toString());
            return newStats;
          });

          if (suggestionToUse.linesCleared > 0) {
            const tempBoard = board.map(row => [...row]);
            const pieceRotations = PIECES[currentPiece]?.rotations;
            if (!pieceRotations) { setAiBusy(false); return; }
            const coords = pieceRotations[suggestionToUse.rotationIndex];
            const baseR = Math.floor(suggestionToUse.pos / BOARD_WIDTH);
            const baseC = ((suggestionToUse.pos % BOARD_WIDTH) + BOARD_WIDTH) % BOARD_WIDTH;

            for (let i = 0; i < coords.length; i++) {
              const off = coords[i];
              const colOff = ((off + 5) % BOARD_WIDTH + BOARD_WIDTH) % BOARD_WIDTH - 5;
              const rowOff = (off - colOff) / BOARD_WIDTH;
              const r = baseR + rowOff;
              const c = baseC + colOff;
              if (r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
                tempBoard[r][c] = currentPiece;
              }
            }

            const completedRows = [];
            for (let r = 0; r < BOARD_HEIGHT; r++) {
              if (tempBoard[r].every(cell => cell !== null)) {
                completedRows.push(r);
              }
            }

            setBoard(tempBoard);
            setBlinkingLines(completedRows);
            setIsBlinking(true);

            setTimeout(() => {
              setBoard(finalBoard);
              setBlinkingLines([]);
              setIsBlinking(false);

              setScore(prev => prev + suggestionToUse.linesCleared * 100 + 10); // 10 points per piece + line bonus
              setLines(prev => {
                const total = prev + suggestionToUse.linesCleared;
                setLevel(Math.floor(total / 10) + 1);
                return total;
              });

              const next = nextPiece || PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
              const spawnPos = topCenterPos();
              const canSpawn = !wouldCollide(finalBoard, next, 0, spawnPos.r, spawnPos.c, 0, 0);

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
              setAiBusy(false);
            }, 1000);
          } else {
            setBoard(finalBoard);

            // Add points for placing piece (even without lines)
            setScore(prev => prev + 10); // 10 points per piece

            const next = nextPiece || PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
            const spawnPos = topCenterPos();
            const canSpawn = !wouldCollide(finalBoard, next, 0, spawnPos.r, spawnPos.c, 0, 0);

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
            setAiBusy(false);
          }
        }
      }, 100); // Close setTimeout with 100ms delay
    } catch (e) {
      setAiBusy(false);
    }
    
    // SAFETY TIMEOUT: Ensure aiBusy is always reset after 5 seconds
    setTimeout(() => {
      setAiBusy(false);
    }, 5000);
  }, [aiBusy, aiSuggestion, gameOver, gameStarted, currentPiece, nextPiece, board, aiEnabled, ai, isDissolving]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setAiSuggestion(null);
      return;
    }
    
    if (currentPiece && !gameOver && gameStarted) {
      // FORCE regeneration for Magic T to ensure valid suggestions
      if (currentPiece === 'T' && aiSuggestion && (aiSuggestion.col <= 1 || aiSuggestion.col >= 8)) {
        setAiSuggestion(null);
      }
      
      // SAFETY CHECK: Validate board structure before passing to AI
      if (!board || !Array.isArray(board) || board.length !== BOARD_HEIGHT) {
        setAiSuggestion(null);
        return;
      }
      
      for (let i = 0; i < board.length; i++) {
        if (!board[i] || !Array.isArray(board[i]) || board[i].length !== BOARD_WIDTH) {
          setAiSuggestion(null);
          return;
        }
      }
      
      const suggestion = ai.suggestBestMove(board, currentPiece, nextPiece);
      
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
            const col = ecOf(idx);
            
            // Check bounds strictly
            if (row < 0 || row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH) {
              isValidSuggestion = false;
              break;
            }
          }
          
          if (isValidSuggestion) {
            setAiSuggestion(suggestion);
          } else {
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
      const pieceData = PIECES[currentPiece];
      if (!pieceData) return displayBoard;
      
      const coords = pieceData.rotations[currentRotation];
      const baseR = currentPosition.r;
      const baseC = currentPosition.c;

      for (let i = 0; i < coords.length; i++) {
        const off = coords[i];
        const colOff = ((off + 5) % BOARD_WIDTH + BOARD_WIDTH) % BOARD_WIDTH - 5;
        const rowOff = (off - colOff) / BOARD_WIDTH;
        const r = baseR + rowOff;
        const c = baseC + colOff;
        if (r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
          displayBoard[r][c] = currentPiece;
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
                <div className="rounded-lg p-3 bg-gray-900 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-gray-800">
                  <div
                    className="mx-auto"
                    style={{
                      '--cell':'24px',
                      display:'grid',
                      gridTemplateColumns:`repeat(${BOARD_WIDTH}, var(--cell))`,
                      gridTemplateRows:`repeat(${BOARD_HEIGHT}, var(--cell))`,
                      width:`calc(var(--cell) * ${BOARD_WIDTH})`,
                      height:`calc(var(--cell) * ${BOARD_HEIGHT})`,
                      backgroundColor: '#0f172a',
                    }}
                  >
                    {renderBoard().flatMap((row, r) =>
                      row.map((cell, c) => {
                        const isBlinkingRow = blinkingLines.includes(r);
                        const shouldShow = !isBlinkingRow || (isBlinkingRow && isBlinking);

                        return (
                          <div key={`${r}-${c}`}
                              className="border-[0.5px] border-white/[0.05]"
                              style={{
                                width: 'var(--cell)',
                                height: 'var(--cell)',
                                ...(shouldShow && cell
                                  ? (cell === 'T'
                                      ? {
                                          backgroundImage: 'url(/assets/ttris/PRGif.gif)',
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                          borderRadius: '2px',
                                          ...neonGlowOnly(PIECES['T'].color)
                                        }
                                      : { ...neonCellStyle(PIECES[cell].color), borderRadius: '2px' })
                                  : { backgroundColor: 'rgba(255, 255, 255, 0.03)' }),
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
                {aiEnabled && (
                  <button
                      onClick={() => { 
                        handleFirstInteraction(); 
                        makeAIMove(); 
                      }}
                      className={`px-4 py-3 rounded-lg font-bold transition-transform active:scale-95 ${
                        aiBusy || currentPiece === 'T' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={gradientButtonStyle('rgba(0,168,255,0.98)', 'rgba(7, 79, 187, 0.98)')}
                      disabled={aiBusy || currentPiece === 'T'}
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