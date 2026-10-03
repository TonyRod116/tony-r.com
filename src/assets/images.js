// Import project images
import buildappMarketplaceImg from '../assets/image_original (3).jpg'
import reluxImg from '../assets/image_original (12).jpg'
import tradelabImg from '../assets/image_original.jpg'
import buildappProAppDashboardImg from './projects/buildapp-pro-mobile-2026-09-30.png'
import buildappProBudgetImg from './projects/buildapp-budget-mobile-2026-09-30.png'
import buildappProQuoteImg from './projects/buildapp-before-after-2026-09-30.png'
import buildappSiteHeroImg from './projects/buildapp-web-current-2026-09-30.png'
import buildappBeforeRoomImg from './projects/buildapp-before-room.png'
import buildappAfterRoomImg from './projects/buildapp-after-room.png'

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
export const buildappComparisonImages = { before: buildappBeforeRoomImg, after: buildappAfterRoomImg }
export const buildappCaptureCaptions = {
  es: ['Foto original y propuesta con IA · visualización de BuildApp','Presupuestos · BuildApp Pro · datos de ejemplo','Detalle de presupuesto · BuildApp Pro · datos de ejemplo'],
  en: ['Original photo and AI proposal · BuildApp visualization','Budgets · BuildApp Pro · sample data','Budget detail · BuildApp Pro · sample data'],
  ca: ['Foto original i proposta amb IA · visualització de BuildApp','Pressupostos · BuildApp Pro · dades d’exemple','Detall de pressupost · BuildApp Pro · dades d’exemple'],
}
