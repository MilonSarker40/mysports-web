import { Video } from '@/types'

interface VideoCardProps {
  video: Video
  variant?: 'featured' | 'popular'
}

export default function VideoCard({ video, variant = 'featured' }: VideoCardProps) {
  const gradientClass =
    variant === 'featured'
      ? 'from-blue-500 to-purple-600'
      : 'from-red-500 to-orange-600'

  return (
    <div className="bg-white rounded-xl shadow-md border overflow-hidden">
      <div className={`aspect-video bg-gradient-to-br ${gradientClass} relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{video.title}</h3>
        <p className="text-xs text-gray-600 mt-1">{video.description}</p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
            {video.category}
          </span>

          <button className="text-blue-600 text-xs flex items-center font-medium">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch
          </button>
        </div>
      </div>
    </div>
  )
}
