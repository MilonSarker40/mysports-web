// components/QuizPlay.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { questions } from '@/data/questions'
import { ArrowLeft, Check, X } from 'lucide-react'

const QuizPlay = () => {
  const { quiz, setQuizState, updateCoins } = useAppStore()
  const router = useRouter()
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = questions[quiz.currentQuestion]

  // Reset on question change
  useEffect(() => {
    setSelectedOption(null)
    setTimeLeft(15)
    setIsSubmitting(false)
  }, [quiz.currentQuestion])

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (timeLeft > 0 && !quiz.showResult && !isSubmitting) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (timeLeft === 0 && !quiz.showResult && !isSubmitting) {
      handleAnswer(selectedOption !== null ? selectedOption : -1)
    }

    return () => clearTimeout(timer)
  }, [timeLeft, quiz.showResult, isSubmitting, selectedOption])

  const handleOptionSelect = (index: number) => {
    if (!quiz.showResult && !isSubmitting) setSelectedOption(index)
  }

  const handleAnswer = (optionIndex: number) => {
    if (quiz.showResult || isSubmitting) return
    setIsSubmitting(true)

    const isCorrect = optionIndex === currentQuestion.correctAnswer
    const newScore = isCorrect ? quiz.score + 1 : quiz.score

    setQuizState({
      score: newScore,
      selectedAnswers: [...quiz.selectedAnswers, optionIndex],
      showResult: true,
      isCorrect,
      lastSelected: optionIndex
    })

    if (isCorrect) updateCoins(10)

    setTimeout(() => {
      if (quiz.currentQuestion + 1 < questions.length) {
        setQuizState({
          currentQuestion: quiz.currentQuestion + 1,
          showResult: false,
          isCorrect: false,
          lastSelected: null
        })
      } else {
        router.push('/quiz/result')
      }
    }, 2000)
  }

  const handleSubmit = () => {
    if (selectedOption !== null && !quiz.showResult && !isSubmitting) {
      handleAnswer(selectedOption)
    }
  }

  const getOptionClasses = (index: number) => {
    const isCorrect = index === currentQuestion.correctAnswer
    const wasSelected = index === quiz.lastSelected
    const isSelected = selectedOption === index
    const isResult = quiz.showResult

    let cls = 'w-full text-left p-4 rounded-2xl flex items-center space-x-4 transition-all duration-200 '

    if (!isResult) {
      if (isSelected) cls += 'bg-red-500 text-white border-red-600'
      else cls += 'bg-white text-gray-900 border border-gray-300'
    } else {
      if (isCorrect) {
        cls += 'bg-red-500 text-white border-red-600'
      } else if (wasSelected && !isCorrect) {
        cls += 'bg-black text-white border-black'
      } else {
        cls += 'bg-gray-200 text-gray-500 border border-gray-300'
      }
    }

    return cls
  }

  const OptionIcon = ({ index }: { index: number }) => {
    const isCorrect = index === currentQuestion.correctAnswer
    const wasSelected = index === quiz.lastSelected
    const isSelected = selectedOption === index
    const isResult = quiz.showResult

    if (!isResult) {
      return (
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          isSelected ? 'border-white bg-white' : 'border-gray-400 bg-white'
        }`}>
          {isSelected && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
        </div>
      )
    }

    if (isCorrect) {
      return (
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-red-500">
          <Check size={16} className="text-red-500" />
        </div>
      )
    }

    if (wasSelected && !isCorrect) {
      return (
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-black">
          <X size={16} className="text-black" />
        </div>
      )
    }

    return <div className="w-6 h-6 rounded-full border-2 border-gray-400 bg-gray-200"></div>
  }

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-red-600">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <ArrowLeft
          size={24}
          className="text-white cursor-pointer"
          onClick={() => router.push('/quiz')}
        />
        <div className="text-white font-bold text-lg">
          Question {quiz.currentQuestion + 1}
        </div>
        <div className="bg-red-700 text-white px-3 py-1 rounded-full text-sm font-bold">
          {timeLeft}s
        </div>
      </div>

      {/* Question */}
      <div className="p-4">
        <h2 className="text-white text-sm mb-2">
          Question {quiz.currentQuestion + 1} of {questions.length}
        </h2>
        <h1 className="text-white text-lg font-bold">
          {currentQuestion.question}
        </h1>
      </div>

      {/* Options */}
      <div className="bg-[#f3f3f3] min-h-screen rounded-t-2xl p-6">
        <div className="space-y-4">
          {currentQuestion.options.map((op, i) => (
            <button
              key={i}
              onClick={() => handleOptionSelect(i)}
              disabled={quiz.showResult || isSubmitting}
              className={getOptionClasses(i)}
            >
              <OptionIcon index={i} />
              <span className={
                quiz.showResult
                  ? i === currentQuestion.correctAnswer || i === quiz.lastSelected
                    ? 'text-white font-medium'
                    : 'text-gray-500'
                  : selectedOption === i
                  ? 'text-white font-medium'
                  : 'text-gray-900'
              }>
                {op}
              </span>
            </button>
          ))}
        </div>

        {/* Submit */}
        {!quiz.showResult && (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold mt-6 ${
              selectedOption !== null
                ? 'bg-red-600 text-white'
                : 'bg-gray-300 text-gray-500'
            }`}
          >
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </button>
        )}

        {/* Result */}
        {quiz.showResult && (
          <div className="text-center mt-6 p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
            <div className={`text-2xl font-bold mb-2 ${
              quiz.isCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {quiz.isCorrect ? 'Right Answer' : 'Wrong Answer'}
            </div>

            {quiz.isCorrect ? (
              <Check size={48} className="mx-auto text-green-600" />
            ) : (
              <X size={48} className="mx-auto text-red-600" />
            )}

            <p className="text-gray-600 text-sm mt-2">
              {quiz.isCorrect ? 'You earned 10 coins!' : 'Try again!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizPlay