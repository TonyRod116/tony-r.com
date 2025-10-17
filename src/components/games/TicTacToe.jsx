import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

const X = "X";
const O = "O";
const EMPTY = null;

// Minimax Algorithm Implementation
const initial_state = () => {
    return [[EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY]];
};

const player = (board) => {
    const x_count = board.flat().filter(cell => cell === X).length;
    const o_count = board.flat().filter(cell => cell === O).length;
    return x_count === o_count ? X : O;
};

const actions = (board) => {
    if (terminal(board)) return [];
    const possible_actions = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === EMPTY) {
                possible_actions.push([i, j]);
            }
        }
    }
    return possible_actions;
};

const result = (board, action) => {
    const new_board = board.map(row => [...row]);
    const [i, j] = action;
    if (new_board[i][j] !== EMPTY) {
        throw new Error("Invalid action");
    }
    const current_player = player(board);
    new_board[i][j] = current_player;
    return new_board;
};

const winner = (board) => {
    // Check rows
    for (let row of board) {
        if (row[0] === row[1] && row[1] === row[2] && row[0] !== EMPTY) {
            return row[0];
        }
    }
    
    // Check columns
    for (let j = 0; j < 3; j++) {
        if (board[0][j] === board[1][j] && board[1][j] === board[2][j] && board[0][j] !== EMPTY) {
            return board[0][j];
        }
    }
    
    // Check diagonals
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== EMPTY) {
        return board[0][0];
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== EMPTY) {
        return board[0][2];
    }
    
    return null;
};

const terminal = (board) => {
    if (winner(board) !== null) return true;
    return board.flat().every(cell => cell !== EMPTY);
};

const utility = (board) => {
    const game_winner = winner(board);
    if (game_winner === X) return 1;
    if (game_winner === O) return -1;
    return 0;
};

const minimax = (board) => {
    if (terminal(board)) return null;
    const current_player = player(board);
    if (current_player === X) {
        const [value, action] = max_value(board);
        return action;
    } else {
        const [value, action] = min_value(board);
        return action;
    }
};

const max_value = (board) => {
    if (terminal(board)) return [utility(board), null];
    let v = -Infinity;
    let best_action = null;
    for (let action of actions(board)) {
        const new_board = result(board, action);
        const [min_val, _] = min_value(new_board);
        if (min_val > v) {
            v = min_val;
            best_action = action;
        }
    }
    return [v, best_action];
};

const min_value = (board) => {
    if (terminal(board)) return [utility(board), null];
    let v = Infinity;
    let best_action = null;
    for (let action of actions(board)) {
        const new_board = result(board, action);
        const [max_val, _] = max_value(new_board);
        if (max_val < v) {
            v = max_val;
            best_action = action;
        }
    }
    return [v, best_action];
};

