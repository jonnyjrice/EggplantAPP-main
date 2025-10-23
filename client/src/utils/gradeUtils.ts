/**
 * Utility functions for grade calculations and display
 */

export interface GradeData {
  currentGrade: string
  gradePoints: number
}

/**
 * Convert percentage points to letter grade
 */
export const calculateLetterGrade = (points: number): string => {
  if (points >= 97) return 'A+'
  if (points >= 93) return 'A'
  if (points >= 90) return 'A-'
  if (points >= 87) return 'B+'
  if (points >= 83) return 'B'
  if (points >= 80) return 'B-'
  if (points >= 77) return 'C+'
  if (points >= 73) return 'C'
  if (points >= 70) return 'C-'
  if (points >= 67) return 'D+'
  if (points >= 63) return 'D'
  if (points >= 60) return 'D-'
  return 'F'
}

/**
 * Get color for grade display
 */
export const getGradeColor = (grade: string): string => {
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

/**
 * Calculate overall class grade from assignment scores
 */
export const calculateOverallGrade = (assignments: Array<{ score: number; maxPoints: number; weight?: number }>): GradeData => {
  if (assignments.length === 0) {
    return { currentGrade: 'N/A', gradePoints: 0 }
  }

  // Calculate weighted average if weights are provided, otherwise simple average
  const hasWeights = assignments.some(a => a.weight !== undefined)
  
  if (hasWeights) {
    const totalWeight = assignments.reduce((sum, a) => sum + (a.weight || 0), 0)
    const weightedSum = assignments.reduce((sum, a) => {
      const percentage = (a.score / a.maxPoints) * 100
      return sum + (percentage * (a.weight || 0))
    }, 0)
    
    const gradePoints = totalWeight > 0 ? weightedSum / totalWeight : 0
    return {
      currentGrade: calculateLetterGrade(gradePoints),
      gradePoints: Math.round(gradePoints * 10) / 10
    }
  } else {
    // Simple average
    const totalPoints = assignments.reduce((sum, a) => sum + a.score, 0)
    const maxTotalPoints = assignments.reduce((sum, a) => sum + a.maxPoints, 0)
    const gradePoints = maxTotalPoints > 0 ? (totalPoints / maxTotalPoints) * 100 : 0
    
    return {
      currentGrade: calculateLetterGrade(gradePoints),
      gradePoints: Math.round(gradePoints * 10) / 10
    }
  }
}
