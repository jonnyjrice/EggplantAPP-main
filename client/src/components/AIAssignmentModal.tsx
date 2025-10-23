'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface AubrieAssignmentModalProps {
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

export default function AubrieAssignmentModal({ isOpen, onClose, courseId }: AubrieAssignmentModalProps) {
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
      console.log('Aubrie Assignment Response:', data)
      
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
        console.log('Mock Aubrie Assignment Response:', mockResponse)
        
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
        <Dialog.Content style={{ backgroundColor: 'white' }} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[75vw] max-h-[90vh] overflow-y-auto p-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-2xl font-bold text-gray-800">
                {showQuestions ? 'Review & Edit Generated Questions' : 'Create New Assignment with Aubrie'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full">
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>

            {!showQuestions ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="assignmentTitle" className="block text-base font-semibold text-gray-800 mb-2">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    id="assignmentTitle"
                    name="assignmentTitle"
                    value={formData.assignmentTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="e.g., Week 3: Photosynthesis Quiz"
                  />
                </div>

                <div>
                  <label htmlFor="topicDescription" className="block text-base font-semibold text-gray-800 mb-2">
                    Topic Description
                  </label>
                  <textarea
                    id="topicDescription"
                    name="topicDescription"
                    value={formData.topicDescription}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="e.g., The process of photosynthesis, including the light-dependent and light-independent reactions, chlorophyll, and stomata."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="numQuestions" className="block text-base font-semibold text-gray-800 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="questionType" className="block text-base font-semibold text-gray-800 mb-2">
                      Question Type
                    </label>
                    <select
                      id="questionType"
                      name="questionType"
                      value={formData.questionType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      <option value="MultipleChoice">Multiple Choice</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-center space-x-8 pt-6 border-t border-gray-200 mt-8">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-base font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 text-base font-semibold text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? 'Generating...' : 'Generate Assignment'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Assignment Info */}
                <div className="bg-indigo-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-indigo-900 mb-2">{formData.assignmentTitle}</h3>
                  <p className="text-base text-indigo-800">{formData.topicDescription}</p>
                  <p className="text-sm text-indigo-600 mt-3">{generatedQuestions.length} questions generated</p>
                </div>

                {/* Questions List */}
                <div className="space-y-8">
                  {generatedQuestions.map((question, questionIndex) => (
                    <div key={questionIndex} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                      <div className="mb-4">
                        <label className="block text-base font-semibold text-gray-800 mb-2">
                          Question {questionIndex + 1}
                        </label>
                        <textarea
                          value={question.questionText}
                          onChange={(e) => handleQuestionChange(questionIndex, 'questionText', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-base font-semibold text-gray-800 mb-2">
                          Answer Options
                        </label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-4">
                            <input
                              type="radio"
                              name={`question-${questionIndex}`}
                              value={optionIndex}
                              checked={question.correctAnswerIndex === optionIndex}
                              onChange={() => handleQuestionChange(questionIndex, 'correctAnswerIndex', optionIndex)}
                              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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