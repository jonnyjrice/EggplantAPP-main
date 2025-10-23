'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type ViewMode = 'teacher' | 'student'

export default function ViewSwitcher() {
  const [currentView, setCurrentView] = useState<ViewMode>('teacher')
  const router = useRouter()
  const pathname = usePathname()

  // Load saved view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('eggplant-view-mode') as ViewMode
    if (savedView && (savedView === 'teacher' || savedView === 'student')) {
      setCurrentView(savedView)
    }
  }, [])

  // Update view mode and save to localStorage
  const handleViewChange = (newView: ViewMode) => {
    setCurrentView(newView)
    localStorage.setItem('eggplant-view-mode', newView)
    
    // If we're in a teacher-specific route and switching to student view, go to student home
    if (newView === 'student' && (pathname.includes('/lesson-plan') || pathname.includes('/generate-project') || pathname.includes('/multiple-choice-quiz') || pathname.includes('/open-ended-quiz'))) {
      router.push('/student')
    }
    // If we're in a student-specific route and switching to teacher view, go to teacher home
    else if (newView === 'teacher' && pathname.startsWith('/student')) {
      router.push('/')
    }
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
