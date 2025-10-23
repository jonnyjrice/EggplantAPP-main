'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

export default function StudentHomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTerm, setSelectedTerm] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleClassClick = (classId: string) => {
    router.push(`/student/class/${classId}`)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleTermFilter = (term: string) => {
    setSelectedTerm(term)
    setIsDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const getTermDisplayName = (term: string) => {
    switch (term) {
      case 'all':
        return 'All School Years'
      case '2024-2025':
        return '2024-2025'
      case '2023-2024':
        return '2023-2024'
      default:
        return 'All School Years'
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Mock enrolled classes data for student view
  const enrolledClasses = [
    { id: 'math101', title: 'Math 101', subtitle: 'Calculus I', icon: '🧮', instructor: 'Dr. Smith', term: '2024-2025' },
    { id: 'science201', title: 'Science 201', subtitle: 'General Chemistry', icon: '🔬', instructor: 'Prof. Johnson', term: '2024-2025' },
    { id: 'english101', title: 'English 101', subtitle: 'Composition', icon: '📚', instructor: 'Dr. Williams', term: '2023-2024' },
    { id: 'history150', title: 'History 150', subtitle: 'World History', icon: '🌍', instructor: 'Prof. Brown', term: '2024-2025' },
    { id: 'physics201', title: 'Physics 201', subtitle: 'Mechanics', icon: '⚡', instructor: 'Dr. Davis', term: '2023-2024' },
    { id: 'art101', title: 'Art 101', subtitle: 'Drawing Fundamentals', icon: '🎨', instructor: 'Ms. Wilson', term: '2024-2025' },
    { id: 'music101', title: 'Music 101', subtitle: 'Music Theory', icon: '🎵', instructor: 'Mr. Garcia', term: '2024-2025' },
    { id: 'biology201', title: 'Biology 201', subtitle: 'Cell Biology', icon: '🧬', instructor: 'Dr. Martinez', term: '2023-2024' },
    { id: 'psychology101', title: 'Psychology 101', subtitle: 'Introduction to Psychology', icon: '🧠', instructor: 'Prof. Anderson', term: '2024-2025' },
    { id: 'computer101', title: 'Computer Science 101', subtitle: 'Programming Fundamentals', icon: '💻', instructor: 'Dr. Taylor', term: '2024-2025' }
  ]

  // Filter classes based on search and term
  const filteredClasses = enrolledClasses.filter(classItem => {
    const matchesTerm = selectedTerm === 'all' || classItem.term === selectedTerm
    
    if (!searchQuery.trim()) {
      return matchesTerm
    }
    
    const searchLower = searchQuery.toLowerCase()
    const titleMatch = classItem.title.toLowerCase().includes(searchLower)
    const subtitleMatch = classItem.subtitle.toLowerCase().includes(searchLower)
    const instructorMatch = classItem.instructor.toLowerCase().includes(searchLower)
    
    return matchesTerm && (titleMatch || subtitleMatch || instructorMatch)
  })

  return (
    <div className="page-content">
      <div className="student-dashboard-layout">
        {/* Left Activity Feed - Student Version */}
        <div className="activity-feed">
          <div className="activity-header">
            <h3>My Assignments</h3>
          </div>
          <div className="activity-content">
            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-details">
                <div className="activity-title">Math 101 - Problem Set 3</div>
                <div className="activity-subtitle">Due Tomorrow</div>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🎯</div>
              <div className="activity-details">
                <div className="activity-title">Science 201 - Lab Report</div>
                <div className="activity-subtitle">Due Next Week</div>
                <div className="activity-time">4 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-details">
                <div className="activity-title">History 150 - Quiz Graded</div>
                <div className="activity-subtitle">Score: 85/100</div>
                <div className="activity-time">1 day ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📋</div>
              <div className="activity-details">
                <div className="activity-title">English 101 - Midterm Exam</div>
                <div className="activity-subtitle">Scheduled for Friday</div>
                <div className="activity-time">2 days ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🔔</div>
              <div className="activity-details">
                <div className="activity-title">New Assignment Posted</div>
                <div className="activity-subtitle">Physics 201 - Homework 5</div>
                <div className="activity-time">3 days ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-details">
                <div className="activity-title">Grade Updated</div>
                <div className="activity-subtitle">Art 101 - Project Grade</div>
                <div className="activity-time">1 week ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Classes Section - Student Version */}
        <div className="classes-main">
          <div className="classes-header">
            <h2>My Enrolled Classes</h2>
            <div className="classes-controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
              <div className="filter-container">
                <div className="dropdown" ref={dropdownRef}>
                  <button className="dropdown-btn" onClick={toggleDropdown}>
                    <span>{getTermDisplayName(selectedTerm)}</span>
                    <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <button
                        className={`dropdown-item ${selectedTerm === 'all' ? 'active' : ''}`}
                        onClick={() => handleTermFilter('all')}
                      >
                        All School Years
                      </button>
                      <button
                        className={`dropdown-item ${selectedTerm === '2024-2025' ? 'active' : ''}`}
                        onClick={() => handleTermFilter('2024-2025')}
                      >
                        2024-2025
                      </button>
                      <button
                        className={`dropdown-item ${selectedTerm === '2023-2024' ? 'active' : ''}`}
                        onClick={() => handleTermFilter('2023-2024')}
                      >
                        2023-2024
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="classes-content">
            <div className="classes-grid">
              {filteredClasses.map((classItem) => (
                <div key={classItem.id} className="class-card student-class-card" onClick={() => handleClassClick(classItem.id)}>
                  <div className="class-content">
                    <div className="class-icon">{classItem.icon}</div>
                    <div className="class-title">{classItem.title}</div>
                    <div className="class-subtitle">{classItem.subtitle}</div>
                    <div className="class-instructor">Instructor: {classItem.instructor}</div>
                    <div className="class-term">{classItem.term}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
