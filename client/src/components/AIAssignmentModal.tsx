'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface AIAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
}

interface FormData {
  assignmentTitle: string
  topicDescription: string
  numQuestions: number
  questionType: 'MultipleChoice'
}

interface Question {
  questionText: string
  options: string[]
  correctAnswerIndex: number
}

export default function AIAssignmentModal({ isOpen, onClose, courseId }: AIAssignmentModalProps) {
  const [formData, setFormData] = useState<FormData>({
    assignmentTitle: '',
    topicDescription: '',
    numQuestions: 5,
    questionType: 'MultipleChoice'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])
  const [showQuestions, setShowQuestions] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numQuestions' ? parseInt(value) || 0 : value
    }))
  }

  const handleQuestionChange = (questionIndex: number, field: 'questionText' | 'options' | 'correctAnswerIndex', value: string | string[] | number) => {
    setGeneratedQuestions(prev => prev.map((question, index) => {
      if (index === questionIndex) {
        if (field === 'options' && Array.isArray(value)) {
          return { ...question, options: value }
        } else if (field === 'correctAnswerIndex' && typeof value === 'number') {
          return { ...question, correctAnswerIndex: value }
        } else if (field === 'questionText' && typeof value === 'string') {
          return { ...question, questionText: value }
        }
      }
      return question
    }))
  }

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setGeneratedQuestions(prev => prev.map((question, index) => {
      if (index === questionIndex) {
        const newOptions = [...question.options]
        newOptions[optionIndex] = value
        return { ...question, options: newOptions }
      }
      return question
    }))
  }

  const handleSaveAssignment = async () => {
    setIsSaving(true)
    
    try {
      // Gather current data from all editable fields
      const assignmentData = {
        assignmentTitle: formData.assignmentTitle,
        questions: generatedQuestions.map(question => ({
          questionText: question.questionText,
          options: question.options,
          correctAnswerIndex: question.correctAnswerIndex
        }))
      }

      console.log('Saving assignment with data:', assignmentData)

      // Send POST request to save-assignment endpoint
      const response = await fetch(`http://localhost:3001/pl/api/v1/course/${courseId}/save-assignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Assignment saved successfully:', result)
      
      // Show success message
      alert('Assignment saved!')
      
      // Close modal and reset form
      handleReset()
      onClose()
      
    } catch (error) {
      console.error('Error saving assignment:', error)
      
      // For development: show mock success when server is not available
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.log('PrairieLearn server not available, showing mock success for development')
        alert('Assignment saved! (Mock response - server not available)')
        handleReset()
        onClose()
        return
      }
      
      alert('Error saving assignment. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setFormData({
      assignmentTitle: '',
      topicDescription: '',
      numQuestions: 5,
      questionType: 'MultipleChoice'
    })
    setGeneratedQuestions([])
    setShowQuestions(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Make API call to PrairieLearn backend
      const response = await fetch(`http://localhost:3001/pl/api/v1/course/${courseId}/generate-assignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('AI Assignment Response:', data)
      
      // Parse the questions from the response
      if (data.questions && Array.isArray(data.questions)) {
        setGeneratedQuestions(data.questions)
        setShowQuestions(true)
      } else {
        throw new Error('Invalid response format: questions array not found')
      }
    } catch (error) {
      console.error('Error generating assignment:', error)
      
      // For development: show mock response when server is not available
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.log('PrairieLearn server not available, showing mock response for development')
        const mockResponse = {
          questions: [
            {
              questionText: `What is the primary pigment used in ${formData.topicDescription.toLowerCase()}?`,
              options: ['Hemoglobin', 'Melanin', 'Chlorophyll', 'Carotene'],
              correctAnswerIndex: 2
            },
            {
              questionText: `Where do the light-dependent reactions occur in ${formData.topicDescription.toLowerCase()}?`,
              options: ['In the stroma', 'In the thylakoid membrane', 'In the cytoplasm', 'In the mitochondria'],
              correctAnswerIndex: 1
            }
          ]
        }
        console.log('Mock AI Assignment Response:', mockResponse)
        
        // Parse the mock questions
        setGeneratedQuestions(mockResponse.questions)
        setShowQuestions(true)
        return
      }
      
      alert('Error generating assignment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                {showQuestions ? 'Review & Edit Generated Questions' : 'Create New AI Assignment'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>

            {!showQuestions ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="assignmentTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    id="assignmentTitle"
                    name="assignmentTitle"
                    value={formData.assignmentTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Week 3: Photosynthesis Quiz"
                  />
                </div>

                <div>
                  <label htmlFor="topicDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Topic Description
                  </label>
                  <textarea
                    id="topicDescription"
                    name="topicDescription"
                    value={formData.topicDescription}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., The process of photosynthesis, including the light-dependent and light-independent reactions, chlorophyll, and stomata."
                  />
                </div>

                <div>
                  <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    id="numQuestions"
                    name="numQuestions"
                    value={formData.numQuestions}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="questionType" className="block text-sm font-medium text-gray-700 mb-1">
                    Question Type
                  </label>
                  <select
                    id="questionType"
                    name="questionType"
                    value={formData.questionType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="MultipleChoice">Multiple Choice</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Generating...' : 'Generate Assignment'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Assignment Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{formData.assignmentTitle}</h3>
                  <p className="text-sm text-gray-600">{formData.topicDescription}</p>
                  <p className="text-sm text-gray-500 mt-2">{generatedQuestions.length} questions generated</p>
                </div>

                {/* Questions List */}
                <div className="space-y-6">
                  {generatedQuestions.map((question, questionIndex) => (
                    <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question {questionIndex + 1}
                        </label>
                        <textarea
                          value={question.questionText}
                          onChange={(e) => handleQuestionChange(questionIndex, 'questionText', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Answer Options
                        </label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name={`question-${questionIndex}`}
                              value={optionIndex}
                              checked={question.correctAnswerIndex === optionIndex}
                              onChange={() => handleQuestionChange(questionIndex, 'correctAnswerIndex', optionIndex)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Over
                  </button>
                  <div className="space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAssignment}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Assignment'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
