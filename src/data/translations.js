export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      resume: 'Resume',
      contact: 'Contact',
      hireMe: 'Hire Me'
    },
    
    // Home Page
    home: {
      hero: {
        titlePart1: 'Full Stack',
        titlePart2: 'Software Engineer',
        titlePart3: 'with product vision.',
        subtitle: 'From construction entrepreneur to creating innovative digital solutions.',
        cta: {
          viewProjects: 'View Projects',
          viewResume: 'View Resume',
          startProject: 'Start project'
        },
        scrollDown: 'Scroll down'
      },
      stats: {
        repositories: 'GitHub Repositories',
        problemSolving: 'Problem Solving',
        orientedBy: 'Oriented by',
        yearsLeading: 'Years leading teams',
        continuousLearning: 'Continuous Learning',
        drivenBy: 'Driven by'
      },
      about: {
        title: 'From construction entrepreneur to Full Stack Software Engineer',
        description: "At General Assembly, I stood out for consistently going beyond project requirements, adding creative, functional, and product-oriented features that elevated each build. My final project, TradeLab, was publicly recognized by my instructor as one of the best projects he had ever seen in his years of teaching at GA.",
        moreAboutMe: 'More about me'
      },
      skills: {
        title: 'Technical Skills',
        languages: 'Languages',
        frameworks: 'Frameworks & Libraries'
      },
      projects: {
        title: 'Featured Projects',
        subtitle: 'A selection of my most recent work, from value propositions to complete implementation.',
        readMore: 'Read more',
        readLess: 'Read less',
        live: 'Live',
        backend: 'Backend',
        frontend: 'Frontend',
        github: 'GitHub',
        viewAll: 'View all projects'
      },
      cta: {
        title: 'Ready to build something incredible?',
        description: 'I have real experience building products that people use. From construction to software, I combine technical depth with strategic thinking.',
        viewResume: 'View Resume',
        startProject: 'Start project'
      }
    },

    // About Page
    about: {
      hero: {
        title: 'About Me',
        description1: "I'm a Full Stack Software Engineer with a strong foundation in JavaScript, React, Node.js, Python, Django, MongoDB, and PostgreSQL, and experience deploying applications on Netlify, Heroku, and Render. My journey into tech came after years of running client-centered businesses in real estate and construction, where I learned how to turn ideas into practical solutions that people actually use.",
        description2: "At General Assembly's immersive Software Engineering Bootcamp, I delivered four complete applications. In each project, I went beyond the requirements, adding creative and product-oriented features. My final project, TradeLab, a trading strategy backtesting platform, was recognized by my instructor as one of the best projects he had ever seen in his years of teaching.",
        description3: "What drives me most is solving problems with creativity and precision. I bring an entrepreneurial mindset, a product-driven perspective, and resilience built through real-world challenges. Whether working solo or in teams, I focus on creating scalable, user-friendly products that deliver real value.",
        description4: "I'm excited to keep growing as an engineer while contributing to projects that improve the way people live and work."
      },
      technical: {
        title: 'Technical Expertise',
        subtitle: 'I bring expertise in modern technologies and frameworks, with experience deploying applications across multiple platforms.',
        languages: 'Languages',
        frameworks: 'Frameworks & Libraries',
        tools: 'Tools',
        softSkills: 'Soft Skills'
      },
      whatIBring: {
        title: 'What I Bring',
        subtitle: 'Beyond technical ability, I contribute with a growth mindset, creative problem-solving, and a product-driven perspective. Qualities shaped by my years as an entrepreneur.',
        technicalStack: {
          title: 'Technical Stack',
          description: 'Experience with JavaScript, React, Node.js, Python, Django, MongoDB, PostgreSQL'
        },
        problemSolving: {
          title: 'Problem-Solving Mindset',
          description: 'Creative and analytical approach to overcoming technical challenges'
        },
        productThinking: {
          title: 'Product Thinking',
          description: 'Ability to design features that go beyond requirements and create real value'
        },
        collaboration: {
          title: 'Collaboration & Leadership',
          description: '15+ years leading teams and working effectively in Agile/Scrum environments'
        },
        resilience: {
          title: 'Resilience & Adaptability',
          description: 'Thrived in high-pressure situations, from entrepreneurship to fast-paced bootcamp projects'
        },
        continuousLearning: {
          title: 'Continuous Learning',
          description: 'Strong growth mindset, always exploring new tools and frameworks'
        }
      },
      lookingFor: {
        title: 'What I\'m Looking For',
        description: 'I am excited to join teams where I can combine technical depth with strategic thinking, helping to build scalable products that make a real impact while continuing to grow as a developer.',
        quote: 'I bring expertise in JavaScript, React, Node.js, Python, Django, MongoDB, PostgreSQL, and REST APIs, with experience deploying applications on Netlify, Heroku, and Render.'
      },
      cta: {
        title: 'Ready to work together?',
        description: 'If you have a project in mind or just want to chat about technology, I\'d love to hear from you.',
        sendMessage: 'Send message',
        viewGitHub: 'View GitHub'
      }
    },

    // Projects Page
    projects: {
      title: 'Projects',
      subtitle: 'A selection of my most recent work, from value propositions to complete implementation. Each project represents a unique challenge and an opportunity to learn and grow.',
      overview: 'Project Overview',
      features: 'Key Features',
      challenges: 'Technical Challenges',
      techStack: 'Technologies Used',
      backend: 'Backend',
      frontend: 'Frontend',
      github: 'GitHub',
      live: 'Live',
      projects: {
        buildapp: {
          description: 'Comprehensive platform connecting clients with construction professionals. Project management, portfolios and review system.',
          longDescription: 'BuildAPP is a comprehensive web platform connecting clients with construction professionals. Built with Node.js, Express.js and MongoDB, includes dual authentication, project management, professional portfolios and review system. Deployed on Netlify with serverless architecture and Cloudinary for images.',
          highlights: [
            'Real solution for construction sector',
            'Role-differentiated user experience',
            'Integration with management tools'
          ],
          challenges: [
            'Complex serverless architecture',
            'Dual user management (clients/professionals)',
            'Intelligent matching system'
          ]
        },
        're-lux': {
          description: 'Second-hand luxury e-commerce platform. Premium marketplace with authentication, favorites, reviews and shopping cart.',
          longDescription: 'Re-Lux is a second-hand luxury e-commerce platform built with React, Node.js and MongoDB. Includes JWT authentication, favorites system, product reviews, Cloudinary integration for images and complete shopping cart. I overcame challenges like frontend-backend refactoring and CSS optimization.',
          highlights: [
            'Exceptional UX for luxury products',
            'Robust authentication system',
            'Perfect integration with external services'
          ],
          challenges: [
            'Complete frontend-backend refactoring',
            'Image optimization with Cloudinary',
            'Payment system implementation'
          ]
        },
        tradelab: {
          description: 'Professional trading strategy backtesting platform. Convert ideas into executable strategies and run complete backtests.',
          longDescription: 'TradeLab is a full-stack trading strategy backtesting platform built in 8 days using React, Django, PostgreSQL (Neon.tech) and REST APIs. I converted Databento market data to Parquet format using Pandas for efficient processing. Includes JWT authentication, strategy builder, real historical data integration and advanced metrics (Sharpe ratio, drawdown). Deployed on Netlify/Heroku, fully responsive.',
          highlights: [
            'Recognized by instructor as one of the best projects',
            'Real-time data processing',
            'Intuitive interface for professional traders'
          ],
          challenges: [
            'Efficient conversion of massive market data',
            'Implementation of complex financial metrics',
            'Performance optimization for long backtests'
          ]
        }
      }
    },

    // Footer
    footer: {
      description: 'I build products that are understood and used. Software engineer and founder with real construction experience.',
      quickLinks: 'Quick Links',
      connect: 'Connect with me',
      copyright: '© 2025 Tony Rodríguez. All rights reserved.'
    },

    // Resume Page
    resume: {
      title: 'Resume',
      subtitle: 'A comprehensive overview of my experience, skills and professional achievements.',
      aboutMe: 'About Me',
      aboutMeContent: "I'm a full stack software engineer who recently graduated from General Assembly, after several years leading projects and running client-centered businesses in real estate and construction. At GA I built four complete applications: my final project, TradeLab, was highlighted by my instructor as one of the best he had seen, and I found that what drives me most is using code creatively to solve problems. I enjoy looking beyond the obvious, understanding what people really need, and turning that into innovative, practical solutions. I bring curiosity, creativity, and a collaborative spirit to every project, and I'm excited to keep growing as an engineer while building products that genuinely improve the way people live and work.",
      experience: 'Professional Experience',
      experienceDetails: {
        generalassembly: {
          description: 'Built 4 projects (solo and group) applying agile workflows, Git version control, and modern stacks. Strengthened problem-solving, debugging, and collaboration skills through daily coding challenges and peer programming.'
        },
        totalhomes: {
          description: 'Founded and managed a boutique construction and renovation company, delivering high-quality residential projects. Led cross-functional teams, budgets, and timelines from concept to delivery. Known for creativity and client focus: translated customer needs into innovative, functional designs. Developed digital workflows to improve transparency and efficiency in projects.'
        },
        casex: {
          description: 'Managed residential projects, budgets, and client relationships. Oversaw sales strategies, market studies, and new client acquisition.'
        }
      },
      skills: 'Technical Skills',
      languages: 'Languages',
      frameworks: 'Frameworks & Libraries',
      tools: 'Tools',
      soft: 'Soft Skills',
      softSkills: {
        creativity: 'Creativity',
        problemSolving: 'Problem-Solving',
        projectManagement: 'Project management',
        leadership: 'Leadership',
        clientRelations: 'Client Relations'
      },
      keySkills: 'Key Skills',
      achievements: 'Key Achievements',
      achievement1: 'Final project TradeLab recognized as one of the best by General Assembly instructor',
      achievement2: '3 out of 4 projects highlighted during Software Engineering bootcamp',
      achievement3: '6 years of experience leading teams and managing complex projects at TotalHomes',
      achievement4: 'Successful founder with exceptional reputation in the construction sector',
      educationTitle: 'Education',
      education: {
        generalassembly: {
          degree: 'Software Engineering Bootcamp',
          institution: 'General Assembly',
          description: 'Intensive full-stack development program with focus on modern web technologies and agile methodologies.'
        },
        passivhaus: {
          degree: 'Certified Passive House Consultant & Tradesperson',
          institution: 'Energiehaus Arquitectos / Passivhaus Institut',
          description: 'Professional certification in energy-efficient building design and construction.'
        },
        uic: {
          degree: 'Architecture (coursework completed)',
          institution: 'Universitat Internacional de Catalunya',
          description: 'Foundation studies in architecture and design principles.'
        },
        asb: {
          degree: 'High School Studies (Bilingual English/Spanish) & Proficiency Certificate',
          institution: 'American School of Barcelona',
          description: 'International baccalaureate program with focus on mathematics, sciences, and languages.'
        }
      },
      interests: 'Interests',
      interestsContent: "I am passionate about projects that put people first: whether through technology, design, or community. I enjoy exploring how digital solutions can make everyday life easier and more enjoyable, while also taking interest in wellbeing, creativity, and personal growth. My goal is always to combine innovation with a genuine desire to improve people's lives.",
      spanish: 'Spanish',
      english: 'English',
      native: 'Native',
      advanced: 'Fluent',
      download: 'Download Resume',
      downloadText: 'Click to download PDF'
    },

    // Contact Page
    contact: {
      title: 'Contact',
      subtitle: "Have a project in mind? I'd love to hear about it and how I can help you bring it to life.",
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        budget: 'Budget (Optional)',
        availability: 'Availability',
        sendMessage: 'Send message',
        successMessage: "Message sent successfully! I'll get back to you soon.",
        errorMessage: 'Error sending message. Please try again.',
        sending: 'Sending message...',
        namePlaceholder: 'Your name',
        emailPlaceholder: 'tu@email.com',
        messagePlaceholder: 'Tell me about your project, goals, timeline...',
        selectRange: 'Select a range',
        whenStart: 'When do you need to start?'
      },
      info: {
        title: 'Contact Information',
        email: 'Email',
        location: 'Location'
      },
      social: {
        title: 'Social Media'
      },
      availability: {
        title: 'Availability',
        available: 'Available for new projects',
        responseTime: 'Typical response time: 24 hours'
      },
      budget: {
        under5k: 'Under 5k€',
        '5k10k': '5k€ - 10k€',
        '10k25k': '10k€ - 25k€',
        '25k50k': '25k€ - 50k€',
        over50k: 'Over 50k€'
      },
      availabilityOptions: {
        immediate: 'Immediate',
        '1month': 'In 1 month',
        '3months': 'In 3 months',
        flexible: 'Flexible'
      }
    },

    // Footer
    footer: {
      description: 'I build products that are understood and used. Software engineer and founder with real construction experience.',
      quickLinks: 'Quick Links',
      connect: 'Connect with me',
      copyright: '© 2025 Tony Rodríguez. All rights reserved.'
    }
  },

  es: {
    // Navigation
    nav: {
      home: 'Inicio',
      about: 'Sobre Mí',
      projects: 'Proyectos',
      resume: 'CV',
      contact: 'Contacto',
      hireMe: 'Contrátame'
    },
    
    // Home Page
    home: {
      hero: {
        titlePart1: 'Full Stack',
        titlePart2: 'Software Engineer',
        titlePart3: 'con visión de producto.',
        subtitle: 'De emprendedor de construcción a crear soluciones digitales innovadoras.',
        cta: {
          viewProjects: 'Ver Proyectos',
          viewResume: 'Ver CV',
          startProject: 'Iniciar proyecto'
        },
        scrollDown: 'Desplázate hacia abajo'
      },
      stats: {
        repositories: 'Repositorios GitHub',
        problemSolving: 'Resolución de Problemas',
        orientedBy: 'Orientado por',
        yearsLeading: 'Años liderando equipos',
        continuousLearning: 'Aprendizaje Continuo',
        drivenBy: 'Impulsado por'
      },
      about: {
        title: 'De emprendedor de construcción a Full Stack Software Engineer',
        description: 'En General Assembly, me destacé por ir consistentemente más allá de los requisitos del proyecto, añadiendo características creativas, funcionales y orientadas al producto que elevaron cada construcción. Mi proyecto final, TradeLab, fue públicamente reconocido por mi instructor como uno de los mejores proyectos que había visto en sus años de enseñanza en GA.',
        moreAboutMe: 'Más sobre mí'
      },
      skills: {
        title: 'Habilidades Técnicas',
        languages: 'Lenguajes',
        frameworks: 'Frameworks y Librerías'
      },
      projects: {
        title: 'Proyectos Destacados',
        subtitle: 'Una selección de mi trabajo más reciente, desde propuestas de valor hasta implementación completa.',
        readMore: 'Leer más',
        readLess: 'Leer menos',
        live: 'Live',
        backend: 'Backend',
        frontend: 'Frontend',
        github: 'GitHub',
        viewAll: 'Ver todos los proyectos'
      },
      cta: {
        title: '¿Listo para construir algo increíble?',
        description: 'Tengo experiencia real construyendo productos que la gente usa. De la construcción al software, combino profundidad técnica con pensamiento estratégico.',
        viewResume: 'Ver CV',
        startProject: 'Iniciar proyecto'
      }
    },

    // About Page
    about: {
      hero: {
        title: 'Sobre Mí',
        description1: 'Soy un Full Stack Software Engineer con una sólida base en JavaScript, React, Node.js, Python, Django, MongoDB y PostgreSQL, y experiencia desplegando aplicaciones en Netlify, Heroku y Render. Mi camino hacia la tecnología comenzó después de años dirigiendo negocios centrados en el cliente en obra nueva y reformas, donde aprendí a convertir ideas en soluciones prácticas que la gente realmente usa.',
        description2: 'En el Bootcamp inmersivo de Software Engineering de General Assembly, entregué cuatro aplicaciones completas. En cada proyecto, fui más allá de los requisitos, añadiendo funcionalidades creativas y orientadas al producto. Mi proyecto final, TradeLab, una plataforma de backtesting de estrategias de trading, fue reconocido por mi instructor como uno de los mejores proyectos que había visto en sus años de enseñanza.',
        description3: 'Lo que más me motiva es resolver problemas con creatividad y precisión. Traigo una mentalidad emprendedora, una perspectiva orientada al producto y resiliencia construida a través de desafíos del mundo real. Ya sea trabajando solo o en equipos, me enfoco en crear productos escalables y fáciles de usar que aporten valor real.',
        description4: 'Estoy emocionado de seguir creciendo como ingeniero mientras contribuyo a proyectos que mejoran la forma en que las personas viven y trabajan.'
      },
      technical: {
        title: 'Experiencia Técnica',
        subtitle: 'Traigo experiencia en tecnologías modernas y frameworks, con experiencia desplegando aplicaciones en múltiples plataformas.',
        languages: 'Lenguajes',
        frameworks: 'Frameworks y Librerías',
        tools: 'Herramientas',
        softSkills: 'Habilidades Blandas'
      },
      whatIBring: {
        title: 'Lo Que Aporto',
        subtitle: 'Más allá de la capacidad técnica, contribuyo con una mentalidad de crecimiento, resolución creativa de problemas y una perspectiva orientada al producto. Cualidades moldeadas por mis años como emprendedor.',
        technicalStack: {
          title: 'Stack Técnico',
          description: 'Experiencia con JavaScript, React, Node.js, Python, Django, MongoDB, PostgreSQL'
        },
        problemSolving: {
          title: 'Mentalidad de Resolución de Problemas',
          description: 'Enfoque creativo y analítico para superar desafíos técnicos'
        },
        productThinking: {
          title: 'Pensamiento de Producto',
          description: 'Capacidad para diseñar características que van más allá de los requisitos y crean valor real'
        },
        collaboration: {
          title: 'Colaboración y Liderazgo',
          description: '15+ años liderando equipos y trabajando efectivamente en entornos Agile/Scrum'
        },
        resilience: {
          title: 'Resiliencia y Adaptabilidad',
          description: 'Prosperé en situaciones de alta presión, desde el emprendimiento hasta proyectos intensivos de bootcamp'
        },
        continuousLearning: {
          title: 'Aprendizaje Continuo',
          description: 'Fuerte mentalidad de crecimiento, siempre explorando nuevas herramientas y frameworks'
        }
      },
      lookingFor: {
        title: 'Lo Que Busco',
        description: 'Estoy emocionado de unirme a equipos donde pueda combinar profundidad técnica con pensamiento estratégico, ayudando a construir productos escalables que generen un impacto real mientras continúo creciendo como desarrollador.',
        quote: 'Traigo experiencia en JavaScript, React, Node.js, Python, Django, MongoDB, PostgreSQL y REST APIs, con experiencia desplegando aplicaciones en Netlify, Heroku y Render.'
      },
      cta: {
        title: '¿Listo para trabajar juntos?',
        description: 'Si tienes un proyecto en mente o solo quieres charlar sobre tecnología, me encantaría saber de ti.',
        sendMessage: 'Enviar mensaje',
        viewGitHub: 'Ver GitHub'
      }
    },

    // Projects Page
    projects: {
      title: 'Proyectos',
      subtitle: 'Una selección de mi trabajo más reciente, desde propuestas de valor hasta implementación completa. Cada proyecto representa un desafío único y una oportunidad para aprender y crecer.',
      overview: 'Resumen del Proyecto',
      features: 'Características Clave',
      challenges: 'Desafíos Técnicos',
      techStack: 'Tecnologías Utilizadas',
      backend: 'Backend',
      frontend: 'Frontend',
      github: 'GitHub',
      live: 'En vivo',
      projects: {
        buildapp: {
          description: 'Plataforma integral que conecta clientes con profesionales de la construcción. Gestión de proyectos, portafolios y sistema de reseñas.',
          longDescription: 'BuildAPP es una plataforma web integral que conecta clientes con profesionales de la construcción. Construida con Node.js, Express.js y MongoDB, incluye autenticación dual, gestión de proyectos, portafolios profesionales y sistema de reseñas. Desplegada en Netlify con arquitectura serverless y Cloudinary para imágenes.',
          highlights: [
            'Solución real para el sector de la construcción',
            'Experiencia de usuario diferenciada por roles',
            'Integración con herramientas de gestión'
          ],
          challenges: [
            'Arquitectura serverless compleja',
            'Gestión dual de usuarios (clientes/profesionales)',
            'Sistema de emparejamiento inteligente'
          ]
        },
        're-lux': {
          description: 'Plataforma de e-commerce de lujo de segunda mano. Marketplace premium con autenticación, favoritos, reseñas y carrito de compras.',
          longDescription: 'Re-Lux es una plataforma de e-commerce de lujo de segunda mano construida con React, Node.js y MongoDB. Incluye autenticación JWT, sistema de favoritos, reseñas de productos, integración con Cloudinary para imágenes y carrito de compras completo. Superé desafíos como la refactorización frontend-backend y la optimización de CSS.',
          highlights: [
            'UX excepcional para productos de lujo',
            'Sistema de autenticación robusto',
            'Integración perfecta con servicios externos'
          ],
          challenges: [
            'Refactorización completa frontend-backend',
            'Optimización de imágenes con Cloudinary',
            'Implementación del sistema de pagos'
          ]
        },
        tradelab: {
          description: 'Plataforma profesional de backtesting de estrategias de trading. Convierte ideas en estrategias ejecutables y ejecuta backtests completos.',
          longDescription: 'TradeLab es una plataforma full-stack de backtesting de estrategias de trading construida en 8 días usando React, Django, PostgreSQL (Neon.tech) y REST APIs. Convertí datos de mercado de Databento al formato Parquet usando Pandas para procesamiento eficiente. Incluye autenticación JWT, constructor de estrategias, integración de datos históricos reales y métricas avanzadas (ratio Sharpe, drawdown). Desplegada en Netlify/Heroku, completamente responsive.',
          highlights: [
            'Reconocido por el instructor como uno de los mejores proyectos',
            'Procesamiento de datos en tiempo real',
            'Interfaz intuitiva para traders profesionales'
          ],
          challenges: [
            'Conversión eficiente de datos masivos de mercado',
            'Implementación de métricas financieras complejas',
            'Optimización de rendimiento para backtests largos'
          ]
        }
      }
    },

    // Footer
    footer: {
      description: 'Construyo productos que se entienden y se usan. Ingeniero de software y fundador con experiencia real en construcción.',
      quickLinks: 'Enlaces Rápidos',
      connect: 'Conéctate conmigo',
      copyright: '© 2025 Tony Rodríguez. Todos los derechos reservados.'
    },

    // Resume Page
    resume: {
      title: 'CV',
      subtitle: 'Una visión integral de mi experiencia, habilidades y logros profesionales.',
      aboutMe: 'Sobre Mí',
      aboutMeContent: 'Soy un ingeniero de software full stack que recientemente se graduó de General Assembly, después de varios años liderando proyectos y dirigiendo negocios centrados en el cliente en bienes raíces y construcción. En GA construí cuatro aplicaciones completas: mi proyecto final, TradeLab, fue destacado por mi instructor como uno de los mejores que había visto, y descubrí que lo que más me motiva es usar el código de manera creativa para resolver problemas. Disfruto mirar más allá de lo obvio, entender lo que la gente realmente necesita, y convertir eso en soluciones innovadoras y prácticas. Aporto curiosidad, creatividad y un espíritu colaborativo a cada proyecto, y estoy emocionado de seguir creciendo como ingeniero mientras construyo productos que genuinamente mejoran la forma en que las personas viven y trabajan.',
      experience: 'Experiencia Profesional',
      experienceDetails: {
        generalassembly: {
          description: 'Construí 4 proyectos (individuales y grupales) aplicando flujos de trabajo ágiles, control de versiones Git y stacks modernos. Fortalecí habilidades de resolución de problemas, depuración y colaboración a través de desafíos de codificación diarios y programación en pareja.'
        },
        totalhomes: {
          description: 'Fundé y gestioné una empresa boutique de construcción y renovación, entregando proyectos residenciales de alta calidad. Lideré equipos multifuncionales, presupuestos y cronogramas desde el concepto hasta la entrega. Conocido por la creatividad y el enfoque en el cliente: traduje las necesidades del cliente en diseños innovadores y funcionales. Desarrollé flujos de trabajo digitales para mejorar la transparencia y eficiencia en los proyectos.'
        },
        casex: {
          description: 'Gestioné proyectos residenciales, presupuestos y relaciones con clientes. Supervisé estrategias de ventas, estudios de mercado y adquisición de nuevos clientes.'
        }
      },
      skills: 'Habilidades Técnicas',
      languages: 'Idiomas',
      frameworks: 'Frameworks y Librerías',
      tools: 'Herramientas',
      soft: 'Habilidades Blandas',
      softSkills: {
        creativity: 'Creatividad',
        problemSolving: 'Resolución de Problemas',
        projectManagement: 'Gestión de Proyectos',
        leadership: 'Liderazgo',
        clientRelations: 'Relaciones con Clientes'
      },
      keySkills: 'Habilidades Clave',
      achievements: 'Logros Clave',
      achievement1: 'Proyecto final TradeLab reconocido como uno de los mejores por el instructor de General Assembly',
      achievement2: '3 de 4 proyectos destacados durante el bootcamp de Software Engineering',
      achievement3: '6 años de experiencia liderando equipos y gestionando proyectos complejos en TotalHomes',
      achievement4: 'Fundador exitoso con reputación excepcional en el sector de la construcción',
      educationTitle: 'Educación',
      education: {
        generalassembly: {
          degree: 'Bootcamp de Ingeniería de Software',
          institution: 'General Assembly',
          description: 'Programa intensivo de desarrollo full-stack con enfoque en tecnologías web modernas y metodologías ágiles.'
        },
        passivhaus: {
          degree: 'Consultor y Técnico Certificado en Casa Pasiva',
          institution: 'Energiehaus Arquitectos / Passivhaus Institut',
          description: 'Certificación profesional en diseño y construcción de edificios energéticamente eficientes.'
        },
        uic: {
          degree: 'Arquitectura (estudios completados)',
          institution: 'Universitat Internacional de Catalunya',
          description: 'Estudios de base en arquitectura y principios de diseño.'
        },
        asb: {
          degree: 'Estudios de Bachillerato (Bilingüe Inglés/Español) y Certificado de Competencia',
          institution: 'American School of Barcelona',
          description: 'Programa de bachillerato internacional con enfoque en matemáticas, ciencias e idiomas.'
        }
      },
      interests: 'Intereses',
      interestsContent: 'Me apasionan los proyectos que ponen a las personas primero: ya sea a través de la tecnología, el diseño o la comunidad. Disfruto explorando cómo las soluciones digitales pueden hacer la vida cotidiana más fácil y agradable, mientras también me intereso en el bienestar, la creatividad y el crecimiento personal. Mi objetivo es siempre combinar la innovación con un deseo genuino de mejorar la vida de las personas.',
      spanish: 'Español',
      english: 'Inglés',
      native: 'Nativo',
      advanced: 'Fluido',
      download: 'Descargar CV',
      downloadText: 'Haz clic para descargar PDF'
    },

    // Contact Page
    contact: {
      title: 'Contacto',
      subtitle: '¿Tienes un proyecto en mente? Me encantaría escucharlo y cómo puedo ayudarte a darle vida.',
      form: {
        name: 'Nombre',
        email: 'Email',
        message: 'Mensaje',
        budget: 'Presupuesto (Opcional)',
        availability: 'Disponibilidad',
        sendMessage: 'Enviar mensaje',
        successMessage: '¡Mensaje enviado con éxito! Te responderé pronto.',
        errorMessage: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.',
        sending: 'Enviando mensaje...',
        namePlaceholder: 'Tu nombre',
        emailPlaceholder: 'tu@email.com',
        messagePlaceholder: 'Cuéntame sobre tu proyecto, objetivos, cronograma...',
        selectRange: 'Selecciona un rango',
        whenStart: '¿Cuándo necesitas empezar?'
      },
      info: {
        title: 'Información de Contacto',
        email: 'Email',
        location: 'Ubicación'
      },
      social: {
        title: 'Redes Sociales'
      },
      availability: {
        title: 'Disponibilidad',
        available: 'Disponible para nuevos proyectos',
        responseTime: 'Tiempo de respuesta típico: 24 horas'
      },
      budget: {
        under5k: 'Menos de 5k€',
        '5k10k': '5k€ - 10k€',
        '10k25k': '10k€ - 25k€',
        '25k50k': '25k€ - 50k€',
        over50k: 'Más de 50k€'
      },
      availabilityOptions: {
        immediate: 'Inmediato',
        '1month': 'En 1 mes',
        '3months': 'En 3 meses',
        flexible: 'Flexible'
      }
    },

    // Footer
    footer: {
      description: 'Construyo productos que se entienden y se usan. Ingeniero de software y fundador con experiencia real en construcción.',
      quickLinks: 'Enlaces Rápidos',
      connect: 'Conéctate conmigo',
      copyright: '© 2025 Tony Rodríguez. Todos los derechos reservados.'
    }
  },

  ca: {
    // Navigation
    nav: {
      home: 'Inici',
      about: 'Sobre Mi',
      projects: 'Projectes',
      resume: 'CV',
      contact: 'Contacte',
      hireMe: 'Contracta\'m'
    },
    
    // Home Page
    home: {
      hero: {
        titlePart1: 'Full Stack',
        titlePart2: 'Software Engineer',
        titlePart3: 'amb visió de producte.',
        subtitle: 'D\'emprenedor de construcció a crear solucions digitals innovadores.',
        cta: {
          viewProjects: 'Veure Projectes',
          viewResume: 'Veure CV',
          startProject: 'Iniciar projecte'
        },
        scrollDown: 'Desplaça\'t cap avall'
      },
      stats: {
        repositories: 'Repositoris GitHub',
        problemSolving: 'Resolució de Problemes',
        orientedBy: 'Orientat per',
        yearsLeading: 'Anys liderant equips',
        continuousLearning: 'Aprenentatge Continu',
        drivenBy: 'Impulsat per'
      },
      about: {
        title: 'D\'emprenedor de construcció a Full Stack Software Engineer',
        description: 'A General Assembly, em vaig destacar per anar consistentment més enllà dels requisits de cada projecte, afegint característiques creatives, funcionals i orientades al producte que van elevar cada construcció. El meu projecte final, TradeLab, va ser públicament reconegut pel meu instructor com un dels millors projectes que havia vist en els seus anys d\'ensenyament a GA.',
        moreAboutMe: 'Més sobre mí'
      },
      skills: {
        title: 'Habilitats Tècniques',
        languages: 'Llenguatges',
        frameworks: 'Frameworks i Llibreries'
      },
      projects: {
        title: 'Projectes Destacats',
        subtitle: 'Una selecció del meu treball més recent, des de propostes de valor fins a implementació completa.',
        readMore: 'Llegir més',
        readLess: 'Llegir menys',
        live: 'Live',
        backend: 'Backend',
        frontend: 'Frontend',
        github: 'GitHub',
        viewAll: 'Veure tots els projectes'
      },
      cta: {
        title: 'Llest per construir alguna cosa increïble?',
        description: 'Tinc experiència real construint productes que la gent usa. De la construcció al programari, combino profunditat tècnica amb pensament estratègic.',
        viewResume: 'Veure CV',
        startProject: 'Iniciar projecte'
      }
    },

    // About Page
    about: {
      hero: {
        title: 'Sobre Mi',
        description1: 'Soc un Full Stack Software Engineer amb una base sòlida en JavaScript, React, Node.js, Python, Django, MongoDB i PostgreSQL, i experiència desplegant aplicacions a Netlify, Heroku i Render. El meu camí cap a la tecnologia va començar després d\'anys dirigint negocis centrats en el client en béns immobles i construcció, on vaig aprendre a convertir idees en solucions pràctiques que la gent realment usa.',
        description2: 'Al Bootcamp immersiu de Software Engineering de General Assembly, vaig lliurar quatre aplicacions completes. En cada projecte, vaig anar més enllà dels requisits, afegint funcionalitats creatives i orientades al producte. El meu projecte final, TradeLab, una plataforma de backtesting d\'estratègies de trading, va ser reconegut pel meu instructor com un dels millors projectes que havia vist en els seus anys d\'ensenyament.',
        description3: 'El que més em motiva és resoldre problemes amb creativitat i precisió. Porto una mentalitat emprenedora, una perspectiva orientada al producte i resiliència construïda a través de desafiaments del món real. Ja sigui treballant sol o en equips, em centro en crear productes escalables i fàcils d\'usar que aportin valor real.',
        description4: 'Estic emocionat de seguir creixent com a enginyer mentre contribueixo a projectes que milloren la forma en què les persones viuen i treballen.'
      },
      technical: {
        title: 'Experiència Tècnica',
        subtitle: 'Porto experiència en tecnologies modernes i frameworks, amb experiència desplegant aplicacions en múltiples plataformes.',
        languages: 'Llenguatges',
        frameworks: 'Frameworks i Llibreries',
        tools: 'Eines',
        softSkills: 'Habilitats Suaus'
      },
      whatIBring: {
        title: 'El Que Aporto',
        subtitle: 'Més enllà de la capacitat tècnica, contribueixo amb una mentalitat de creixement, resolució creativa de problemes i una perspectiva orientada al producte. Qualitats modelades pels meus anys com a emprenedor.',
        technicalStack: {
          title: 'Stack Tècnic',
          description: 'Experiència amb JavaScript, React, Node.js, Python, Django, MongoDB, PostgreSQL'
        },
        problemSolving: {
          title: 'Mentalitat de Resolució de Problemes',
          description: 'Enfocament creatiu i analític per superar desafiaments tècnics'
        },
        productThinking: {
          title: 'Pensament de Producte',
          description: 'Capacitat per dissenyar característiques que van més enllà dels requisits i creen valor real'
        },
        collaboration: {
          title: 'Col·laboració i Lideratge',
          description: '15+ anys liderant equips i treballant efectivament en entorns Agile/Scrum'
        },
        resilience: {
          title: 'Resiliència i Adaptabilitat',
          description: 'Vaig prosperar en situacions d\'alta pressió, des de l\'emprenedoria fins a projectes intensius de bootcamp'
        },
        continuousLearning: {
          title: 'Aprenentatge Continu',
          description: 'Forta mentalitat de creixement, sempre explorant noves eines i frameworks'
        }
      },
      lookingFor: {
        title: 'El Que Busco',
        description: 'Estic emocionat d\'unir-me a equips on pugui combinar profunditat tècnica amb pensament estratègic, ajudant a construir productes escalables que generin un impacte real mentre continuo creixent com a desenvolupador.',
        quote: 'Porto experiència en JavaScript, React, Node.js, Python, Django, MongoDB, PostgreSQL i REST APIs, amb experiència desplegant aplicacions a Netlify, Heroku i Render.'
      },
      cta: {
        title: 'Llest per treballar junts?',
        description: 'Si tens un projecte en ment o només vols xerrar sobre tecnologia, m\'encantaria saber de tu.',
        sendMessage: 'Enviar missatge',
        viewGitHub: 'Veure GitHub'
      }
    },

    // Projects Page
    projects: {
      title: 'Projectes',
      subtitle: 'Una selecció del meu treball més recent, des de propostes de valor fins a implementació completa. Cada projecte representa un desafiament únic i una oportunitat per aprendre i créixer.',
      overview: 'Resum del Projecte',
      features: 'Característiques Clau',
      challenges: 'Desafiaments Tècnics',
      techStack: 'Tecnologies Utilitzades',
      backend: 'Backend',
      frontend: 'Frontend',
      github: 'GitHub',
      live: 'En viu',
      projects: {
        buildapp: {
          description: 'Plataforma integral que connecta clients amb professionals de la construcció. Gestió de projectes, portafolis i sistema de ressenyes.',
          longDescription: 'BuildAPP és una plataforma web integral que connecta clients amb professionals de la construcció. Construïda amb Node.js, Express.js i MongoDB, inclou autenticació dual, gestió de projectes, portafolis professionals i sistema de ressenyes. Desplegada a Netlify amb arquitectura serverless i Cloudinary per a imatges.',
          highlights: [
            'Solució real per al sector de la construcció',
            'Experiència d\'usuari diferenciada per rols',
            'Integració amb eines de gestió'
          ],
          challenges: [
            'Arquitectura serverless complexa',
            'Gestió dual d\'usuaris (clients/professionals)',
            'Sistema d\'emparellament intel·ligent'
          ]
        },
        're-lux': {
          description: 'Plataforma d\'e-commerce de luxe de segona mà. Marketplace premium amb autenticació, favorits, ressenyes i carretó de compres.',
          longDescription: 'Re-Lux és una plataforma d\'e-commerce de luxe de segona mà construïda amb React, Node.js i MongoDB. Inclou autenticació JWT, sistema de favorits, ressenyes de productes, integració amb Cloudinary per a imatges i carretó de compres complet. Vaig superar desafiaments com la refactorització frontend-backend i l\'optimització de CSS.',
          highlights: [
            'UX excepcional per a productes de luxe',
            'Sistema d\'autenticació robust',
            'Integració perfecta amb serveis externs'
          ],
          challenges: [
            'Refactorització completa frontend-backend',
            'Optimització d\'imatges amb Cloudinary',
            'Implementació del sistema de pagaments'
          ]
        },
        tradelab: {
          description: 'Plataforma professional de backtesting d\'estratègies de trading. Converteix idees en estratègies executables i executa backtests complets.',
          longDescription: 'TradeLab és una plataforma full-stack de backtesting d\'estratègies de trading construïda en 8 dies usant React, Django, PostgreSQL (Neon.tech) i REST APIs. Vaig convertir dades de mercat de Databento al format Parquet usant Pandas per a processament eficient. Inclou autenticació JWT, constructor d\'estratègies, integració de dades històriques reals i mètriques avançades (ratio Sharpe, drawdown). Desplegada a Netlify/Heroku, completament responsive.',
          highlights: [
            'Reconegut per l\'instructor com un dels millors projectes',
            'Processament de dades en temps real',
            'Interfície intuïtiva per a traders professionals'
          ],
          challenges: [
            'Conversió eficient de dades massives de mercat',
            'Implementació de mètriques financeres complexes',
            'Optimització de rendiment per a backtests llargs'
          ]
        }
      }
    },

    // Footer
    footer: {
      description: 'Construeixo productes que s\'entenen i s\'usen. Enginyer de programari i fundador amb experiència real en construcció.',
      quickLinks: 'Enllaços Ràpids',
      connect: 'Connecta\'m amb mi',
      copyright: '© 2025 Tony Rodríguez. Tots els drets reservats.'
    },

    // Resume Page
    resume: {
      title: 'CV',
      subtitle: 'Una visió integral de la meva experiència, habilitats i assoliments professionals.',
      aboutMe: 'Sobre Mi',
      aboutMeContent: 'Soc un enginyer de programari full stack que recentment es va graduar de General Assembly, després de diversos anys liderant projectes i dirigint negocis centrats en el client en béns immobles i construcció. A GA vaig construir quatre aplicacions completes: el meu projecte final, TradeLab, va ser destacat pel meu instructor com un dels millors que havia vist, i vaig descobrir que el que més em motiva és usar el codi de manera creativa per resoldre problemes. Gaudeixo mirant més enllà de l\'obvi, entendre el que la gent realment necessita, i convertir això en solucions innovadores i pràctiques. Aporto curiositat, creativitat i un esperit col·laboratiu a cada projecte, i estic emocionat de seguir creixent com a enginyer mentre construeixo productes que genuïnament milloren la forma en què les persones viuen i treballen.',
      experience: 'Experiència Professional',
      experienceDetails: {
        generalassembly: {
          description: 'Vaig construir 4 projectes (individuals i grupals) aplicant fluxos de treball àgils, control de versions Git i stacks moderns. Vaig enfortir habilitats de resolució de problemes, depuració i col·laboració a través de desafiaments de codificació diaris i programació en parella.'
        },
        totalhomes: {
          description: 'Vaig fundar i gestionar una empresa boutique de construcció i renovació, lliurant projectes residencials d\'alta qualitat. Vaig liderar equips multifuncionals, pressupostos i cronogrames des del concepte fins a la lliura. Conegut per la creativitat i l\'enfocament en el client: vaig traduir les necessitats del client en dissenys innovadors i funcionals. Vaig desenvolupar fluxos de treball digitals per millorar la transparència i eficiència en els projectes.'
        },
        casex: {
          description: 'Vaig gestionar projectes residencials, pressupostos i relacions amb clients. Vaig supervisar estratègies de vendes, estudis de mercat i adquisició de nous clients.'
        }
      },
      skills: 'Habilitats Tècniques',
      languages: 'Idiomes',
      frameworks: 'Frameworks i Llibreries',
      tools: 'Eines',
      soft: 'Habilitats Suaus',
      softSkills: {
        creativity: 'Creativitat',
        problemSolving: 'Resolució de Problemes',
        projectManagement: 'Gestió de Projectes',
        leadership: 'Lideratge',
        clientRelations: 'Relacions amb Clients'
      },
      keySkills: 'Habilitats Clau',
      achievements: 'Assoliments Clau',
      achievement1: 'Projecte final TradeLab reconegut com un dels millors pel instructor de General Assembly',
      achievement2: '3 de 4 projectes destacats durant el bootcamp de Software Engineering',
      achievement3: '6 anys d\'experiència liderant equips i gestionant projectes complexos a TotalHomes',
      achievement4: 'Fundador exitós amb reputació excepcional en el sector de la construcció',
      educationTitle: 'Educació',
      education: {
        generalassembly: {
          degree: 'Bootcamp d\'Enginyeria de Programari',
          institution: 'General Assembly',
          description: 'Programa intensiu de desenvolupament full-stack amb enfocament en tecnologies web modernes i metodologies àgils.'
        },
        passivhaus: {
          degree: 'Consultor i Tècnic Certificat en Casa Passiva',
          institution: 'Energiehaus Arquitectos / Passivhaus Institut',
          description: 'Certificació professional en disseny i construcció d\'edificis energèticament eficients.'
        },
        uic: {
          degree: 'Arquitectura (estudis completats)',
          institution: 'Universitat Internacional de Catalunya',
          description: 'Estudis de base en arquitectura i principis de disseny.'
        },
        asb: {
          degree: 'Estudis de Batxillerat (Bilingüe Anglès/Espanyol) i Certificat de Competència',
          institution: 'American School of Barcelona',
          description: 'Programa de batxillerat internacional amb enfocament en matemàtiques, ciències i idiomes.'
        }
      },
      interests: 'Interessos',
      interestsContent: 'M\'apassiona els projectes que posen les persones primer: ja sigui a través de la tecnologia, el disseny o la comunitat. Gaudeixo explorant com les solucions digitals poden fer la vida quotidiana més fàcil i agradable, mentre també m\'interesso en el benestar, la creativitat i el creixement personal. El meu objectiu és sempre combinar la innovació amb un desig genuí de millorar la vida de les persones.',
      spanish: 'Espanyol',
      english: 'Anglès',
      native: 'Natiu',
      advanced: 'Fluït',
      download: 'Descarregar CV',
      downloadText: 'Fes clic per descarregar PDF'
    },

    // Contact Page
    contact: {
      title: 'Contacte',
      subtitle: 'Tens un projecte en ment? M\'encantaria escoltar-lo i com puc ajudar-te a donar-li vida.',
      form: {
        name: 'Nom',
        email: 'Email',
        message: 'Missatge',
        budget: 'Pressupost (Opcional)',
        availability: 'Disponibilitat',
        sendMessage: 'Enviar missatge',
        successMessage: 'Missatge enviat amb èxit! Et respondré aviat.',
        errorMessage: 'Error en enviar el missatge. Si us plau, torna-ho a intentar.',
        sending: 'Enviant missatge...',
        namePlaceholder: 'El teu nom',
        emailPlaceholder: 'tu@email.com',
        messagePlaceholder: 'Explica\'m sobre el teu projecte, objectius, cronograma...',
        selectRange: 'Selecciona un rang',
        whenStart: 'Quan necessites començar?'
      },
      info: {
        title: 'Informació de Contacte',
        email: 'Email',
        location: 'Ubicació'
      },
      social: {
        title: 'Xarxes Socials'
      },
      availability: {
        title: 'Disponibilitat',
        available: 'Disponible per a nous projectes',
        responseTime: 'Temps de resposta típic: 24 hores'
      },
      budget: {
        under5k: 'Menys de 5k€',
        '5k10k': '5k€ - 10k€',
        '10k25k': '10k€ - 25k€',
        '25k50k': '25k€ - 50k€',
        over50k: 'Més de 50k€'
      },
      availabilityOptions: {
        immediate: 'Immediat',
        '1month': 'En 1 mes',
        '3months': 'En 3 mesos',
        flexible: 'Flexible'
      }
    },

    // Footer
    footer: {
      description: 'Construeixo productes que s\'entenen i s\'usen. Enginyer de programari i fundador amb experiència real en construcció.',
      quickLinks: 'Enllaços Ràpids',
      connect: 'Connecta\'m amb mi',
      copyright: '© 2025 Tony Rodríguez. Tots els drets reservats.'
    }
  }
}
