import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

// Tetris Game Implementation with Magic T Piece (based on original code)
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_COUNT = BOARD_WIDTH * BOARD_HEIGHT;
const STARTING_POS = 24;

// Tetris pieces with original colors and classes
const PIECES = {
  L: {
    className: 'blueShape',
    color: '#3b82f6',
    rotations: [
      [-(BOARD_WIDTH*2), -BOARD_WIDTH, 0, 1],
      [-(BOARD_WIDTH)+1, -(BOARD_WIDTH)-1, -(BOARD_WIDTH), -1],      
      [-(BOARD_WIDTH*2) -1, -(BOARD_WIDTH*2), -(BOARD_WIDTH), 0], 
      [-(BOARD_WIDTH)+1, -(BOARD_WIDTH)-1, -(BOARD_WIDTH), -(BOARD_WIDTH*2)+1],  
    ]
  },
  Li: {
    className: 'redShape',
    color: '#ef4444',
    rotations: [
      [-(BOARD_WIDTH*2) +1, -(BOARD_WIDTH) +1, 0, 1], 
      [-(BOARD_WIDTH*2) -1, -(BOARD_WIDTH) -1, -(BOARD_WIDTH), -(BOARD_WIDTH) +1,],
      [-(BOARD_WIDTH*2), -(BOARD_WIDTH*2) +1, -(BOARD_WIDTH), 0],
      [-(BOARD_WIDTH) -1, -(BOARD_WIDTH), -(BOARD_WIDTH) +1, 1],
    ]
  },
  S: {
    className: 'greenShape',
    color: '#10b981',
    rotations: [
      [-(BOARD_WIDTH*2), -BOARD_WIDTH, -(BOARD_WIDTH)+1, 1],
      [-(BOARD_WIDTH*2) +1, -(BOARD_WIDTH*2), -(BOARD_WIDTH) -1, -(BOARD_WIDTH)],
      [-(BOARD_WIDTH*2), -BOARD_WIDTH, -(BOARD_WIDTH)+1, 1],
      [-(BOARD_WIDTH*2) +1, -(BOARD_WIDTH*2), -(BOARD_WIDTH) -1, -(BOARD_WIDTH)],
    ]
  },
  Si: {
    className: 'yellowShape',
    color: '#f59e0b',
    rotations: [
      [-(BOARD_WIDTH*2) +1, -(BOARD_WIDTH) +1, -(BOARD_WIDTH), 0],
      [-(BOARD_WIDTH) -1, -(BOARD_WIDTH), 0, 1],
      [-(BOARD_WIDTH*2) +1, -(BOARD_WIDTH) +1, -(BOARD_WIDTH), 0],
      [-(BOARD_WIDTH) -1, -(BOARD_WIDTH), 0, 1],
    ]
  },
  M: {
    className: 'purpleShape',
    color: '#8b5cf6',
    rotations: [
      [-(BOARD_WIDTH*2), -BOARD_WIDTH, -(BOARD_WIDTH) + 1, 0],
      [-(BOARD_WIDTH), -(BOARD_WIDTH)-1, -(BOARD_WIDTH) + 1, 0],
      [-(BOARD_WIDTH*2), -(BOARD_WIDTH)-1, -(BOARD_WIDTH), 0],
      [-(BOARD_WIDTH*2), -(BOARD_WIDTH) -1, -(BOARD_WIDTH), -(BOARD_WIDTH) + 1],
    ]
  },
  O: {
    className: 'orangeShape',
    color: '#f97316',
    rotations: [
      [-(BOARD_WIDTH), -BOARD_WIDTH+1, 0, 1],
      [-(BOARD_WIDTH), -BOARD_WIDTH+1, 0, 1],
      [-(BOARD_WIDTH), -BOARD_WIDTH+1, 0, 1],
      [-(BOARD_WIDTH), -BOARD_WIDTH+1, 0, 1],
    ]
  },
  I: {
    className: 'pinkShape',
    color: '#ec4899',
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
    // Position piece at top
    let pos = STARTING_POS;
    const maxShift = 4;
    let shifted = 0;

    // Adjust position to stay in bounds
    while (shifted <= maxShift) {
      const coords = PIECES[shapeName].rotations[rotationIndex];
      let canPlace = true;
      
      for (let i = 0; i < coords.length; i++) {
        const cellIdx = pos + coords[i];
        if (cellIdx < 0 || cellIdx >= CELL_COUNT) {
          canPlace = false;
          break;
        }
        const col = cellIdx % BOARD_WIDTH;
        if (col < 0 || col >= BOARD_WIDTH) {
          canPlace = false;
          break;
        }
      }
      
      if (canPlace) break;
      pos++; shifted++;
    }

    // Drop until collision
    while (true) {
      const coords = PIECES[shapeName].rotations[rotationIndex];
      let canDrop = true;
      
      for (let i = 0; i < coords.length; i++) {
        const cellIdx = pos + coords[i];
        const cellBelowIdx = cellIdx + BOARD_WIDTH;
        if (cellBelowIdx >= CELL_COUNT || matrix[Math.floor(cellBelowIdx / BOARD_WIDTH)][cellBelowIdx % BOARD_WIDTH]) {
          canDrop = false;
          break;
        }
      }
      
      if (!canDrop) break;
      pos += BOARD_WIDTH;
    }

    // Clone matrix and apply landing
    const next = matrix.map(row => [...row]);

    if (this.magicT && shapeName === 'T') {
      // MAGIC T DISSOLUTION: based on original stoppedShape logic
      const coords = PIECES['T'].rotations[rotationIndex];
      let highestRow = BOARD_HEIGHT;
      
      for (let i = 0; i < coords.length; i++) {
        const cellIdx = pos + coords[i];
        const row = Math.floor(cellIdx / BOARD_WIDTH);
        const col = cellIdx % BOARD_WIDTH;
        
        // Mark the T cell where it lands
        next[row][col] = true;
        
        // Fall vertically filling until hitting occupied or ground
        let dropPos = cellIdx;
        while (dropPos + BOARD_WIDTH < CELL_COUNT && !next[Math.floor((dropPos + BOARD_WIDTH) / BOARD_WIDTH)][(dropPos + BOARD_WIDTH) % BOARD_WIDTH]) {
          dropPos += BOARD_WIDTH;
          next[Math.floor(dropPos / BOARD_WIDTH)][dropPos % BOARD_WIDTH] = true;
        }
        
        const finalRow = Math.floor(dropPos / BOARD_WIDTH);
        if (finalRow < highestRow) highestRow = finalRow;
      }
    } else {
      // Normal behavior
      const coords = PIECES[shapeName].rotations[rotationIndex];
      let highestRow = BOARD_HEIGHT;
      
      for (let i = 0; i < coords.length; i++) {
        const cellIdx = pos + coords[i];
        const row = Math.floor(cellIdx / BOARD_WIDTH);
        const col = cellIdx % BOARD_WIDTH;
        next[row][col] = true;
        if (row < highestRow) highestRow = row;
      }
    }

    // Clear lines and count how many
    let linesCleared = 0;
    for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
      if (next[r].every(v => v)) {
        next.splice(r, 1);
        next.unshift(Array(BOARD_WIDTH).fill(false));
        linesCleared++;
        r++; // Re-evaluate after shift
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
    Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(false))
  );
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(STARTING_POS);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [magicTEnabled, setMagicTEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [stats, setStats] = useState({
    gamesPlayed: parseInt(localStorage.getItem('tetris_games') || '0'),
    aiMoves: parseInt(localStorage.getItem('tetris_ai_moves') || '0'),
    gamesWon: parseInt(localStorage.getItem('tetris_gamesWon') || '0')
  });

  const ai = new TetrisAI();

  // Initialize game
  const initializeGame = useCallback(() => {
    const newBoard = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(false));
    setBoard(newBoard);
    setCurrentPiece(null);
    setNextPiece(null);
    setCurrentPosition(STARTING_POS);
    setCurrentRotation(0);
    setGameOver(false);
    setScore(0);
    setLines(0);
    setLevel(1);
    setAiSuggestion(null);
    setGameStarted(false);
    spawnNewPiece();
  }, []);

  // Start game
  const startGame = useCallback(() => {
    setGameStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch(console.error);
    }
  }, []);

  // Spawn new piece
  const spawnNewPiece = useCallback(() => {
    if (nextPiece === null) {
      const pieceName = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
      setNextPiece(pieceName);
    }
    
    const pieceName = nextPiece || PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
    setCurrentPiece(pieceName);
    setCurrentPosition(STARTING_POS);
    setCurrentRotation(0);
    
    // Generate next piece
    const nextPieceName = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
    setNextPiece(nextPieceName);
    
    // Get AI suggestion if enabled
    if (aiEnabled) {
      const suggestion = ai.suggestBestMove(board, pieceName);
      setAiSuggestion(suggestion);
    }
  }, [board, aiEnabled, nextPiece]);

  // Check collisions
  const downCollision = useCallback(() => {
    if (!currentPiece) return true;
    
    const coords = PIECES[currentPiece].rotations[currentRotation];
    for (let i = 0; i < coords.length; i++) {
      const cellIdx = currentPosition + coords[i];
      const cellBelowIdx = cellIdx + BOARD_WIDTH;
      if (cellBelowIdx >= CELL_COUNT || 
          (Math.floor(cellBelowIdx / BOARD_WIDTH) < BOARD_HEIGHT && 
           board[Math.floor(cellBelowIdx / BOARD_WIDTH)][cellBelowIdx % BOARD_WIDTH])) {
        return true;
      }
    }
    return false;
  }, [currentPiece, currentRotation, currentPosition, board]);

  const leftCollision = useCallback(() => {
    if (!currentPiece) return true;
    
    const coords = PIECES[currentPiece].rotations[currentRotation]; 
    for (let i = 0; i < coords.length; i++) {
      const cellIdx = currentPosition + coords[i];        
      const cellLeftToIdx = cellIdx - 1;        
      if (cellLeftToIdx >= 0 && 
          Math.floor(cellLeftToIdx / BOARD_WIDTH) < BOARD_HEIGHT &&
          board[Math.floor(cellLeftToIdx / BOARD_WIDTH)][cellLeftToIdx % BOARD_WIDTH] && 
          (cellIdx % BOARD_WIDTH !== 0)) { 
        return true; 
      }
    }
    return false; 
  }, [currentPiece, currentRotation, currentPosition, board]);

  const rightCollision = useCallback(() => {
    if (!currentPiece) return true;
    
    const coords = PIECES[currentPiece].rotations[currentRotation]; 
    for (let i = 0; i < coords.length; i++) {
      const cellIdx = currentPosition + coords[i];        
      const cellRightToIdx = cellIdx + 1;        
      if (cellRightToIdx < CELL_COUNT &&
          Math.floor(cellRightToIdx / BOARD_WIDTH) < BOARD_HEIGHT &&
          board[Math.floor(cellRightToIdx / BOARD_WIDTH)][cellRightToIdx % BOARD_WIDTH] && 
          (cellIdx % BOARD_WIDTH !== BOARD_WIDTH - 1)) { 
        return true; 
      }
    }
    return false; 
  }, [currentPiece, currentRotation, currentPosition, board]);

  const canRotate = useCallback((nextRotation) => {
    if (!currentPiece) return false;
    
    const nextCoords = PIECES[currentPiece].rotations[nextRotation];
    const baseCol = currentPosition % BOARD_WIDTH;  
    for (let i = 0; i < nextCoords.length; i++) {
      const idx = currentPosition + nextCoords[i];
      if (idx < 0 || idx >= CELL_COUNT) return false;
      const col = idx % BOARD_WIDTH;
      if (col < 0 || col >= BOARD_WIDTH) return false;
      if (Math.abs(col - baseCol) > 3) return false; 
      if (Math.floor(idx / BOARD_WIDTH) < BOARD_HEIGHT && 
          board[Math.floor(idx / BOARD_WIDTH)][idx % BOARD_WIDTH]) return false;
    }
    return true;
  }, [currentPiece, currentPosition, board]);

  // Move piece
  const movePiece = useCallback((direction) => {
    if (!currentPiece || gameOver || !gameStarted) return;

    let newPosition = currentPosition;
    let newRotation = currentRotation;

    switch (direction) {
      case 'left':
        if (!leftCollision()) {
          newPosition = Math.max(0, currentPosition - 1);
        }
        break;
      case 'right':
        if (!rightCollision()) {
          newPosition = Math.min(CELL_COUNT - 1, currentPosition + 1);
        }
        break;
      case 'down':
        // Handle drop
        break;
      case 'rotate':
        const nextRotation = (currentRotation + 1) % PIECES[currentPiece].rotations.length;
        if (canRotate(nextRotation)) {
          newRotation = nextRotation;
        }
        break;
    }

    if (newPosition !== currentPosition || newRotation !== currentRotation) {
      setCurrentPosition(newPosition);
      setCurrentRotation(newRotation);
    }
  }, [currentPiece, currentPosition, currentRotation, gameOver, gameStarted, leftCollision, rightCollision, canRotate]);

  // Drop piece
  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || !gameStarted) return;

    if (downCollision()) {
      // Piece has landed - apply magic T logic
      const newBoard = board.map(row => [...row]);
      
      if (magicTEnabled && currentPiece === 'T') {
        // MAGIC T DISSOLUTION: based on original stoppedShape logic
        const coords = PIECES['T'].rotations[currentRotation];
        let highestRow = BOARD_HEIGHT;
        
        for (let i = 0; i < coords.length; i++) {
          const cellIdx = currentPosition + coords[i];
          const row = Math.floor(cellIdx / BOARD_WIDTH);
          const col = cellIdx % BOARD_WIDTH;
          
          // Mark the T cell where it lands
          newBoard[row][col] = true;
          
          // Fall vertically filling until hitting occupied or ground
          let dropPos = cellIdx;
          while (dropPos + BOARD_WIDTH < CELL_COUNT && !newBoard[Math.floor((dropPos + BOARD_WIDTH) / BOARD_WIDTH)][(dropPos + BOARD_WIDTH) % BOARD_WIDTH]) {
            dropPos += BOARD_WIDTH;
            newBoard[Math.floor(dropPos / BOARD_WIDTH)][dropPos % BOARD_WIDTH] = true;
          }
          
          const finalRow = Math.floor(dropPos / BOARD_WIDTH);
          if (finalRow < highestRow) highestRow = finalRow;
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
          const col = cellIdx % BOARD_WIDTH;
          newBoard[row][col] = true;
          if (row < highestRow) highestRow = row;
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
        if (newBoard[i].every(v => v)) {
          rowsToDelete.push(i);
        }
      }
      
      if (rowsToDelete.length > 0) {
        setScore(prev => prev + rowsToDelete.length * 100);
        setLines(prev => prev + rowsToDelete.length);
        setLevel(prev => Math.floor((lines + rowsToDelete.length) / 10) + 1);
        
        // Remove completed rows
        rowsToDelete.forEach(rowIdx => {
          newBoard.splice(rowIdx, 1);
          newBoard.unshift(Array(BOARD_WIDTH).fill(false));
        });
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
      
      spawnNewPiece();
      
      // Check for game over
      if (downCollision()) {
        setGameOver(true);
        setStats(prev => {
          const newStats = { ...prev, gamesPlayed: prev.gamesPlayed + 1 };
          localStorage.setItem('tetris_games', newStats.gamesPlayed.toString());
          return newStats;
        });
      }
    } else {
      // Move piece down
      setCurrentPosition(prev => prev + BOARD_WIDTH);
    }
  }, [currentPiece, currentRotation, currentPosition, gameOver, gameStarted, board, magicTEnabled, downCollision, aiEnabled, lines, spawnNewPiece]);

  // AI move
  const makeAIMove = useCallback(() => {
    if (!aiSuggestion || gameOver || !gameStarted) return;

    setCurrentPosition(aiSuggestion.col);
    setCurrentRotation(aiSuggestion.rotationIndex);
    
    // Auto-drop after AI move
    setTimeout(() => {
      dropPiece();
    }, 500);
  }, [aiSuggestion, gameOver, gameStarted, dropPiece]);

  // Toggle magic T
  const toggleMagicT = useCallback(() => {
    const newValue = !magicTEnabled;
    setMagicTEnabled(newValue);
    ai.magicT = newValue;
  }, [magicTEnabled]);

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
          movePiece('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          movePiece('rotate');
          break;
        case ' ':
          e.preventDefault();
          dropPiece();
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

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece && gameStarted) {
      const coords = PIECES[currentPiece].rotations[currentRotation];
      for (let i = 0; i < coords.length; i++) {
        const cellIdx = currentPosition + coords[i];
        const row = Math.floor(cellIdx / BOARD_WIDTH);
        const col = cellIdx % BOARD_WIDTH;
        if (row >= 0 && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH) {
          displayBoard[row][col] = true;
        }
      }
    }
    
    return displayBoard;
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('/assets/ttris/T-Tetris_fondo1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Audio */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/assets/ttris/TetrisStrings.mp3" type="audio/mpeg" />
      </audio>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <button
              onClick={() => navigate('/ai')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              {t('aiLab.games.tetris.backToAI')}
            </button>
            <img 
              src="/assets/ttris/T-Tris2.PNG" 
              alt="T-Tris Logo" 
              className="h-12 sm:h-16 md:h-20 w-auto"
            />
            {magicTEnabled && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-medium rounded-full">
                {t('aiLab.games.tetris.magicT')}
              </span>
            )}
          </div>
          <p className="text-lg text-white max-w-2xl mx-auto drop-shadow-lg">
            {t('aiLab.games.tetris.description')}
          </p>
        </div>

        {/* Game Start Screen */}
        {!gameStarted && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('aiLab.games.tetris.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {magicTEnabled ? 'Magic T mode enabled!' : 'Classic Tetris mode'}
              </p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 text-lg"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {/* Game Board */}
        {gameStarted && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Game Board */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {t('aiLab.games.tetris.gameBoard')}
                  </h2>
                  <div className="flex flex-wrap gap-2">
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
                  </div>
                </div>

                {/* Tetris Board */}
                <div className="bg-gray-900 rounded-lg p-2 sm:p-4 mb-4">
                  <div className="grid grid-cols-10 gap-1 mx-auto" style={{ maxWidth: '300px' }}>
                    {renderBoard().map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`aspect-square rounded ${
                            cell ? 'bg-blue-500' : 'bg-gray-800'
                          }`}
                          style={{ 
                            minHeight: '12px',
                            minWidth: '12px'
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                  <button
                    onClick={() => movePiece('left')}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => movePiece('rotate')}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                  >
                    ↻
                  </button>
                  <button
                    onClick={() => movePiece('right')}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                  >
                    →
                  </button>
                  <button
                    onClick={dropPiece}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                  >
                    ↓
                  </button>
                </div>

                {/* Mobile Controls Info */}
                <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 sm:hidden">
                  Use arrow keys or buttons above
                </div>

                {aiEnabled && aiSuggestion && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={makeAIMove}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                    >
                      {t('aiLab.games.tetris.aiMove')}
                    </button>
                  </div>
                )}
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
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Next Piece
                  </h3>
                  <div className="flex justify-center">
                    <div 
                      className="w-8 h-8 sm:w-12 sm:h-12 rounded"
                      style={{ backgroundColor: PIECES[nextPiece].color }}
                    />
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
                    <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t('aiLab.games.tetris.gamesWon')}</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{stats.gamesWon}</span>
                  </div>
                </div>
              </div>

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
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center max-w-md mx-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Game Over!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Score: <span className="font-bold">{score}</span>
              </p>
              <button
                onClick={initializeGame}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}