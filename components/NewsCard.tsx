// components/NewsCard.tsx
import { News } from '@/types'
import { Calendar, Tag } from 'lucide-react'

interface NewsCardProps {
  news: News
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 flex-1 pr-2 leading-tight">{news.title}</h3>
        <span className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
          <Tag size={12} className="mr-1" />
          {news.category}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{news.content}</p>
      <div className="flex justify-between items-center">
        <span className="flex items-center text-xs text-gray-500">
          <Calendar size={12} className="mr-1" />
          {news.date}
        </span>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
          Read More →
        </button>
      </div>
    </div>
  )
}