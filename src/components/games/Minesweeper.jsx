import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

// Minesweeper AI Implementation
class Sentence {
    constructor(cells, count) {
        this.cells = new Set(cells);
        this.count = count;
    }

    equals(other) {
        return this.cells.size === other.cells.size && 
               [...this.cells].every(cell => other.cells.has(cell)) &&
               this.count === other.count;
    }

    knownMines() {
        if (this.count === this.cells.size) {
            return new Set(this.cells);
        }
        return new Set();
    }

    knownSafes() {
        if (this.count === 0) {
            return new Set(this.cells);
        }
        return new Set();
    }

    markMine(cell) {
        if (this.cells.has(cell)) {
            this.cells.delete(cell);
            this.count--;
        }
    }

    markSafe(cell) {
        if (this.cells.has(cell)) {
            this.cells.delete(cell);
        }
    }
}

class MinesweeperAI {
    constructor(height = 8, width = 8) {
        this.height = height;
        this.width = width;
        this.movesMade = new Set();
        this.mines = new Set();
        this.safes = new Set();
        this.knowledge = [];
    }

    markMine(cell) {
        this.mines.add(cell);
        for (let sentence of this.knowledge) {
            sentence.markMine(cell);
        }
    }

    markSafe(cell) {
        this.safes.add(cell);
        for (let sentence of this.knowledge) {
            sentence.markSafe(cell);
        }
    }

    addKnowledge(cell, count) {
        this.movesMade.add(cell);
        this.markSafe(cell);

        const neighbors = new Set();
        for (let i = cell[0] - 1; i <= cell[0] + 1; i++) {
            for (let j = cell[1] - 1; j <= cell[1] + 1; j++) {
                if (i === cell[0] && j === cell[1]) continue;
                if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
                    neighbors.add([i, j]);
                }
            }
        }

        const undeterminedNeighbors = [...neighbors].filter(neighbor => 
            !this.mines.has(neighbor.toString()) && !this.safes.has(neighbor.toString())
        );

        if (undeterminedNeighbors.length > 0) {
            const newSentence = new Sentence(undeterminedNeighbors, count);
            this.knowledge.push(newSentence);
        }

