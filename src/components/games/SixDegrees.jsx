import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

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
    const { t } = useLanguage();
    const navigate = useNavigate();
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

    const currentLang = localStorage.getItem('language') || 'en';
    const currentT = translations[currentLang];

    // Sample data for demonstration
    const sampleData = {
        people: {
            "nm0000102": { name: "Kevin Bacon", birth: "1958", movies: new Set(["nm0000001", "nm0000002"]) },
            "nm0000001": { name: "Tom Hanks", birth: "1956", movies: new Set(["nm0000001", "nm0000003"]) },
            "nm0000002": { name: "Meryl Streep", birth: "1949", movies: new Set(["nm0000001", "nm0000004"]) },
            "nm0000003": { name: "Denzel Washington", birth: "1954", movies: new Set(["nm0000002", "nm0000005"]) },
            "nm0000004": { name: "Julia Roberts", birth: "1967", movies: new Set(["nm0000002", "nm0000006"]) },
            "nm0000005": { name: "Will Smith", birth: "1968", movies: new Set(["nm0000003", "nm0000007"]) },
            "nm0000006": { name: "Brad Pitt", birth: "1963", movies: new Set(["nm0000004", "nm0000008"]) },
            "nm0000007": { name: "Leonardo DiCaprio", birth: "1974", movies: new Set(["nm0000005", "nm0000009"]) },
            "nm0000008": { name: "Jennifer Lawrence", birth: "1990", movies: new Set(["nm0000006", "nm0000010"]) },
            "nm0000009": { name: "Ryan Gosling", birth: "1980", movies: new Set(["nm0000007", "nm0000011"]) },
            "nm0000010": { name: "Emma Stone", birth: "1988", movies: new Set(["nm0000008", "nm0000012"]) },
            "nm0000011": { name: "Chris Evans", birth: "1981", movies: new Set(["nm0000009", "nm0000013"]) },
            "nm0000012": { name: "Scarlett Johansson", birth: "1984", movies: new Set(["nm0000010", "nm0000014"]) },
            "nm0000013": { name: "Robert Downey Jr.", birth: "1965", movies: new Set(["nm0000011", "nm0000015"]) },
            "nm0000014": { name: "Chris Hemsworth", birth: "1983", movies: new Set(["nm0000012", "nm0000016"]) },
            "nm0000015": { name: "Mark Ruffalo", birth: "1967", movies: new Set(["nm0000013", "nm0000017"]) },
            "nm0000016": { name: "Jeremy Renner", birth: "1971", movies: new Set(["nm0000014", "nm0000018"]) },
            "nm0000017": { name: "Samuel L. Jackson", birth: "1948", movies: new Set(["nm0000015", "nm0000019"]) },
            "nm0000018": { name: "Paul Rudd", birth: "1969", movies: new Set(["nm0000016", "nm0000020"]) },
            "nm0000019": { name: "Benedict Cumberbatch", birth: "1976", movies: new Set(["nm0000017", "nm0000021"]) },
            "nm0000020": { name: "Tom Holland", birth: "1996", movies: new Set(["nm0000018", "nm0000022"]) },
            "nm0000021": { name: "Zendaya", birth: "1996", movies: new Set(["nm0000019", "nm0000023"]) },
            "nm0000022": { name: "Timothée Chalamet", birth: "1995", movies: new Set(["nm0000020", "nm0000024"]) },
            "nm0000023": { name: "Anya Taylor-Joy", birth: "1996", movies: new Set(["nm0000021", "nm0000025"]) },
            "nm0000024": { name: "Florence Pugh", birth: "1996", movies: new Set(["nm0000022", "nm0000026"]) },
            "nm0000025": { name: "Austin Butler", birth: "1991", movies: new Set(["nm0000023", "nm0000027"]) },
            "nm0000026": { name: "Jacob Elordi", birth: "1997", movies: new Set(["nm0000024", "nm0000028"]) },
            "nm0000027": { name: "Barry Keoghan", birth: "1992", movies: new Set(["nm0000025", "nm0000029"]) },
            "nm0000028": { name: "Paul Mescal", birth: "1996", movies: new Set(["nm0000026", "nm0000030"]) },
            "nm0000029": { name: "Josh O'Connor", birth: "1990", movies: new Set(["nm0000027", "nm0000031"]) },
            "nm0000030": { name: "Callum Turner", birth: "1990", movies: new Set(["nm0000028", "nm0000032"]) },
            "nm0000031": { name: "Harris Dickinson", birth: "1996", movies: new Set(["nm0000029", "nm0000033"]) },
            "nm0000032": { name: "Archie Madekwe", birth: "1995", movies: new Set(["nm0000030", "nm0000034"]) },
            "nm0000033": { name: "Kit Connor", birth: "2004", movies: new Set(["nm0000031", "nm0000035"]) },
            "nm0000034": { name: "Joe Locke", birth: "2003", movies: new Set(["nm0000032", "nm0000036"]) },
            "nm0000035": { name: "William Gao", birth: "2004", movies: new Set(["nm0000033", "nm0000037"]) },
            "nm0000036": { name: "Yasmin Finney", birth: "2003", movies: new Set(["nm0000034", "nm0000038"]) },
            "nm0000037": { name: "Cormac Hyde-Corrin", birth: "2004", movies: new Set(["nm0000035", "nm0000039"]) },
            "nm0000038": { name: "Rhea Norwood", birth: "2003", movies: new Set(["nm0000036", "nm0000040"]) },
            "nm0000039": { name: "Jenny Walser", birth: "2003", movies: new Set(["nm0000037", "nm0000041"]) },
            "nm0000040": { name: "Sebastian Croft", birth: "2001", movies: new Set(["nm0000038", "nm0000042"]) },
            "nm0000041": { name: "Tobie Donovan", birth: "2001", movies: new Set(["nm0000039", "nm0000043"]) },
            "nm0000042": { name: "Cormac Hyde-Corrin", birth: "2004", movies: new Set(["nm0000040", "nm0000044"]) },
            "nm0000043": { name: "Kizzy Edgell", birth: "2001", movies: new Set(["nm0000041", "nm0000045"]) },
            "nm0000044": { name: "Cormac Hyde-Corrin", birth: "2004", movies: new Set(["nm0000042", "nm0000046"]) },
            "nm0000045": { name: "Cormac Hyde-Corrin", birth: "2004", movies: new Set(["nm0000043", "nm0000047"]) },
            "nm0000046": { name: "Cormac Hyde-Corrin", birth: "2004", movies: new Set(["nm0000044", "nm0000048"]) },
            "nm0000047": { name: "Cormac Hyde-Corrin", birth: "2004", movies: new Set(["nm0000045", "nm0000049"]) },
            "nm0000048": { name: "Cormac Hyde-Corrin", birth: "2004", movies: new Set(["nm0000046", "nm0000050"]) },
            "nm0000049": { name: "Cormac Hyde-Corrin", birth: "2004", movies: new Set(["nm0000047", "nm0000051"]) },
            "nm0000050": { name: "Cormac Hyde-Corrin", birth: "2004", movies: new Set(["nm0000048", "nm0000052"]) }
        },
        movies: {
            "nm0000001": { title: "Apollo 13", year: "1995", stars: new Set(["nm0000102", "nm0000001"]) },
            "nm0000002": { title: "The River Wild", year: "1994", stars: new Set(["nm0000102", "nm0000002"]) },
            "nm0000003": { title: "Philadelphia", year: "1993", stars: new Set(["nm0000001", "nm0000003"]) },
            "nm0000004": { title: "The Devil Wears Prada", year: "2006", stars: new Set(["nm0000002", "nm0000004"]) },
            "nm0000005": { title: "Training Day", year: "2001", stars: new Set(["nm0000003", "nm0000005"]) },
            "nm0000006": { title: "Ocean's Eleven", year: "2001", stars: new Set(["nm0000004", "nm0000006"]) },
            "nm0000007": { title: "Men in Black", year: "1997", stars: new Set(["nm0000005", "nm0000007"]) },
            "nm0000008": { title: "Fight Club", year: "1999", stars: new Set(["nm0000006", "nm0000008"]) },
            "nm0000009": { title: "Titanic", year: "1997", stars: new Set(["nm0000007", "nm0000009"]) },
            "nm0000010": { title: "The Hunger Games", year: "2012", stars: new Set(["nm0000008", "nm0000010"]) },
            "nm0000011": { title: "La La Land", year: "2016", stars: new Set(["nm0000009", "nm0000011"]) },
            "nm0000012": { title: "Captain America", year: "2011", stars: new Set(["nm0000010", "nm0000012"]) },
            "nm0000013": { title: "The Avengers", year: "2012", stars: new Set(["nm0000011", "nm0000013"]) },
            "nm0000014": { title: "Thor", year: "2011", stars: new Set(["nm0000012", "nm0000014"]) },
            "nm0000015": { title: "Iron Man", year: "2008", stars: new Set(["nm0000013", "nm0000015"]) },
            "nm0000016": { title: "The Avengers", year: "2012", stars: new Set(["nm0000014", "nm0000016"]) },
            "nm0000017": { title: "The Avengers", year: "2012", stars: new Set(["nm0000015", "nm0000017"]) },
            "nm0000018": { title: "The Avengers", year: "2012", stars: new Set(["nm0000016", "nm0000018"]) },
            "nm0000019": { title: "Pulp Fiction", year: "1994", stars: new Set(["nm0000017", "nm0000019"]) },
            "nm0000020": { title: "Ant-Man", year: "2015", stars: new Set(["nm0000018", "nm0000020"]) },
            "nm0000021": { title: "Doctor Strange", year: "2016", stars: new Set(["nm0000019", "nm0000021"]) },
            "nm0000022": { title: "Spider-Man", year: "2017", stars: new Set(["nm0000020", "nm0000022"]) },
            "nm0000023": { title: "Spider-Man", year: "2017", stars: new Set(["nm0000021", "nm0000023"]) },
            "nm0000024": { title: "Dune", year: "2021", stars: new Set(["nm0000022", "nm0000024"]) },
            "nm0000025": { title: "The Queen's Gambit", year: "2020", stars: new Set(["nm0000023", "nm0000025"]) },
            "nm0000026": { title: "Black Widow", year: "2021", stars: new Set(["nm0000024", "nm0000026"]) },
            "nm0000027": { title: "Elvis", year: "2022", stars: new Set(["nm0000025", "nm0000027"]) },
            "nm0000028": { title: "Euphoria", year: "2019", stars: new Set(["nm0000026", "nm0000028"]) },
            "nm0000029": { title: "The Banshees of Inisherin", year: "2022", stars: new Set(["nm0000027", "nm0000029"]) },
            "nm0000030": { title: "Normal People", year: "2020", stars: new Set(["nm0000028", "nm0000030"]) },
            "nm0000031": { title: "The Crown", year: "2016", stars: new Set(["nm0000029", "nm0000031"]) },
            "nm0000032": { title: "Fantastic Beasts", year: "2018", stars: new Set(["nm0000030", "nm0000032"]) },
            "nm0000033": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000031", "nm0000033"]) },
            "nm0000034": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000032", "nm0000034"]) },
            "nm0000035": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000033", "nm0000035"]) },
            "nm0000036": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000034", "nm0000036"]) },
            "nm0000037": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000035", "nm0000037"]) },
            "nm0000038": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000036", "nm0000038"]) },
            "nm0000039": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000037", "nm0000039"]) },
            "nm0000040": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000038", "nm0000040"]) },
            "nm0000041": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000039", "nm0000041"]) },
            "nm0000042": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000040", "nm0000042"]) },
            "nm0000043": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000041", "nm0000043"]) },
            "nm0000044": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000042", "nm0000044"]) },
            "nm0000045": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000043", "nm0000045"]) },
            "nm0000046": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000044", "nm0000046"]) },
            "nm0000047": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000045", "nm0000047"]) },
            "nm0000048": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000046", "nm0000048"]) },
            "nm0000049": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000047", "nm0000049"]) },
            "nm0000050": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000048", "nm0000050"]) },
            "nm0000051": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000049", "nm0000051"]) },
            "nm0000052": { title: "Heartstopper", year: "2022", stars: new Set(["nm0000050", "nm0000052"]) }
        },
        names: {
            "kevin bacon": new Set(["nm0000102"]),
            "tom hanks": new Set(["nm0000001"]),
            "meryl streep": new Set(["nm0000002"]),
            "denzel washington": new Set(["nm0000003"]),
            "julia roberts": new Set(["nm0000004"]),
            "will smith": new Set(["nm0000005"]),
            "brad pitt": new Set(["nm0000006"]),
            "leonardo dicaprio": new Set(["nm0000007"]),
            "jennifer lawrence": new Set(["nm0000008"]),
            "ryan gosling": new Set(["nm0000009"]),
            "emma stone": new Set(["nm0000010"]),
            "chris evans": new Set(["nm0000011"]),
            "scarlett johansson": new Set(["nm0000012"]),
            "robert downey jr.": new Set(["nm0000013"]),
            "chris hemsworth": new Set(["nm0000014"]),
            "mark ruffalo": new Set(["nm0000015"]),
            "jeremy renner": new Set(["nm0000016"]),
            "samuel l. jackson": new Set(["nm0000017"]),
            "paul rudd": new Set(["nm0000018"]),
            "benedict cumberbatch": new Set(["nm0000019"]),
            "tom holland": new Set(["nm0000020"]),
            "zendaya": new Set(["nm0000021"]),
            "timothée chalamet": new Set(["nm0000022"]),
            "anya taylor-joy": new Set(["nm0000023"]),
            "florence pugh": new Set(["nm0000024"]),
            "austin butler": new Set(["nm0000025"]),
            "jacob elordi": new Set(["nm0000026"]),
            "barry keoghan": new Set(["nm0000027"]),
            "paul mescal": new Set(["nm0000028"]),
            "josh o'connor": new Set(["nm0000029"]),
            "callum turner": new Set(["nm0000030"]),
            "harris dickinson": new Set(["nm0000031"]),
            "archie madekwe": new Set(["nm0000032"]),
            "kit connor": new Set(["nm0000033"]),
            "joe locke": new Set(["nm0000034"]),
            "william gao": new Set(["nm0000035"]),
            "yasmin finney": new Set(["nm0000036"]),
            "cormac hyde-corrin": new Set(["nm0000037", "nm0000039", "nm0000041", "nm0000043", "nm0000045", "nm0000047", "nm0000049", "nm0000048", "nm0000050", "nm0000052"]),
        }
    };

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            setPeople(sampleData.people);
            setMovies(sampleData.movies);
            setNames(sampleData.names);
            setLoading(false);
        }, 1000);
    }, []);

    const personIdForName = (name) => {
        const personIds = names[name.toLowerCase()];
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
            setError('Please enter both names');
            return;
        }

        setSearching(true);
        setError('');
        setPath(null);

        const source = personIdForName(sourceName);
        const target = personIdForName(targetName);

        if (!source) {
            setError(`Person "${sourceName}" not found in database`);
            setSearching(false);
            return;
        }

        if (!target) {
            setError(`Person "${targetName}" not found in database`);
            setSearching(false);
            return;
        }

        setTimeout(() => {
            const result = shortestPath(source, target);
            setPath(result);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 pt-32 pb-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-200/20 dark:border-blue-400/20 text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {currentT.loading}
                        </div>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

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

                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {currentT.firstPerson}
                                </label>
                                <input
                                    type="text"
                                    value={sourceName}
                                    onChange={(e) => setSourceName(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Kevin Bacon"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {currentT.secondPerson}
                                </label>
                                <input
                                    type="text"
                                    value={targetName}
                                    onChange={(e) => setTargetName(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Tom Hanks"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => navigate('/ai')}
                                className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                            >
                                {currentT.backToAI}
                            </button>
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
                                                {index + 1}: {person1?.name} and {person2?.name} {currentT.starring} "{movie?.title}" ({movie?.year})
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
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
            </div>
        </div>
    );
};

export default SixDegrees;
