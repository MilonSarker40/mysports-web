'use client'
import { useEffect, useRef, useState } from 'react'
import api from '@/utils/api'
import Hls from 'hls.js'

export default function FeaturedVideos() {
  const [videos, setVideos] = useState<any[]>([])
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // fetch playlists -> extract featured playlist contents
  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await api.post('/contentinfo/all')
        console.log('contentinfo/all response:', res.data)
        const payload = res.data ?? {}
        let contents: any[] = []

        // handle { items: [...] } shape (playlists with contents)
        if (Array.isArray(payload.items)) {
          // match 'featured_video' or 'Featured Video' etc
          const playlist = payload.items.find((p: any) => {
            const t = (p.playlist_type || '').toString().toLowerCase()
            const title = (p.playlist_title || '').toString().toLowerCase()
            return t.includes('featured') || title.includes('featured')
          })

          if (playlist && Array.isArray(playlist.contents)) {
            contents = playlist.contents
          } else {
            // fallback: flatten all playlist.contents arrays
            contents = payload.items.flatMap((p: any) => p.contents ?? [])
          }
        } else if (Array.isArray(payload.data)) {
          contents = payload.data
        } else if (Array.isArray(res.data)) {
          contents = res.data
        } else {
          contents = []
        }

        if (mounted) setVideos(contents)
      } catch (err) {
        console.error('Failed to fetch contentinfo/all', err)
        if (mounted) setError('Failed to load featured videos')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [])

  // recursive search helper to find first plausible video URL
  const findVideoUrl = (obj: any, depth = 0): string | null => {
    if (!obj || depth > 10) return null

    if (typeof obj === 'string') {
      const s = obj.trim()
      if (/\.mp4(\?|$)/i.test(s) || /\.m3u8(\?|$)/i.test(s) || /^https?:\/\//i.test(s) || s.startsWith('/')) {
        return s
      }
      return null
    }

    if (Array.isArray(obj)) {
      for (const it of obj) {
        const r = findVideoUrl(it, depth + 1)
        if (r) return r
      }
      return null
    }

    // object: prioritize keys likely to hold urls
    const keysPriority = ['video', 'file', 'url', 'content', 'source', 'media', 'files', 'video_url', 'content_url']
    for (const key of keysPriority) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key]
        if (typeof val === 'string') {
          const s = val.trim()
          if (/\.mp4(\?|$)/i.test(s) || /\.m3u8(\?|$)/i.test(s) || /^https?:\/\//i.test(s) || s.startsWith('/')) {
            return s
          }
        } else {
          const r = findVideoUrl(val, depth + 1)
          if (r) return r
        }
      }
    }

    // general scan
    for (const key of Object.keys(obj)) {
      const val = obj[key]
      if (typeof val === 'string') {
        const s = val.trim()
        if (/\.mp4(\?|$)/i.test(s) || /\.m3u8(\?|$)/i.test(s) || /^https?:\/\//i.test(s) || s.startsWith('/')) {
          return s
        }
      } else if (typeof val === 'object') {
        const r = findVideoUrl(val, depth + 1)
        if (r) return r
      }
    }

    return null
  }

  // resolve relative urls to absolute host (adjust host if assets are on a different origin)
  const resolveUrl = (url: string) => {
    if (!url) return url
    const s = url.toString()
    if (s.startsWith('//')) return window.location.protocol + s
    if (s.startsWith('/')) return 'https://apiv2.mysports.com.bd' + s
    return s
  }

  // destroy any attached hls instance
  const destroyHls = () => {
    const el = videoRef.current as any
    if (!el) return
    const hls: Hls | undefined = el._hls
    if (hls) {
      try { hls.destroy() } catch (e) { /* ignore */ }
      delete el._hls
    }
  }

  // open video: try item fields first, otherwise request details endpoint and search response
  const openVideo = async (item: any) => {
    setError(null)
    setIsVideoPlaying(true)

    try {
      // quick check on the item itself for a playable url
      const candidateFromItem = findVideoUrl(item)
      if (candidateFromItem) {
        const final = resolveUrl(candidateFromItem)
        setSelectedVideo({ ...item, videoUrl: final })
        return
      }

      const playlistType = item.playlist_type ?? 'featured_video'
      const contentId = item.content_id ?? item.id ?? item._id
      const res = await api.post('/contentinfo/details', {
        params: { playlist_type: playlistType, content_id: contentId }
      })

      console.log('details response (raw):', res.data)
      // try finding URL anywhere in res.data or res.data.data
      const payload = res.data?.data ?? res.data ?? res
      const urlFound = findVideoUrl(payload)

      if (!urlFound) {
        console.warn('No video URL found in details response', payload)
        setError('No playable video URL returned from API')
        setIsVideoPlaying(false)
        return
      }

      const finalUrl = resolveUrl(urlFound)
      setSelectedVideo({ ...item, videoUrl: finalUrl })
    } catch (err) {
      console.error('openVideo error', err)
      setError('Failed to load video details')
      setIsVideoPlaying(false)
    }
  }

  // when selectedVideo changes, attach to <video> element with HLS support
  useEffect(() => {
    const attach = () => {
      const videoEl = videoRef.current
      if (!videoEl || !selectedVideo) return
      destroyHls()
      const src = selectedVideo.videoUrl ?? ''
      if (!src) {
        console.warn('selectedVideo has no videoUrl', selectedVideo)
        return
      }
      const isHls = /\.m3u8(\?|$)/i.test(src) || src.includes('.m3u8')
      if (isHls) {
        if (Hls.isSupported()) {
          const hls = new Hls()
          hls.loadSource(src)
          hls.attachMedia(videoEl)
          ;(videoEl as any)._hls = hls
          videoEl.play().catch((e) => console.warn('play promise rejected', e))
        } else {
          // Safari supports HLS natively
          videoEl.src = src
          videoEl.play().catch((e) => console.warn('play promise rejected', e))
        }
      } else {
        videoEl.src = src
        videoEl.play().catch((e) => console.warn('play promise rejected', e))
      }
    }

    const t = setTimeout(attach, 50)
    return () => {
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVideo])

  const handleCloseVideo = () => {
    destroyHls()
    setIsVideoPlaying(false)
    setSelectedVideo(null)
    if (videoRef.current) {
      try {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
        videoRef.current.removeAttribute('src')
        videoRef.current.load()
      } catch (e) { /* ignore */ }
    }
  }

  // escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseVideo()
    }

    if (isVideoPlaying) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isVideoPlaying])

  return (
    <>
      <section className="mt-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900">Featured Videos</h2>
        </div>

        <div className="space-y-3">
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}

          {videos.map((video) => (
            <div
              key={video.content_id ?? video.id ?? video._id}
              className="overflow-hidden cursor-pointer active:scale-95 transition-transform"
              onClick={() => openVideo(video)}
            >
              <div>
                <div
                  className="w-full h-52 relative flex-shrink-0 rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${video.thumbnail ?? video.banner ?? ''})` }}
                >
                  <div className="absolute inset-0 rounded-xl bg-black bg-opacity-30" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute bottom-5 right-5 bg-red-500 bg-opacity-70 text-white text-[14px] px-2 py-0.5 rounded">
                    {video.duration ?? video.video_duration ?? ''}
                  </div>
                </div>

                <div className="flex-1 p-2 pb-0 pl-0">
                  <h3 className="font-normal text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
                    {video.content_title ?? video.title ?? video.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isVideoPlaying && selectedVideo && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent p-4">
            <button
              onClick={handleCloseVideo}
              className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
              onEnded={handleCloseVideo}
            />
          </div>
        </div>
      )}
    </>
  )
}
