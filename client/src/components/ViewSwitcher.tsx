'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type ViewMode = 'teacher' | 'student'

export default function ViewSwitcher() {
  const [currentView, setCurrentView] = useState<ViewMode>('teacher')
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load saved view preference from localStorage
  useEffect(() => {
    if (isClient) {
      const savedView = localStorage.getItem('eggplant-view-mode') as ViewMode
      if (savedView && (savedView === 'teacher' || savedView === 'student')) {
        setCurrentView(savedView)
      }
    }
  }, [isClient])

  // Update view mode and save to localStorage
  const handleViewChange = (newView: ViewMode) => {
    setCurrentView(newView)
    
    if (isClient) {
      localStorage.setItem('eggplant-view-mode', newView)
    }
    
    // Navigate to the appropriate home page based on the selected view
    if (newView === 'student') {
      router.push('/student')
    } else if (newView === 'teacher') {
      router.push('/')
    }
  }

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="view-switcher">
        <div className="view-switcher-container">
          <button className="view-switcher-btn active">
            <span className="view-icon">👨‍🏫</span>
            <span className="view-label">Teacher</span>
          </button>
          <button className="view-switcher-btn">
            <span className="view-icon">🎓</span>
            <span className="view-label">Student</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="view-switcher">
      <div className="view-switcher-container">
        <button
          className={`view-switcher-btn ${currentView === 'teacher' ? 'active' : ''}`}
          onClick={() => handleViewChange('teacher')}
        >
          <span className="view-icon">👨‍🏫</span>
          <span className="view-label">Teacher</span>
        </button>
        <button
          className={`view-switcher-btn ${currentView === 'student' ? 'active' : ''}`}
          onClick={() => handleViewChange('student')}
        >
          <span className="view-icon">🎓</span>
          <span className="view-label">Student</span>
        </button>
      </div>
    </div>
  )
}

