export const SITE_ORIGIN = 'https://tony-r.com'
const BRAND = 'Tony Rodríguez'

// Títulos y descripciones por ruta e idioma. Los de demos y experimentos se verifican contra
// siteContent.js y aiExperiments.js en tests/tooling/page-meta.test.mjs para que no se desalineen.
const sections = {
  es: { ai: 'Lab de IA', notFound: 'Página no encontrada' },
  en: { ai: 'AI Lab', notFound: 'Page not found' },
  ca: { ai: 'Lab d’IA', notFound: 'Pàgina no trobada' },
}

const home = {
  es: { title: `${BRAND} | BuildApp, producto y software`, description: 'Mi trabajo en BuildApp, productos web y móviles, sistemas de trading en Python y experimentos con inteligencia artificial.' },
  en: { title: `${BRAND} | BuildApp, product and software`, description: 'My work at BuildApp, web and mobile products, Python trading systems and artificial intelligence experiments.' },
  ca: { title: `${BRAND} | BuildApp, producte i programari`, description: 'La meva feina a BuildApp, productes web i mòbils, sistemes de trading en Python i experiments amb intel·ligència artificial.' },
}

const pages = {
  '/about': {
    es: ['Mi recorrido', 'De la construcción al software: cómo pasé de dirigir reformas a fundar BuildApp y a trabajar en producto y desarrollo.'],
    en: ['My story', 'From construction to software: how I went from running renovation projects to founding BuildApp and working in product and development.'],
    ca: ['El meu recorregut', 'De la construcció al programari: com vaig passar de dirigir reformes a fundar BuildApp i a treballar en producte i desenvolupament.'],
  },
  '/projects': {
    es: ['Proyectos', 'BuildApp Pro y otros proyectos: qué problema resolvía cada uno, qué parte construí yo y qué puedes explorar.'],
    en: ['Projects', 'BuildApp Pro and other projects: the problem each one solved, which part I built and what you can explore.'],
    ca: ['Projectes', 'BuildApp Pro i altres projectes: quin problema resolia cadascun, quina part vaig construir jo i què pots explorar.'],
  },
  '/resume': {
    es: ['Currículum', 'Experiencia, formación y certificados, con el CV en español y en inglés para descargar.'],
    en: ['Resume', 'Experience, education and certificates, with the CV available to download in Spanish and English.'],
    ca: ['Currículum', 'Experiència, formació i certificats, amb el CV en castellà i en anglès per descarregar.'],
  },
  '/contact': {
    es: ['Contacto', 'Escríbeme si te interesa alguno de mis proyectos o mi forma de trabajar.'],
    en: ['Contact', 'Send me a message if one of my projects or the way I work interests you.'],
    ca: ['Contacte', 'Escriu-me si t’interessa algun dels meus projectes o la meva manera de treballar.'],
  },
  '/demos': {
    es: ['Soluciones con IA', 'Tres recorridos para probar cómo encaja la IA en tareas concretas: presupuestar, entender una consulta y presentar una propuesta visual.'],
    en: ['AI solutions', 'Three journeys to try how AI fits concrete tasks: budgeting, understanding an inquiry and presenting a visual proposal.'],
    ca: ['Solucions amb IA', 'Tres recorreguts per provar com encaixa la IA en tasques concretes: pressupostar, entendre una consulta i presentar una proposta visual.'],
  },
  '/ai': {
    es: [sections.es.ai, 'Seis experimentos para ver cómo aprende una máquina, qué decisiones toma y dónde se equivoca.'],
    en: [sections.en.ai, 'Six experiments to see how a machine learns, what it decides, and where it gets things wrong.'],
    ca: [sections.ca.ai, 'Sis experiments per veure com aprèn una màquina, què decideix i on s’equivoca.'],
  },
}

export const demoMeta = {
  'presupuesto-orientativo': {
    es: ['Presupuesto orientativo', 'Describe una reforma y explora una primera estimación con sus partidas y alcance.'],
    en: ['Budget estimate', 'Describe a renovation and explore an initial estimate with line items and scope.'],
    ca: ['Pressupost orientatiu', 'Descriu una reforma i explora una primera estimació amb partides i abast.'],
  },
  'lead-qualifier': {
    es: ['Una consulta, con contexto', 'Prueba una conversación que recoge lo importante antes de preparar el siguiente paso.'],
    en: ['An inquiry, with context', 'Try a conversation that captures what matters before preparing the next step.'],
    ca: ['Una consulta, amb context', 'Prova una conversa que recull allò important abans de preparar el pas següent.'],
  },
  'render-presupuesto': {
    es: ['Una propuesta que se ve', 'Parte de una foto y describe un cambio. Compara el original con la visualización generada.'],
    en: ['A proposal you can see', 'Start from a photo and describe a change. Compare the original with the generated visualization.'],
    ca: ['Una proposta que es veu', 'Parteix d’una foto i descriu un canvi. Compara l’original amb la visualització generada.'],
  },
}

