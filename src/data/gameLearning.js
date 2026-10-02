export const learningCopy = {
  es: { rule: 'La regla', code: 'Código real · JavaScript', more: 'Ver más código', excerpt: 'Fragmentos de la implementación. Las funciones auxiliares y el resto del juego se omiten para seguir la idea.', proposal: 'Propuesta para la pieza actual', last: 'Última decisión de la IA', waitingTetris: 'Activa IA para ver la propuesta o pide una jugada. Aquí aparecerán los valores de esa decisión.', waitingMines: 'Descubre casillas y pide una jugada segura a la IA. Aquí aparecerá la restricción que la justifica.', lines: 'Líneas', height: 'Altura máxima', holes: 'Huecos', roughness: 'Irregularidad', immediate: 'Valor de esta posición', future: 'Mejor continuación', total: 'Valor para decidir', candidates: 'Se anticipa la siguiente pieza entre las {count} mejores posiciones actuales. Este valor sirve para elegir una jugada; es distinto de tus puntos de partida.', safe: 'Casilla segura', safeNote: 'Después de combinar las pistas, estas casillas tienen cero minas. La IA elige una de ellas. La explicación solo usa lo que ya ha deducido.', cell: 'F{row}C{col}', path: 'En esta búsqueda', degrees: 'Enlaces del camino mínimo', discovered: 'Artistas descubiertos', pathNote: 'Se amplía primero el nivel más cercano. Las conexiones cuentan películas compartidas del catálogo; los artistas descubiertos incluyen los que quedaron en la cola.' },
  en: { rule: 'The rule', code: 'Actual code · JavaScript', more: 'Show more code', excerpt: 'Implementation excerpts. Helper functions and the rest of the game are omitted to keep the idea clear.', proposal: 'Suggestion for the current piece', last: 'Last AI decision', waitingTetris: 'Enable AI to inspect a suggestion or request a move. Its actual values will appear here.', waitingMines: 'Reveal cells and request a safe AI move. The constraint that justifies it will appear here.', lines: 'Lines', height: 'Maximum height', holes: 'Holes', roughness: 'Bumpiness', immediate: 'Current position value', future: 'Best continuation', total: 'Decision value', candidates: 'The next piece is anticipated among the {count} best current positions. This value chooses a move; it is separate from your game points.', safe: 'Safe cell', safeNote: 'After combining the clues, these cells contain zero mines. The AI chooses one of them. The explanation only uses what it has deduced.', cell: 'R{row}C{col}', path: 'In this search', degrees: 'Links in the shortest path', discovered: 'Artists discovered', pathNote: 'The nearest level is expanded first. Connections count shared films in the catalogue; discovered artists include those still in the queue.' },
  ca: { rule: 'La regla', code: 'Codi real · JavaScript', more: 'Veure més codi', excerpt: 'Fragments de la implementació. Les funcions auxiliars i la resta del joc s’ometen per seguir la idea.', proposal: 'Proposta per a la peça actual', last: 'Última decisió de la IA', waitingTetris: 'Activa IA per veure la proposta o demana una jugada. Aquí apareixeran els valors d’aquella decisió.', waitingMines: 'Descobreix caselles i demana una jugada segura a la IA. Aquí apareixerà la restricció que la justifica.', lines: 'Línies', height: 'Alçada màxima', holes: 'Buits', roughness: 'Irregularitat', immediate: 'Valor d’aquesta posició', future: 'Millor continuació', total: 'Valor per decidir', candidates: 'S’anticipa la peça següent entre les {count} millors posicions actuals. Aquest valor tria una jugada; és diferent dels punts de la partida.', safe: 'Casella segura', safeNote: 'Després de combinar les pistes, aquestes caselles tenen zero mines. La IA en tria una. L’explicació només utilitza el que ja ha deduït.', cell: 'F{row}C{col}', path: 'En aquesta cerca', degrees: 'Enllaços del camí mínim', discovered: 'Artistes descoberts', pathNote: 'Primer s’amplia el nivell més proper. Les connexions compten pel·lícules compartides del catàleg; els artistes descoberts inclouen els que queden a la cua.' },
}

// Excerpts from the actual implementations, not runnable standalone programs.
export const gameLearning = {
  tetris: {
    title: { es: 'Una jugada, varias consecuencias.', en: 'One move, several consequences.', ca: 'Una jugada, diverses conseqüències.' },
    explanation: { es: 'Una línea suma; un hueco resta. La IA compara posiciones alcanzables y después comprueba qué dejarían para la cola conocida y la caducidad del Cristal.', en: 'A line adds value; a hole subtracts it. The AI compares reachable positions, then checks what they leave for the known queue and Crystal expiry.', ca: 'Una línia suma; un buit resta. La IA compara posicions assolibles i després comprova què deixarien per a la cua coneguda i la caducitat del Cristall.' },
    formula: 'S = 8L − 4.5H − 9.5G − 1.8R',
    glossary: { es: 'L: líneas completadas · H: altura máxima · G: huecos bajo bloques · R: diferencias de altura entre columnas vecinas. Se mide el tablero al terminar efectos y líneas.', en: 'L: completed lines · H: maximum height · G: holes below blocks · R: height differences between neighboring columns. The board is measured after effects and line clears.', ca: 'L: línies completades · H: alçada màxima · G: buits sota blocs · R: diferències d’alçada entre columnes veïnes. Es mesura el tauler en acabar efectes i línies.' },
    function: 'evaluate', source: 'src/components/games/tetrisEngine.js',
    code: `const f = features(result.board)
return result.cleared * 8 - f.height * 4.5 - f.holes * 9.5 - f.bumpiness * 1.8`,
    moreCode: `const continuation = continuations(candidate.result.board, nextName, candidate.result.turn, second)
const future = continuation.value
const score = immediate + (nextName ? 0.6 * future : 0)`,
  },
  tictactoe: {
    title: { es: 'Tu rival también elige bien.', en: 'Your opponent chooses well too.', ca: 'El rival també tria bé.' },
    explanation: { es: 'Minimax alterna dos decisiones: X busca el valor más alto y O el más bajo. En modo difícil, la IA juega con O y supone que tú responderás con la mejor jugada disponible.', en: 'Minimax alternates two decisions: X seeks the highest value and O the lowest. In hard mode, the AI plays O and assumes you will choose your best available reply.', ca: 'Minimax alterna dues decisions: X busca el valor més alt i O el més baix. En mode difícil, la IA juga amb O i suposa que respondràs amb la millor jugada disponible.' },
    formula: { es: 'X → V(s) = max V(hijos)\nO → V(s) = min V(hijos)', en: 'X → V(s) = max V(children)\nO → V(s) = min V(children)', ca: 'X → V(s) = max V(fills)\nO → V(s) = min V(fills)' },
    glossary: { es: 'Máximo cuando juega X; mínimo cuando juega O. Al terminar: +1 si gana X, −1 si gana O y 0 si empatan. El valor describe el resultado con juego óptimo.', en: 'Maximum on X’s turn; minimum on O’s turn. Terminal values: +1 for an X win, −1 for an O win, and 0 for a draw. The value describes the outcome under optimal play.', ca: 'Màxim quan juga X; mínim quan juga O. Al final: +1 si guanya X, −1 si guanya O i 0 si empaten. El valor descriu el resultat amb joc òptim.' },
    function: 'min_value', source: 'src/components/games/TicTacToe.jsx',
    code: `const new_board = result(board, action);
const [max_val, _] = max_value(new_board);
if (max_val < v) {
    v = max_val;
    best_action = action;
}`,
    moreCode: `const game_winner = winner(board);
if (game_winner === X) return 1;
if (game_winner === O) return -1;
return 0;`,
  },
  minesweeper: {
    title: { es: 'Una pista se convierte en una certeza.', en: 'A clue becomes a certainty.', ca: 'Una pista es converteix en una certesa.' },
    explanation: { es: 'Cada número limita cuántas minas hay entre las casillas vecinas. Al combinar restricciones, la IA puede demostrar que una casilla es segura.', en: 'Each number limits how many mines neighboring cells contain. Combining constraints lets the AI prove that a cell is safe.', ca: 'Cada número limita quantes mines hi ha entre les caselles veïnes. Combinant restriccions, la IA pot demostrar que una casella és segura.' },
    formula: 'A + B = 1\nA + B + C = 1\n⇒ C = 0',
    glossary: { es: 'Ejemplo ilustrativo: cada letra vale 1 si contiene una mina y 0 si es segura. Restar la primera restricción de la segunda demuestra que C no tiene mina.', en: 'Illustrative example: each letter is 1 for a mine and 0 for a safe cell. Subtracting the first constraint from the second proves that C contains no mine.', ca: 'Exemple il·lustratiu: cada lletra val 1 si conté una mina i 0 si és segura. Restar la primera restricció de la segona demostra que C no té mina.' },
    function: 'Sentence.knownSafes', source: 'src/components/games/Minesweeper.jsx',
    code: `return this.count === 0 && this.cells.size > 0
  ? new Set(this.cells)
  : new Set();`,
    moreCode: `const newCells = [];
for (const k of S2.cells) if (!S1.cells.has(k)) newCells.push(k);
const newCount = S2.count - S1.count;`,
  },
  nim: {
    title: { es: 'Aprender jugando contra sí mismo.', en: 'Learning through self-play.', ca: 'Aprendre jugant contra si mateix.' },
    explanation: { es: 'Q-learning guarda una valoración para cada jugada en un estado concreto. El autojuego ajusta esa valoración con el resultado y con lo que estima para la continuación.', en: 'Q-learning stores a value for each move in a particular state. Self-play adjusts it using the outcome and its estimate of the continuation.', ca: 'Q-learning guarda una valoració per a cada jugada en un estat concret. L’autojoc l’ajusta amb el resultat i amb el que estima per a la continuació.' },
    formula: 'Q ← Q + α · (r + max Q(s′, ·) − Q)',
    glossary: { es: 'α = 0.5: cuánto incorpora cada actualización. r vale −1 al retirar la última pieza, +1 al ganar y 0 durante la partida. La continuación se valora sin descuento en esta demo. Entrenar no garantiza jugar perfecto.', en: 'α = 0.5: how much each update incorporates. r is −1 for taking the last piece, +1 for winning, and 0 during play. Future value is undiscounted in this demo. Training does not guarantee perfect play.', ca: 'α = 0.5: quant incorpora cada actualització. r val −1 en retirar l’última peça, +1 en guanyar i 0 durant la partida. La continuació es valora sense descompte en aquesta demo. Entrenar no garanteix jugar perfecte.' },
    function: 'NimAI.updateQValue', source: 'src/components/games/Nim.jsx',
    code: `const newValueEstimate = reward + futureRewards;
const updatedQ = oldQ + this.alpha * (newValueEstimate - oldQ);
this.q.set(key, updatedQ);`,
    moreCode: `if (Math.random() < this.epsilon) {
    return availableActions[Math.floor(Math.random() * availableActions.length)];
} else {
    return this.getBestAction(state, availableActions);
}`,
    note: { es: 'Este último fragmento permite explorar durante el entrenamiento. Al jugar contra ti se pide chooseAction(..., false), que usa la mejor valoración aprendida.', en: 'This last excerpt allows exploration during training. Against you, chooseAction(..., false) uses the highest learned value.', ca: 'Aquest últim fragment permet explorar durant l’entrenament. Contra tu, chooseAction(..., false) fa servir la millor valoració apresa.' },
  },
  sixdegrees: {
    title: { es: 'Primero cerca. Después, un paso más.', en: 'Nearest first. Then one step further.', ca: 'Primer a prop. Després, un pas més.' },
    explanation: { es: 'La búsqueda en amplitud usa una cola. Visita las conexiones de un nivel antes de pasar al siguiente; cada película compartida cuenta como un enlace.', en: 'Breadth-first search uses a queue. It visits one level before moving to the next; each shared film counts as a link.', ca: 'La cerca en amplada fa servir una cua. Visita les connexions d’un nivell abans de passar al següent; cada pel·lícula compartida compta com un enllaç.' },
    formula: { es: 'd(vecino) = d(actual) + 1', en: 'd(neighbor) = d(current) + 1', ca: 'd(veí) = d(actual) + 1' },
    glossary: { es: 'd es el número de enlaces desde el origen. Con enlaces de igual coste, encontrar primero el destino da un camino mínimo. Puede haber varios caminos igual de cortos.', en: 'd is the number of links from the source. With equal-cost links, reaching the target first gives a shortest path. Several paths can be equally short.', ca: 'd és el nombre d’enllaços des de l’origen. Amb enllaços d’igual cost, trobar primer el destí dona un camí mínim. Pot haver-hi diversos camins igual de curts.' },
    function: 'ActorCatalog.shortestPath', source: 'src/components/games/SixDegrees/catalog.js',
    code: `if (parents[next] !== -1) continue
parents[next] = person; via[next] = movie; queue[tail++] = next`,
    moreCode: `if (next === target) {
  const steps = []; let current = target
  while (current !== source) { steps.push({ from: this.person(parents[current]), to: this.person(current), movie: this.movie(via[current]) }); current = parents[current] }
  return { steps: steps.reverse(), visited: tail }
}`,
  },
}
