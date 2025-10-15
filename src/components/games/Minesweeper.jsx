import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

// ==== helpers clave/coords ====
const key = (r, c) => `${r},${c}`;
const fromKey = (k) => k.split(',').map(Number);

// ==== Sentence con claves string ====
class Sentence {
  constructor(cells, count) {
    // cells: Iterable de strings "r,c"
    this.cells = new Set(cells);
    this.count = count;
  }

  equals(other) {
    if (this.count !== other.count) return false;
    if (this.cells.size !== other.cells.size) return false;
    for (const c of this.cells) if (!other.cells.has(c)) return false;
    return true;
  }

  knownMines() {
    return this.count === this.cells.size && this.cells.size > 0
      ? new Set(this.cells)
      : new Set();
  }

  knownSafes() {
    return this.count === 0 && this.cells.size > 0
      ? new Set(this.cells)
      : new Set();
  }

  markMine(cellKey) {
    if (this.cells.has(cellKey)) {
      this.cells.delete(cellKey);
      this.count -= 1;
    }
  }

  markSafe(cellKey) {
    if (this.cells.has(cellKey)) {
      this.cells.delete(cellKey);
    }
  }
}

// ==== AI con claves string ====
class MinesweeperAI {
  constructor(height = 8, width = 8) {
    this.height = height;
    this.width = width;
    this.movesMade = new Set(); // "r,c"
    this.mines = new Set();     // "r,c"
    this.safes = new Set();     // "r,c"
    this.knowledge = [];        // Sentence[]
  }

  markMine(cellKey) {
    if (this.mines.has(cellKey)) return;
    this.mines.add(cellKey);
    for (const s of this.knowledge) s.markMine(cellKey);
  }

  markSafe(cellKey) {
    if (this.safes.has(cellKey)) return;
    this.safes.add(cellKey);
    for (const s of this.knowledge) s.markSafe(cellKey);
  }

  // cell = [r,c], count = # minas vecinas (0-8)
  addKnowledge(cell, count) {
    const [r, c] = cell;
    const cellK = key(r, c);

    this.movesMade.add(cellK);
    this.markSafe(cellK);

    // 1) vecinos dentro de tablero -> claves string
    const neighbors = [];
    for (let i = r - 1; i <= r + 1; i++) {
      for (let j = c - 1; j <= c + 1; j++) {
        if (i === r && j === c) continue;
        if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
          neighbors.push(key(i, j));
        }
      }
    }

    // 2) separa conocidos (mines/safes) y resta minas al conteo
    let remaining = count;
    const unknown = [];
    for (const k of neighbors) {
      if (this.mines.has(k)) remaining -= 1;
      else if (!this.safes.has(k)) unknown.push(k);
      // si es safe conocido, no entra en la oración
    }

    if (unknown.length > 0) {
      this.knowledge.push(new Sentence(unknown, remaining));
    }

    // 3) ciclo de inferencia
    let changed = true;
    while (changed) {
      changed = false;

      // 3a) deduce minas/seguros directos
      for (const s of this.knowledge) {
        for (const m of s.knownMines()) {
          if (!this.mines.has(m)) {
            this.markMine(m);
            changed = true;
          }
        }
        for (const sf of s.knownSafes()) {
          if (!this.safes.has(sf)) {
            this.markSafe(sf);
            changed = true;
          }
        }
      }

      // 3b) eliminación y normalización de oraciones vacías/duplicadas
      const compact = [];
      for (const s of this.knowledge) {
        if (s.cells.size === 0) continue;
        if (!compact.some((x) => x.equals(s))) compact.push(s);
      }
      if (compact.length !== this.knowledge.length) {
        this.knowledge = compact;
        changed = true;
      }

      // 3c) inferencia por **subconjunto**: S2 \ S1 con count ajustado
      for (let i = 0; i < this.knowledge.length; i++) {
        for (let j = 0; j < this.knowledge.length; j++) {
          if (i === j) continue;
          const S1 = this.knowledge[i];
          const S2 = this.knowledge[j];
          // ¿S1 ⊆ S2?
          let isSubset = true;
          for (const k of S1.cells) if (!S2.cells.has(k)) { isSubset = false; break; }
          if (!isSubset) continue;

          // crea Snew = S2 - S1 ; cnew = c2 - c1
          const newCells = [];
          for (const k of S2.cells) if (!S1.cells.has(k)) newCells.push(k);
          const newCount = S2.count - S1.count;

          if (newCells.length > 0 && newCount >= 0) {
            const Snew = new Sentence(newCells, newCount);
            if (!this.knowledge.some((x) => x.equals(Snew))) {
              this.knowledge.push(Snew);
              changed = true;
            }
          }
        }
      }
    }
  }

  makeSafeMove() {
    for (const s of this.safes) {
      if (!this.movesMade.has(s)) return fromKey(s);
    }
    return null;
  }

  hasSafeMove() {
    for (const s of this.safes) {
      if (!this.movesMade.has(s)) return true;
    }
    return false;
  }

  makeRandomMove(revealedCells = new Set()) {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const k = key(i, j);
        // Verificar que no esté en movesMade (ya jugada), ni en mines (mina conocida), ni ya revelada
        if (!this.movesMade.has(k) && !this.mines.has(k) && !revealedCells.has(k)) {
          return [i, j];
        }
      }
    }
    return null;
  }
}