const TicTacToe = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [board, setBoard] = useState(initial_state());
    const [isHardMode, setIsHardMode] = useState(true);
    const [gameStatus, setGameStatus] = useState('');
    const [stats, setStats] = useState({
        gamesPlayed: parseInt(localStorage.getItem('ttt_games') || '0'),
        aiWins: parseInt(localStorage.getItem('ttt_ai_wins') || '0'),
        youWins: parseInt(localStorage.getItem('ttt_you_wins') || '0'),
        draws: parseInt(localStorage.getItem('ttt_draws') || '0')
    });

    const translations = {
        en: {
            title: "Tic-Tac-Toe AI",
            subtitle: "Challenge tha AI's unbeatable Minimax algorithm",
            description: "This AI uses my original Minimax Python algorithm converted to JavaScript. The algorithm evaluates all 255,168 possible game positions, making it impossible to beat (unless you use easy mode) - it will always force a draw or win against any opponent.",
            newGame: "New Game",
            easyMode: "Easy Mode",
            hardMode: "Hard Mode",
            yourTurn: "Your turn!",
            aiThinking: "AI is thinking...",
            youWin: "You win!",
            aiWins: "AI wins!",
            draw: "It's a draw!",
            stats: {
                games: "Games Played",
                aiWins: "AI Wins",
                draws: "Draws"
            }
        },
        es: {
            title: "IA Tres en Raya",
            subtitle: "Desafía el algoritmo Minimax imbatible de la IA",
            description: "Esta IA usa mi implementación original del algoritmo Minimax en Python convertida a JavaScript. El algoritmo evalúa todas las 255,168 posiciones posibles del juego, haciéndolo imposible de vencer (a menos que uses el modo fácil) - siempre forzará un empate o victoria contra cualquier oponente.",
            newGame: "Nuevo Juego",
            easyMode: "Modo Fácil",
            hardMode: "Modo Difícil",
            yourTurn: "¡Tu turno!",
            aiThinking: "La IA está pensando...",
            youWin: "¡Ganaste!",
            aiWins: "¡La IA gana!",
            draw: "¡Es un empate!",
            stats: {
                games: "Juegos Jugados",
                aiWins: "Victorias IA",
                draws: "Empates"
            }
        },
        ca: {
            title: "IA Tres en Ratlla",
            subtitle: "Desafia l'algoritme Minimax imbatible de la IA",
            description: "Aquesta IA usa la meva implementació original de l'algoritme Minimax de Python convertida a JavaScript. L'algoritme avalua totes les 255,168 posicions possibles del joc, fent-lo impossible de vèncer (a menys que usis el mode fàcil) - sempre forçarà un empat o victòria contra qualsevol oponent.",
            newGame: "Nou Joc",
            easyMode: "Mode Fàcil",
            hardMode: "Mode Difícil",
            yourTurn: "El teu torn!",
            aiThinking: "La IA està pensant...",
            youWin: "Has guanyat!",
            aiWins: "L'IA guanya!",
            draw: "És un empat!",
            stats: {
                games: "Jocs Jugats",
                aiWins: "Victòries IA",
                draws: "Empats"
            }
        }
    };

    const currentLang = localStorage.getItem('language') || 'en';
    const currentT = translations[currentLang];

    useEffect(() => {
        updateGameStatus();
    }, [board]);

    const updateGameStatus = () => {
        const gameWinner = winner(board);
        if (gameWinner) {
            if (gameWinner === X) {
                setGameStatus(t('aiLab.games.tictactoe.youWin'));
                // Player wins - update stats
                const newStats = { ...stats, youWins: stats.youWins + 1 };
                setStats(newStats);
                localStorage.setItem('ttt_you_wins', newStats.youWins.toString());
            } else {
                setGameStatus(t('aiLab.games.tictactoe.aiWins'));
                // AI wins - update stats
                const newStats = { ...stats, aiWins: stats.aiWins + 1 };
                setStats(newStats);
                localStorage.setItem('ttt_ai_wins', newStats.aiWins.toString());
            }
        } else if (terminal(board)) {
            setGameStatus(t('aiLab.games.tictactoe.draw'));
            // Draw - update stats
            const newStats = { ...stats, draws: stats.draws + 1 };
            setStats(newStats);
            localStorage.setItem('ttt_draws', newStats.draws.toString());
        } else {
            const currentPlayer = player(board);
            setGameStatus(currentPlayer === X ? t('aiLab.games.tictactoe.yourTurn') : t('aiLab.games.tictactoe.aiThinking'));
        }
    };

    const makeMove = (row, col) => {
        if (board[row][col] !== EMPTY || terminal(board)) return;
        
        const newBoard = result(board, [row, col]);
        setBoard(newBoard);
        
        // AI move after player move
        setTimeout(() => {
            if (!terminal(newBoard)) {
                const aiMove = isHardMode ? minimax(newBoard) : getEasyModeMove(newBoard);
                if (aiMove) {
                    const finalBoard = result(newBoard, aiMove);
                    setBoard(finalBoard);
                }
            }
        }, 500);
    };

    const getRandomMove = (board) => {
        const possibleMoves = actions(board);
        if (possibleMoves.length === 0) return null;
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    };

    // Function to detect if player can make three in a row
    const canPlayerWin = (board, player) => {
        // Check rows
        for (let i = 0; i < 3; i++) {
            let count = 0;
            let emptyPos = null;
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === player) count++;
                else if (board[i][j] === EMPTY) emptyPos = [i, j];
            }
            if (count === 2 && emptyPos !== null) return emptyPos;
        }
        
        // Check columns
        for (let j = 0; j < 3; j++) {
            let count = 0;
            let emptyPos = null;
            for (let i = 0; i < 3; i++) {
                if (board[i][j] === player) count++;
                else if (board[i][j] === EMPTY) emptyPos = [i, j];
            }
            if (count === 2 && emptyPos !== null) return emptyPos;
        }
        
        // Check diagonal 1 (top-left to bottom-right)
        let count = 0;
        let emptyPos = null;
        for (let i = 0; i < 3; i++) {
            if (board[i][i] === player) count++;
            else if (board[i][i] === EMPTY) emptyPos = [i, i];
        }
        if (count === 2 && emptyPos !== null) return emptyPos;
        
        // Check diagonal 2 (top-right to bottom-left)
        count = 0;
        emptyPos = null;
        for (let i = 0; i < 3; i++) {
            if (board[i][2-i] === player) count++;
            else if (board[i][2-i] === EMPTY) emptyPos = [i, 2-i];
        }
        if (count === 2 && emptyPos !== null) return emptyPos;
        
        return null;
    };

    // Function for easy mode: 50% random, 50% intelligent
    const getEasyModeMove = (board) => {
        // 50% de probabilidad de hacer movimiento aleatorio
        if (Math.random() < 0.5) {
            return getRandomMove(board);
        }
        
        // 50% de probabilidad de hacer movimiento inteligente
        // Primero verificar si el jugador puede ganar y bloquearlo
        const blockingMove = canPlayerWin(board, X); // X es el jugador
        if (blockingMove) {
            return blockingMove;
        }
        
        // Si no hay nada que bloquear, hacer movimiento aleatorio
        return getRandomMove(board);
    };

    const newGame = () => {
        setBoard(initial_state());
        setGameStatus(t('aiLab.games.tictactoe.yourTurn'));
        
        // Update games played counter
        const newStats = { ...stats, gamesPlayed: stats.gamesPlayed + 1 };
        setStats(newStats);
        localStorage.setItem('ttt_games', newStats.gamesPlayed.toString());
    };

    const toggleMode = () => {
        setIsHardMode(!isHardMode);
        newGame();
    };

    const getCellColor = (cell) => {
        if (cell === X) return 'text-red-400';
        if (cell === O) return 'text-blue-400';
        return 'text-gray-300';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 pt-32 pb-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-200/20 dark:border-blue-400/20">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('aiLab.games.tictactoe.title')}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            {t('aiLab.games.tictactoe.subtitle')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
                            {t('aiLab.games.tictactoe.description')}
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto mb-8">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                            {t('aiLab.games.tictactoe.howToPlay')}
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => navigate('/ai')}
                            className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                        >
                            {t('aiLab.games.tictactoe.backToAI')}
                        </button>
                        <button
                            onClick={newGame}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            {t('aiLab.games.tictactoe.newGame')}
                        </button>
                        <button
                            onClick={toggleMode}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                                isHardMode
                                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                            }`}
                        >
                            {isHardMode ? t('aiLab.games.tictactoe.easyMode') : t('aiLab.games.tictactoe.hardMode')}
                        </button>
                    </div>

                    <div className="flex justify-center mb-6">
                        <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                            {gameStatus}
                        </div>
                    </div>

                    <div className="flex justify-center mb-8">
                        <div className="grid grid-cols-3 gap-1 sm:gap-2 bg-gray-800/50 p-2 sm:p-4 rounded-xl max-w-xs sm:max-w-none mx-auto">
                            {board.map((row, rowIndex) =>
                                row.map((cell, colIndex) => (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => makeMove(rowIndex, colIndex)}
                                        className={`w-16 h-16 sm:w-20 sm:h-20 bg-gray-700/80 hover:bg-gray-600/80 border-2 border-blue-400/30 rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-bold transition-all duration-200 hover:scale-105 ${getCellColor(cell)}`}
                                        disabled={cell !== EMPTY || terminal(board)}
                                    >
                                        {cell}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto">
                        <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-xl sm:text-2xl font-bold text-blue-400">{stats.gamesPlayed}</div>
                            <div className="text-xs sm:text-sm text-gray-300">{t('aiLab.games.tictactoe.stats.games')}</div>
                        </div>
                        <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-xl sm:text-2xl font-bold text-blue-400">{stats.aiWins}</div>
                            <div className="text-xs sm:text-sm text-gray-300">{t('aiLab.games.tictactoe.stats.aiWins')}</div>
                        </div>
                        <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.youWins}</div>
                            <div className="text-xs sm:text-sm text-gray-300">{t('aiLab.games.tictactoe.stats.youWins')}</div>
                        </div>
                        <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-xl sm:text-2xl font-bold text-blue-400">{stats.draws}</div>
                            <div className="text-xs sm:text-sm text-gray-300">{t('aiLab.games.tictactoe.stats.draws')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicTacToe;
