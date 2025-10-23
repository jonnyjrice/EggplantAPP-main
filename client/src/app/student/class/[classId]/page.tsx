'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import AssignmentList from '@/components/AssignmentList'

export default function StudentClassPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.classId as string

  // Mock class data for student view
  const classData = {
    'math101': { title: 'Math 101', subtitle: 'Calculus I', icon: '🧮', instructor: 'Dr. Smith', term: '2024-2025' },
    'science201': { title: 'Science 201', subtitle: 'General Chemistry', icon: '🔬', instructor: 'Prof. Johnson', term: '2024-2025' },
    'english101': { title: 'English 101', subtitle: 'Composition', icon: '📚', instructor: 'Dr. Williams', term: '2023-2024' },
    'history150': { title: 'History 150', subtitle: 'World History', icon: '🌍', instructor: 'Prof. Brown', term: '2024-2025' },
    'physics201': { title: 'Physics 201', subtitle: 'Mechanics', icon: '⚡', instructor: 'Dr. Davis', term: '2023-2024' },
    'art101': { title: 'Art 101', subtitle: 'Drawing Fundamentals', icon: '🎨', instructor: 'Ms. Wilson', term: '2024-2025' },
    'music101': { title: 'Music 101', subtitle: 'Music Theory', icon: '🎵', instructor: 'Mr. Garcia', term: '2024-2025' },
    'biology201': { title: 'Biology 201', subtitle: 'Cell Biology', icon: '🧬', instructor: 'Dr. Martinez', term: '2023-2024' },
    'psychology101': { title: 'Psychology 101', subtitle: 'Introduction to Psychology', icon: '🧠', instructor: 'Prof. Anderson', term: '2024-2025' },
    'computer101': { title: 'Computer Science 101', subtitle: 'Programming Fundamentals', icon: '💻', instructor: 'Dr. Taylor', term: '2024-2025' }
  }

  const currentClass = classData[classId as keyof typeof classData]

  if (!currentClass) {
    return (
      <div className="student-class-page">
        <div className="error-state">
          <h2>Class not found</h2>
          <p>The class you're looking for doesn't exist.</p>
          <button className="back-button" onClick={() => router.push('/student')}>
            ← Back to My Classes
          </button>
        </div>
      </div>
    )
  }

  const handleBackToStudentHome = () => {
    router.push('/student')
  }

  return (
    <div className="student-class-page">
      <div className="student-class-container">
        {/* Class Header */}
        <div className="student-class-header">
          <div className="class-info">
            <button className="back-button" onClick={handleBackToStudentHome}>
              ← Back to My Classes
            </button>
            <div className="class-icon-large">{currentClass.icon}</div>
            <div className="class-details">
              <h2>{currentClass.title}</h2>
              <p className="class-subtitle">{currentClass.subtitle}</p>
              <div className="class-meta">
                <span className="class-instructor">Instructor: {currentClass.instructor}</span>
                <span className="class-term">{currentClass.term}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Class Content */}
        <div className="student-class-content">
          {/* Assignments Section */}
          <div className="assignments-section">
            <AssignmentList courseId={classId} />
          </div>
        </div>
      </div>
    </div>
  )
}
