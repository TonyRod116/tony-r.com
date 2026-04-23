import { projectImages } from '../assets/images.js'

export const projects = [
  {
    id: 'buildapp-pro',
    title: 'BuildApp Pro',
    description: 'AI-assisted renovation product already shipped on web, iPhone, and Android for faster quotes, client follow-up, and visual proposals.',
    longDescription: 'I founded BuildApp, defined the product vision, brought in a CTO to co-lead the harder backend architecture, and still built most of the shipped experience myself: web frontend, Android and iPhone apps, a substantial part of the backend flows, CI/CD, observability, and AWS S3 storage/media workflows. BuildApp Pro helps renovation professionals capture site visits, prepare clearer budgets, generate visual before/after proposals, manage CRM context, and send everything fast enough to improve the sales moment.',
    image: projectImages['buildapp-pro'],
    stack: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Capacitor', 'AWS S3', 'Sentry', 'Playwright'],
    category: 'fullstack',
    featured: true,
    liveUrl: 'https://buildapp.es/pro',
    appStoreUrl: 'https://apps.apple.com/es/app/buildapp/id6761193227',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=es.buildapp.app&hl=es_419',
    samplePdfUrl: 'https://buildapp-v1-1.onrender.com/public/quote-share?slug=q-wlgYmKB21CE&token=cTqNCIRXO2RCbnx_LlfjjjCmRwE5sXn_agpXionvTO8&clientName=Marta+Gimeno',
    date: '2026-03-26',
    metrics: {
      performance: 92,
      accessibility: 88,
      bestPractices: 96,
      seo: 91
    },
    challenges: [
      'Keeping one credible workflow across browser and native mobile contexts',
      'Making AI output useful for real quoting and presentation, not just demo-worthy',
      'Collaborating with the CTO through a PR-based multi-endpoint backend workflow without losing delivery speed'
    ],
    highlights: [
      'Built and shipped the user-facing product across web, Android, and iPhone',
      'Turned photos, notes, AI budgets, visual proposals, CRM, and PDF delivery into one professional workflow',
      'Owned CI/CD, observability, and AWS S3 media/storage flows for real production use'
    ]
  },
  {
    id: 'buildapp',
    title: 'BuildApp',
    description: 'Public website and launch layer for BuildApp, clarifying the category thesis and routing professionals, followers, and investors into the right next step.',
    longDescription: 'I designed and built buildapp.es as the public face of the company: a landing page that explains the bigger BuildApp vision without sounding abstract, while making BuildApp Pro feel concrete and available today. The job was not just frontend execution. It was positioning, messaging hierarchy, proof selection, multilingual copy, CTA structure, and giving the company a credible story that works for professionals, early supporters, and strategic conversations.',
    image: projectImages.buildapp,
    stack: ['Landing Strategy', 'Multilingual Copy', 'Positioning', 'Responsive UI', 'CRO', 'Product Marketing'],
    category: 'frontend',
    featured: true,
    liveUrl: 'https://buildapp.es/',
    date: '2026-04-22',
    metrics: {
      performance: 92,
      accessibility: 88,
      bestPractices: 96,
      seo: 91
    },
    challenges: [
      'Balancing a bigger platform story without overselling what already exists',
      'Speaking to professionals, future users, and investors on the same surface',
      'Keeping the page clear, visual, and trustworthy instead of startup-hype heavy'
    ],
    highlights: [
      'Explains the wedge clearly: useful product today, larger platform thesis tomorrow',
      'Turns market insight into a launch-ready website instead of a vague vision deck',
      'Creates a clean path into BuildApp Pro, waitlist interest, and strategic conversations'
    ]
  },
  {
    id: 'buildapp-marketplace',
    title: 'BuildApp Marketplace',
    description: 'Early construction marketplace prototype that first proved my product instincts in this space.',
    longDescription: 'Before the current company version of BuildApp, this was my first end-to-end marketplace for the construction sector. Built with Node.js, Express, and MongoDB, it handled dual authentication, project management, professional portfolios, and reviews. More importantly, it showed an early but real product instinct: solving a sector problem with role-specific UX and operational workflows instead of a generic CRUD app.',
    image: projectImages['buildapp-marketplace'],
    stack: ['Node.js', 'Express', 'MongoDB', 'EJS', 'CSS3', 'Cloudinary'],
    category: 'fullstack',
    featured: false,
    liveUrl: 'https://buildapp-ga.netlify.app/',
    githubUrl: 'https://github.com/TonyRod116/BuildApp-ga-first-full-stack',
    date: '2025-07-10',
    metrics: {
      performance: 92,
      accessibility: 88,
      bestPractices: 96,
      seo: 91
    },
    challenges: [
      'Designing a two-sided marketplace without bloating the UX',
      'Managing dual authentication and role-based permissions',
      'Turning a real sector pain point into product logic, not just CRUD screens'
    ],
    highlights: [
      'First serious proof that I could translate construction pain into software',
      'Role-specific UX for homeowners and professionals',
      'End-to-end marketplace flows with portfolios, projects, and reviews'
    ]
  },
  {
    id: 're-lux',
    title: 'Re-Lux',
    description: 'Luxury resale marketplace focused on trust, browsing quality, and polished purchase flows.',
    longDescription: 'Re-Lux is a premium second-hand luxury marketplace built with React, Node.js, and MongoDB. It includes JWT authentication, favorites, reviews, Cloudinary image handling, and a full cart flow. The main challenge was keeping the experience polished while untangling frontend-backend responsibilities and improving performance.',
    image: projectImages['re-lux'],
    stack: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Cloudinary'],
    category: 'fullstack',
    featured: false,
    liveUrl: 'https://re-lux-frontend.netlify.app/',
    frontendUrl: 'https://github.com/TonyRod116/Re-Lux-frontend',
    backendUrl: 'https://github.com/TonyRod116/Re-Lux-backend',
    githubUrl: 'https://github.com/TonyRod116/Re-Lux-frontend',
    date: '2025-08-20',
    metrics: {
      performance: 88,
      accessibility: 90,
      bestPractices: 94,
      seo: 85
    },
    challenges: [
      'Keeping premium-brand polish while refactoring frontend/backend responsibilities',
      'Managing image-heavy browsing without slowing the experience',
      'Connecting trust signals, cart behavior, and account flows into one purchase journey'
    ],
    highlights: [
      'Polished browsing, favorites, reviews, and cart flow',
      'JWT auth plus Cloudinary-based image handling',
      'Good proof of product finish, not just implementation completeness'
    ]
  },
  {
    id: 'tradelab',
    title: 'TradeLab',
    description: 'Trading strategy backtesting platform built in 8 days, turning ideas into executable rules and measurable results.',
    longDescription: 'TradeLab is a full-stack backtesting platform built in 8 days with React, Django, PostgreSQL, and REST APIs. I converted Databento market data into Parquet with Pandas for efficient processing, then built strategy creation, historical testing, and performance metrics such as Sharpe ratio and drawdown. It was an early proof that I could combine product thinking, technical depth, and speed.',
    image: projectImages.tradelab,
    stack: ['React', 'Django', 'PostgreSQL', 'Neon.tech', 'Python', 'JavaScript', 'Pandas', 'Parquet'],
    category: 'fullstack',
    featured: true,
    liveUrl: 'https://trade-lab.netlify.app/',
    frontendUrl: 'https://github.com/TonyRod116/TradingLab',
    backendUrl: 'https://github.com/TonyRod116/TradingLab-Backend',
    githubUrl: 'https://github.com/TonyRod116/TradingLab',
    date: '2025-09-15',
    metrics: {
      performance: 95,
      accessibility: 92,
      bestPractices: 98,
      seo: 89
    },
    challenges: [
      'Efficient conversion of massive market data',
      'Implementation of complex financial metrics',
      'Performance optimization for long backtests'
    ],
    highlights: [
      'Built in 8 days and recognized by my instructor as one of the strongest projects in the cohort',
      'Real-time data processing with strategy creation and historical testing',
      'Good proof of speed, product judgement, and quantitative tooling'
    ]
  }
]
