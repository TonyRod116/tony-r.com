// Import project images
import buildappMarketplaceImg from '../assets/image_original (3).jpg'
import reluxImg from '../assets/image_original (12).jpg'
import tradelabImg from '../assets/image_original.jpg'
import buildappProAppDashboardImg from './projects/buildapp-pro-mobile-2026-09-30.png'
import buildappProBudgetImg from './projects/buildapp-budget-mobile-2026-09-30.png'
import buildappProQuoteImg from './projects/buildapp-before-after-2026-09-30.png'
import buildappSiteHeroImg from './projects/buildapp-web-current-2026-09-30.png'

export const projectImages = {
  buildapp: buildappSiteHeroImg,
  'buildapp-pro': buildappProQuoteImg,
  'buildapp-marketplace': buildappMarketplaceImg,
  're-lux': reluxImg,
  tradelab: tradelabImg
}

export const projectShowcaseImages = {
  'buildapp-pro': [
    buildappProQuoteImg,
    buildappProAppDashboardImg,
    buildappProBudgetImg
  ],
  buildapp: [
    buildappSiteHeroImg
  ]
}

export const buildappMobileImages = [buildappProAppDashboardImg,buildappProBudgetImg]
export const buildappCaptureCaptions = {
  es: ['Antes y propuesta con IA · web actual de BuildApp','Presupuestos · demo pública de la web móvil','Detalle de presupuesto · demo pública de la web móvil'],
  en: ['Before and AI proposal · current BuildApp website','Budgets · public mobile web demo','Budget detail · public mobile web demo'],
  ca: ['Abans i proposta amb IA · web actual de BuildApp','Pressupostos · demo pública de la web mòbil','Detall de pressupost · demo pública de la web mòbil'],
}
