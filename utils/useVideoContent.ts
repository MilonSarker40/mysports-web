'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '../utils/api'
import { toast } from 'react-toastify'

export const useVideoContent = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [selectedVideoContent, setSelectedVideoContent] = useState<Content | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const router = useRouter()
  const { userInfo } = useAuthStore() // ✅ CORRECT SOURCE

  /* -------------------------------
     1. FETCH ALL PLAYLISTS
  -------------------------------- */
  const fetchContentList = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post('/contentinfo/all')
      setPlaylists(response.data.items)
    } catch (e) {
      console.error('Error fetching content list:', e)
      setError('Failed to load video content list.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /* -------------------------------
     2. FETCH VIDEO DETAILS
  -------------------------------- */
  const fetchVideoDetails = useCallback(
    async (contentId: string, playlistType: string) => {
      setIsLoading(true)
      setVideoUrl(null)
      setError(null)

      try {
        const url = `/contentinfo/details?playlist_type=${playlistType}&content_id=${contentId}`
        const response = await api.post<VideoDetails>(url)
        setVideoUrl(response.data.url)
        return response.data.url
      } catch (e) {
        console.error(`Error fetching video details for ${contentId}:`, e)
        setError('Failed to load video stream.')
        return null
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  /* -------------------------------
     3. HANDLE VIDEO PLAY (PREMIUM GUARD)
  -------------------------------- */
  const handleVideoPlay = useCallback(
    async (content: Content, playlistType: string) => {
      // 🔒 PREMIUM CHECK (100% DYNAMIC)
      if (content.is_premium === 'true' && !userInfo?.subscribed) {
        toast.error('এই ভিডিওটি দেখতে সাবস্ক্রাইব করুন')
        router.push('/subscription')
        return
      }

      // ✅ Allowed to play
      setSelectedVideoContent(content)
      setIsVideoPlaying(true)

      await fetchVideoDetails(content.content_id, playlistType)
    },
    [fetchVideoDetails, router, userInfo?.subscribed]
  )

  /* -------------------------------
     4. CLOSE VIDEO
  -------------------------------- */
  const handleCloseVideo = useCallback(() => {
    setIsVideoPlaying(false)
    setSelectedVideoContent(null)
    setVideoUrl(null)

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [])

  /* -------------------------------
     INIT
  -------------------------------- */
  useEffect(() => {
    fetchContentList()
  }, [fetchContentList])

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
