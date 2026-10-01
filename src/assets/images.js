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
  es: ['Antes y propuesta con IA · web actual de BuildApp','Presupuestos · BuildApp Pro · datos de ejemplo','Detalle de presupuesto · BuildApp Pro · datos de ejemplo'],
  en: ['Before and AI proposal · current BuildApp website','Budgets · BuildApp Pro · sample data','Budget detail · BuildApp Pro · sample data'],
  ca: ['Abans i proposta amb IA · web actual de BuildApp','Pressupostos · BuildApp Pro · dades d’exemple','Detall de pressupost · BuildApp Pro · dades d’exemple'],
}
