'use client'
import { useVideoContent, Content } from '@/utils/useVideoContent' 
import VideoPlayerModal from './VideoPlayerModal'
import { useRouter } from "next/navigation";

export default function Cricket() {
  const { 
    playlists, 
    selectedVideoContent, 
    videoUrl, 
    isVideoPlaying, 
    isLoading,
    error,
    handleVideoPlay, 
    handleCloseVideo, 
    videoRef 
  } = useVideoContent()

  const router = useRouter();

  // Pick the Cricket playlist
  const cricketPlaylist = playlists.find(p => p.playlist_title === 'Cricket') 
  const cricketVideos = cricketPlaylist?.contents || []
  const currentPlaylistType = cricketPlaylist?.playlist_type || 'regular_video'; 

  const renderVideoCard = (video: Content) => (
    <div 
      key={video.content_id} 
      className="mr-3 w-[260px] flex-shrink-0"
      onClick={() => handleVideoPlay(video, currentPlaylistType)}
    >
      <div className="cursor-pointer active:scale-[0.98] transition-transform">
        
        {/* Thumbnail */}
        <div className="w-full h-36 relative rounded-2xl overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.content_title}
            className="w-full h-full"
          />

          <div className="absolute inset-0 bg-black bg-opacity-30"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          {/* PREMIUM Badge */}
          {video.is_premium === 'true' && (
            <div className="absolute top-1 left-1 bg-yellow-500 text-gray-900 text-[10px] px-1 py-0.5 rounded font-bold">
              PREMIUM
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-normal text-gray-900 text-xs line-clamp-2 pt-2">
          {video.content_title}
        </h3>
      </div>
    </div>
  );


  return (
    <>
      <section className="mt-2">
        <div className="flex items-center justify-between mb-2 px-4">
          <h2 className="text-lg font-bold text-gray-900">
            {cricketPlaylist?.playlist_title || 'Cricket'}
          </h2>

          <button
            onClick={() => {
              const title = cricketPlaylist?.playlist_title || "Cricket";
              router.push(`/videos/${encodeURIComponent(title)}`);
            }}
            className="text-sm text-gray-600 font-semibold p-1 hover:text-red-500"
          >
            See All
          </button>
        </div>

        {/* ⭐ Horizontal Scroll Container */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex px-4">
            {cricketVideos.map(renderVideoCard)}
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      {isVideoPlaying && selectedVideoContent && (
        <VideoPlayerModal 
          videoUrl={videoUrl}
          handleCloseVideo={handleCloseVideo}
          videoRef={videoRef}
          title={selectedVideoContent.content_title}
        />
      )}
    </>
  )
}
