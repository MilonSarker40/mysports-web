// lib/useVideoContent.ts
'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import api from '../utils/api' // ধরে নেওয়া হচ্ছে এটি আপনার axios/fetch wrapper

// --- Interface Definitions ---

export interface Content {
    content_id: string
    content_title: string
    banner: string
    thumbnail: string
    design_type: 'regular' | 'featured'
    is_premium: string // 'true' or 'false'
}

export interface Playlist {
    playlist_title: string
    playlist_type: string // CRITICAL for API call
    playlist_description: string | null
    contents: Content[]
}

interface VideoDetails {
    url: string // The actual stream URL from /details API
    content_title: string;
    content_id: string;
}

// --- The Hook ---

export const useVideoContent = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [selectedVideoContent, setSelectedVideoContent] = useState<Content | null>(null)
    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    // 1. Fetch all content playlists (e.g., Cricket, Trending, Featured)
    const fetchContentList = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await api.post('/contentinfo/all') 
            setPlaylists(response.data.items)
        } catch (e: any) {
            console.error('Error fetching content list:', e)
            setError('Failed to load video content list.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    // 2. Fetch video details (stream URL) based on contentId AND playlistType
    const fetchVideoDetails = useCallback(async (contentId: string, playlistType: string) => {
        if (!videoUrl) {
            setIsLoading(true)
            setError(null)
        }
        setVideoUrl(null)
        
        try {
            // CRITICAL: playlist_type is sent to the API to get the correct URL
            const url = `/contentinfo/details?playlist_type=${playlistType}&content_id=${contentId}`;
            const response = await api.post<VideoDetails>(url)
            
            setVideoUrl(response.data.url)
            return response.data.url
        } catch (e: any) {
            console.error(`Error fetching video details for ${contentId}:`, e)
            setError('Failed to load video stream. Please check API parameters.')
            return null
        } finally {
            setIsLoading(false)
        }
    }, [videoUrl])

    // 3. Handle video play logic (receives both content and playlistType)
    const handleVideoPlay = useCallback(async (content: Content, playlistType: string) => {
        setSelectedVideoContent(content)
        setIsVideoPlaying(true)
        
        // Pass the contentId AND the playlistType to fetch the stream URL
        await fetchVideoDetails(content.content_id, playlistType)
    }, [fetchVideoDetails])

    // 4. Handle video close logic
    const handleCloseVideo = useCallback(() => {
        setIsVideoPlaying(false)
        setSelectedVideoContent(null)
        setVideoUrl(null)
        if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
    }, []) 

    useEffect(() => {
        fetchContentList()
    }, [fetchContentList])

    // ... (Escape key/body scroll effects here) ...

    return {
        playlists,
        selectedVideoContent,
        videoUrl,
        isVideoPlaying,
        isLoading,
        error,
        handleVideoPlay, 
        handleCloseVideo,
        videoRef,
    }
}