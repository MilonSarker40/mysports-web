'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import { useAuthStore } from '@/store/authStore'
import api from '@/utils/api'

/* =========================
   TYPES (EXPORTED)
========================= */

export interface Content {
  content_id: string
  content_title: string
  thumbnail?: string
  banner?: string
  is_premium: 'true' | 'false'
}

export interface Playlist {
  playlist_type: string
  playlist_title?: string
  contents?: Content[]
  items?: Content[] // backend inconsistency safeguard
}

interface VideoDetails {
  url: string
}

/* =========================
   HOOK
========================= */

export const useVideoContent = () => {
  const router = useRouter()
  const { userInfo } = useAuthStore()

  /* ---------------- STATE ---------------- */
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [selectedVideoContent, setSelectedVideoContent] =
    useState<Content | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)

  /* ---------------- SUBSCRIPTION FLAG ---------------- */
  const isSubscribed = userInfo?.subscription?.subscribed === true

  /* =========================
     1. FETCH ALL PLAYLISTS
  ========================= */
  const fetchContentList = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await api.post('/contentinfo/all')
      const items: Playlist[] = res.data?.items ?? []
      setPlaylists(items)
    } catch (err) {
      console.error('Error fetching content list:', err)
      setError('Failed to load video content list.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /* =========================
     2. FETCH VIDEO DETAILS
  ========================= */
  const fetchVideoDetails = useCallback(
    async (contentId: string, playlistType: string) => {
      setError(null)
      setVideoUrl(null)

      try {
        const url = `/contentinfo/details?playlist_type=${playlistType}&content_id=${contentId}`
        const res = await api.post<VideoDetails>(url)

        if (!res.data?.url) {
          throw new Error('VIDEO_URL_MISSING')
        }

        setVideoUrl(res.data.url)
        return res.data.url
      } catch (err) {
        console.error('Error fetching video details:', err)
        toast.error('ভিডিও লোড করা যায়নি')
        return null
      }
    },
    []
  )

  /* =========================
     3. HANDLE VIDEO PLAY
     🔒 Premium Guard Included
  ========================= */
  const handleVideoPlay = useCallback(
    async (content: Content, playlistType: string) => {
      // 🔒 PREMIUM CHECK
      if (content.is_premium === 'true' && !isSubscribed) {
        toast.error('এই ভিডিওটি দেখতে সাবস্ক্রাইব করুন')
        router.push('/subscription')
        return
      }

      setIsLoading(true)

      // 1️⃣ Fetch video URL first
      const url = await fetchVideoDetails(
        content.content_id,
        playlistType
      )

      if (!url) {
        setIsLoading(false)
        return
      }

      // 2️⃣ Then open modal
      setSelectedVideoContent(content)
      setIsVideoPlaying(true)

      setIsLoading(false)
    },
    [fetchVideoDetails, router, isSubscribed]
  )

  /* =========================
     4. CLOSE VIDEO
  ========================= */
  const handleCloseVideo = useCallback(() => {
    setIsVideoPlaying(false)
    setSelectedVideoContent(null)
    setVideoUrl(null)

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [])

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    fetchContentList()
  }, [fetchContentList])

  /* =========================
     RETURN API
  ========================= */
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
    isSubscribed,
  }
}
