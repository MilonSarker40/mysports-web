'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FaArrowLeft } from "react-icons/fa";

// News data (same as in your main news page)
const newsItems = [
  {
    id: '1',
    title: 'I was unhappy that BCB tried to force retirement\' - said by Bangladeshi captain!',
    content: 'Bangladeshi cricket captain has expressed strong dissatisfaction with the cricket board attempts to influence retirement decisions.',
    fullContent: `DHAKA – The Bangladeshi cricket captain, Shakib Al Hasan, has publicly voiced his dissatisfaction with the Bangladesh Cricket Board (BCB) over attempts to influence the retirement of senior players. The captain stressed that such decisions should be left entirely to the players, based on their performance and fitness.

"It is highly disappointing when I hear reports that the board is trying to pressurize players into retirement," the captain said. "We have dedicated our lives to this sport, and we deserve the respect to leave on our own terms. I believe in contributing to the team as long as my body and mind allow."

This controversy highlights the ongoing tension between the BCB management and key national players regarding squad transition and future planning. The full report details the specific interactions and the resulting impact on team morale ahead of the next major tournament.`,
    date: '2 hours ago',
    category: 'Cricket',
    imageUrl: '/images/1741642087977.webp'
  },
  {
    id: '2',
    title: 'Virat Kohli is looking forward to back on his form!',
    content: 'The star batsman is confident about returning to his best form in the upcoming international series.',
    fullContent: `Indian cricket star Virat Kohli has expressed confidence in returning to his peak form in the upcoming international series. After a brief period of inconsistent performances, Kohli has been working intensively on his technique and mental preparation.

"I've been analyzing my game and working on specific areas that needed improvement," Kohli stated in a recent press conference. "The passion and drive to perform at the highest level has never diminished. I'm looking forward to the upcoming series and contributing significantly to the team's success."

Kohli's return to form is crucial for the Indian team as they prepare for important tournaments ahead. The batting maestro has been spending extra hours in the nets and working closely with team coaches to refine his technique.`,
    date: '4 hours ago',
    category: 'Cricket',
    imageUrl: '/images/news-img-1.jpg'
  },
  {
    id: '3',
    title: 'You call yourself a Ben Stokes fan? - releasing his book',
    content: 'New autobiography from the English all-rounder reveals untold stories from his career.',
    fullContent: `England's star all-rounder Ben Stokes has released his much-anticipated autobiography, revealing previously untold stories from his remarkable career. The book provides intimate details about his journey, including the 2019 World Cup final and the famous Headingley Test.

"This book is my story, in my words," Stokes said during the launch event. "I wanted to share the real experiences, the challenges, and the moments that defined my career. There are stories here that even my closest teammates haven't heard."

The autobiography has already received critical acclaim for its honesty and compelling narrative. Cricket fans worldwide are eager to get insights into Stokes' mindset during crucial matches and his personal journey through various challenges.`,
    date: '6 hours ago',
    category: 'Cricket',
    imageUrl: '/images/banner-slider-img-1.jpeg'
  },
  {
    id: '4',
    title: 'Mitchell Starc opts out of IPL 2020! - Cricket Australia',
    content: 'Australian pace bowler decides to skip IPL season to focus on national duties.',
    fullContent: `Australian fast bowler Mitchell Starc has decided to opt out of the IPL 2020 season to focus on his national team commitments. The decision comes as Cricket Australia looks to manage the workload of its key players ahead of important international fixtures.

"After careful consideration and discussions with Cricket Australia, I've decided to skip this year's IPL," Starc confirmed. "My focus remains on representing Australia across all formats and ensuring I'm in the best possible condition for national duties."

This move highlights the increasing concern about player workload management in modern cricket. Starc's decision will allow him to prepare adequately for upcoming Test series and international tournaments where his presence is crucial for Australia's success.`,
    date: '1 day ago',
    category: 'Cricket',
    imageUrl: '/images/popular-img-3.jpg'
  },
  {
    id: '5',
    title: 'NBA Flashback - Iverson stops Lakers in 2001 Finals',
    content: 'Relive the iconic moment when Allen Iverson led the 76ers to a stunning victory over the Lakers.',
    fullContent: `In one of the most memorable moments in NBA Finals history, Allen Iverson and the Philadelphia 76ers stunned the heavily favored Los Angeles Lakers in Game 1 of the 2001 Finals. The Lakers, led by Shaquille O'Neal and Kobe Bryant, entered the series with an 11-0 playoff record.

Iverson put on a spectacular performance, scoring 48 points and leading the 76ers to a 107-101 overtime victory. The most iconic moment came when Iverson stepped over Tyronn Lue after hitting a crucial jumper, creating one of the most enduring images in basketball history.

Despite eventually losing the series 4-1, Iverson's Game 1 performance remains one of the greatest individual efforts in Finals history. His fearless approach and incredible scoring ability against a dominant Lakers team cemented his legacy as one of basketball's most exciting players.`,
    date: '2 days ago',
    category: 'Basketball',
    imageUrl: '/images/popular-img-3.jpg'
  },
  {
    id: '6', 
    title: 'Spurs Aldridge has shoulder surgery, will miss rest of NBA season',
    content: 'San Antonio Spurs forward LaMarcus Aldridge undergoes successful shoulder surgery, ending his season.',
    fullContent: `San Antonio Spurs forward LaMarcus Aldridge has undergone successful surgery on his right shoulder and will miss the remainder of the NBA season. The procedure addressed a nagging injury that had been affecting his performance throughout the season.

"The surgery was successful, and we expect LaMarcus to make a full recovery," said Spurs team doctor David Schmidt. "He should be ready to return to basketball activities by the start of next season."

Aldridge, a seven-time All-Star, was averaging 18.9 points and 7.4 rebounds per game before the injury. His absence will be a significant blow to the Spurs' playoff aspirations. The team will now rely more heavily on their younger players to step up in Aldridge's absence during this crucial part of the season.`,
    date: '3 days ago',
    category: 'Basketball',
    imageUrl: '/images/popular-img-3.jpg'
  },
  {
    id: '7', 
    title: 'Spurs Aldridge has shoulder surgery, will miss rest of NBA season',
    content: 'San Antonio Spurs forward LaMarcus Aldridge undergoes successful shoulder surgery, ending his season.',
    fullContent: `San Antonio Spurs forward LaMarcus Aldridge has undergone successful surgery on his right shoulder and will miss the remainder of the NBA season. The procedure addressed a nagging injury that had been affecting his performance throughout the season.

"The surgery was successful, and we expect LaMarcus to make a full recovery," said Spurs team doctor David Schmidt. "He should be ready to return to basketball activities by the start of next season."

Aldridge, a seven-time All-Star, was averaging 18.9 points and 7.4 rebounds per game before the injury. His absence will be a significant blow to the Spurs' playoff aspirations. The team will now rely more heavily on their younger players to step up in Aldridge's absence during this crucial part of the season.`,
    date: '3 days ago',
    category: 'Basketball',
    imageUrl: '/images/popular-img-3.jpg'
  },
  {
    id: '8', 
    title: 'Spurs Aldridge has shoulder surgery, will miss rest of NBA season',
    content: 'San Antonio Spurs forward LaMarcus Aldridge undergoes successful shoulder surgery, ending his season.',
    fullContent: `San Antonio Spurs forward LaMarcus Aldridge has undergone successful surgery on his right shoulder and will miss the remainder of the NBA season. The procedure addressed a nagging injury that had been affecting his performance throughout the season.

"The surgery was successful, and we expect LaMarcus to make a full recovery," said Spurs team doctor David Schmidt. "He should be ready to return to basketball activities by the start of next season."

Aldridge, a seven-time All-Star, was averaging 18.9 points and 7.4 rebounds per game before the injury. His absence will be a significant blow to the Spurs' playoff aspirations. The team will now rely more heavily on their younger players to step up in Aldridge's absence during this crucial part of the season.`,
    date: '3 days ago',
    category: 'Basketball',
    imageUrl: '/images/popular-img-3.jpg'
  }
]

