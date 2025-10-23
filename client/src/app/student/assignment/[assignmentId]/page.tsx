'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Assignment {
  assignmentId: number
  title: string
  dueDate: string | null
  type: string
  maxPoints: number | null
  description: string | null
}

export default function StudentAssignmentPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const classId = searchParams.get('classId')
  const assignmentId = params.assignmentId as string
  
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`http://localhost:3001/pl/api/v1/course/${classId}/assignments/${assignmentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setAssignment(data)
      } catch (error) {
        console.error('Error fetching assignment:', error)
        setError('Failed to load assignment. Please try again.')
        
        // For development: show mock data when server is not available
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.log('PrairieLearn server not available, showing mock data for development')
          setAssignment({
            assignmentId: parseInt(assignmentId),
            title: `Assignment ${assignmentId}`,
            dueDate: '2024-01-15T23:59:59Z',
            type: 'Quiz',
            maxPoints: 100,
            description: 'Complete this assignment to test your knowledge.'
          })
          setError(null)
        }
      } finally {
        setLoading(false)
      }
    }

    if (classId) {
      fetchAssignment()
    }
  }, [classId, assignmentId])

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return 'No due date'
    
    try {
      const date = new Date(dueDate)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const getAssignmentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'quiz':
        return '📝'
      case 'exam':
        return '📊'
      case 'homework':
        return '📋'
      case 'lab':
        return '🔬'
      case 'project':
        return '🎯'
      default:
        return '📄'
    }
  }

  const handleBackClick = () => {
    router.push(`/student/class/${classId}`)
  }

  if (loading) {
    return (
      <div className="assignment-page">
        <div className="assignment-header">
          <button className="back-button" onClick={handleBackClick}>
            ← Back to Class
          </button>
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading assignment...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="assignment-page">
        <div className="assignment-header">
          <button className="back-button" onClick={handleBackClick}>
            ← Back to Class
          </button>
          <div className="error-state">
            <p>❌ {error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="assignment-page">
        <div className="assignment-header">
          <button className="back-button" onClick={handleBackClick}>
            ← Back to Class
          </button>
          <div className="error-state">
            <p>Assignment not found</p>
          </div>
        </div>
      </div>
    )
  }

  // Construct PrairieLearn URL
  // This would typically be provided by the PrairieLearn API or configuration
  const prairieLearnUrl = `http://localhost:3001/pl/course/${classId}/assignment/${assignmentId}`

  return (
    <div className="assignment-page">
      <div className="assignment-header">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Class
        </button>
        <div className="assignment-info">
          <div className="assignment-title-section">
            <div className="assignment-icon">
              {getAssignmentIcon(assignment.type)}
            </div>
            <div className="assignment-details">
              <h1 className="assignment-title">{assignment.title}</h1>
              <div className="assignment-meta">
                <span className="assignment-type">{assignment.type}</span>
                {assignment.maxPoints && (
                  <span className="assignment-points">{assignment.maxPoints} points</span>
                )}
                <span className="assignment-due-date">
                  Due: {formatDueDate(assignment.dueDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="assignment-content">
        <div className="assignment-description">
          {assignment.description && (
            <p>{assignment.description}</p>
          )}
        </div>
        
        <div className="assignment-iframe-container">
          <iframe
            src={prairieLearnUrl}
            className="assignment-iframe"
            title={`${assignment.title} - PrairieLearn Assessment`}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}
