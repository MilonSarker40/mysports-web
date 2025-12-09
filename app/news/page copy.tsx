// app/news/page.tsx
'use client'

import { useState } from 'react'
import NewsCard from '@/components/NewsCard'

const newsItems = [
  {
    id: '1',
    title: 'I was unhappy that BCB tried to force retirement said by Bangladeshi captain!',
    content: 'Bangladeshi cricket captain has expressed strong dissatisfaction with the cricket board attempts to influence retirement decisions.',
    date: '2 hours ago',
    category: 'Cricket'
  },
  {
    id: '2',
    title: 'Virat Kohli is looking forward to back on his form!',
    content: 'The star batsman is confident about returning to his best form in the upcoming international series.',
    date: '4 hours ago', 
    category: 'Cricket'
  },
  {
    id: '3',
    title: 'You call yourself a Ben Stokes fan? - releasing his book',
    content: 'New autobiography from the English all-rounder reveals untold stories from his career.',
    date: '6 hours ago',
    category: 'Cricket'
  },
  {
    id: '4',
    title: 'Mitchell Starc opts out of IPL 2020! - Cricket Australia',
    content: 'Australian pace bowler decides to skip IPL season to focus on national duties.',
    date: '1 day ago',
    category: 'Cricket'
  },
  {
    id: '5',
    title: 'NBA Flashback - Iverson stops Lakers in 2001 Finals',
    content: 'Relive the iconic moment when Allen Iverson led the 76ers to a stunning victory over the Lakers.',
    date: '2 days ago',
    category: 'Basketball'
  },
  {
    id: '6', 
    title: 'Spurs Aldridge has shoulder surgery, will miss rest of NBA season',
    content: 'San Antonio Spurs forward LaMarcus Aldridge undergoes successful shoulder surgery, ending his season.',
    date: '3 days ago',
    category: 'Basketball'
  }
]

const newsDetails = {
  '5': {
    title: 'NBA Flashback - Iverson stops Lakers in 2001 Finals',
    fullContent: `Ernesto Valverde said Monday that Lionel Messi could make his comeback against Borussia Dortmund as the Catalans open their Champions League campaign in Germany on Tuesday evening.

Messi took part in training along with the rest of the squad at the club training centre in Barcelona on Monday ahead of the trip to Signal Iduna Park. The Argentine, 32, has missed the beginning of the season with a calf injury but was named in Valverde squad for Tuesday match, though it remains unclear whether he will play.

"We will decide tomorrow. For the last week we have been unsure whether he will be able to play, but he has trained two or three times and made a good impression. We will see," said Valverde at a press conference on Monday.`
  }
}

export default function News() {
  const [selectedNews, setSelectedNews] = useState<string | null>(null)

  return (
    <div className="pb-4">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4 border-b">
          <h1 className="text-xl font-bold text-center text-gray-900">News</h1>
        </div>
      </header>

      {/* News List */}
      <div className="p-4 space-y-4">
        {newsItems.map((news) => (
          <div 
            key={news.id} 
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => setSelectedNews(news.id)}
          >
            <NewsCard news={news} />
          </div>
        ))}
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex-1 pr-4">
                  {newsDetails[selectedNews as keyof typeof newsDetails]?.title || newsItems.find(n => n.id === selectedNews)?.title}
                </h2>
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {newsDetails[selectedNews as keyof typeof newsDetails]?.fullContent || 
                   newsItems.find(n => n.id === selectedNews)?.content}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{newsItems.find(n => n.id === selectedNews)?.date}</span>
                  <span>{newsItems.find(n => n.id === selectedNews)?.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}