export const experimentMeta = {
  'neural-network': {
    es: ['Red neuronal', 'De tu trazo a una predicción. Mira cómo se activa cada capa de la red.'],
    en: ['Neural network', 'From your sketch to a prediction. See each network layer activate.'],
    ca: ['Xarxa neuronal', 'Del teu traç a una predicció. Mira com s’activa cada capa de la xarxa.'],
  },
  tetris: {
    es: ['T-Tris', 'Coloca, anticipa y compara tu jugada con la IA. Con una T que cambia las reglas.'],
    en: ['T-Tris', 'Place, anticipate, and compare your move with the AI. With a T that changes the rules.'],
    ca: ['T-Tris', 'Col·loca, anticipa i compara la teva jugada amb la IA. Amb una T que canvia les regles.'],
  },
  tictactoe: {
    es: ['Tres en raya', 'Una partida pequeña, un árbol de decisiones completo. ¿Puedes forzar un empate?'],
    en: ['Tic-tac-toe', 'A small game, a full decision tree. Can you force a draw?'],
    ca: ['Tres en ratlla', 'Una partida petita, un arbre de decisions complet. Pots forçar un empat?'],
  },
  minesweeper: {
    es: ['Buscaminas', 'Una casilla, una pista. Sigue las deducciones de la IA paso a paso.'],
    en: ['Minesweeper', 'One cell, one clue. Follow the AI’s deductions step by step.'],
    ca: ['Cercamines', 'Una casella, una pista. Segueix les deduccions de la IA pas a pas.'],
  },
  nim: {
    es: ['Nim', 'Retira piezas de un montón. Entrena al rival y comprueba qué aprende.'],
    en: ['Nim', 'Remove pieces from a pile. Train the opponent and test what it learns.'],
    ca: ['Nim', 'Retira peces d’una pila. Entrena el rival i comprova què aprèn.'],
  },
  sixdegrees: {
    es: ['Seis grados', 'Dos nombres y el camino más corto entre ellos. Explora una búsqueda en grafos.'],
    en: ['Six degrees', 'Two names and the shortest path between them. Explore graph search.'],
    ca: ['Sis graus', 'Dos noms i el camí més curt entre ells. Explora una cerca en grafs.'],
  },
}

const withBrand = label => `${label} | ${BRAND}`
// Las tablas son objetos normales: sin hasOwn, rutas como /ai/constructor heredarían propiedades de Object.
const own = (table, key) => Object.hasOwn(table, key)

export function resolvePageMeta(pathname, language) {
  const lang = own(sections, language) ? language : 'es'
  // El router de la app no distingue mayúsculas (/Projects muestra Proyectos): los metadatos tampoco.
  const path = (String(pathname || '/').replace(/\/+$/, '') || '/').toLowerCase()
  const canonical = `${SITE_ORIGIN}${path}`
  if (path === '/') return { ...home[lang], canonical, robots: 'index, follow' }
  if (own(pages, path)) {
    const [label, description] = pages[path][lang]
    return { title: withBrand(label), description, canonical, robots: 'index, follow' }
  }
  const demoId = path.startsWith('/demos/') ? path.slice('/demos/'.length) : ''
  if (own(demoMeta, demoId)) return { title: withBrand(demoMeta[demoId][lang][0]), description: demoMeta[demoId][lang][1], canonical, robots: 'index, follow' }
  const experimentId = path.startsWith('/ai/') ? path.slice('/ai/'.length) : ''
  if (own(experimentMeta, experimentId)) return { title: withBrand(`${experimentMeta[experimentId][lang][0]} · ${sections[lang].ai}`), description: experimentMeta[experimentId][lang][1], canonical, robots: 'index, follow' }
  // Página inexistente: noindex y sin canonical (las dos señales juntas se contradicen).
  return { title: withBrand(sections[lang].notFound), description: home[lang].description, canonical: null, robots: 'noindex, follow' }
}
