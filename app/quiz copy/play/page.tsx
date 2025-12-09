// app/quiz/play/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useStore } from '@/store/useAppStore'
import { Check, X, Trophy } from 'lucide-react'

const questions = [
  {
    id: 1,
    question: "Which is the Capital City of Bangladesh?",
    options: ["Rajsahi", "Dhaka", "Chittagong", "Khulna"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Who won the 2019 Cricket World Cup?",
    options: ["India", "Australia", "England", "New Zealand"],
    correctAnswer: 2
  },
  {
    id: 3, 
    question: "Which team has won the most NBA championships?",
    options: ["Los Angeles Lakers", "Boston Celtics", "Chicago Bulls", "Golden State Warriors"],
    correctAnswer: 1
  }
]

export default function QuizPlay() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const quizType = searchParams.get('type')
  const { quiz, setQuizState, updateCoins, resetQuiz } = useStore()
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)

  const currentQuestion = questions[quiz.currentQuestion]

  useEffect(() => {
    if (timeLeft > 0 && !quiz.showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !quiz.showResult) {
      handleAnswer(-1) // Time's up
    }
  }, [timeLeft, quiz.showResult])

  const handleAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === currentQuestion.correctAnswer
    const newScore = isCorrect ? quiz.score + 1 : quiz.score
    
    setQuizState({
      score: newScore,
      selectedAnswers: [...quiz.selectedAnswers, optionIndex],
      showResult: true,
      isCorrect: isCorrect
    })

    if (isCorrect) {
      updateCoins(10)
    }

    setTimeout(() => {
      if (quiz.currentQuestion + 1 < questions.length) {
        setQuizState({
          currentQuestion: quiz.currentQuestion + 1,
          showResult: false,
          isCorrect: false
        })
        setSelectedOption(null)
        setTimeLeft(30)
      } else {
        // Quiz completed
        router.push('/quiz/result')
      }
    }, 2000)
  }

  const handleSubmit = () => {
    if (selectedOption !== null) {
      handleAnswer(selectedOption)
    }
  }

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  return (
    <div className="pb-4 min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Question {quiz.currentQuestion + 1}</h1>
            <div className="flex items-center space-x-2">
              <Trophy size={20} className="text-yellow-500" />
              <span className="font-semibold">{quiz.score}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress and Timer */}
      <div className="px-4 pt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Question {quiz.currentQuestion + 1} of {questions.length}
          </div>
          <div className={`text-sm font-semibold ${
            timeLeft < 10 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {timeLeft}s
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${((quiz.currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white mx-4 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !quiz.showResult && setSelectedOption(index)}
              disabled={quiz.showResult}
              className={`w-full text-left p-4 border rounded-lg transition-all ${
                selectedOption === index
                  ? quiz.showResult
                    ? index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-blue-500 bg-blue-50 text-blue-700'
                  : quiz.showResult && index === currentQuestion.correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
              } ${quiz.showResult ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {quiz.showResult && (
                  <>
                    {index === currentQuestion.correctAnswer && (
                      <Check size={20} className="text-green-500" />
                    )}
                    {selectedOption === index && index !== currentQuestion.correctAnswer && (
                      <X size={20} className="text-red-500" />
                    )}
                  </>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {!quiz.showResult && (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold mt-6 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Submit Answer
          </button>
        )}

        {/* Result Overlay */}
        {quiz.showResult && (
          <div className={`mt-6 p-4 rounded-lg text-center ${
            quiz.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`text-2xl font-bold mb-2 ${
              quiz.isCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {quiz.isCorrect ? 'Right Answer! 🎉' : 'Wrong Answer! 😔'}
            </div>
            <p className={`text-sm ${
              quiz.isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {quiz.isCorrect ? '+10 coins awarded!' : 'Better luck next time!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}