// components/Cricket.tsx
'use client'
import VideoPlaylistSlider from './VideoPlaylistSlider'

export default function Cricket() {
  return (
    <VideoPlaylistSlider 
      playlistType="regular_video" // API Type
      defaultTitle="Cricket" // Filtering Title
    />
  )
}