        let changed = true;
        while (changed) {
            changed = false;

            for (let sentence of this.knowledge) {
                const knownMines = sentence.knownMines();
                const knownSafes = sentence.knownSafes();

                for (let mine of knownMines) {
                    if (!this.mines.has(mine.toString())) {
                        this.markMine(mine);
                        changed = true;
                    }
                }

                for (let safe of knownSafes) {
                    if (!this.safes.has(safe.toString())) {
                        this.markSafe(safe);
                        changed = true;
                    }
                }
            }

            for (let i = 0; i < this.knowledge.length; i++) {
                for (let j = 0; j < this.knowledge.length; j++) {
                    if (i === j) continue;

                    const sentence1 = this.knowledge[i];
                    const sentence2 = this.knowledge[j];

                    if (sentence1.cells.size > 0 && sentence2.cells.size > 0) {
                        const intersection = [...sentence1.cells].filter(cell => sentence2.cells.has(cell));
                        
                        if (intersection.length > 0 && sentence1.cells.size <= sentence2.cells.size) {
                            const newCells = [...sentence2.cells].filter(cell => !sentence1.cells.has(cell));
                            const newCount = sentence2.count - sentence1.count;
                            
                            if (newCells.length > 0 && newCount >= 0) {
                                const newSentence = new Sentence(newCells, newCount);
                                const exists = this.knowledge.some(s => s.equals(newSentence));
                                if (!exists) {
                                    this.knowledge.push(newSentence);
                                    changed = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    makeSafeMove() {
        const safeMoves = [...this.safes].filter(safe => 
            !this.movesMade.has(safe.toString())
        );
        
        if (safeMoves.length > 0) {
            const move = safeMoves[0];
            return move.split(',').map(Number);
        }
        return null;
    }

    makeRandomMove() {
        const allCells = [];
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                allCells.push([i, j]);
            }
        }

        const possibleMoves = allCells.filter(cell => 
            !this.movesMade.has(cell.toString()) && 
            !this.mines.has(cell.toString())
        );

        if (possibleMoves.length > 0) {
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
        return null;
    }
}

const Minesweeper = () => {
    const { t } = useLanguage();
    const [board, setBoard] = useState([]);
    const [mines, setMines] = useState(new Set());
    const [revealed, setRevealed] = useState(new Set());
    const [flagged, setFlagged] = useState(new Set());
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [aiMode, setAiMode] = useState(false);
    const [ai, setAi] = useState(new MinesweeperAI());
    const [stats, setStats] = useState({
        gamesPlayed: parseInt(localStorage.getItem('ms_games') || '0'),
        aiMoves: parseInt(localStorage.getItem('ms_ai_moves') || '0'),
        winRate: '0%'
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
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const getNeighborMines = (row, col) => {
        let count = 0;
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
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
        newRevealed.add(`${row},${col}`);

        if (mines.has(`${row},${col}`)) {
            setGameOver(true);
            return;
        }

        setRevealed(newRevealed);

        // If no neighboring mines, reveal neighbors
        if (getNeighborMines(row, col) === 0) {
            for (let i = row - 1; i <= row + 1; i++) {
                for (let j = col - 1; j <= col + 1; j++) {
                    if (i >= 0 && i < 8 && j >= 0 && j < 8 && !newRevealed.has(`${i},${j}`)) {
                        revealCell(i, j);
                    }
                }
            }
        }

        // Check win condition
        if (newRevealed.size === 64 - mines.size) {
            setGameWon(true);
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
        if (gameOver || gameWon || !aiMode) return;

        const safeMove = ai.makeSafeMove();
        if (safeMove) {
            const [row, col] = safeMove;
            revealCell(row, col);
            ai.addKnowledge([row, col], getNeighborMines(row, col));
            
            const newStats = { ...stats, aiMoves: stats.aiMoves + 1 };
            setStats(newStats);
            localStorage.setItem('ms_ai_moves', newStats.aiMoves.toString());
        } else {
            const randomMove = ai.makeRandomMove();
            if (randomMove) {
                const [row, col] = randomMove;
                revealCell(row, col);
                ai.addKnowledge([row, col], getNeighborMines(row, col));
                
                const newStats = { ...stats, aiMoves: stats.aiMoves + 1 };
                setStats(newStats);
                localStorage.setItem('ms_ai_moves', newStats.aiMoves.toString());
            }
        }
    };

    const aiSolveAll = () => {
        if (gameOver || gameWon || !aiMode) return;

        const solveInterval = setInterval(() => {
            if (gameOver || gameWon) {
                clearInterval(solveInterval);
                return;
            }

            const safeMove = ai.makeSafeMove();
            if (safeMove) {
                const [row, col] = safeMove;
                revealCell(row, col);
                ai.addKnowledge([row, col], getNeighborMines(row, col));
                
                const newStats = { ...stats, aiMoves: stats.aiMoves + 1 };
                setStats(newStats);
                localStorage.setItem('ms_ai_moves', newStats.aiMoves.toString());
            } else {
                const randomMove = ai.makeRandomMove();
                if (randomMove) {
                    const [row, col] = randomMove;
                    revealCell(row, col);
                    ai.addKnowledge([row, col], getNeighborMines(row, col));
                    
                    const newStats = { ...stats, aiMoves: stats.aiMoves + 1 };
                    setStats(newStats);
                    localStorage.setItem('ms_ai_moves', newStats.aiMoves.toString());
                } else {
                    clearInterval(solveInterval);
                }
            }
        }, 500);
    };

    const toggleAIMode = () => {
        setAiMode(!aiMode);
        if (!aiMode) {
            setAi(new MinesweeperAI());
        }
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
                            {currentT.title}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            {currentT.subtitle}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
                            {currentT.description}
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 mb-8 flex-wrap">
                        <button
                            onClick={newGame}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            {currentT.newGame}
                        </button>
                        <button
                            onClick={toggleAIMode}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                                aiMode
                                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                            }`}
                        >
                            {aiMode ? currentT.disableAI : currentT.enableAI}
                        </button>
                        {aiMode && (
                            <>
                                <button
                                    onClick={aiSolveStep}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    {currentT.aiSolveStep}
                                </button>
                                <button
                                    onClick={aiSolveAll}
                                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    {currentT.aiSolveAll}
                                </button>
                            </>
                        )}
                    </div>

                    {(gameOver || gameWon) && (
                        <div className="text-center mb-6">
                            <div className={`text-2xl font-bold ${gameWon ? 'text-green-400' : 'text-red-400'}`}>
                                {gameWon ? currentT.gameWon : currentT.gameOver}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center mb-8">
                        <div className="grid grid-cols-8 gap-1 bg-gray-800/50 p-4 rounded-xl max-w-fit">
                            {board.map((row, rowIndex) =>
                                row.map((cell, colIndex) => (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => revealCell(rowIndex, colIndex)}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            toggleFlag(rowIndex, colIndex);
                                        }}
                                        className={`w-8 h-8 ${getCellColor(rowIndex, colIndex)} border border-gray-500 rounded flex items-center justify-center text-sm font-bold transition-all duration-200 hover:scale-105 ${getNumberColor(getNeighborMines(rowIndex, colIndex))}`}
                                        disabled={gameOver || gameWon}
                                    >
                                        {getCellContent(rowIndex, colIndex)}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                        <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-2xl font-bold text-blue-400">{stats.gamesPlayed}</div>
                            <div className="text-sm text-gray-300">{currentT.stats.games}</div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-2xl font-bold text-blue-400">{stats.aiMoves}</div>
                            <div className="text-sm text-gray-300">{currentT.stats.aiMoves}</div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-2xl font-bold text-blue-400">{stats.winRate}</div>
                            <div className="text-sm text-gray-300">{currentT.stats.winRate}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Minesweeper;
