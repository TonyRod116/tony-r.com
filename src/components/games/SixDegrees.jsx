import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import AiExperimentLayout from '../ai/AiExperimentLayout';
import { labCopy } from '../../data/aiExperiments';
import { buildActorGraph } from '../../data/actorGraph';

// Six Degrees of Kevin Bacon Implementation
class Node {
    constructor(state, parent, action) {
        this.state = state;
        this.parent = parent;
        this.action = action;
    }
}

class QueueFrontier {
    constructor() {
        this.frontier = [];
    }

    add(node) {
        this.frontier.push(node);
    }

    remove() {
        if (this.empty()) {
            throw new Error("Empty frontier");
        }
        return this.frontier.shift();
    }

    empty() {
        return this.frontier.length === 0;
    }
}

const SixDegrees = () => {
    const { language } = useLanguage();
    const copy = labCopy[language];
    const searchTimer = useRef(null);
    useEffect(() => () => clearTimeout(searchTimer.current), []);
    const [people, setPeople] = useState({});
    const [movies, setMovies] = useState({});
    const [names, setNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [sourceName, setSourceName] = useState('');
    const [targetName, setTargetName] = useState('');
    const [path, setPath] = useState(null);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');

    const translations = {
        en: {
            title: "Six Degrees of Kevin Bacon",
            subtitle: "Find connections between actors using breadth-first search",
            description: "This AI uses my original breadth-first search implementation converted from Python to JavaScript. The algorithm finds the shortest path between any two actors through their shared movies.",
            firstPerson: "First person's name:",
            secondPerson: "Second person's name:",
            findPath: "Find Path",
            loading: "Loading data...",
            searching: "Searching connection...",
            noConnection: "No connection found between these people.",
            degrees: "degrees of separation.",
            found: "Found!",
            starring: "starred in",
            stats: {
                people: "People in Database",
                movies: "Movies in Database",
                connections: "Connections Found"
            }
        },
        es: {
            title: "Seis Grados de Kevin Bacon",
            subtitle: "Encuentra conexiones entre actores usando búsqueda en amplitud",
            description: "Esta IA usa mi implementación original de búsqueda en amplitud convertida de Python a JavaScript. El algoritmo encuentra el camino más corto entre dos actores a través de sus películas compartidas.",
            firstPerson: "Nombre de la primera persona:",
            secondPerson: "Nombre de la segunda persona:",
            findPath: "Encontrar Camino",
            loading: "Cargando datos...",
            searching: "Buscando conexión...",
            noConnection: "No se encontró conexión entre estas personas.",
            degrees: "grados de separación.",
            found: "¡Encontrado!",
            starring: "protagonizó",
            stats: {
                people: "Personas en Base de Datos",
                movies: "Películas en Base de Datos",
                connections: "Conexiones Encontradas"
            }
        },
        ca: {
            title: "Sis Graus de Kevin Bacon",
            subtitle: "Troba connexions entre actors usant cerca en amplada",
            description: "Aquesta IA usa la meva implementació original de cerca en amplada convertida de Python a JavaScript. L'algoritme troba el camí més curt entre dos actors a través de les seves pel·lícules compartides.",
            firstPerson: "Nom de la primera persona:",
            secondPerson: "Nom de la segona persona:",
            findPath: "Trobar Camí",
            loading: "Carregant dades...",
            searching: "Cercant connexió...",
            noConnection: "No s'ha trobat connexió entre aquestes persones.",
            degrees: "graus de separació.",
            found: "Trobat!",
            starring: "va protagonitzar",
            stats: {
                people: "Persones a Base de Dades",
                movies: "Pel·lícules a Base de Dades",
                connections: "Connexions Trobades"
            }
        }
    };

    const currentLang = language;
    const currentT = translations[currentLang];

    useEffect(() => {
        const data = buildActorGraph();
        setPeople(data.people);
        setMovies(data.movies);
        setNames(data.names);
        setLoading(false);
    }, []);

    const personIdForName = (name) => {
        const personIds = names[name.trim().toLowerCase()];
        if (!personIds || personIds.size === 0) {
            return null;
        }
        if (personIds.size === 1) {
            return [...personIds][0];
        }
        // For multiple people with same name, return the first one
        return [...personIds][0];
    };

    const neighborsForPerson = (personId) => {
        const movieIds = people[personId]?.movies;
        if (!movieIds) return [];
        
        const neighbors = [];
        for (let movieId of movieIds) {
            const stars = movies[movieId]?.stars;
            if (stars) {
                for (let starId of stars) {
                    if (starId !== personId) {
                        neighbors.push([movieId, starId]);
                    }
                }
            }
        }
        return neighbors;
    };

    const shortestPath = (source, target) => {
        if (source === target) return [];

        const frontier = new QueueFrontier();
        const startNode = new Node(source, null, null);
        frontier.add(startNode);

        const explored = new Set();
        const frontierStates = new Set([source]);

        while (!frontier.empty()) {
            const node = frontier.remove();
            explored.add(node.state);

            const neighbors = neighborsForPerson(node.state);
            for (let [movieId, personId] of neighbors) {
                if (explored.has(personId) || frontierStates.has(personId)) {
                    continue;
                }

                const childNode = new Node(personId, node, [movieId, personId]);
                
                if (personId === target) {
                    const path = [];
                    let currentNode = childNode;
                    while (currentNode.parent !== null) {
                        path.push(currentNode.action);
                        currentNode = currentNode.parent;
                    }
                    return path.reverse();
                }

                frontier.add(childNode);
                frontierStates.add(personId);
            }
        }

        return null;
    };

    const findPath = () => {
        if (!sourceName.trim() || !targetName.trim()) {
            setError(copy.searchEmpty);
            return;
        }

        setSearching(true);
        setError('');
        setPath(null);

        const source = personIdForName(sourceName);
        const target = personIdForName(targetName);

        if (!source) {
            setError(`${copy.notFound}: ${sourceName}`);
            setSearching(false);
            return;
        }

        if (!target) {
            setError(`${copy.notFound}: ${targetName}`);
            setSearching(false);
            return;
        }

        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            const result = shortestPath(source, target);
            setPath(result);
            if (result === null) setError(copy.noPath);
            setSearching(false);
        }, 1000);
    };

    const getStats = () => {
        return {
            people: Object.keys(people).length,
            movies: Object.keys(movies).length,
            connections: path ? path.length : 0
        };
    };

    const stats = getStats();

    if (loading) return <AiExperimentLayout id="sixdegrees"><p>{currentT.loading}</p></AiExperimentLayout>;

    return (
        <AiExperimentLayout id="sixdegrees">
            <div className="ai-legacy-content">


                    <p className="ai-help mb-6">{currentT.howToPlay}</p>

                    <p className="ai-help mb-6">{copy.graphNote}</p>
                    <datalist id="graph-names">{Object.values(people).map(person => <option key={person.name} value={person.name} />)}</datalist>
                    <div className="ai-toolbar"><span>{copy.examples}</span><button className="ai-button ai-button-secondary" onClick={() => { clearTimeout(searchTimer.current); setSearching(false); setPath(null); setSourceName('Kevin Bacon'); setTargetName('Tom Hanks'); }}>Kevin Bacon → Tom Hanks</button></div>
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label htmlFor="graph-source" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {currentT.firstPerson}
                                </label>
                                <input
                                    type="text"
                                    id="graph-source" list="graph-names"
                                    value={sourceName}
                                    onChange={(e) => { clearTimeout(searchTimer.current); setSearching(false); setPath(null); setSourceName(e.target.value); }}
                                    className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Kevin Bacon"
                                />
                            </div>
                            <div>
                                <label htmlFor="graph-target" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {currentT.secondPerson}
                                </label>
                                <input
                                    type="text"
                                    id="graph-target" list="graph-names"
                                    value={targetName}
                                    onChange={(e) => { clearTimeout(searchTimer.current); setSearching(false); setPath(null); setTargetName(e.target.value); }}
                                    className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Tom Hanks"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mb-4">
                        </div>

                        <button
                            onClick={findPath}
                            disabled={searching}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg disabled:transform-none"
                        >
                            {searching ? currentT.searching : currentT.findPath}
                        </button>

                        {error && (
                            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {path !== null && (
                            <div className="mt-6 p-6 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg">
                                <div className="text-lg font-bold text-green-800 dark:text-green-400 mb-4">
                                    {currentT.found} {path.length} {currentT.degrees}
                                </div>
                                <div className="space-y-2">
                                    {path.map(([movieId, personId], index) => {
                                        const person1 = index === 0 ? people[personIdForName(sourceName)] : people[path[index - 1][1]];
                                        const person2 = people[personId];
                                        const movie = movies[movieId];
                                        
                                        return (
                                            <div key={index} className="text-sm text-green-700 dark:text-green-300">
                                                {index + 1}: {person1?.name} → {person2?.name} {currentT.starring} <a className="ai-text-link" href={movie?.source} target="_blank" rel="noopener noreferrer">{movie?.title} ({movie?.year})</a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="ai-game-stats grid grid-cols-3 gap-6 max-w-md mx-auto">
                        <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-2xl font-bold text-blue-400">{stats.people}</div>
                            <div className="text-sm text-gray-300">{currentT.stats.people}</div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-2xl font-bold text-blue-400">{stats.movies}</div>
                            <div className="text-sm text-gray-300">{currentT.stats.movies}</div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-blue-400/20">
                            <div className="text-2xl font-bold text-blue-400">{stats.connections}</div>
                            <div className="text-sm text-gray-300">{currentT.stats.connections}</div>
                        </div>
                    </div>
            </div>
        </AiExperimentLayout>
    );
};

export default SixDegrees;
