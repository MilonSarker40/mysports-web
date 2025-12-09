// components/QuizHome.tsx
'use client'
import { useAppStore } from '@/store/useAppStore'
import { LiaCoinsSolid } from "react-icons/lia";
import { useRouter } from 'next/navigation'

const QuizHome = () => {
  const { resetQuiz } = useAppStore()
  const router = useRouter()

  const handlePlayClick = () => {
    console.log('🎮 Starting new quiz...')
    // Reset quiz state before starting
    resetQuiz()
    router.push('/quiz/play')
  }

  const quizCards = [
    {
      title: "Coin Collector",
      subtitle: "Earn 50 Coins",
      bgColor: "#ffffff",
      image: "/images/quize-img-1.png" 
    },
    {
      title: "Live Quiz", 
      subtitle: "Earn 50 Coins",
      bgColor: "#ffffff",
      image: "/images/quize-img-2.png" 
    },
    {
      title: "Quick Play",
      subtitle: "Earn 50 Coins",
      bgColor: "#ffffff",
      image: "/images/quize-img-3.png" 
    }
  ]

  return (
    <div className="min-h-screen bg-[#f3f3f3] relative z-10 rounded-t-2xl">
      {/* Quiz Cards */}
      <div className="p-4 pt-5">
        {quizCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-2xl text-white mb-8 shadow-lg`}
          >
            {/* Top Div - Image */}
            <div className="">
              <div className="w-full h-45">
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="w-full h-full rounded-t-2xl object-cover"
                />
              </div>
            </div>

            {/* Bottom Div - Text and Button */}
            <div className="flex items-center justify-between p-5">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
                <p className="text-gray-900 text-sm flex justify-left items-center">
                  <LiaCoinsSolid className='text-[#ffa901] pr-1 text-lg' /> 
                  {card.subtitle}
                </p>
              </div>
              <button 
                onClick={handlePlayClick}
                className="bg-[#fa3735] text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-[#ffa600] transition-colors"
              >
                PLAY NOW
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuizHome