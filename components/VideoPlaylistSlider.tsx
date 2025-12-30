'use client'
import React from 'react'
import VideoSlider from './VideoSlider'
import { useVideoContent } from '@/utils/useVideoContent'

interface VideoPlaylistSliderProps {
  playlistType: string
  defaultTitle: string
}

export default function VideoPlaylistSlider({
  playlistType,
  defaultTitle,
}: VideoPlaylistSliderProps) {
  const { playlists, handleVideoPlay, isLoading, error } =
    useVideoContent()

  const playlist = playlists.find(
    p =>
      p.playlist_type === playlistType &&
      p.playlist_title === defaultTitle
  )

  // ✅ Normalize contents
  const videos = playlist?.contents ?? []

  if (isLoading && playlists.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">
        Loading content...
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-4">
        Error: {error}
      </p>
    )
  }

  if (!playlist || videos.length === 0) {
    if (!isLoading && playlists.length > 0) {
      return (
        <p className="text-center text-gray-500 mt-4">
          No content found for {defaultTitle}.
        </p>
      )
    }
    return null
  }

  return (
    <VideoSlider
      title={playlist.playlist_title ?? defaultTitle}
      videos={videos}
      handleVideoPlay={handleVideoPlay}
      playlistType={playlistType}
    />
  )
}
