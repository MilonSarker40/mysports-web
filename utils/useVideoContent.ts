'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import { useAuthStore } from '@/store/authStore'
import api from '../utils/api'

/* ---------------- TYPES (example) ---------------- */
interface Playlist {
  playlist_type: string
  items: Content[]
}

interface Content {
  content_id: string
  content_title: string
  is_premium: 'true' | 'false'
}

interface VideoDetails {
  url: string
}

export const useVideoContent = () => {
  const router = useRouter()
  const { userInfo } = useAuthStore()

  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [selectedVideoContent, setSelectedVideoContent] =
    useState<Content | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)

  /* -------------------------------
     SUBSCRIPTION FLAG (✅ FIXED)
  -------------------------------- */
  const isSubscribed = userInfo?.subscription?.subscribed === true

  /* -------------------------------
     1. FETCH ALL PLAYLISTS
  -------------------------------- */
  const fetchContentList = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await api.post('/contentinfo/all')
      setPlaylists(res.data.items ?? [])
    } catch (err) {
      console.error('Error fetching content list:', err)
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
        const res = await api.post<VideoDetails>(url)

        setVideoUrl(res.data.url)
        return res.data.url
      } catch (err) {
        console.error('Error fetching video details:', err)
        setError('Failed to load video stream.')
        return null
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  /* -------------------------------
     3. HANDLE VIDEO PLAY (🔒 PREMIUM GUARD)
  -------------------------------- */
  const handleVideoPlay = useCallback(
    async (content: Content, playlistType: string) => {
      // 🔒 PREMIUM CHECK
      if (content.is_premium === 'true' && !isSubscribed) {
        toast.error('এই ভিডিওটি দেখতে সাবস্ক্রাইব করুন')
        router.push('/subscription')
        return
      }

      // ✅ ALLOWED
      setSelectedVideoContent(content)
      setIsVideoPlaying(true)

      await fetchVideoDetails(content.content_id, playlistType)
    },
    [fetchVideoDetails, router, isSubscribed]
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

  /* -------------------------------
     RETURN
  -------------------------------- */
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
    isSubscribed, // optional expose
  }
}