const IMAGE_PLACEHOLDERS: { [key: string]: string } = {
  '1': '/images/1741642087977.webp',
  '2': '/images/news-img-1.jpg',
  '3': '/images/banner-slider-img-1.jpeg',
  '4': '/images/popular-img-3.jpg',
  '5': '/images/popular-img-3.jpg',
  '6': '/images/popular-img-3.jpg',
};

export default function NewsDetails() {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState<any>(null)

  useEffect(() => {
    const newsId = params.id as string
    const foundNews = newsItems.find(item => item.id === newsId)
    setNews(foundNews)
  }, [params.id])

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading news...</p>
        </div>
      </div>
    )
  }

  const finalImageUrl = news.imageUrl || IMAGE_PLACEHOLDERS[news.id] || IMAGE_PLACEHOLDERS['1'];

  return (
    <div className="min-h-screen bg-red-600">
      {/* Simple Header with Back Button */}
      <div className="px-4 py-4">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()}
            className="mr-3 text-gray-600 hover:text-gray-900 text-lg"
          >
            <FaArrowLeft className='text-white' />
          </button>
          <h1 className="text-base font-normal text-white">News Details</h1>
        </div>
      </div>

      {/* News Content */}
      <div className=" bg-white rounded-t-2xl">
        <div className='p-4'>
          {/* News Image */}
          <div className="w-full h-48 mb-4">
            <img 
              src={finalImageUrl} 
              alt={news.title}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => { e.currentTarget.src = IMAGE_PLACEHOLDERS['1']; }}
            />
          </div>

          {/* News Title */}
          <h1 className="text-lg font-medium text-red-700 mb-4 leading-tight">
            {news.title}
          </h1>
        </div>

        <div className='min-h-screen bg-[#f3f3f3] px-4 py-8 rounded-t-2xl'>
          {/* News Content */}
          <div className="mb-6">
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              {news.fullContent || news.content}
            </p>
          </div>

          {/* Meta Information */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{news.date}</span>
              <span>{news.category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}