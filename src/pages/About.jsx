import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Code, Users, Zap, Target, Lightbulb, Heart, Cpu, Brain, TrendingUp, Shield, BookOpen } from 'lucide-react'
import { profile } from '../data/profile'
import profileImage from '../assets/pic2.jpeg'

export default function About() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-transparent to-blue-50 dark:from-primary-900/20 dark:via-transparent dark:to-blue-900/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">About Me</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I'm a Full Stack Software Engineer with a strong foundation in JavaScript, React, Node.js, Python, Django, MongoDB, and PostgreSQL, and experience deploying applications on Netlify, Heroku, and Render. My journey into tech came after years of running client-centered businesses in real estate and construction, where I learned how to turn ideas into practical solutions that people actually use.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                At General Assembly's immersive Software Engineering Bootcamp, I delivered four complete applications. In each project, I went beyond the requirements, adding creative and product-oriented features. My final project, TradeLab, a trading strategy backtesting platform, was recognized by my instructor as one of the best projects he had ever seen in his years of teaching.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                What drives me most is solving problems with creativity and precision. I bring an entrepreneurial mindset, a product-driven perspective, and resilience built through real-world challenges. Whether working solo or in teams, I focus on creating scalable, user-friendly products that deliver real value.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I'm excited to keep growing as an engineer while contributing to projects that improve the way people live and work.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/20 dark:to-blue-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-48 h-48 rounded-full overflow-hidden mx-auto border-4 border-white shadow-lg">
                      <img 
                        src={profileImage} 
                        alt="Tony Rodríguez" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Tony Rodríguez</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technical Expertise */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Technical Expertise</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              I bring expertise in modern technologies and frameworks, with experience deploying applications across multiple platforms.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.languages.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frameworks & Libraries</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.frameworks.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.tools.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.soft.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What I Bring */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What I Bring</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Beyond technical ability, I contribute with a growth mindset, creative problem-solving, and a product-driven perspective. Qualities shaped by my years as an entrepreneur.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <Cpu className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Technical Stack</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Experience with JavaScript, React, Node.js, Python, Django, MongoDB, PostgreSQL
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <Brain className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Problem-Solving Mindset</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Creative and analytical approach to overcoming technical challenges
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Product Thinking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ability to design features that go beyond requirements and create real value
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Collaboration & Leadership</h3>
              <p className="text-gray-600 dark:text-gray-300">
                15+ years leading teams and working effectively in Agile/Scrum environments
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Resilience & Adaptability</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Thrived in high-pressure situations, from entrepreneurship to fast-paced bootcamp projects
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Continuous Learning</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Strong growth mindset, always exploring new tools and frameworks
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What I'm Looking For */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">What I'm Looking For</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              I am excited to join teams where I can combine technical depth with strategic thinking, helping to build scalable products that make a real impact while continuing to grow as a developer.
            </p>
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                "I bring expertise in JavaScript, React, Node.js, Python, Django, MongoDB, PostgreSQL, and REST APIs, with experience deploying applications on Netlify, Heroku, and Render."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-20 lg:py-24 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl font-bold text-white">Ready to work together?</h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              If you have a project in mind or just want to chat about technology, 
              I'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Send message
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors"
              >
                View GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
