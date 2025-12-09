'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useNewsStore from '@/store/newsStore'
import { FaSpinner } from 'react-icons/fa'

// --- NewsCard Component ---
interface NewsCardProps {
  news: any;
  isFeatured?: boolean;
  onClick: (id: string) => void;
}

const IMAGE_PLACEHOLDERS: { [key: string]: string } = {
  '1': '/images/1741642087977.webp',
  '2': '/images/news-img-1.jpg',
  '3': '/images/banner-slider-img-1.jpeg',
  '4': '/images/popular-img-3.jpg',
  'default': '/images/popular-img-3.jpg',
};

const NewsCard = ({ news, isFeatured = false, onClick }: NewsCardProps) => {
  const finalImageUrl = news.image_url || IMAGE_PLACEHOLDERS[news.content_id] || IMAGE_PLACEHOLDERS['default'];

  if (isFeatured) {
    return (
      <div 
        className="cursor-pointer border-b border-gray-200 pb-4"
        onClick={() => onClick(news.content_id)}
      >
        <div className="relative w-full h-48">
          <img 
            src={finalImageUrl} 
            alt={news.title} 
            className="w-full h-full object-cover rounded-2xl" 
            onError={(e) => { e.currentTarget.src = IMAGE_PLACEHOLDERS['default']; }}
          />
          {news.category_name && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
              {news.category_name}
            </div>
          )}
        </div>
        <p className="text-sm font-normal text-gray-900 mt-3 mb-1 leading-snug">
          {news.title}
        </p>
        {news.subtitle && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {news.subtitle}
          </p>
        )}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {new Date(news.created_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          {news.author && (
            <span className="text-xs text-gray-500">By {news.author}</span>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div 
        className="flex items-center py-3 border-b border-gray-200 cursor-pointer"
        onClick={() => onClick(news.content_id)}
      >
        <div className="relative w-20 h-16 flex-shrink-0 mr-3">
          <img 
            src={finalImageUrl} 
            alt={news.title} 
            className="w-full h-full object-cover rounded-lg" 
            onError={(e) => { e.currentTarget.src = IMAGE_PLACEHOLDERS['default']; }}
          />
        </div>
        
        <div className="flex-grow">
          <h3 className="text-sm text-gray-900 leading-snug line-clamp-2">
            {news.title}
          </h3>
          {news.subtitle && (
            <p className="text-xs text-gray-600 line-clamp-1 mt-1">
              {news.subtitle}
            </p>
          )}
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {new Date(news.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            {news.category_name && (
              <span className="text-xs text-red-600">{news.category_name}</span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default function News() {
  const router = useRouter()
  const {
    newsList,
    featuredNews,
    loading,
    error,
    page,
    hasMore,
    fetchNewsList,
    resetNewsList,
  } = useNewsStore()

  useEffect(() => {
    // Fetch initial news
    fetchNewsList(1)
    
    // Cleanup on unmount
    return () => {
      resetNewsList()
    }
  }, [])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchNewsList(page + 1)
    }
  }

  const handleNewsClick = (id: string) => {
    router.push(`/news/${id}`)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">Error Loading News</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchNewsList(1)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] relative z-10 pb-5 pt-5 rounded-t-2xl">
      {/* News Content */}
      <div className="p-4 pt-0">
        {/* Loading State */}
        {loading && newsList.length === 0 && (
          <div className="flex flex-col justify-center items-center h-64">
            <FaSpinner className="animate-spin text-red-600 text-2xl mb-3" />
            <p className="text-sm text-gray-500">Loading news...</p>
          </div>
        )}

        {/* Featured News Card */}
        {featuredNews && !loading && (
          <div key={featuredNews.content_id} className="mb-2">
            <NewsCard 
              news={featuredNews} 
              isFeatured={true} 
              onClick={handleNewsClick}
            />
          </div>
        )}

        {/* News List */}
        <div>
          {newsList.map((news) => (
            <div key={news.content_id}>
              <NewsCard 
                news={news} 
                isFeatured={false} 
                onClick={handleNewsClick}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && !loading && newsList.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More News'}
            </button>
          </div>
        )}

        {/* Loading More Indicator */}
        {loading && newsList.length > 0 && (
          <div className="flex justify-center mt-4">
            <FaSpinner className="animate-spin text-red-600" />
          </div>
        )}

        {/* No More News */}
        {!hasMore && newsList.length > 0 && (
          <div className="text-center mt-6 text-gray-500 text-sm py-4">
            No more news to load
          </div>
        )}

        {/* Empty State */}
        {!loading && newsList.length === 0 && !featuredNews && (
          <div className="text-center py-12">
            <p className="text-gray-500">No news available</p>
            <button 
              onClick={() => fetchNewsList(1)}
              className="mt-4 px-4 py-2 text-sm bg-red-600 text-white rounded-lg"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  )
}