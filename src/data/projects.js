import { projectImages } from '../assets/images.js'

export const projects = [
  {
    id: 'buildapp',
    title: 'BuildAPP',
    description: 'Comprehensive platform connecting clients with construction professionals. Project management, portfolios and review system.',
    longDescription: 'BuildAPP is a comprehensive web platform connecting clients with construction professionals. Built with Node.js, Express.js and MongoDB, includes dual authentication, project management, professional portfolios and review system. Deployed on Netlify with serverless architecture and Cloudinary for images.',
    image: projectImages.buildapp,
    stack: ['Node.js', 'Express', 'MongoDB', 'EJS', 'CSS3', 'Cloudinary'],
    category: 'fullstack',
    featured: true,
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
    id: 're-lux',
    title: 'Re-Lux',
    description: 'Second-hand luxury e-commerce platform. Premium marketplace with authentication, favorites, reviews and shopping cart.',
    longDescription: 'Re-Lux is a second-hand luxury e-commerce platform built with React, Node.js and MongoDB. Includes JWT authentication, favorites system, product reviews, Cloudinary integration for images and complete shopping cart. I overcame challenges like frontend-backend refactoring and CSS optimization.',
    image: projectImages['re-lux'],
    stack: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Cloudinary'],
    category: 'fullstack',
    featured: true,
    liveUrl: 'https://re-lux-frontend.netlify.app/',
    githubUrl: 'https://github.com/TonyRod116/Re-Lux-frontend',
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
    id: 'tradelab',
    title: 'TradeLab',
    description: 'Professional trading strategy backtesting platform. Convert ideas into executable strategies and run complete backtests.',
    longDescription: 'TradeLab is a full-stack trading strategy backtesting platform built in 8 days using React, Django, PostgreSQL and REST APIs. I converted Databento market data to Parquet format using Pandas for efficient processing. Includes JWT authentication, strategy builder, real historical data integration and advanced metrics (Sharpe ratio, drawdown). Deployed on Netlify/Heroku, fully responsive.',
    image: projectImages.tradelab,
    stack: ['React', 'Django', 'PostgreSQL', 'Python', 'JavaScript', 'Pandas', 'Parquet'],
    category: 'fullstack',
    featured: true,
    liveUrl: 'https://trade-lab.netlify.app/',
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
      'Recognized by instructor as one of the best projects',
      'Real-time data processing',
      'Intuitive interface for professional traders'
    ]
  }
]
