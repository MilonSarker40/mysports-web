// pages/content/[id].tsx
'use client'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import api from '@/utils/api'

type ContentDetail = {
  content_id?: string
  content_title?: string
  banner?: string
  thumbnail?: string
  video_url?: string
  video?: string
  // ...any other fields returned by your detail endpoint
}

export default function ContentDetailPage() {
  const router = useRouter()
  const { id } = router.query as { id?: string }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ContentDetail | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // helper: try a few endpoint shapes
  const fetchDetailById = async (contentId: string) => {
    setLoading(true)
    setError(null)
    const endpoints = [
      `/contentinfo/details/${contentId}`,
      `/contentinfo/${contentId}`,
      `/contentinfo/content/${contentId}`,
      `/content/${contentId}`,
      `/content/[id]`,
      // add more if your backend uses other routes
    ]

    for (const ep of endpoints) {
      try {
        const res = await api.post(ep)
        // if success and has data, return it
        if (res?.data) {
          return res.data
        }
      } catch (err) {
        // ignore and try next
      }
    }

    // final fallback: no detail endpoint — return null so caller can try CDN pattern
    return null
  }

  // optional: guess CDN pattern for mp4 (enable if you have such pattern)
  const guessCdnVideoUrl = (contentId: string) => {
    // --------- EDIT THIS if you have a different pattern ----------
    return `https://cdn.mysports.com.bd/videos/${contentId}.mp4`
    // ----------------------------------------------------------------
  }

  useEffect(() => {
    if (!id) return
    let mounted = true

    ;(async () => {
      setLoading(true)
      setError(null)
      setData(null)

      try {
        const detail = await fetchDetailById(id)

        if (mounted && detail) {
          // if the endpoint returns { data: { ... } } or returns the object directly handle both
          const payload = detail?.data ?? detail
          setData(payload)
          setLoading(false)
          return
        }

        // if no endpoint returned anything, try to make a best guess
        const guessedUrl = guessCdnVideoUrl(id)
        const guessedData: ContentDetail = {
          content_id: id,
          content_title: 'Video',
          banner: guessedUrl ? guessedUrl.replace('.mp4', '.jpg') : undefined, // optional guessed poster
          video_url: guessedUrl
        }
        setData(guessedData)
        setLoading(false)
      } catch (err: any) {
        setError(err?.message || 'Failed to load content')
        setLoading(false)
      }
    })()

    return () => { mounted = false }
  }, [id])

  // autoplay if video_url present
  useEffect(() => {
    if (!data) return
    const possible = [data.video_url, data.video, (data as any).videoUrl, (data as any).play_url].filter(Boolean)
    if (possible.length && videoRef.current) {
      videoRef.current.src = possible[0] as string
      videoRef.current.play().catch(() => {})
    }
  }, [data])

  if (!id) return <div className="p-6">Invalid content id</div>

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-4">
        <button onClick={() => router.back()} className="inline-block mb-4 px-3 py-1 bg-gray-100 rounded">← Back</button>

        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}

        {!loading && data && (
          <div>
            <h1 className="text-2xl font-bold mb-4">{data.content_title || 'Video'}</h1>

            { (data.video_url || (data as any).video || (data as any).videoUrl) ? (
              <video
                ref={videoRef}
                controls
                className="w-full max-h-[70vh] bg-black rounded"
                poster={data.thumbnail || data.banner}
              />
            ) : (
              // If no video, still show banner
              <img src={data.banner || data.thumbnail} alt={data.content_title} className="w-full rounded" />
            )}

            <div className="mt-4 text-sm text-gray-600">
              <p>ID: {data.content_id}</p>
              <p>Banner: {data.banner ? 'available' : 'not available'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
