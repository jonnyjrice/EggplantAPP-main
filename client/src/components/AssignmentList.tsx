'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Assignment {
  assignmentId: number
  title: string
  dueDate: string | null
  type: string
  maxPoints: number | null
  description: string | null
}

interface AssignmentListProps {
  courseId: string
}

export default function AssignmentList({ courseId }: AssignmentListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`http://localhost:3001/pl/api/v1/course/${courseId}/assignments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setAssignments(data)
      } catch (error) {
        console.error('Error fetching assignments:', error)
        setError('Failed to load assignments. Please try again.')
        
        // For development: show mock data when server is not available
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.log('PrairieLearn server not available, showing mock data for development')
          setAssignments([
            {
              assignmentId: 1,
              title: 'Week 3: Photosynthesis Quiz',
              dueDate: '2024-01-15T23:59:59Z',
              type: 'Quiz',
              maxPoints: 100,
              description: 'Complete the photosynthesis quiz covering light-dependent and light-independent reactions.'
            },
            {
              assignmentId: 2,
              title: 'Midterm Exam',
              dueDate: '2024-02-01T23:59:59Z',
              type: 'Exam',
              maxPoints: 200,
              description: 'Comprehensive midterm covering chapters 1-5 of the textbook.'
            },
            {
              assignmentId: 3,
              title: 'Lab Report: Plant Growth',
              dueDate: '2024-01-25T23:59:59Z',
              type: 'Lab',
              maxPoints: 150,
              description: 'Write a detailed lab report analyzing the effects of light on plant growth.'
            }
          ])
          setError(null)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [courseId])

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

  const handleAssignmentClick = (assignmentId: number) => {
    // Navigate to assignment page
    router.push(`/student/assignment/${assignmentId}?classId=${courseId}`)
  }

  if (loading) {
    return (
      <div className="assignment-list">
        <div className="assignment-list-header">
          <h3>Assignments</h3>
        </div>
        <div className="assignment-list-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading assignments...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="assignment-list">
        <div className="assignment-list-header">
          <h3>Assignments</h3>
        </div>
        <div className="assignment-list-content">
          <div className="error-state">
            <p>❌ {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="assignment-list">
      <div className="assignment-list-header">
        <h3>Assignments</h3>
        <span className="assignment-count">{assignments.length} assignments</span>
      </div>
      <div className="assignment-list-content">
        {assignments.length === 0 ? (
          <div className="empty-state">
            <p>No assignments available for this course.</p>
          </div>
        ) : (
          <div className="assignments-grid">
            {assignments.map((assignment) => (
              <div
                key={assignment.assignmentId}
                className="assignment-card"
                onClick={() => handleAssignmentClick(assignment.assignmentId)}
              >
                <div className="assignment-card-header">
                  <div className="assignment-icon">
                    {getAssignmentIcon(assignment.type)}
                  </div>
                  <div className="assignment-type">{assignment.type}</div>
                </div>
                <div className="assignment-card-body">
                  <h4 className="assignment-title">{assignment.title}</h4>
                  {assignment.description && (
                    <p className="assignment-description">
                      {assignment.description.length > 100 
                        ? `${assignment.description.substring(0, 100)}...`
                        : assignment.description
                      }
                    </p>
                  )}
                </div>
                <div className="assignment-card-footer">
                  <div className="assignment-due-date">
                    <span className="due-label">Due:</span>
                    <span className="due-value">{formatDueDate(assignment.dueDate)}</span>
                  </div>
                  {assignment.maxPoints && (
                    <div className="assignment-points">
                      <span className="points-label">Points:</span>
                      <span className="points-value">{assignment.maxPoints}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
