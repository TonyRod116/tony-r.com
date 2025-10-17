import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

// Tetris Game Implementation with Magic T Piece (based on original code)
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_COUNT = BOARD_WIDTH * BOARD_HEIGHT;

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

  // Get all possible placements for a piece
  allPlacementsFor(matrix, shapeName) {
    const placements = [];
    const rotations = PIECES[shapeName].rotations;
    
    for (let rotationIndex = 0; rotationIndex < rotations.length; rotationIndex++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        const result = this.simulateDrop(matrix, shapeName, rotationIndex, col);
        if (result) {
          placements.push({
            ...result,
            col,
            rotationIndex
          });
        }
      }
    }
    
    return placements;
  }

  // Simulate drop with magic T mechanic (based on original stoppedShape logic)
  simulateDrop(matrix, shapeName, rotationIndex, startCol) {
    // Base spawn position at top row
    let pos = startCol; // absolute index with row 0, column=startCol
      const coords = PIECES[shapeName].rotations[rotationIndex];
      
    // PREVALIDATE lateral bounds using base column + relative offset column
    const baseRow0 = 0;
    const baseCol0 = startCol;
      for (let i = 0; i < coords.length; i++) {
      const offRow = Math.floor(coords[i] / BOARD_WIDTH);
      const offCol = coords[i] - offRow * BOARD_WIDTH;
      const c = baseCol0 + offCol;
      if (c < 0 || c >= BOARD_WIDTH) {
        return null; // would cross walls even above the board
      }
    }

    // Drop until collision using base row/col + relative offsets
    while (true) {
      const posRow = Math.floor(pos / BOARD_WIDTH);
      const posCol = pos - posRow * BOARD_WIDTH;
      let canDrop = true;
      
      for (let i = 0; i < coords.length; i++) {
        const offRow = Math.floor(coords[i] / BOARD_WIDTH);
        const offCol = coords[i] - offRow * BOARD_WIDTH;
        const rBelow = posRow + offRow + 1;
        const c = posCol + offCol;

        // Below the board -> cannot drop
        if (rBelow >= BOARD_HEIGHT) { canDrop = false; break; }
        // Lateral bounds must always hold
        if (c < 0 || c >= BOARD_WIDTH) { canDrop = false; break; }
        // If inside the board, check collision
        if (rBelow >= 0 && matrix[rBelow][c] !== null) { canDrop = false; break; }
      }
      
      if (!canDrop) break;
      pos += BOARD_WIDTH;
    }

    // Clone matrix and apply landing using base row/col + relative offsets
    const next = matrix.map(row => [...row]);

    if (this.magicT && shapeName === 'T') {
      const coords = PIECES['T'].rotations[rotationIndex];
      let highestRow = BOARD_HEIGHT;

      const posRow = Math.floor(pos / BOARD_WIDTH);
      const posCol = pos - posRow * BOARD_WIDTH;
      
      for (let i = 0; i < coords.length; i++) {
        const offRow = Math.floor(coords[i] / BOARD_WIDTH);
        const offCol = coords[i] - offRow * BOARD_WIDTH;
        const r = posRow + offRow;
        const c = posCol + offCol;

        if (r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
          next[r][c] = shapeName;
        }

        // Dissolve downward with guards
        let dropRow = r;
        while (dropRow + 1 < BOARD_HEIGHT) {
          if (c < 0 || c >= BOARD_WIDTH) break;
          if (next[dropRow + 1][c] !== null) break;
          dropRow++;
          if (dropRow >= 0 && dropRow < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
            next[dropRow][c] = shapeName;
          }
        }

        if (dropRow < highestRow) highestRow = dropRow;
      }
    } else {
      const posRow = Math.floor(pos / BOARD_WIDTH);
      const posCol = pos - posRow * BOARD_WIDTH;
      for (let i = 0; i < coords.length; i++) {
        const offRow = Math.floor(coords[i] / BOARD_WIDTH);
        const offCol = coords[i] - offRow * BOARD_WIDTH;
        const r = posRow + offRow;
        const c = posCol + offCol;
        if (r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
          next[r][c] = shapeName;
        }
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
      lines: 0
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

    // Calculate wells
    for (let col = 1; col < BOARD_WIDTH - 1; col++) {
      if (heights[col] < heights[col - 1] && heights[col] < heights[col + 1]) {
        features.wells += heights[col - 1] - heights[col];
        features.wells += heights[col + 1] - heights[col];
      }
    }

    return features;
  }

  // Evaluate board state
  evaluateBoard(matrix, linesCleared) {
    const features = this.calculateFeatures(matrix);
    
    // Scoring weights
    const weights = {
      lines: 100,
      holes: -50,
      bumpiness: -10,
      wells: -20,
      height: -5
    };

    return linesCleared * weights.lines +
           features.holes * weights.holes +
           features.bumpiness * weights.bumpiness +
           features.wells * weights.wells +
           features.height * weights.height;
  }

  // Suggest best move
  suggestBestMove(matrix, currentPiece) {
    const placements = this.allPlacementsFor(matrix, currentPiece);
    
    if (placements.length === 0) return null;

    let bestMove = placements[0];
    let bestScore = -Infinity;

    for (const placement of placements) {
      const score = this.evaluateBoard(placement.matrix, placement.linesCleared);
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
  const [stats, setStats] = useState({
    gamesPlayed: parseInt(localStorage.getItem('tetris_games') || '0'),
    aiMoves: parseInt(localStorage.getItem('tetris_ai_moves') || '0'),
    maxScore: parseInt(localStorage.getItem('tetris_maxScore') || '0')
  });
  const [aiBusy, setAiBusy] = useState(false);

  const aiRef = useRef(new TetrisAI());
  const ai = aiRef.current;

  // Helper function for unified collision detection
  const wouldCollide = useCallback((matrix, name, rot, pos, dx, dy) => {
    if (!name) return true;
    const offs = PIECES[name].rotations[rot];

    // Calcular posición base después del movimiento
    const newPos = pos + dx + dy * BOARD_WIDTH;
    const basePosR = Math.floor(newPos / BOARD_WIDTH);
    const basePosC = newPos - basePosR * BOARD_WIDTH;

    for (const off of offs) {
      // Calcular la posición absoluta sumando el offset directamente
      const targetIdx = newPos + off;
      const r = Math.floor(targetIdx / BOARD_WIDTH);
      const c = targetIdx - r * BOARD_WIDTH;

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

  // Rotation-specific placement check: allow r<0 but still enforce lateral bounds
  const canRotateAt = useCallback((matrix, name, rot, pos) => {
    if (!name) return false;
    const offs = PIECES[name].rotations[rot];

    for (const off of offs) {
      // Compute absolute cell index, then row/col via floor and diff (robust for negatives)
      const idx = pos + off;
      const r = Math.floor(idx / BOARD_WIDTH);
      const c = idx - r * BOARD_WIDTH;

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
    
    // Start music if not muted
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch(console.error);
    }
  }, [ai]);



  // Drop piece
  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || !gameStarted) return;

    if (wouldCollide(board, currentPiece, currentRotation, currentPosition, 0, 1)) {
      // Piece has landed - apply magic T logic
      const newBoard = board.map(row => [...row]);
      
      if (magicTEnabled && currentPiece === 'T') {
        // MAGIC T DISSOLUTION: based on original stoppedShape logic
        const coords = PIECES['T'].rotations[currentRotation];
        let highestRow = BOARD_HEIGHT;
        
        for (let i = 0; i < coords.length; i++) {
          const cellIdx = currentPosition + coords[i];
          const row = Math.floor(cellIdx / BOARD_WIDTH);
          const col = cellIdx - row * BOARD_WIDTH;
          
          // Bounds check before accessing board
          if (row >= 0 && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH) {
          // Mark the T cell where it lands
            newBoard[row][col] = currentPiece;
          
          // Fall vertically filling until hitting occupied or ground
          let dropPos = cellIdx;
            while (dropPos + BOARD_WIDTH < CELL_COUNT) {
              const nextRow = Math.floor((dropPos + BOARD_WIDTH) / BOARD_WIDTH);
              const nextCol = (dropPos + BOARD_WIDTH) - nextRow * BOARD_WIDTH;
              if (newBoard[nextRow][nextCol] !== null) break;
            dropPos += BOARD_WIDTH;
              const dropRow = Math.floor(dropPos / BOARD_WIDTH);
              const dropCol = dropPos - dropRow * BOARD_WIDTH;
              newBoard[dropRow][dropCol] = currentPiece;
          }
          
          const finalRow = Math.floor(dropPos / BOARD_WIDTH);
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
        // Normal behavior
        const coords = PIECES[currentPiece].rotations[currentRotation];
        let highestRow = BOARD_HEIGHT;
        
        for (let i = 0; i < coords.length; i++) {
          const cellIdx = currentPosition + coords[i];
          const row = Math.floor(cellIdx / BOARD_WIDTH);
          const col = cellIdx - row * BOARD_WIDTH;
          
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
      setCurrentPosition(prev => prev + BOARD_WIDTH);
    }
  }, [currentPiece, currentRotation, currentPosition, gameOver, gameStarted, board, magicTEnabled, aiEnabled, lines, nextPiece, wouldCollide]);

  // Move piece
  const movePiece = useCallback((direction) => {
    if (!currentPiece || gameOver || !gameStarted) return;

    let newPosition = currentPosition;
    let newRotation = currentRotation;

    switch (direction) {
      case 'left': {
        // Check if any cell of the piece would go out of bounds or wrap around
        const coords = PIECES[currentPiece].rotations[currentRotation];
        const basePosR = Math.floor(currentPosition / BOARD_WIDTH);
        const basePosC = currentPosition - basePosR * BOARD_WIDTH;
        let canMoveLeft = true;
        
        for (let i = 0; i < coords.length; i++) {
          const cellIdx = currentPosition + coords[i];
          const cellR = Math.floor(cellIdx / BOARD_WIDTH);
          const cellC = cellIdx - cellR * BOARD_WIDTH;
          
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
        // Check if any cell of the piece would go out of bounds or wrap around
        const coords = PIECES[currentPiece].rotations[currentRotation];
        const basePosR = Math.floor(currentPosition / BOARD_WIDTH);
        const basePosC = currentPosition - basePosR * BOARD_WIDTH;
        let canMoveRight = true;
        
        for (let i = 0; i < coords.length; i++) {
          const cellIdx = currentPosition + coords[i];
          const cellR = Math.floor(cellIdx / BOARD_WIDTH);
          const cellC = cellIdx - cellR * BOARD_WIDTH;
          
          // Check if cell is at right edge
          if (cellC === BOARD_WIDTH - 1) {
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
        // Hard drop: baja hasta que no pueda bajar más y fija inmediatamente
        let finalPos = currentPosition;
        while (!wouldCollide(board, currentPiece, currentRotation, finalPos, 0, 1)) {
          finalPos += BOARD_WIDTH;
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

        // Try rotate in place with strict check
        if (canRotateAt(board, currentPiece, nextRotation, currentPosition)) {
          newRotation = nextRotation;
          break;
        }

        // Try kicks (right/left up to 2 cells)
        const baseRow = Math.floor(currentPosition / BOARD_WIDTH);
        const baseCol = currentPosition - baseRow * BOARD_WIDTH;
        for (const dx of [1, -1, 2, -2]) {
          const newCol = baseCol + dx;
          if (newCol < 0 || newCol >= BOARD_WIDTH) continue;
          const testPos = baseRow * BOARD_WIDTH + newCol;
          if (canRotateAt(board, currentPiece, nextRotation, testPos)) {
            newRotation = nextRotation;
            newPosition = testPos;
            break;
          }
        }
        break;
      }
    }

    if (newPosition !== currentPosition || newRotation !== currentRotation) {
      setCurrentPosition(newPosition);
      setCurrentRotation(newRotation);
    }
  }, [currentPiece, currentPosition, currentRotation, gameOver, gameStarted, board, dropPiece, wouldCollide, canRotateAt]);

  // AI move
  const makeAIMove = useCallback(() => {
    if (aiBusy) return;
    if (!aiSuggestion || gameOver || !gameStarted || !currentPiece) return;
    setAiBusy(true);

    try {
      const finalBoard = aiSuggestion.matrix;
      setStats(prev => {
        const newStats = { ...prev, aiMoves: prev.aiMoves + 1 };
        localStorage.setItem('tetris_ai_moves', newStats.aiMoves.toString());
        return newStats;
      });

      if (aiSuggestion.linesCleared > 0) {
        const tempBoard = board.map(row => [...row]);
        const pieceRotations = PIECES[currentPiece]?.rotations;
        if (!pieceRotations) { setAiBusy(false); return; }
        const coords = pieceRotations[aiSuggestion.rotationIndex];
        const pos = aiSuggestion.pos;

        for (let i = 0; i < coords.length; i++) {
          const offRow = Math.floor(coords[i] / BOARD_WIDTH);
          const offCol = coords[i] - offRow * BOARD_WIDTH;
          const posRow = Math.floor(pos / BOARD_WIDTH);
          const posCol = pos - posRow * BOARD_WIDTH;
          const row = posRow + offRow;
          const col = posCol + offCol;
          if (row >= 0 && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH) {
            tempBoard[row][col] = currentPiece;
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

          setScore(prev => prev + aiSuggestion.linesCleared * 100);
          setLines(prev => {
            const total = prev + aiSuggestion.linesCleared;
            setLevel(Math.floor(total / 10) + 1);
            return total;
          });

          const next = nextPiece || PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
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
          setAiBusy(false);
        }, 1000);
      } else {
        setBoard(finalBoard);

        const next = nextPiece || PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
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
        setAiBusy(false);
      }
    } catch (e) {
      console.error(e);
      setAiBusy(false);
    }
  }, [aiBusy, aiSuggestion, gameOver, gameStarted, currentPiece, nextPiece, board, wouldCollide]);

  // Toggle magic T
  const toggleMagicT = useCallback(() => {
    const newValue = !magicTEnabled;
    setMagicTEnabled(newValue);
    aiRef.current.magicT = newValue;
  }, [magicTEnabled]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
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
  }, [movePiece, dropPiece, gameOver, gameStarted]);

  // Auto-drop
  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const interval = setInterval(() => {
      dropPiece();
    }, 1000 / level);

    return () => clearInterval(interval);
  }, [dropPiece, level, gameOver, gameStarted]);

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
    if (aiEnabled && currentPiece && !gameOver && gameStarted) {
      const suggestion = ai.suggestBestMove(board, currentPiece);
      setAiSuggestion(suggestion);
    } else if (!aiEnabled) {
      setAiSuggestion(null);
    }
  }, [aiEnabled, currentPiece, board, gameOver, gameStarted, ai]);

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece && gameStarted) {
      const coords = PIECES[currentPiece].rotations[currentRotation];
      for (let i = 0; i < coords.length; i++) {
        const cellIdx = currentPosition + coords[i];
        const row = Math.floor(cellIdx / BOARD_WIDTH);
        const col = cellIdx - row * BOARD_WIDTH;
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
                    onClick={() => movePiece('left')}
                    className="px-4 py-3 rounded-lg font-bold transition-transform active:scale-95"
                    style={gradientButtonStyle('rgba(64, 108, 201, 0.95)', 'rgba(30,64,175,0.95)')}
                  >
                    ←
                  </button>
                  <button
                    onClick={() => movePiece('rotate')}
                    className="px-4 py-3 rounded-lg font-bold transition-transform active:scale-95"
                    style={gradientButtonStyle('rgba(57, 190, 106, 0.95)', 'rgba(8, 112, 79, 0.95)')}
                  >
                    ↻
                  </button>
                  <button
                    onClick={() => movePiece('right')}
                    className="px-4 py-3 rounded-lg font-bold transition-transform active:scale-95"
                    style={gradientButtonStyle('rgba(64, 108, 201, 0.95)', 'rgba(30,64,175,0.95)')}
                  >
                    →
                  </button>
                  <button
                    onClick={dropPiece}
                    className="px-4 py-3 rounded-lg font-bold transition-transform active:scale-95"
                    style={gradientButtonStyle('rgba(241, 55, 55, 0.95)', 'rgba(124, 21, 21, 0.95)')}
                  >
                    ↓
                  </button>
                {aiEnabled && aiSuggestion && (
                    <button
                      onClick={makeAIMove}
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