const LOCALES = { es: 'es-ES', en: 'en-GB', ca: 'ca-ES' }
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const monthLabel = (token, language) => {
  const index = MONTHS.indexOf(token)
  if (index < 0) return token
  return new Intl.DateTimeFormat(LOCALES[language] || LOCALES.es, { month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2000, index, 1))).replace(/\.$/, '')
}

// Normaliza los periodos de profile.js ("2019-2025", "Jun 2025 – Sep 2025", "2026 – Present")
// a un formato único y localizado: "2019 – 2025", "jun – sep 2025", "2026 – Ahora".
export function formatPeriod(period, language, nowLabel) {
  const years = period.match(/^(\d{4})\s*[–-]\s*(\d{4}|Present)$/)
  if (years) return `${years[1]} – ${years[2] === 'Present' ? nowLabel : years[2]}`
  const months = period.match(/^([A-Z][a-z]{2}) (\d{4})\s*[–-]\s*(?:([A-Z][a-z]{2}) (\d{4})|Present)$/)
  if (months) {
    const [, startMonth, startYear, endMonth, endYear] = months
    if (!endMonth) return `${monthLabel(startMonth, language)} ${startYear} – ${nowLabel}`
    if (startYear === endYear) return `${monthLabel(startMonth, language)} – ${monthLabel(endMonth, language)} ${endYear}`
    return `${monthLabel(startMonth, language)} ${startYear} – ${monthLabel(endMonth, language)} ${endYear}`
  }
  return period
}
