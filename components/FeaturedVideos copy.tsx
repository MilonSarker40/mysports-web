// components/FeaturedVideos.tsx
'use client'
import { useState, useRef, useEffect } from 'react'

const featuredVideos = [
  {
    id: '1',
    title: 'Sakib-al-hasan will continue his form after back to cricket',
    duration: '2:30',
    thumbnail: '/images/featured-img.png',
    videoUrl: '/videos/sakib-interview.mp4'
  }
]

export default function FeaturedVideos() {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef(null)

  const handleVideoPlay = (video: any) => {
    setSelectedVideo(video)
    setIsVideoPlaying(true)
  }

  const handleCloseVideo = () => {
    setIsVideoPlaying(false)
    setSelectedVideo(null)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  // Handle escape key to close video
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseVideo()
      }
    }

    if (isVideoPlaying) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isVideoPlaying])

  return (
    <>
      <section className="mt-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900">Featured Videos</h2>
        </div>

        <div className="space-y-3">
          {featuredVideos.map((video) => (
            <div 
              key={video.id} 
              className="overflow-hidden cursor-pointer active:scale-95 transition-transform"
              onClick={() => handleVideoPlay(video)}
            >
              <div className="">
                <div 
                  className="w-full h-52 relative flex-shrink-0 rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${video.thumbnail})` }}
                >
                  <div className="absolute inset-0 rounded-xl bg-black bg-opacity-30"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-5 right-5 bg-red-500 bg-opacity-70 text-white text-[14px] px-2 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>
                
                <div className="flex-1 p-2 pb-0 pl-0">
                  <h3 className="font-normal text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
                    {video.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isVideoPlaying && selectedVideo && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent p-4">
            <button
              onClick={handleCloseVideo}
              className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
              onEnded={handleCloseVideo}
            >
              <source src={selectedVideo.videoUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  )
}