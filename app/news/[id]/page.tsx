'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useNewsStore from '@/store/newsStore'
import { FaArrowLeft, FaSpinner, FaEye, FaTags, FaCalendar, FaUser } from "react-icons/fa";

const IMAGE_PLACEHOLDERS: { [key: string]: string } = {
  'default': '/images/1741642087977.webp',
};

export default function NewsDetails() {
  const params = useParams()
  const router = useRouter()
  const {
    newsDetails,
    detailsLoading,
    detailsError,
    fetchNewsDetails,
    resetNewsDetails,
  } = useNewsStore()

  useEffect(() => {
    const newsId = params.id as string
    
    if (newsId) {
      fetchNewsDetails(newsId)
    }
    
    return () => {
      resetNewsDetails()
    }
  }, [params.id])

  if (detailsLoading) {
    return (
      <div className="min-h-screen bg-red-600">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-3 text-gray-600 hover:text-gray-900 text-lg"
            >
              <FaArrowLeft className='text-white' />
            </button>
            <h1 className="text-base font-normal text-white">Loading...</h1>
          </div>
        </div>
        <div className="min-h-screen bg-white flex items-center justify-center rounded-t-2xl">
          <div className="text-center">
            <FaSpinner className="animate-spin text-red-600 text-2xl mb-3" />
            <p className="text-sm text-gray-500">Loading news details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (detailsError || !newsDetails) {
    return (
      <div className="min-h-screen bg-red-600">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-3 text-gray-600 hover:text-gray-900 text-lg"
            >
              <FaArrowLeft className='text-white' />
            </button>
            <h1 className="text-base font-normal text-white">Error</h1>
          </div>
        </div>
        <div className="min-h-screen bg-white flex items-center justify-center rounded-t-2xl">
          <div className="text-center p-4">
            <p className="text-red-600 mb-2">{detailsError || 'News not found'}</p>
            <p className="text-sm text-gray-500 mb-4">The requested news article could not be loaded</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={() => {
                  const newsId = params.id as string
                  if (newsId) {
                    fetchNewsDetails(newsId)
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const finalImageUrl = newsDetails.image_url || IMAGE_PLACEHOLDERS['default'];

  return (
    <div className="min-h-screen bg-red-600">
      {/* Header with Back Button */}
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
      <div className="bg-white rounded-t-2xl">
        <div className='p-4'>
          {/* News Image */}
          <div className="relative w-full h-64 mb-4">
            <img 
              src={finalImageUrl} 
              alt={newsDetails.title}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => { e.currentTarget.src = IMAGE_PLACEHOLDERS['default']; }}
            />
            {newsDetails.category_name && (
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                {newsDetails.category_name}
              </div>
            )}
          </div>

          {/* News Title */}
          <h1 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
            {newsDetails.title}
          </h1>
          
          {/* Subtitle */}
          {newsDetails.subtitle && (
            <p className="text-gray-600 mb-4 leading-relaxed">
              {newsDetails.subtitle}
            </p>
          )}

          {/* Author and Date Info */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              {newsDetails.author && (
                <div className="flex items-center text-xs text-gray-500">
                  <FaUser className="mr-1" size={12} />
                  <span>{newsDetails.author}</span>
                </div>
              )}
              
              <div className="flex items-center text-xs text-gray-500">
                <FaCalendar className="mr-1" size={12} />
                <span>
                  {new Date(newsDetails.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            {newsDetails.views !== undefined && (
              <div className="flex items-center text-xs text-gray-500">
                <FaEye className="mr-1" size={12} />
                <span>{newsDetails.views.toLocaleString()} views</span>
              </div>
            )}
          </div>
        </div>

        <div className='min-h-screen bg-[#f3f3f3] px-4 py-6 rounded-t-2xl'>
          {/* News Content */}
          <div className="mb-6">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {newsDetails.full_content || newsDetails.content || 'No content available'}
            </p>
          </div>

          {/* Tags */}
          {newsDetails.tags && newsDetails.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <FaTags className="text-gray-500 mr-2" size={14} />
                <span className="text-sm font-medium text-gray-700">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {newsDetails.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full hover:bg-gray-300 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to News Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push('/news')}
              className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Back to All News
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}