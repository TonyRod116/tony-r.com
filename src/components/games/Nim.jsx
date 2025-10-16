import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

// Nim Game Logic
class NimGame {
    constructor(initial = [1, 3, 5, 7]) {
        this.piles = [...initial];
        this.player = 0; // 0 = human, 1 = AI
        this.winner = null;
    }

    static availableActions(piles) {
        const actions = new Set();
        for (let i = 0; i < piles.length; i++) {
            for (let j = 1; j <= piles[i]; j++) {
                actions.add(`${i},${j}`);
            }
        }
        return Array.from(actions).map(action => {
            const [pile, count] = action.split(',').map(Number);
            return [pile, count];
        });
    }

    static otherPlayer(player) {
        return player === 0 ? 1 : 0;
    }

    switchPlayer() {
        this.player = NimGame.otherPlayer(this.player);
    }

    move(action) {
        const [pile, count] = action;

        if (this.winner !== null) {
            throw new Error("Game already won");
        }
        if (pile < 0 || pile >= this.piles.length) {
            throw new Error("Invalid pile");
        }
        if (count < 1 || count > this.piles[pile]) {
            throw new Error("Invalid number of objects");
        }

        this.piles[pile] -= count;
        this.switchPlayer();

        if (this.piles.every(pile => pile === 0)) {
            this.winner = this.player;
        }
    }
}

// Nim AI with Q-Learning
class NimAI {
    constructor(alpha = 0.5, epsilon = 0.1) {
        this.q = new Map();
        this.alpha = alpha;
        this.epsilon = epsilon;
    }

    getQValue(state, action) {
        const key = `${state.join(',')}|${action.join(',')}`;
        return this.q.get(key) || 0;
    }

    updateQValue(state, action, oldQ, reward, futureRewards) {
        const key = `${state.join(',')}|${action.join(',')}`;
        const newValueEstimate = reward + futureRewards;
        const updatedQ = oldQ + this.alpha * (newValueEstimate - oldQ);
        this.q.set(key, updatedQ);
    }

    bestFutureReward(state) {
        const availableActions = NimGame.availableActions(state);
        if (availableActions.length === 0) return 0;

        let maxQValue = -Infinity;
        for (const action of availableActions) {
            const qValue = this.getQValue(state, action);
            maxQValue = Math.max(maxQValue, qValue);
        }
        return maxQValue;
    }

    chooseAction(state, epsilon = true) {
        const availableActions = NimGame.availableActions(state);
        if (availableActions.length === 0) return null;

        if (!epsilon) {
            return this.getBestAction(state, availableActions);
        }

        if (Math.random() < this.epsilon) {
            return availableActions[Math.floor(Math.random() * availableActions.length)];
        } else {
            return this.getBestAction(state, availableActions);
        }
    }

    getBestAction(state, availableActions) {
        let bestAction = null;
        let bestQValue = -Infinity;

        for (const action of availableActions) {
            const qValue = this.getQValue(state, action);
            if (qValue > bestQValue) {
                bestQValue = qValue;
                bestAction = action;
            }
        }
        return bestAction;
    }

    // Train the AI by playing against itself
    train(games = 1000) {
        for (let i = 0; i < games; i++) {
            const game = new NimGame();
            const last = {
                0: { state: null, action: null },
                1: { state: null, action: null }
            };

            while (true) {
                const state = [...game.piles];
                const action = this.chooseAction(game.piles);

                last[game.player].state = state;
                last[game.player].action = action;

                game.move(action);
                const newState = [...game.piles];

                if (game.winner !== null) {
                    this.update(state, action, newState, -1);
                    this.update(
                        last[game.player].state,
                        last[game.player].action,
                        newState,
                        1
                    );
                    break;
                } else if (last[game.player].state !== null) {
                    this.update(
                        last[game.player].state,
                        last[game.player].action,
                        newState,
                        0
                    );
                }
            }
        }
    }

    update(oldState, action, newState, reward) {
        const old = this.getQValue(oldState, action);
        const bestFuture = this.bestFutureReward(newState);
        this.updateQValue(oldState, action, old, reward, bestFuture);
    }
}

