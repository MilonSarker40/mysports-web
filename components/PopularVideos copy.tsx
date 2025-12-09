// components/PopularVideos.tsx
'use client'
import VideoPlaylistSlider from './VideoPlaylistSlider'

export default function PopularVideos() {
  return (
    <VideoPlaylistSlider 
      playlistType="regular_video" // API Type
      defaultTitle="Popular Videos" // Filtering Title
    />
  )
}