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
    'math101': { title: 'Math 101', subtitle: 'Calculus I', icon: '🧮', instructor: 'Dr. Smith', term: '2024-2025', currentGrade: 'A-', gradePoints: 91.5 },
    'science201': { title: 'Science 201', subtitle: 'General Chemistry', icon: '🔬', instructor: 'Prof. Johnson', term: '2024-2025', currentGrade: 'B+', gradePoints: 87.2 },
    'english101': { title: 'English 101', subtitle: 'Composition', icon: '📚', instructor: 'Dr. Williams', term: '2023-2024', currentGrade: 'A', gradePoints: 94.0 },
    'history150': { title: 'History 150', subtitle: 'World History', icon: '🌍', instructor: 'Prof. Brown', term: '2024-2025', currentGrade: 'B', gradePoints: 83.7 },
    'physics201': { title: 'Physics 201', subtitle: 'Mechanics', icon: '⚡', instructor: 'Dr. Davis', term: '2023-2024', currentGrade: 'A-', gradePoints: 90.1 },
    'art101': { title: 'Art 101', subtitle: 'Drawing Fundamentals', icon: '🎨', instructor: 'Ms. Wilson', term: '2024-2025', currentGrade: 'A+', gradePoints: 97.3 },
    'music101': { title: 'Music 101', subtitle: 'Music Theory', icon: '🎵', instructor: 'Mr. Garcia', term: '2024-2025', currentGrade: 'B+', gradePoints: 88.9 },
    'biology201': { title: 'Biology 201', subtitle: 'Cell Biology', icon: '🧬', instructor: 'Dr. Martinez', term: '2023-2024', currentGrade: 'A', gradePoints: 92.8 },
    'psychology101': { title: 'Psychology 101', subtitle: 'Introduction to Psychology', icon: '🧠', instructor: 'Prof. Anderson', term: '2024-2025', currentGrade: 'A-', gradePoints: 89.4 },
    'computer101': { title: 'Computer Science 101', subtitle: 'Programming Fundamentals', icon: '💻', instructor: 'Dr. Taylor', term: '2024-2025', currentGrade: 'A+', gradePoints: 96.1 }
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

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return '#10b981' // green-500
      case 'A-':
        return '#34d399' // green-400
      case 'B+':
        return '#84cc16' // lime-500
      case 'B':
        return '#eab308' // yellow-500
      case 'B-':
        return '#f59e0b' // amber-500
      case 'C+':
        return '#f97316' // orange-500
      case 'C':
        return '#ef4444' // red-500
      case 'C-':
        return '#dc2626' // red-600
      case 'D+':
      case 'D':
      case 'D-':
        return '#b91c1c' // red-700
      case 'F':
        return '#991b1b' // red-800
      default:
        return '#6b7280' // gray-500
    }
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
              <div className="class-title-section">
                <h2>{currentClass.title}</h2>
                <div className="class-grade-large" style={{ color: getGradeColor(currentClass.currentGrade) }}>
                  {currentClass.currentGrade}
                </div>
              </div>
              <p className="class-subtitle">{currentClass.subtitle}</p>
              <div className="class-meta">
                <span className="class-instructor">Instructor: {currentClass.instructor}</span>
                <span className="class-term">{currentClass.term}</span>
                <span className="class-grade-points">{currentClass.gradePoints}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Class Content */}
        <div className="student-class-content">
          {/* Assignments Section (clickable like other class sections) */}
          <div className="class-section clickable-section">
            <div className="section-content">
              <AssignmentList courseId={classId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
