'use client'

import { useRouter } from 'next/navigation'
import { useVideoContent, Content } from '@/utils/useVideoContent'
import VideoPlayerModal from './VideoPlayerModal'
import Slider from 'react-slick'
import { useAuthStore } from '@/store/authStore'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function FeaturedVideos() {
  const router = useRouter()

  const { userInfo } = useAuthStore()
  const isSubscribed = userInfo?.subscription?.subscribed === true

  const {
    playlists,
    selectedVideoContent,
    videoUrl,
    isVideoPlaying,
    isLoading,
    error,
    handleVideoPlay,
    handleCloseVideo,
    videoRef,
  } = useVideoContent()

  /* ---------------- FEATURED PLAYLIST ---------------- */
  const featuredPlaylist = playlists.find(
    p => p.playlist_type === 'featured_video'
  )

  const featuredVideos = featuredPlaylist?.contents || []
  const currentPlaylistType =
    featuredPlaylist?.playlist_type || 'featured_video'

  /* ---------------- SLIDER SETTINGS ---------------- */
  const sliderSettings = {
    dots: false,
    infinite: featuredVideos.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
  }

  /* ---------------- CLICK HANDLER ---------------- */
  const onVideoClick = (video: Content) => {
    // ❌ NOT SUBSCRIBED → SUBSCRIPTION PAGE
    if (!isSubscribed) {
      router.push('/subscription')
      return
    }

    // ✅ SUBSCRIBED → PLAY VIDEO
    handleVideoPlay(video, currentPlaylistType)
  }

  /* ---------------- VIDEO CARD ---------------- */
  const renderVideoCard = (video: Content) => (
    <div key={video.content_id} className="outline-none">
      <div
        className="cursor-pointer active:scale-[0.98] transition-transform"
        onClick={() => onVideoClick(video)}
      >
        <div
          className="w-full h-52 relative rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${video.banner})` }}
        >
          <div className="absolute inset-0 rounded-xl bg-black bg-opacity-30" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform">
              <svg
                className="w-4 h-4 text-gray-800 ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* PREMIUM TAG */}
          {video.is_premium === 'true' && (
            <div className="absolute bottom-2 right-2 bg-yellow-500 text-gray-900 text-[12px] px-2 py-0.5 rounded font-bold">
              PREMIUM
            </div>
          )}
        </div>

        <div className="p-2 pl-0">
          <h3 className="text-sm text-gray-900 line-clamp-2">
            {video.content_title}
          </h3>
        </div>
      </div>
    </div>
  )

  /* ---------------- RENDER CONTENT ---------------- */
  const renderContent = () => {
    if (isLoading && !featuredVideos.length) {
      return (
        <p className="text-sm text-gray-500 pl-4">
          Loading featured videos...
        </p>
      )
    }

    if (error) {
      return (
        <p className="text-sm text-red-500 pl-4">
          Error loading videos: {error}
        </p>
      )
    }

    if (!featuredVideos.length) {
      return (
        <p className="text-sm text-gray-500 pl-4">
          No featured videos available.
        </p>
      )
    }

    return (
      <Slider {...sliderSettings}>
        {featuredVideos.map(renderVideoCard)}
      </Slider>
    )
  }

  /* ================= UI ================= */
  return (
    <>
      <section className="mt-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900">
            {featuredPlaylist?.playlist_title || 'Featured Videos'}
          </h2>
        </div>

        {renderContent()}
      </section>

      {/* VIDEO MODAL */}
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
