'use client'

import { useState } from 'react'
// Ensure the path to NewsCard is correct. Since we are fixing the error in a standalone file, 
// I will adjust the import based on the provided file names, but in a real Next.js project 
// you would use the correct relative path like below.

// We must adjust the import path for the canvas environment since we are generating only one file in the response.
// Assuming the user is running the main file, we will remove the relative import for NewsCard for simplicity, 
// but in a proper Next.js environment, the original line would be kept.
// import NewsCard from '@/components/NewsCard' 

// --- Image Placeholders & Data Enhancement ---
const BANGLADESH_CRICKET_TEAM_IMAGE = "https://placehold.co/600x400/003d52/white?text=Team+Bangladesh"; 
const VIRAT_KOHLI_IMAGE = "https://placehold.co/100x100/512da8/white?text=Virat+Kohli";
const BEN_STOKES_IMAGE = "https://placehold.co/100x100/f4511e/white?text=Ben+Stokes";
const MITCHELL_STARC_IMAGE = "https://placehold.co/100x100/004d40/white?text=Mitchell+Starc";
const DUMMY_IMAGE = "https://placehold.co/100x100/999999/white?text=Cricket";

const newsItems = [
  {
    id: '1',
    title: 'I was unhappy that BCB tried to force retirement’ - said by Bangladeshi captain!',
    content: 'Bangladeshi cricket captain has expressed strong dissatisfaction with the cricket board attempts to influence retirement decisions.',
    date: '2 hours ago',
    category: 'Cricket',
    imageUrl: BANGLADESH_CRICKET_TEAM_IMAGE // Used for featured image
  },
  {
    id: '2',
    title: 'Virat Kohli is looking forward to back on his form!',
    content: 'The star batsman is confident about returning to his best form in the upcoming international series.',
    date: '4 hours ago', 
    category: 'Cricket',
    imageUrl: VIRAT_KOHLI_IMAGE
  },
  {
    id: '3',
    title: 'You call yourself a Ben Stokes fan? - releasing his book',
    content: 'New autobiography from the English all-rounder reveals untold stories from his career.',
    date: '6 hours ago',
    category: 'Cricket',
    imageUrl: BEN_STOKES_IMAGE
  },
  {
    id: '4',
    title: 'Mitchell Starc opts out of IPL 2020! - Cricket Australia',
    content: 'Australian pace bowler decides to skip IPL season to focus on national duties.',
    date: '1 day ago',
    category: 'Cricket',
    imageUrl: MITCHELL_STARC_IMAGE
  },
  {
    id: '5',
    title: 'You call yourself a Ben Stokes fan? - releasing his book', // Duplicated to match the image list style
    content: 'Relive the iconic moment when Allen Iverson led the 76ers to a stunning victory over the Lakers.',
    date: '2 days ago',
    category: 'Cricket', 
    imageUrl: BEN_STOKES_IMAGE
  },
  {
    id: '6', 
    title: 'Spurs Aldridge has shoulder surgery, will miss rest of NBA season',
    content: 'San Antonio Spurs forward LaMarcus Aldridge undergoes successful shoulder surgery, ending his season.',
    date: '3 days ago',
    category: 'Basketball',
    imageUrl: DUMMY_IMAGE
  }
]

