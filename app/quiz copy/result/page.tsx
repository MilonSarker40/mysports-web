// app/quiz/result/page.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useStore } from '@/store/useAppStore'
import { Trophy, Star, Home, RotateCcw } from 'lucide-react'

export default function QuizResult() {
  const { quiz, updateCoins, resetQuiz } = useStore()

  useEffect(() => {
    // Award bonus coins based on final score
    const bonusCoins = Math.floor((quiz.score / quiz.totalQuestions) * 100)
    if (bonusCoins > 0) {
      updateCoins(bonusCoins)
    }
  }, [])

  const percentage = Math.floor((quiz.score / quiz.totalQuestions) * 100)

  return (
    <div className="pb-4 min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Result Card */}
      <div className="bg-white mx-4 mt-8 rounded-2xl shadow-xl p-8 text-center">
        {/* Congratulations Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy size={40} className="text-white" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Congrats!</h1>
        <p className="text-gray-600 mb-6">You completed the daily quiz</p>

        {/* Score Summary */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Earned Coins</div>
              <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center">
                <Star size={20} className="mr-1" />
                {Math.floor((quiz.score / quiz.totalQuestions) * 100)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Your Score</div>
              <div className="text-2xl font-bold text-blue-600">
                {quiz.score}/{quiz.totalQuestions}
              </div>
            </div>
          </div>
          
          {/* Progress Circle */}
          <div className="mt-4">
            <div className="w-24 h-24 mx-auto relative">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (percentage / 100) * 251.2}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/quiz/play"
            onClick={resetQuiz}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <RotateCcw size={20} className="mr-2" />
            Play Again
          </Link>
          
          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Home size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}