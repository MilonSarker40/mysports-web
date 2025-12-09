'use client'

import { useRouter } from 'next/navigation'

// --- Image Placeholders & Data Enhancement ---
const BANGLADESH_CRICKET_TEAM_IMAGE = "/images/1741642087977.webp"; 
const VIRAT_KOHLI_IMAGE = "/images/news-img-1.jpg";
const BEN_STOKES_IMAGE = "/images/banner-slider-img-1.jpeg";
const MITCHELL_STARC_IMAGE = "/images/popular-img-3.jpg";
const DUMMY_IMAGE = "/images/popular-img-3.jpg";

const newsItems = [
  {
    id: '1',
    title: 'I was unhappy that BCB tried to force retirement\' - said by Bangladeshi captain!',
    content: 'Bangladeshi cricket captain has expressed strong dissatisfaction with the cricket board attempts to influence retirement decisions.',
    date: '2 hours ago',
    category: 'Cricket',
    imageUrl: BANGLADESH_CRICKET_TEAM_IMAGE
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
    title: 'NBA Flashback - Iverson stops Lakers in 2001 Finals',
    content: 'Relive the iconic moment when Allen Iverson led the 76ers to a stunning victory over the Lakers.',
    date: '2 days ago',
    category: 'Basketball', 
    imageUrl: DUMMY_IMAGE
  },
  {
    id: '6', 
    title: 'Spurs Aldridge has shoulder surgery, will miss rest of NBA season',
    content: 'San Antonio Spurs forward LaMarcus Aldridge undergoes successful shoulder surgery, ending his season.',
    date: '3 days ago',
    category: 'Basketball',
    imageUrl: DUMMY_IMAGE
  },
  {
    id: '7', 
    title: 'Spurs Aldridge has shoulder surgery, will miss rest of NBA season',
    content: 'San Antonio Spurs forward LaMarcus Aldridge undergoes successful shoulder surgery, ending his season.',
    date: '3 days ago',
    category: 'Basketball',
    imageUrl: DUMMY_IMAGE
  },
  {
    id: '8', 
    title: 'Spurs Aldridge has shoulder surgery, will miss rest of NBA season',
    content: 'San Antonio Spurs forward LaMarcus Aldridge undergoes successful shoulder surgery, ending his season.',
    date: '3 days ago',
    category: 'Basketball',
    imageUrl: DUMMY_IMAGE
  },
  {
    id: '9', 
    title: 'Spurs Aldridge has shoulder surgery, will miss rest of NBA season',
    content: 'San Antonio Spurs forward LaMarcus Aldridge undergoes successful shoulder surgery, ending his season.',
    date: '3 days ago',
    category: 'Basketball',
    imageUrl: DUMMY_IMAGE
  }
]

// --- NewsCard Component ---
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
  isFeatured?: boolean;
  onClick: (id: string) => void;
}

const IMAGE_PLACEHOLDERS: { [key: string]: string } = {
  '1': '/images/1741642087977.webp',
  '2': '/images/news-img-1.jpg',
  '3': '/images/banner-slider-img-1.jpeg',
  '4': '/images/popular-img-3.jpg',
  '5': '/images/popular-img-3.jpg',
  '6': '/images/popular-img-3.jpg',
  '7': '/images/1741642087977.webp',
  '8': '/images/1741642087977.webp',
  '9': '/images/1741642087977.webp',
};

const NewsCard = ({ news, isFeatured = false, onClick }: NewsCardProps) => {
  const finalImageUrl = news.imageUrl || IMAGE_PLACEHOLDERS[news.id] || IMAGE_PLACEHOLDERS['1'];

  if (isFeatured) {
    return (
      <div 
        className="cursor-pointer border-b border-gray-200 pb-4"
        onClick={() => onClick(news.id)}
      >
        <div className="relative w-full h-48">
          <img 
            src={finalImageUrl} 
            alt={news.title} 
            className="w-full h-full object-cover rounded-2xl" 
            onError={(e) => { e.currentTarget.src = IMAGE_PLACEHOLDERS['1']; }}
          />
        </div>
        <p className="text-sm font-normal text-gray-900 mt-3 mb-1 leading-snug">
          {news.title}
        </p>
      </div>
    );
  } else {
    return (
      <div 
        className="flex items-center py-3 border-b border-gray-200 cursor-pointer"
        onClick={() => onClick(news.id)}
      >
        <div className="relative w-20 h-16 flex-shrink-0 mr-3">
          <img 
            src={finalImageUrl} 
            alt={news.title} 
            className="w-full h-full object-cover rounded-lg" 
            onError={(e) => { e.currentTarget.src = IMAGE_PLACEHOLDERS['2']; }}
          />
        </div>
        
        <div className="flex-grow">
          <h3 className="text-sm text-gray-900 leading-snug line-clamp-2">
            {news.title}
          </h3>
        </div>
      </div>
    );
  }
}

export default function News() {
  const router = useRouter()

  const handleNewsClick = (id: string) => {
    router.push(`/news/${id}`)
  }

  const featuredNews = newsItems[0];
  const listNews = newsItems.slice(1);

  return (
    <div className="min-h-screen bg-[#f3f3f3] relative z-10 pb-5 pt-5 rounded-t-2xl">
      {/* News Content */}
      <div className="p-4 pt-0">
        {/* Featured News Card (First Item) */}
        {featuredNews && (
          <div key={featuredNews.id} className="mb-2">
            <NewsCard 
              news={featuredNews} 
              isFeatured={true} 
              onClick={handleNewsClick}
            />
          </div>
        )}

        {/* News List (Remaining Items) */}
        <div>
          {listNews.map((news) => (
            <div key={news.id}>
              <NewsCard 
                news={news} 
                isFeatured={false} 
                onClick={handleNewsClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}