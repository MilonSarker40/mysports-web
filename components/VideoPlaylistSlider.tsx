// components/VideoPlaylistSlider.tsx
'use client'
import React from 'react'
import VideoSlider from './VideoSlider' // Assuming path is correct
import { useVideoContent } from '@/utils/useVideoContent'

interface VideoPlaylistSliderProps {
    playlistType: string
    defaultTitle: string
}

export default function VideoPlaylistSlider({ playlistType, defaultTitle }: VideoPlaylistSliderProps) {
    const { 
        playlists, 
        handleVideoPlay, 
        isLoading,
        error,
    } = useVideoContent() 

    // ⭐ CRITICAL STEP: Filter using BOTH playlistType and defaultTitle
    // This solves the problem of multiple sliders having the same 'regular_video' type.
    const playlist = playlists.find(p => 
        p.playlist_type === playlistType && p.playlist_title === defaultTitle
    )

    if (isLoading && playlists.length === 0) {
        return <p className="text-center text-gray-500 mt-4">Loading content...</p>
    }

    if (error) {
        return <p className="text-center text-red-500 mt-4">Error: {error}</p>
    }

    if (!playlist || playlist.contents.length === 0) {
        // Only show this if the list has been fetched but the specific playlist wasn't found
        if (!isLoading && playlists.length > 0) {
             return <p className="text-center text-gray-500 mt-4">No content found for {defaultTitle}.</p>
        }
        return null; // Don't show anything while loading if lists are empty
    }

    // Now, send the found data to the display component
    return (
        <VideoSlider 
            title={playlist.playlist_title} 
            videos={playlist.contents} 
            handleVideoPlay={handleVideoPlay} 
            playlistType={playlistType} 
        />
    )
}