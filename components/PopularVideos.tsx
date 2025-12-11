'use client'
import { useVideoContent, Content } from '@/utils/useVideoContent'
import VideoPlayerModal from './VideoPlayerModal'
import { useRouter } from "next/navigation";
import React from "react";

export default function PopularVideos() {
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
  } = useVideoContent();

  const router = useRouter();

  // playlist may be called "Popular Videos" or "Popular"
  const popularPlaylist = playlists?.find(
    p =>
      p.playlist_title === 'Popular Videos' ||
      p.playlist_title === 'Popular'
  );

  const popularVideos: Content[] = popularPlaylist?.contents || [];
  const currentPlaylistType = popularPlaylist?.playlist_type || 'regular_video';

  const renderVideoCard = (video: Content) => (
    <div key={video.content_id} className="mr-3 w-[260px] flex-shrink-0">
      {/* use a button for accessibility */}
      <button
        type="button"
        onClick={() => handleVideoPlay(video, currentPlaylistType)}
        className="w-full text-left focus:outline-none"
        aria-label={`Play ${video.content_title}`}
      >
        <div className="cursor-pointer active:scale-[0.98] transition-transform">
          <div className="w-full h-36 relative rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.thumbnail}
              alt={video.content_title}
              className="w-full h-full"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = '/fallback-thumbnail.png' }}
            />

            <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-none rounded-2xl"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {video.is_premium === 'true' && (
              <div className="absolute top-1 left-1 bg-yellow-500 text-gray-900 text-[10px] px-1 py-0.5 rounded font-bold">
                PREMIUM
              </div>
            )}
          </div>

          <h3 className="font-normal text-gray-900 text-xs line-clamp-2 pt-2">
            {video.content_title}
          </h3>
        </div>
      </button>
    </div>
  );

  const handleSeeAll = () => {
    const title = popularPlaylist?.playlist_title ?? 'Popular Videos';
    router.push(`/videos/${encodeURIComponent(title)}`);
  };

  return (
    <>
      <section className="mt-4 pb-4">
        <div className="flex items-center justify-between mb-2 px-4">
          <h2 className="text-lg font-bold text-gray-900">
            {popularPlaylist?.playlist_title || 'Popular Videos'}
          </h2>

          <button
            onClick={handleSeeAll}
            className="text-sm text-gray-600 font-semibold p-1 hover:text-red-500"
            aria-label="See all Popular Videos"
          >
            See All
          </button>
        </div>

        {isLoading && <div className="px-4 text-sm text-gray-500">Loading…</div>}
        {error && <div className="px-4 text-sm text-red-500">{error}</div>}

        {popularVideos.length > 0 ? (
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex px-4">
              {popularVideos.map(renderVideoCard)}
            </div>
          </div>
        ) : (
          <div className="px-4 pt-3">
            <p className="text-sm text-gray-500">
              No popular videos found.
            </p>
          </div>
        )}
      </section>

      {isVideoPlaying && selectedVideoContent && (
        <VideoPlayerModal
          videoUrl={videoUrl}
          handleCloseVideo={handleCloseVideo}
          videoRef={videoRef}
          title={selectedVideoContent.content_title}
        />
      )}
    </>
  );
}