const Minesweeper = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [board, setBoard] = useState([]);
    const [mines, setMines] = useState(new Set());
    const [revealed, setRevealed] = useState(new Set());
    const [flagged, setFlagged] = useState(new Set());
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [ai, setAi] = useState(new MinesweeperAI());
    const [canSolve, setCanSolve] = useState(false);
    const [stats, setStats] = useState({
        gamesPlayed: parseInt(localStorage.getItem('ms_games') || '0'),
        aiMoves: parseInt(localStorage.getItem('ms_ai_moves') || '0'),
        gamesWon: parseInt(localStorage.getItem('ms_games_won') || '0')
    });

    const translations = {
        en: {
            title: "Minesweeper AI",
            subtitle: "Watch the AI solve Minesweeper puzzles using logical deduction",
            description: "This AI uses my original logical deduction implementation converted from Python to JavaScript. The algorithm analyzes patterns and probabilities to make safe moves and solve puzzles efficiently.",
            newGame: "New Game",
            enableAI: "Enable AI",
            disableAI: "Disable AI",
            aiSolveStep: "AI Solve Step",
            aiSolveAll: "AI Solve All",
            gameOver: "Game Over!",
            gameWon: "You Win!",
            aiThinking: "AI is thinking...",
            stats: {
                games: "Games Played",
                aiMoves: "AI Moves",
                winRate: "Win Rate"
            }
        },
        es: {
            title: "IA Buscaminas",
            subtitle: "Observa cómo la IA resuelve puzzles de Buscaminas usando deducción lógica",
            description: "Esta IA usa mi implementación original de deducción lógica convertida de Python a JavaScript. El algoritmo analiza patrones y probabilidades para hacer movimientos seguros y resolver puzzles eficientemente.",
            newGame: "Nuevo Juego",
            enableAI: "Activar IA",
            disableAI: "Desactivar IA",
            aiSolveStep: "IA Resolver Paso",
            aiSolveAll: "IA Resolver Todo",
            gameOver: "¡Juego Terminado!",
            gameWon: "¡Ganaste!",
            aiThinking: "La IA está pensando...",
            stats: {
                games: "Juegos Jugados",
                aiMoves: "Movimientos IA",
                winRate: "Tasa de Éxito"
            }
        },
        ca: {
            title: "IA Buscamines",
            subtitle: "Observa com l'IA resol trencaclosques de Buscamines usant deducció lògica",
            description: "Aquesta IA usa la meva implementació original de deducció lògica convertida de Python a JavaScript. L'algoritme analitza patrons i probabilitats per fer moviments segurs i resoldre trencaclosques eficientment.",
            newGame: "Nou Joc",
            enableAI: "Activar IA",
            disableAI: "Desactivar IA",
            aiSolveStep: "IA Resoldre Pas",
            aiSolveAll: "IA Resoldre Tot",
            gameOver: "Joc Acabat!",
            gameWon: "Has guanyat!",
            aiThinking: "L'IA està pensant...",
            stats: {
                games: "Jocs Jugats",
                aiMoves: "Moviments IA",
                winRate: "Taxa d'Èxit"
            }
        }
    };

    const currentLang = localStorage.getItem('language') || 'en';
    const currentT = translations[currentLang];

    const recomputeCanSolve = () => {
        // La IA siempre está activa, solo verifica el estado del juego y si hay movimientos seguros
        setCanSolve(!gameOver && !gameWon && ai.hasSafeMove());
    };

    const initializeGame = () => {
        const newBoard = Array(8).fill().map(() => Array(8).fill(false));
        const newMines = new Set();
        
        // Place mines randomly
        while (newMines.size < 8) {
            const row = Math.floor(Math.random() * 8);
            const col = Math.floor(Math.random() * 8);
            newMines.add(`${row},${col}`);
        }

        setBoard(newBoard);
        setMines(newMines);
        setRevealed(new Set());
        setFlagged(new Set());
        setGameOver(false);
        setGameWon(false);
        setAi(new MinesweeperAI());
        recomputeCanSolve();
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const getNeighborMines = (row, col) => {
        let count = 0;
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i === row && j === col) continue; // <--- evita contar la propia celda
                if (i >= 0 && i < 8 && j >= 0 && j < 8 && mines.has(`${i},${j}`)) {
                    count++;
                }
            }
        }
        return count;
    };

    const revealCell = (row, col) => {
        if (gameOver || gameWon || revealed.has(`${row},${col}`) || flagged.has(`${row},${col}`)) {
            return;
        }

        const newRevealed = new Set(revealed);
        const cellsToReveal = new Set();
        
        const revealRecursive = (r, c) => {
            if (gameOver || gameWon || newRevealed.has(`${r},${c}`) || flagged.has(`${r},${c}`)) {
                return;
            }
            
            newRevealed.add(`${r},${c}`);
            cellsToReveal.add(`${r},${c}`);
            
            if (mines.has(`${r},${c}`)) {
                return;
            }
            
            // If no neighboring mines, add neighbors to reveal
            if (getNeighborMines(r, c) === 0) {
                for (let i = r - 1; i <= r + 1; i++) {
                    for (let j = c - 1; j <= c + 1; j++) {
                        if (i >= 0 && i < 8 && j >= 0 && j < 8 && !newRevealed.has(`${i},${j}`) && !flagged.has(`${i},${j}`)) {
                            revealRecursive(i, j);
                        }
                    }
                }
            }
        };
        
        revealRecursive(row, col);
        
        // Alimentar a la IA con todas las celdas seguras reveladas en este paso
        for (const cell of cellsToReveal) {
            if (!mines.has(cell)) {
                const [rr, cc] = fromKey(cell);
                ai.addKnowledge([rr, cc], getNeighborMines(rr, cc));
            }
        }
        
        // Check if any mine was hit
        for (let cell of cellsToReveal) {
            if (mines.has(cell)) {
                setGameOver(true);
                return;
            }
        }
        
        setRevealed(newRevealed);
        recomputeCanSolve();

        // Check win condition
        if (newRevealed.size === 64 - mines.size) {
            setGameWon(true);
            // Increment games won counter
            const newStats = { ...stats, gamesWon: stats.gamesWon + 1 };
            setStats(newStats);
            localStorage.setItem('ms_games_won', newStats.gamesWon.toString());
        }
    };

    const toggleFlag = (row, col) => {
        if (gameOver || gameWon || revealed.has(`${row},${col}`)) {
            return;
        }

        const newFlagged = new Set(flagged);
        if (newFlagged.has(`${row},${col}`)) {
            newFlagged.delete(`${row},${col}`);
        } else {
            newFlagged.add(`${row},${col}`);
        }
        setFlagged(newFlagged);
    };

    const aiSolveStep = () => {
        if (gameOver || gameWon || !ai.hasSafeMove()) return;
        const safe = ai.makeSafeMove();
        if (!safe) return; // no hay nada que deducir
        const [row, col] = safe;
        revealCell(row, col);
        ai.addKnowledge([row, col], getNeighborMines(row, col));
        const newStats = { ...stats, aiMoves: stats.aiMoves + 1 };
        setStats(newStats);
        localStorage.setItem('ms_ai_moves', newStats.aiMoves.toString());
        recomputeCanSolve();
    };

    const newGame = () => {
        initializeGame();
        const newStats = { ...stats, gamesPlayed: stats.gamesPlayed + 1 };
        setStats(newStats);
        localStorage.setItem('ms_games', newStats.gamesPlayed.toString());
    };

    const getCellContent = (row, col) => {
        if (flagged.has(`${row},${col}`)) {
            return '🚩';
        }
        if (!revealed.has(`${row},${col}`)) {
            return '';
        }
        if (mines.has(`${row},${col}`)) {
            return '💣';
        }
        const neighborMines = getNeighborMines(row, col);
        return neighborMines > 0 ? neighborMines : '';
    };

    const getCellColor = (row, col) => {
        if (gameOver && mines.has(`${row},${col}`)) {
            return 'bg-red-500';
        }
        if (revealed.has(`${row},${col}`)) {
            return 'bg-gray-600';
        }
        return 'bg-gray-700 hover:bg-gray-600';
    };

    const getNumberColor = (num) => {
        const colors = {
            1: 'text-blue-400',
            2: 'text-green-400',
            3: 'text-red-400',
            4: 'text-purple-400',
            5: 'text-yellow-400',
            6: 'text-cyan-400',
            7: 'text-gray-400',
            8: 'text-gray-300'
        };
        return colors[num] || 'text-white';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 pt-32 pb-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-200/20 dark:border-blue-400/20">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('aiLab.games.minesweeper.title')}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            {t('aiLab.games.minesweeper.subtitle')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
                            {t('aiLab.games.minesweeper.description')}
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 mb-8 flex-wrap">
                        <button
                            onClick={() => navigate('/ai')}
                            className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                        >
                            {t('aiLab.games.minesweeper.backToAI')}
                        </button>
                        <button
                            onClick={newGame}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            {t('aiLab.games.minesweeper.newGame')}
                        </button>
                        <button
                            onClick={aiSolveStep}
                            disabled={!canSolve}
                            aria-disabled={!canSolve}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg
                                ${canSolve
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transform hover:scale-105'
                                    : 'bg-gray-500 text-white opacity-60 cursor-not-allowed'}
                            `}
                        >
                            {t('aiLab.games.minesweeper.aiSolveStep')}
                        </button>
                    </div>

                    {(gameOver || gameWon) && (
                        <div className="text-center mb-6">
                            <div className={`text-2xl font-bold ${gameWon ? 'text-green-400' : 'text-red-400'}`}>
                                {gameWon ? t('aiLab.games.minesweeper.gameWon') : t('aiLab.games.minesweeper.gameOver')}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center mb-8">
                        <div className="grid grid-cols-8 gap-0.5 sm:gap-1 bg-gray-800/50 p-2 sm:p-4 rounded-xl max-w-fit mx-auto">
                            {board.map((row, rowIndex) =>
                                row.map((cell, colIndex) => (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => revealCell(rowIndex, colIndex)}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            toggleFlag(rowIndex, colIndex);
                                        }}
                                        className={`w-6 h-6 sm:w-8 sm:h-8 ${getCellColor(rowIndex, colIndex)} border border-gray-500 rounded flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-200 hover:scale-105 ${getNumberColor(getNeighborMines(rowIndex, colIndex))}`}
                                        disabled={gameOver || gameWon}
                                    >
                                        {getCellContent(rowIndex, colIndex)}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto">
                        <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-xl sm:text-2xl font-bold text-blue-400">{stats.gamesPlayed}</div>
                            <div className="text-xs sm:text-sm text-gray-300">{t('aiLab.games.minesweeper.stats.games')}</div>
                        </div>
                        <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-xl sm:text-2xl font-bold text-blue-400">{stats.aiMoves}</div>
                            <div className="text-xs sm:text-sm text-gray-300">{t('aiLab.games.minesweeper.stats.aiMoves')}</div>
                        </div>
                        <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.gamesWon}</div>
                            <div className="text-xs sm:text-sm text-gray-300">{t('aiLab.games.minesweeper.stats.gamesWon')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Minesweeper;
