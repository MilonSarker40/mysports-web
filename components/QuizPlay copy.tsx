// components/QuizPlay.tsx
'use client'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { questions } from '@/data/questions'
import { ArrowLeft, Check, X } from 'lucide-react'

const QuizPlay = () => {
  const { quiz, setQuizState, updateCoins, navigate } = useAppStore()
  
  // Local state management
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = questions[quiz.currentQuestion]

  // Reset everything when question changes
  useEffect(() => {
    console.log('🔄 Question changed to:', quiz.currentQuestion)
    setSelectedOption(null)
    setTimeLeft(15)
    setIsSubmitting(false)
  }, [quiz.currentQuestion])

  // Timer functionality - SIMPLIFIED
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (timeLeft > 0 && !quiz.showResult && !isSubmitting) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !quiz.showResult && !isSubmitting) {
      console.log('⏰ Time up! Auto-submitting...')
      handleAnswer(selectedOption !== null ? selectedOption : -1)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timeLeft, quiz.showResult, isSubmitting, selectedOption])

  const handleOptionSelect = (index: number) => {
    console.log('🎯 Option selected:', index)
    if (!quiz.showResult && !isSubmitting) {
      setSelectedOption(index)
    }
  }

  const handleAnswer = async (optionIndex: number) => {
    console.log('📝 Handling answer:', optionIndex)
    
    if (quiz.showResult || isSubmitting) {
      console.log('❌ Already processing, returning...')
      return
    }

    setIsSubmitting(true)
    
    const isCorrect = optionIndex === currentQuestion.correctAnswer
    const newScore = isCorrect ? quiz.score + 1 : quiz.score

    console.log('✅ Answer details:', {
      selected: optionIndex,
      correct: currentQuestion.correctAnswer,
      isCorrect,
      newScore
    })

    // Show result
    setQuizState({
      score: newScore,
      selectedAnswers: [...quiz.selectedAnswers, optionIndex],
      showResult: true,
      isCorrect: isCorrect,
      lastSelected: optionIndex
    })

    // Add coins for correct answer
    if (isCorrect) {
      console.log('💰 Adding 10 coins')
      updateCoins(10)
    }

    // Move to next question after delay
    setTimeout(() => {
      console.log('➡️ Moving to next question...')
      if (quiz.currentQuestion + 1 < questions.length) {
        // Reset for next question
        setQuizState({
          currentQuestion: quiz.currentQuestion + 1,
          showResult: false,
          isCorrect: false,
          lastSelected: null,
        })
      } else {
        console.log('🏁 Quiz finished, going to result')
        navigate('/result')
      }
    }, 2000)
  }

  const handleSubmit = () => {
    console.log('📤 Submit clicked')
    if (selectedOption !== null && !quiz.showResult && !isSubmitting) {
      handleAnswer(selectedOption)
    }
  }

  // Timer display
  const TimerDisplay = ({ seconds }: { seconds: number }) => (
    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
      {seconds}s
    </div>
  )

  // Option styling
  const getOptionClasses = (index: number) => {
    const isCorrect = index === currentQuestion.correctAnswer
    const isResult = quiz.showResult
    const wasSelected = index === quiz.lastSelected
    const isSelected = selectedOption === index

    let classes = 'w-full text-left p-4 rounded-2xl flex items-center space-x-4 transition-all duration-200 '

    if (!isResult) {
      // Normal state
      classes += ' bg-white text-gray-900 border-gray-300 hover:border-gray-400 cursor-pointer '
      if (isSelected) {
        classes += 'border-red-500 bg-red-500 '
      }
    } else {
      // Result state
      if (isCorrect) {
        classes += 'bg-green-500 text-white border-green-600 '
      } else if (wasSelected && !isCorrect) {
        classes += 'bg-red-500 text-white border-red-600 '
      } else {
        classes += 'bg-white text-gray-500 border-gray-300 opacity-70 '
      }
    }

    return classes
  }

  // Option icon
  const OptionIcon = ({ index }: { index: number }) => {
    const isCorrect = index === currentQuestion.correctAnswer
    const isResult = quiz.showResult
    const wasSelected = index === quiz.lastSelected
    const isSelected = selectedOption === index

    if (!isResult) {
      return (
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          isSelected ? 'border-red-500 bg-red-500' : 'border-gray-400'
        }`}>
          {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
        </div>
      )
    }

    if (isCorrect) {
      return (
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <Check size={16} className="text-white" />
        </div>
      )
    }
    if (wasSelected && !isCorrect) {
      return (
        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
          <X size={16} className="text-white" />
        </div>
      )
    }
    
    return <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-red-600 flex items-center justify-center">
        <div className="text-white text-lg">Loading question...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-red-600">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <ArrowLeft 
          size={24} 
          className="text-white cursor-pointer" 
          onClick={() => navigate('/')} 
        />
        <div className="text-white font-bold text-lg">Question {quiz.currentQuestion + 1}</div>
        <TimerDisplay seconds={timeLeft} />
      </div>

      {/* Question Section */}
      <div className="mb-8">
        <h2 className="text-white text-sm font-medium mb-2">
          Question {quiz.currentQuestion + 1} of {questions.length}
        </h2>
        <h1 className="text-white text-2xl font-bold leading-tight">
          {currentQuestion.question}
        </h1>
      </div>

      {/* Options Section */}
      <div className="bg-[#f3f3f3] min-h-screen rounded-t-2xl p-6 shadow-lg">
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={quiz.showResult || isSubmitting}
              className={getOptionClasses(index)}
            >
              <OptionIcon index={index} />
              <span className={
                quiz.showResult ? 
                  (index === currentQuestion.correctAnswer || index === quiz.lastSelected ? 'text-white' : 'text-gray-500') : 
                  'text-gray-900'
              }>
                {option}
              </span>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {!quiz.showResult && (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold mt-6 transition-colors ${
              selectedOption !== null && !isSubmitting
                ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        )}

        {/* Result Display */}
        {quiz.showResult && (
          <div className="text-center mt-6 p-4 rounded-xl bg-gray-50">
            <div className={`text-2xl font-bold mb-3 ${
              quiz.isCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {quiz.isCorrect ? 'Right Answer 🎉' : 'Wrong Answer ❌'}
            </div>
            <div className="text-4xl mb-2">
              {quiz.isCorrect ? (
                <Check size={48} className="mx-auto text-green-600" />
              ) : (
                <X size={48} className="mx-auto text-red-600" />
              )}
            </div>
            <p className="text-gray-600 text-sm">
              {quiz.isCorrect ? 'You earned 10 coins!' : 'Better luck next time!'}
            </p>
          </div>
        )}
      </div>

      {/* Debug Info - Remove in production */}
      {/* <div className="mt-4 p-3 bg-black bg-opacity-20 rounded-lg">
        <p className="text-white text-xs font-mono">
          Debug: Q{quiz.currentQuestion + 1} | Selected: {selectedOption} | 
          Time: {timeLeft}s | Result: {quiz.showResult ? 'Yes' : 'No'} | 
          Submitting: {isSubmitting ? 'Yes' : 'No'}
        </p>
      </div> */}
    </div>
  )
}

export default QuizPlay