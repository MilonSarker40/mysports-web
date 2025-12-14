"use client"

import { useVideoContent } from '@/utils/useVideoContent' 
import VideoPlayerModal from '@/components/VideoPlayerModal' 

import BannerSlider from '../components/BannerSlider'
import LiveMatch from '../components/LiveMatch'
import Tournaments from '../components/Tournaments'
import FeaturedVideos from '../components/FeaturedVideos'
import PopularVideos from '../components/PopularVideos'
import FootballMatch from '@/components/FootballMatch'
import Cricket from '../components/Cricket'
import Trending from '@/components/Trending'


export default function Home() {
  const { 
    videoUrl, 
    handleCloseVideo, 
    videoRef, 
    selectedVideoContent, 
    isVideoPlaying 
  } = useVideoContent() 

  return (
    <div className="min-h-screen">
      
      <BannerSlider />
      
      <div className='bg-[#f3f3f3] relative z-10 rounded-t-2xl pt-2'>
        <LiveMatch />
        <Tournaments />
        <FootballMatch />
        <FeaturedVideos />
        <Cricket />
        <Trending />
        <PopularVideos />
      </div>

      {isVideoPlaying && videoUrl && selectedVideoContent && (
        <VideoPlayerModal 
          videoUrl={videoUrl} 
          handleCloseVideo={handleCloseVideo} 
          videoRef={videoRef}
          // নিশ্চিত করুন যে মোডালে টাইটেলটি পাস করা হচ্ছে
          title={selectedVideoContent.content_title} 
        />
      )}
    </div>
  )
}