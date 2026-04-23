// Import project images
import buildappMarketplaceImg from '../assets/image_original (3).jpg'
import reluxImg from '../assets/image_original (12).jpg'
import tradelabImg from '../assets/image_original.jpg'
import buildappProAppDashboardImg from './projects/buildapp-pro-app-dashboard-2026-04-23.png'
import buildappProLoginImg from './projects/buildapp-pro-login-2026-04-23-132914.png'
import buildappProQuoteImg from './projects/buildapp-pro-quote-visual.png'
import buildappSiteHeroImg from './projects/buildapp-site-hero-en-2026-04-22.png'

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
    buildappProLoginImg
  ],
  buildapp: [
    buildappSiteHeroImg
  ]
}