const Nim = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [game, setGame] = useState(new NimGame());
    const [aiType, setAiType] = useState('novice'); // 'novice' or 'expert'
    const [noviceAI, setNoviceAI] = useState(new NimAI());
    const [expertAI, setExpertAI] = useState(new NimAI());
    const [gameStatus, setGameStatus] = useState('');
    const [isTraining, setIsTraining] = useState(false);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [stats, setStats] = useState({
        gamesPlayed: parseInt(localStorage.getItem('nim_games') || '0'),
        aiWins: parseInt(localStorage.getItem('nim_ai_wins') || '0'),
        humanWins: parseInt(localStorage.getItem('nim_human_wins') || '0')
    });


    useEffect(() => {
        updateGameStatus();
    }, [game]);

    const updateGameStatus = () => {
        if (game.winner !== null) {
            if (game.winner === 0) {
                setGameStatus(t('aiLab.games.nim.youWin'));
                const newStats = { ...stats, humanWins: stats.humanWins + 1 };
                setStats(newStats);
                localStorage.setItem('nim_human_wins', newStats.humanWins.toString());
            } else {
                setGameStatus(t('aiLab.games.nim.aiWins'));
                const newStats = { ...stats, aiWins: stats.aiWins + 1 };
                setStats(newStats);
                localStorage.setItem('nim_ai_wins', newStats.aiWins.toString());
            }
        } else {
            setGameStatus(game.player === 0 ? t('aiLab.games.nim.yourTurn') : t('aiLab.games.nim.aiTurn'));
        }
    };

    const trainAI = async () => {
        setIsTraining(true);
        setTrainingProgress(0);
        
        // Train novice AI (100 games) - 0% to 20%
        const noviceAI = new NimAI();
        noviceAI.train(100);
        setNoviceAI(noviceAI);
        setTrainingProgress(20);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Train expert AI (10,000 games) - 20% to 100%
        const expertAI = new NimAI();
        const totalGames = 10000;
        const chunkSize = 1000; // Process in chunks of 1000 games
        
        for (let i = 0; i < totalGames; i += chunkSize) {
            expertAI.train(chunkSize);
            const progress = 20 + ((i + chunkSize) / totalGames) * 80; // 20% to 100%
            setTrainingProgress(Math.min(100, progress));
            
            // Small delay to show progress
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        setExpertAI(expertAI);
        setTrainingProgress(100);
        
        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setIsTraining(false);
        setTrainingProgress(0);
    };

    const makeMove = (pile, count) => {
        if (game.winner !== null || game.player !== 0) return;
        
        try {
            const newGame = new NimGame(game.piles);
            newGame.player = game.player;
            newGame.winner = game.winner;
            newGame.move([pile, count]);
            setGame(newGame);
            
            // AI move after human move
            if (newGame.winner === null) {
                setTimeout(() => {
                    const currentAI = aiType === 'novice' ? noviceAI : expertAI;
                    const aiMove = currentAI.chooseAction(newGame.piles, false);
                    if (aiMove) {
                        const finalGame = new NimGame(newGame.piles);
                        finalGame.player = newGame.player;
                        finalGame.winner = newGame.winner;
                        finalGame.move(aiMove);
                        setGame(finalGame);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Invalid move:', error.message);
        }
    };

    const newGame = () => {
        setGame(new NimGame());
        const newStats = { ...stats, gamesPlayed: stats.gamesPlayed + 1 };
        setStats(newStats);
        localStorage.setItem('nim_games', newStats.gamesPlayed.toString());
    };

    const getPileColor = (index) => {
        const colors = [
            'bg-red-500',
            'bg-blue-500', 
            'bg-green-500',
            'bg-yellow-500'
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 pt-32 pb-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-200/20 dark:border-blue-400/20">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('aiLab.games.nim.title')}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            {t('aiLab.games.nim.subtitle')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-4">
                            {t('aiLab.games.nim.description')}
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
                            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                                {t('aiLab.games.nim.howToPlay')}
                            </p>
                        </div>
                    </div>

                    {/* AI Selection */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
                            {t('aiLab.games.nim.selectAI')}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setAiType('novice')}
                                disabled={isTraining}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                    aiType === 'novice'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                } ${isTraining ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {t('aiLab.games.nim.noviceAI')}
                            </button>
                            <button
                                onClick={() => {
                                    setAiType('expert');
                                    trainAI();
                                }}
                                disabled={isTraining}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                    aiType === 'expert'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                } ${isTraining ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isTraining && aiType === 'expert' ? t('aiLab.games.nim.training') : t('aiLab.games.nim.expertAI')}
                            </button>
                        </div>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {aiType === 'novice' 
                                ? t('aiLab.games.nim.noviceDescription')
                                : t('aiLab.games.nim.expertDescription')
                            }
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <button
                            onClick={() => navigate('/ai')}
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                        >
                            {t('aiLab.games.nim.backToAI')}
                        </button>
                        <button
                            onClick={newGame}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            {t('aiLab.games.nim.newGame')}
                        </button>
                    </div>

                    {isTraining && (
                        <div className="mb-6">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${trainingProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
                                {t('aiLab.games.nim.training')} {Math.round(trainingProgress)}% Complete
                            </p>
                        </div>
                    )}

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                            {t('aiLab.games.nim.piles')}
                        </h2>
                        <div className="flex justify-center gap-4 mb-6">
                            {game.piles.map((count, index) => (
                                <div key={index} className="text-center">
                                    <div className={`w-16 h-16 ${getPileColor(index)} rounded-lg flex items-center justify-center text-white font-bold text-xl mb-2`}>
                                        {count}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Pile {index}
                                    </p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-lg font-medium text-gray-800 dark:text-white mb-6">
                            {gameStatus}
                        </div>

                        {game.winner === null && game.player === 0 && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {t('aiLab.games.nim.yourTurn')}
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {game.piles.map((count, pileIndex) => (
                                        count > 0 && (
                                            <div key={pileIndex} className="flex flex-col gap-1">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {currentT.selectPile} {pileIndex}
                                                </span>
                                                <div className="flex gap-1">
                                                    {Array.from({ length: count }, (_, i) => i + 1).map(num => (
                                                        <button
                                                            key={num}
                                                            onClick={() => makeMove(pileIndex, num)}
                                                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                                                        >
                                                            {num}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto">
                        <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-xl sm:text-2xl font-bold text-blue-400">{stats.gamesPlayed}</div>
                            <div className="text-xs sm:text-sm text-gray-300">{t('aiLab.games.nim.stats.games')}</div>
                        </div>
                        <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-xl sm:text-2xl font-bold text-red-400">{stats.aiWins}</div>
                            <div className="text-xs sm:text-sm text-gray-300">{t('aiLab.games.nim.stats.aiWins')}</div>
                        </div>
                        <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.humanWins}</div>
                            <div className="text-xs sm:text-sm text-gray-300">{t('aiLab.games.nim.stats.humanWins')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Nim;
