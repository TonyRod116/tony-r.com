import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import AiExperimentLayout from '../ai/AiExperimentLayout';
import { labCopy, playHints } from '../../data/aiExperiments';

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
    const { t, language } = useLanguage();
    const copy = labCopy[language];
    const aiTimer = useRef(null);
    const [thinking, setThinking] = useState(false);
    useEffect(() => () => clearTimeout(aiTimer.current), []);
    const [board, setBoard] = useState(initial_state());
    const [isHardMode, setIsHardMode] = useState(true);
    const gameWinner = winner(board);
    const gameStatus = gameWinner ? t(gameWinner === X ? 'aiLab.games.tictactoe.youWin' : 'aiLab.games.tictactoe.aiWins') : terminal(board) ? t('aiLab.games.tictactoe.draw') : t(player(board) === X ? 'aiLab.games.tictactoe.yourTurn' : 'aiLab.games.tictactoe.aiThinking');
    const [stats, setStats] = useState({
        gamesPlayed: parseInt(localStorage.getItem('ttt_games') || '0'),
        aiWins: parseInt(localStorage.getItem('ttt_ai_wins') || '0'),
        youWins: parseInt(localStorage.getItem('ttt_you_wins') || '0'),
        draws: parseInt(localStorage.getItem('ttt_draws') || '0')
    });

    useEffect(() => {
        updateGameStatus();
    }, [board]);

    const updateGameStatus = () => {
        const gameWinner = winner(board);
        if (gameWinner) {
            if (gameWinner === X) {

                // Player wins - update stats
                const newStats = { ...stats, youWins: stats.youWins + 1 };
                setStats(newStats);
                localStorage.setItem('ttt_you_wins', newStats.youWins.toString());
            } else {

                // AI wins - update stats
                const newStats = { ...stats, aiWins: stats.aiWins + 1 };
                setStats(newStats);
                localStorage.setItem('ttt_ai_wins', newStats.aiWins.toString());
            }
        } else if (terminal(board)) {

            // Draw - update stats
            const newStats = { ...stats, draws: stats.draws + 1 };
            setStats(newStats);
            localStorage.setItem('ttt_draws', newStats.draws.toString());
        }
    };

    const makeMove = (row, col) => {
        if (aiTimer.current !== null || player(board) !== X || board[row][col] !== EMPTY || terminal(board)) return;
        
        const newBoard = result(board, [row, col]);
        setBoard(newBoard);
        
        // AI move after player move
        setThinking(true);
        aiTimer.current = setTimeout(() => {
            aiTimer.current = null;
            setThinking(false);
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
        clearTimeout(aiTimer.current);
        aiTimer.current = null;
        setThinking(false);
        setBoard(initial_state());

        
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
        <AiExperimentLayout id="tictactoe">
            <div className="ai-legacy-content">
                    <div className="ai-ttt-facts">
                        <p className="ai-kicker">MINIMAX · {t(isHardMode ? 'aiLab.games.tictactoe.hardMode' : 'aiLab.games.tictactoe.easyMode')}</p>
                        <h2><strong>{new Intl.NumberFormat({ es: 'es-ES', en: 'en-GB', ca: 'ca-ES' }[language]).format(255168)}</strong><span>{t('aiLab.games.tictactoe.possibilities')}</span></h2>
                        <p className="ai-ttt-challenge">{t(isHardMode ? 'aiLab.games.tictactoe.challenge' : 'aiLab.games.tictactoe.easyChallenge')}</p>
                        <p className="ai-help">{t('aiLab.games.tictactoe.description')}</p>
                    </div>
                    <p className="ai-help mb-6">{playHints[language].tictactoe}</p>

                    <div className="flex justify-center gap-4 mb-8">
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
                        <div aria-live="polite" className="ai-game-status text-xl font-semibold">
                            {gameStatus}
                        </div>
                    </div>

                    <div className="flex justify-center mb-8">
                        <div className="ai-ttt-board grid grid-cols-3 gap-1 sm:gap-2 bg-gray-800/50 p-2 sm:p-4 rounded-xl max-w-xs sm:max-w-none mx-auto">
                            {board.map((row, rowIndex) =>
                                row.map((cell, colIndex) => (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => makeMove(rowIndex, colIndex)}
                                        aria-label={`${copy.cell} ${rowIndex + 1}, ${colIndex + 1}: ${cell || "—"}`}
                                        className={`ai-cell w-16 h-16 sm:w-20 sm:h-20 bg-gray-700/80 hover:bg-gray-600/80 border-2 border-blue-400/30 rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-bold transition-all duration-200 hover:scale-105 ${getCellColor(cell)}`}
                                        disabled={thinking || cell !== EMPTY || terminal(board)}
                                    >
                                        {cell}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="ai-game-stats grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto">
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
        </AiExperimentLayout>
    );
};

export default TicTacToe;
