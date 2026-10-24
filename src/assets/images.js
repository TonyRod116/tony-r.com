// Import project images
import buildappMarketplaceImg from '../assets/image_original (3).jpg'
import reluxImg from '../assets/image_original (12).jpg'
import tradelabImg from '../assets/image_original.jpg'
import buildappClientSimulationImg from './projects/buildapp-client-simulation-store-2026-10-24.webp'
import buildappProBudgetImg from './projects/buildapp-pro-quote-store-2026-10-24.webp'
import buildappProVisualImg from './projects/buildapp-pro-visual-store-2026-10-24.webp'
import buildappProItemsImg from './projects/buildapp-pro-items-store-2026-10-24.webp'
import buildappProQuoteImg from './projects/buildapp-before-after-2026-09-30.png'
import buildappSiteHeroImg from './projects/buildapp-website-2026-10-24.png'
import buildappBeforeRoomImg from './projects/buildapp-before-room.png'
import buildappAfterRoomImg from './projects/buildapp-after-room.png'

export const projectImages = {
  buildapp: buildappSiteHeroImg,
  'buildapp-pro': buildappProBudgetImg,
  'buildapp-marketplace': buildappMarketplaceImg,
  're-lux': reluxImg,
  tradelab: tradelabImg
}

export const projectShowcaseImages = {
  'buildapp-pro': [
    buildappProQuoteImg,
    buildappClientSimulationImg,
    buildappProBudgetImg,
    buildappProVisualImg,
    buildappProItemsImg
  ],
  buildapp: [
    buildappSiteHeroImg
  ]
}

export const buildappMobileImages = [buildappClientSimulationImg,buildappProBudgetImg]
export const buildappComparisonImages = { before: buildappBeforeRoomImg, after: buildappAfterRoomImg }
export const buildappCaptureCaptions = {
  es: ['Foto original y propuesta con IA · visualización de BuildApp','Cliente · simulación con IA y coste orientativo · captura oficial de App Store','Pro · presupuesto y envío · captura oficial de App Store','Pro · propuesta visual de antes y después · captura oficial de App Store','Pro · partidas, cantidades e importes · captura oficial de App Store'],
  en: ['Original photo and AI proposal · BuildApp visualization','Client · AI simulation and indicative cost · official App Store screenshot','Pro · quote and sharing · official App Store screenshot','Pro · before-and-after proposal · official App Store screenshot','Pro · line items, quantities and prices · official App Store screenshot'],
  ca: ['Foto original i proposta amb IA · visualització de BuildApp','Client · simulació amb IA i cost orientatiu · captura oficial d’App Store','Pro · pressupost i enviament · captura oficial d’App Store','Pro · proposta visual d’abans i després · captura oficial d’App Store','Pro · partides, quantitats i imports · captura oficial d’App Store'],
}
