import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import TotalHomesGallery from '../components/TotalHomesGallery'

export default function Experience() {
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
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Experience</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A journey from traditional construction to modern software development. 
              Each experience has contributed to my unique vision of how to build products that really work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {profile.experience.map((exp, index) => (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Timeline line */}
                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
                    
                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{exp.position}</h3>
                            <p className="text-primary-600 font-medium">{exp.company}</p>
                          </div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 w-fit">
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                          {exp.description}
                        </p>
                        {exp.stack && exp.stack.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Technologies used:</h4>
                            <div className="flex flex-wrap gap-2">
                              {exp.stack.map((tech) => (
                                <span key={tech} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white dark:border-gray-900" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Key Achievements</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Highlight moments from my career that demonstrate my ability to 
              deliver exceptional results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-3">
                  <span className="text-2xl mr-2">🏆</span>
                  Outstanding GA Project
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  My final project TradeLab was recognized by the instructor as one of the best 
                  projects he had seen in his years of teaching at General Assembly.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-3">
                  <span className="text-2xl mr-2">🚀</span>
                  Successful Founder
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Founded and led TotalHomes for 6 years, delivering high-quality projects 
                  and maintaining an exceptional reputation with clients.
                </p>
                <a 
                  href="https://instagram.com/totalhomes.es" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  <span className="mr-2">📸</span>
                  View our work on Instagram
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-3">
                  <span className="text-2xl mr-2">⚡</span>
                  Successful Transition
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete transition from traditional construction to software development, 
                  applying my experience in project management and leadership.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TotalHomes Gallery */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">TotalHomes Portfolio</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A showcase of our construction and renovation projects. 
              Each project represents our commitment to quality and attention to detail.
            </p>
          </motion.div>

          <TotalHomesGallery />
        </div>
      </section>
    </div>
  )
}
