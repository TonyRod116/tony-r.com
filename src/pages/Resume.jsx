import { motion } from 'framer-motion'
import { Download, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react'
import { profile } from '../data/profile'

export default function Resume() {
  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation or link to actual PDF
    window.open('/Tony-CV.pdf', '_blank')
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-transparent to-blue-50 dark:from-primary-900/20 dark:via-transparent dark:to-blue-900/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Resume</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A printable version of my experience, skills and professional achievements.
            </p>
            <button onClick={handleDownloadPDF} className="btn-primary mt-6">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </motion.div>
        </div>
      </section>

      {/* Resume Content */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 print:p-0">
              {/* Header */}
              <div className="text-center mb-8 print:mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white print:text-2xl mb-2">{profile.name}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 print:text-lg mb-4">{profile.title}</p>
                
                {/* Contact Info */}
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-300 print:gap-2">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Github className="h-4 w-4" />
                    <span>github.com/TonyRod116</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Linkedin className="h-4 w-4" />
                    <span>linkedin.com/in/tony-rodriguez</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 print:text-lg">Perfil profesional</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed print:text-sm">
                  {profile.bio.es} Disfruto mirando más allá de lo obvio, entendiendo lo que la gente 
                  realmente necesita, y convirtiendo eso en soluciones innovadoras y prácticas. 
                  Traigo curiosidad, creatividad y un espíritu colaborativo a cada proyecto.
                </p>
              </div>

              {/* Experience */}
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-lg">Experiencia profesional</h2>
                <div className="space-y-6 print:space-y-4">
                  {profile.experience.map((exp, index) => (
                    <div key={exp.company} className="border-l-2 border-primary-200 dark:border-primary-800 pl-4 print:pl-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg print:text-base text-gray-900 dark:text-white">{exp.position}</h3>
                          <p className="text-primary-600 font-medium">{exp.company}</p>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 w-fit mt-1 sm:mt-0 print:text-xs">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 print:text-sm">{exp.description}</p>
                      {exp.stack && exp.stack.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2 print:text-sm">Tecnologías utilizadas:</h4>
                          <div className="flex flex-wrap gap-1">
                            {exp.stack.map((tech) => (
                              <span key={tech} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 print:text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-lg">Habilidades técnicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 print:text-sm">Lenguajes de programación</h3>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.languages.map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 print:text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 print:text-sm">Frontend</h3>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.frontend.map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 print:text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 print:text-sm">Backend</h3>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.backend.map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 print:text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 print:text-sm">Herramientas</h3>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.tools.map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 print:text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Soft Skills */}
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-lg">Habilidades blandas</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.soft.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300 print:text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Achievements */}
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-lg">Logros destacados</h2>
                <ul className="space-y-2 print:text-sm">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">Proyecto final TradeLab reconocido como uno de los mejores por el instructor de General Assembly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">3 de 4 proyectos destacados durante el bootcamp de Software Engineering</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">6 años de experiencia liderando equipos y gestionando proyectos complejos en TotalHomes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">Fundador exitoso con reputación excepcional en el sector de la construcción</span>
                  </li>
                </ul>
              </div>

              {/* Education */}
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-lg">Formación</h2>
                <div className="space-y-4 print:space-y-2">
                  <div className="border-l-2 border-primary-200 dark:border-primary-800 pl-4 print:pl-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold print:text-sm text-gray-900 dark:text-white">Software Engineering Bootcamp</h3>
                        <p className="text-primary-600 font-medium print:text-sm">General Assembly</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 w-fit mt-1 sm:mt-0 print:text-xs">
                        Jun 2025 - Sep 2025
                      </span>
                    </div>
                  </div>
                  <div className="border-l-2 border-primary-200 dark:border-primary-800 pl-4 print:pl-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold print:text-sm text-gray-900 dark:text-white">Certified Passive House Consultant</h3>
                        <p className="text-primary-600 font-medium print:text-sm">Energiehaus Arquitectos / PassivHaus Institut</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 w-fit mt-1 sm:mt-0 print:text-xs">
                        2019 - 2020
                      </span>
                    </div>
                  </div>
                  <div className="border-l-2 border-primary-200 dark:border-primary-800 pl-4 print:pl-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold print:text-sm text-gray-900 dark:text-white">Arquitectura (cursado)</h3>
                        <p className="text-primary-600 font-medium print:text-sm">Universitat Internacional de Catalunya</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 w-fit mt-1 sm:mt-0 print:text-xs">
                        2001 - 2003
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-lg">Idiomas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
                  <div>
                    <p className="font-medium print:text-sm text-gray-900 dark:text-white">Español</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm print:text-xs">Nativo</p>
                  </div>
                  <div>
                    <p className="font-medium print:text-sm text-gray-900 dark:text-white">Inglés</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm print:text-xs">Avanzado</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-300 print:text-xs">
                <p>© 2025 Tony Rodríguez - Todos los derechos reservados</p>
                <p>tony-r.com | tony.rod.bcn@gmail.com</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
