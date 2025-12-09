// components/QuizResult.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAppStore } from '@/store/useAppStore'
import { questions } from '@/data/questions'
import { ArrowLeft } from 'lucide-react'
import { FaCoins } from "react-icons/fa6";

const QuizResult = () => {
  const { quiz, updateCoins, resetQuiz } = useAppStore()
  const router = useRouter()
  
  const earnedCoins = 25
  const score = `${quiz.score}/${questions.length}`

  useEffect(() => {
    updateCoins(earnedCoins)
  }, [updateCoins])

  const handlePlayAgain = () => {
    resetQuiz()
    router.push('/quiz/play')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="mb-4 p-4">
        <ArrowLeft 
          size={24} 
          className="text-gray-700 cursor-pointer" 
          onClick={() => router.push('/quiz')} 
        />
      </div>

      {/* Result Content */}
      <div className="text-center">
        <div className='flex justify-center items-center pb-5'>
          <Image 
            className='flex justify-center items-center' 
            src="/images/Mesa de trabajo.png" 
            width='150' 
            height='150' 
            alt="Mesa De Trabajo"
          />
        </div>
        <div className='bg-[#f3f3f3] min-h-screen rounded-t-2xl p-5'>
          <h1 className="text-3xl font-bold text-red-600 mb-6">Congrats!</h1>
          <p className="text-gray-700 max-w-[300px] m-auto mb-8">
            You earned <span className='text-red-600'>{earnedCoins} Coins</span> by {score.split('/')[0]} right answers out of {score.split('/')[1]} on Daily Quiz
          </p>

          {/* Score Grid */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-6 mb-8">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Earned Coins</div>
              <div className="text-2xl flex justify-center items-center font-bold text-yellow-600">
                <FaCoins className='pr-2' /> {earnedCoins}
              </div>
            </div>
            <div className="text-center border-l border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Your Score</div>
              <div className="text-2xl font-bold text-red-600">{score}</div>
            </div>
          </div>

          {/* Play Again Button */}
          <button
            onClick={handlePlayAgain}
            className="bg-red-600 text-white py-3 px-10 rounded-full font-medium hover:bg-red-700"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizResult