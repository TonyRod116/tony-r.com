import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Replace with your actual Google Analytics ID
const GA_TRACKING_ID = 'G-5EC5QCFG7L' // Your actual GA4 ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    })
  }
}

// Track page views
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Google Analytics component
export default function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    // Initialize Google Analytics for all visitors
    initGA()
  }, [])

  useEffect(() => {
    // Track page views when route changes for all visitors
    trackPageView(location.pathname + location.search)
  }, [location])

  return null // This component doesn't render anything
}

// Helper functions for tracking specific events
export const trackContactForm = () => {
  trackEvent('submit', 'contact', 'contact_form')
}

export const trackProjectView = (projectName) => {
  trackEvent('view', 'project', projectName)
}

export const trackResumeDownload = () => {
  trackEvent('download', 'resume', 'cv_download')
}

export const trackSocialClick = (platform) => {
  trackEvent('click', 'social', platform)
}
