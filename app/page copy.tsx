// app/page.tsx
import BannerSlider from '../components/BannerSlider'
import LiveMatch from '../components/LiveMatch'
import Tournaments from '../components/Tournaments'
import FeaturedVideos from '../components/FeaturedVideos'
import PopularVideos from '../components/PopularVideos'
import FootballMatch from '@/components/FootballMatch'
import Cricket from '../components/Cricket'
import Trending from '@/components/Trending'



export default function Home() {
  return (
    <div className="min-h-screen">
      {/* <BannerSlider /> */}
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
    </div>
  )
}


