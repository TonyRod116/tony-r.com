export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  stack: string[]
  category: 'frontend' | 'backend' | 'fullstack'
  featured: boolean
  liveUrl?: string
  githubUrl?: string
  date: string
  metrics?: {
    performance?: number
    accessibility?: number
    bestPractices?: number
    seo?: number
  }
  challenges?: string[]
  highlights?: string[]
}

export const projects: Project[] = [
  {
    id: 'tradelab',
    title: 'TradeLab',
    description: 'Professional trading strategy backtesting platform. Convert ideas into executable strategies and run complete backtests.',
    longDescription: 'TradeLab is a full-stack trading strategy backtesting platform built in 8 days using React, Django, PostgreSQL and APIs. I converted Databento market data to Parquet for efficient processing. Includes JWT authentication, strategy builder, real historical data integration and advanced metrics (Sharpe ratio, drawdown). Deployed on Netlify/Heroku, fully responsive.',
    image: '/src/assets/image_original.jpg',
    stack: ['React', 'Django', 'PostgreSQL', 'Python', 'JavaScript', 'REST APIs'],
    category: 'fullstack',
    featured: true,
    liveUrl: 'https://tradelab-demo.vercel.app',
    githubUrl: 'https://github.com/TonyRod116/tradelab',
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
      'Recognized by instructor as one of the best projects',
      'Real-time data processing',
      'Intuitive interface for professional traders'
    ]
  },
  {
    id: 're-lux',
    title: 'Re-Lux',
    description: 'Second-hand luxury e-commerce platform. Premium marketplace with authentication, favorites, reviews and shopping cart.',
    longDescription: 'Re-Lux is a second-hand luxury e-commerce platform built with React, Node.js and MongoDB. Includes JWT authentication, favorites system, product reviews, Cloudinary integration for images and complete shopping cart. I overcame challenges like frontend-backend refactoring and CSS optimization.',
    image: '/src/assets/image_original (12).jpg',
    stack: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Cloudinary'],
    category: 'fullstack',
    featured: true,
    liveUrl: 'https://re-lux-demo.vercel.app',
    githubUrl: 'https://github.com/TonyRod116/re-lux',
    date: '2025-08-20',
    metrics: {
      performance: 88,
      accessibility: 90,
      bestPractices: 94,
      seo: 85
    },
    challenges: [
      'Complete frontend-backend refactoring',
      'Image optimization with Cloudinary',
      'Payment system implementation'
    ],
    highlights: [
      'Exceptional UX for luxury products',
      'Robust authentication system',
      'Perfect integration with external services'
    ]
  },
  {
    id: 'buildapp',
    title: 'BuildAPP',
    description: 'Comprehensive platform connecting clients with construction professionals. Project management, portfolios and review system.',
    longDescription: 'BuildAPP is a comprehensive web platform connecting clients with construction professionals. Built with Node.js, Express.js and MongoDB, includes dual authentication, project management, professional portfolios and review system. Deployed on Netlify with serverless architecture and Cloudinary for images.',
    image: '/src/assets/image_original (3).jpg',
    stack: ['Node.js', 'Express', 'MongoDB', 'React', 'Tailwind CSS', 'Cloudinary'],
    category: 'fullstack',
    featured: true,
    liveUrl: 'https://buildapp-demo.vercel.app',
    githubUrl: 'https://github.com/TonyRod116/buildapp',
    date: '2025-07-10',
    metrics: {
      performance: 92,
      accessibility: 88,
      bestPractices: 96,
      seo: 91
    },
    challenges: [
      'Complex serverless architecture',
      'Dual user management (clients/professionals)',
      'Intelligent matching system'
    ],
    highlights: [
      'Real solution for construction sector',
      'Role-differentiated user experience',
      'Integration with management tools'
    ]
  },
  {
    id: 'weather-dashboard',
    title: 'Weather Dashboard',
    description: 'Weather dashboard with real-time predictions, interactive maps and personalized alerts.',
    longDescription: 'Advanced weather dashboard built with React and TypeScript. Includes real-time predictions, interactive maps with Leaflet, personalized alerts and historical data. Integration with multiple weather APIs for maximum accuracy.',
    image: '/images/projects/weather-dashboard.jpg',
    stack: ['React', 'TypeScript', 'Leaflet', 'Chart.js', 'OpenWeather API'],
    category: 'frontend',
    featured: false,
    liveUrl: 'https://weather-dashboard-demo.vercel.app',
    githubUrl: 'https://github.com/TonyRod116/weather-dashboard',
    date: '2025-06-15',
    metrics: {
      performance: 94,
      accessibility: 89,
      bestPractices: 97,
      seo: 82
    },
    challenges: [
      'Integration of multiple weather APIs',
      'Interactive maps optimization',
      'Complex state management with Context API'
    ],
    highlights: [
      'Intuitive and responsive interface',
      'Updated real-time data',
      'Advanced data visualizations'
    ]
  }
]
