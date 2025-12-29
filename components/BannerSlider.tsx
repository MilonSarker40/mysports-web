// components/BannerSlider.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBannerStore } from '@/store/useBannerStore'

export default function BannerSlider() {
  const router = useRouter()
  const { banners, loading, error, fetchBanners } = useBannerStore()
  const [currentSlide, setCurrentSlide] = useState(0)

  /* ---------------- FETCH BANNERS ---------------- */
  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  /* ---------------- AUTO SLIDE ---------------- */
  useEffect(() => {
    if (!banners || banners.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [banners])

  /* ---------------- CLICK HANDLER ---------------- */
  const handleClick = (item: typeof banners[number]) => {
    if (!item) return

    // ✅ QUIZ banner → internal quiz page
    if (item.content_type === 'web_link' && item.content_title === 'QUIZ') {
      router.push('/quiz')
      return
    }

    // ✅ Other web links → external
    if (item.content_type === 'web_link' && item.url) {
      window.location.href = item.url
      return
    }

    // ✅ News banner
    if (item.content_type === 'news' && item.content_id) {
      router.push(`/news/${item.content_id}`)
      return
    }

    // fallback
    if (item.content_id) {
      router.push(`/news/${item.content_id}`)
    }
  }

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="relative px-4 bg-white rounded-t-2xl pb-4 pt-5">
        <div className="h-60 flex items-center justify-center">
          <p>Loading banners...</p>
        </div>
      </div>
    )
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div className="relative px-4 bg-white rounded-t-2xl pb-4 pt-5">
        <div className="h-60 flex items-center justify-center">
          <p className="text-red-500">Failed to load banners</p>
        </div>
      </div>
    )
  }

  /* ---------------- EMPTY ---------------- */
  if (!banners || banners.length === 0) {
    return (
      <div className="relative px-4 bg-white rounded-t-2xl pb-4 pt-5">
        <div className="h-60 flex items-center justify-center">
          <p>No banners available</p>
        </div>
      </div>
    )
  }

  const current = banners[currentSlide]

  /* ---------------- UI ---------------- */
  return (
    <div className="relative px-4 bg-white rounded-t-2xl pb-4 pt-5">
      <div className="h-60 relative overflow-hidden rounded-2xl">
        {/* Banner Image */}
        <div
          onClick={() => handleClick(current)}
          role="button"
          className="absolute inset-0 bg-cover bg-center transition-all duration-500 cursor-pointer"
          style={{
            backgroundImage: `url(${current.banner || current.thumbnail})`,
          }}
        />

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50'
              }`}
              aria-label={`go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
