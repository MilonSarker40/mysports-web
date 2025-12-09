// app/quiz/page.tsx
'use client'

import Link from 'next/link'
import { useStore } from '@/store/useAppStore'
import { Trophy, Clock, Zap } from 'lucide-react'

const quizTypes = [
  {
    id: 'collector',
    title: 'Coin Collector',
    description: 'Earn 50 Coins',
    icon: Trophy,
    color: 'bg-yellow-500',
    href: '/quiz/play?type=collector'
  },
  {
    id: 'live',
    title: 'Live Quiz', 
    description: 'Earn 50 Coins',
    icon: Clock,
    color: 'bg-green-500',
    href: '/quiz/play?type=live'
  },
  {
    id: 'quick',
    title: 'Quick Play',
    description: 'Earn 50 Coins', 
    icon: Zap,
    color: 'bg-blue-500',
    href: '/quiz/play?type=quick'
  }
]

export default function Quiz() {
  const { user } = useStore()

  return (
    <div className="pb-4">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4 border-b">
          <h1 className="text-xl font-bold text-center text-gray-900">Quiz</h1>
        </div>
      </header>

      {/* User Coins */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 mx-4 mt-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">Your Coins</p>
            <p className="text-2xl font-bold">{user.coins}</p>
          </div>
          <Trophy size={32} className="opacity-90" />
        </div>
      </div>

      {/* Quiz Types */}
      <div className="p-4 space-y-4">
        {quizTypes.map((quiz) => {
          const Icon = quiz.icon
          
          return (
            <Link
              key={quiz.id}
              href={quiz.href}
              className="block bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-transform hover:scale-[1.02] active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`${quiz.color} text-white p-3 rounded-lg`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                    <p className="text-sm text-gray-600">{quiz.description}</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  PLAY NOW
                </button>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}