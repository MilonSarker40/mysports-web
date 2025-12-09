// components/BannerSlider.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const bannerSlides = [
  {
    id: 'b1',
    image: '/images/banner-slider-img-1.png'
  },
  {
    id: 'b2', 
    image: '/images/banner-slider-img-2.webp'
  },
  {
    id: 'b3',
    image: '/images/banner-slider-img-3.webp'
  }
]

export default function BannerSlider() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative px-4 bg-white rounded-t-2xl pb-4 pt-5">
      <div className="h-60 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center rounded-2xl transition-all duration-500"
          style={{
            backgroundImage: `url(${bannerSlides[currentSlide].image})`
          }}
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>
      {/* <div className="p-4">
  <button 
    onClick={() => router.push('/otp')}
    className="w-full bg-blue-600 text-white py-2 rounded-lg"
  >
    Go to OTP Verification
  </button>
</div> */}
    </div>
  )
}