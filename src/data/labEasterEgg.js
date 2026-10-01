import { experiments } from './aiExperiments.js'

const publicLabPaths = new Set(['/ai', ...experiments.map(experiment => `/ai/${experiment.id}`)])
export function destroyLabUrl(pathname) {
  const path = pathname.replace(/\/+$/, '')
  if (!publicLabPaths.has(path)) return null
  // Only a public canonical route is shared, never preview URLs, queries or state.
  return `https://destroy.spritefusion.com/?url=${encodeURIComponent(`https://tony-r.com${path}`)}`
}

export const easterCopy = {
  es: { trigger: 'No pulses aquí', title: 'Has encontrado el easter egg.', heading: '¿Y si rompes el laboratorio?', description: 'Destroy Any Website convierte esta página en un escenario destructible. Se abre en otra pestaña; ciérrala para volver al laboratorio.', credit: 'Un juego de', controls: 'En ordenador: A / D para moverte, Espacio para saltar, ratón para disparar y Esc para pausar.', launch: 'Destruir esta página', close: 'Volver al laboratorio' },
  en: { trigger: 'Don’t press this', title: 'You found the easter egg.', heading: 'What if you break the lab?', description: 'Destroy Any Website turns this page into a destructible level. It opens in another tab; close it to return to the lab.', credit: 'A game by', controls: 'On desktop: A / D to move, Space to jump, mouse to shoot and Esc to pause.', launch: 'Destroy this page', close: 'Return to the lab' },
  ca: { trigger: 'No premis aquí', title: 'Has trobat l’easter egg.', heading: 'I si trenques el laboratori?', description: 'Destroy Any Website converteix aquesta pàgina en un escenari destructible. S’obre en una altra pestanya; tanca-la per tornar al laboratori.', credit: 'Un joc de', controls: 'A l’ordinador: A / D per moure’t, Espai per saltar, ratolí per disparar i Esc per pausar.', launch: 'Destruir aquesta pàgina', close: 'Tornar al laboratori' },
}
