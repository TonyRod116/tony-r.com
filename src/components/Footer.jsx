import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail, Instagram, Facebook, Heart } from 'lucide-react'
import { profile } from '../data/profile'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TR</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">Tony Rodríguez</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md">
              I build products that are understood and used. Software engineer and founder with real construction experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Quick Links</h3>
            <nav className="space-y-2">
              <Link
                to="/about"
                className="block text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
              >
                About
              </Link>
              <Link
                to="/projects"
                className="block text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
              >
                Projects
              </Link>
              <Link
                to="/resume"
                className="block text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
              >
                Resume
              </Link>
              <Link
                to="/contact"
                className="block text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Connect with me</h3>
            <div className="flex space-x-4">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </a>
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </a>
              <a
                href={profile.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </a>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>{profile.location}</p>
              <p>{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            © 2025 Tony Rodríguez. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
