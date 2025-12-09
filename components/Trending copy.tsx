// components/Trending.tsx
'use client'
import VideoPlaylistSlider from './VideoPlaylistSlider'

export default function Trending() {
  return (
    <VideoPlaylistSlider 
      playlistType="regular_video" // API Type
      defaultTitle="Trending" // Filtering Title
    />
  )
}