// components/BannerSlider.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBannerStore } from '@/store/useBannerStore'

export default function BannerSlider() {
  const router = useRouter()
  const { banners, loading, error, fetchBanners } = useBannerStore()
  const [currentSlide, setCurrentSlide] = useState(0)

  // fetch banners on mount
  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  // auto-slide when banners change or on interval
  useEffect(() => {
    if (!banners || banners.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [banners])

  const handleClick = (item: typeof banners[number]) => {
    if (!item) return
    if (item.url) {
      router.push(item.url)
      return
    }

    // fallback: route by content_type
    // if (item.content_type === 'news') {
    //   router.push(`/news/${item.content_id}`)
    //   return
    // }

    // default fallback: open content in same domain path
    router.push(`/content/${item.content_id}`)
  }

  if (loading) {
    return (
      <div className="relative px-4 bg-white rounded-t-2xl pb-4 pt-5">
        <div className="h-60 flex items-center justify-center">
          <p>Loading banners...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative px-4 bg-white rounded-t-2xl pb-4 pt-5">
        <div className="h-60 flex items-center justify-center">
          <p className="text-red-500">Failed to load banners</p>
        </div>
      </div>
    )
  }

  if (!banners || banners.length === 0) {
    // fallback to static placeholder if desired
    return (
      <div className="relative px-4 bg-white rounded-t-2xl pb-4 pt-5">
        <div className="h-60 flex items-center justify-center">
          <p>No banners available</p>
        </div>
      </div>
    )
  }

  const current = banners[currentSlide]

  return (
    <div className="relative px-4 bg-white rounded-t-2xl pb-4 pt-5">
      <div className="h-60 relative overflow-hidden rounded-2xl">
        {/* <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
          }
          className="absolute left-2 top-1/2 w-5 h-10 transform -translate-y-1/2 z-20 bg-red-700 bg-opacity-50 rounded-full p-2"
          aria-label="previous"
        >
          ‹
        </button> */}

        <div
          onClick={() => handleClick(current)}
          role="button"
          className="absolute inset-0 bg-cover bg-center transition-all duration-500 cursor-pointer"
          style={{
            backgroundImage: `url(${current.banner || current.thumbnail})`,
          }}
        >
          {/* optional overlay for title */}
          {/* <div className="absolute bottom-4 left-4 right-4 text-white text-sm bg-black bg-opacity-30 rounded p-2">
            <div className="truncate">{current.content_title}</div>
          </div> */}
        </div>

        {/* <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-20 rounded-full p-2"
          aria-label="next"
        >
          ›
        </button> */}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
