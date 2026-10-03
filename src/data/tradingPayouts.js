export const tradingPayouts = [
  { date: '2026-08-14', amount: 1617, image: '/payouts/lucid-2026-08-14.png', thumbnail: '/payouts/lucid-2026-08-14-thumb.webp' },
  { date: '2026-09-15', amount: 2100, image: '/payouts/lucid-2026-09-15.png', thumbnail: '/payouts/lucid-2026-09-15-thumb.webp' },
]

export const payoutCopy = {
  es: { title: 'Payouts de Lucid Trading', view: 'Ver justificante', certificate: 'Certificado de payout', privacy: 'Certificados aportados por Tony. Identificador oculto.', fullSize: 'Abrir a tamaño completo', close: 'Cerrar justificante' },
  en: { title: 'Lucid Trading payouts', view: 'View certificate', certificate: 'Payout certificate', privacy: 'Certificates provided by Tony. Identifier hidden.', fullSize: 'Open full-size image', close: 'Close certificate' },
  ca: { title: 'Payouts de Lucid Trading', view: 'Veure justificant', certificate: 'Certificat de payout', privacy: 'Certificats aportats per Tony. Identificador ocult.', fullSize: 'Obrir a mida completa', close: 'Tancar justificant' },
}

const locales = { es: 'es-ES', en: 'en-GB', ca: 'ca-ES' }
export function payoutAmount(amount, language) {
  return `${new Intl.NumberFormat(locales[language], { maximumFractionDigits: 0, useGrouping: 'always' }).format(amount)} USD`
}
export function payoutDate(date, language) {
  return new Intl.DateTimeFormat(locales[language], { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))
}