const newsDetails = {
  '1': { // Adding a full content for the featured story
    title: 'I was unhappy that BCB tried to force retirement’ - said by Bangladeshi captain!',
    fullContent: `DHAKA – The Bangladeshi cricket captain, Shakib Al Hasan, has publicly voiced his dissatisfaction with the Bangladesh Cricket Board (BCB) over attempts to influence the retirement of senior players. The captain stressed that such decisions should be left entirely to the players, based on their performance and fitness.

"It is highly disappointing when I hear reports that the board is trying to pressurize players into retirement," the captain said. "We have dedicated our lives to this sport, and we deserve the respect to leave on our own terms. I believe in contributing to the team as long as my body and mind allow."

This controversy highlights the ongoing tension between the BCB management and key national players regarding squad transition and future planning. The full report details the specific interactions and the resulting impact on team morale ahead of the next major tournament.`
  },
  '5': {
    title: 'You call yourself a Ben Stokes fan? - releasing his book',
    fullContent: `Ernesto Valverde said Monday that Lionel Messi could make his comeback against Borussia Dortmund as the Catalans open their Champions League campaign in Germany on Tuesday evening.

Messi took part in training along with the rest of the squad at the club training centre in Barcelona on Monday ahead of the trip to Signal Iduna Park. The Argentine, 32, has missed the beginning of the season with a calf injury but was named in Valverde squad for Tuesday match, though it remains unclear whether he will play.

"We will decide tomorrow. For the last week we have been unsure whether he will be able to play, but he has trained two or three times and made a good impression. We will see," said Valverde at a press conference on Monday.`
  }
}

// --- NewsCard Component (Copied from components/NewsCard.tsx to make the file runnable in this environment) ---
interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  imageUrl?: string;
}

interface NewsCardProps {
  news: NewsItem;
  isFeatured?: boolean; // Controls the layout style
}

const IMAGE_PLACEHOLDERS: { [key: string]: string } = {
  '1': 'https://placehold.co/400x250/003d52/white?text=Team+Bangladesh', // Featured
  '2': 'https://placehold.co/100x100/512da8/white?text=Kohli',
  '3': 'https://placehold.co/100x100/f4511e/white?text=Stokes',
  '4': 'https://placehold.co/100x100/004d40/white?text=Starc',
  '5': 'https://placehold.co/100x100/e0e0e0/333?text=Iverson',
  '6': 'https://placehold.co/100x100/4e342e/white?text=Aldridge',
};

const NewsCard = ({ news, isFeatured = false }: NewsCardProps) => {
  const finalImageUrl = news.imageUrl || IMAGE_PLACEHOLDERS[news.id] || IMAGE_PLACEHOLDERS['1'];

  if (isFeatured) {
    return (
      <div className="bg-white">
        <div className="relative w-full aspect-video">
          <img 
            src={finalImageUrl} 
            alt={news.title} 
            className="w-full h-full object-cover rounded-lg" 
            onError={(e) => { e.currentTarget.src = IMAGE_PLACEHOLDERS['1']; }}
          />
        </div>
        <p className="text-base font-bold text-gray-900 mt-2 px-1 leading-snug">
          {news.title}
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex bg-white items-center pb-2 border-b border-gray-200">
        <div className="relative w-20 h-20 flex-shrink-0 mr-3">
          <img 
            src={finalImageUrl} 
            alt={news.title} 
            className="w-full h-full object-cover rounded-md" 
            onError={(e) => { e.currentTarget.src = IMAGE_PLACEHOLDERS['2']; }}
          />
        </div>
        
        <div className="flex-grow">
          <h3 className="text-base font-medium text-gray-800 leading-snug">
            {news.title}
          </h3>
        </div>
      </div>
    );
  }
}
// --- End NewsCard Component ---


export default function News() {
  const [selectedNews, setSelectedNews] = useState<string | null>(null)
  
  const featuredNews = newsItems[0];
  const listNews = newsItems.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* News Content */}
      <div className="p-4">
        {/* Featured News Card (First Item) */}
        {featuredNews && (
          <div 
            key={featuredNews.id} 
            className="mb-4 cursor-pointer"
            onClick={() => setSelectedNews(featuredNews.id)}
          >
            <NewsCard news={featuredNews} isFeatured={true} />
          </div>
        )}

        {/* News List (Remaining Items) */}
        <div className="space-y-3">
          {listNews.map((news) => (
            <div 
              key={news.id} 
              className="cursor-pointer"
              onClick={() => setSelectedNews(news.id)}
            >
              <NewsCard news={news} isFeatured={false} />
            </div>
          ))}
          {/* Add padding at the end of the list to visually match the image space */}
          <div className="pt-2"></div>
        </div>
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