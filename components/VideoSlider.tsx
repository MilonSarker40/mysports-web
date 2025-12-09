// components/VideoSlider.tsx
'use client'
import React, { useRef } from 'react'
import { Content } from '@/utils/useVideoContent' // Assuming correct path

interface VideoSliderProps {
    title: string
    videos: Content[]
    // The handler now requires playlistType as the second argument
    handleVideoPlay: (video: Content, playlistType: string) => void 
    playlistType: string; // The type received from VideoPlaylistSlider
}

export default function VideoSlider({ title, videos, handleVideoPlay, playlistType }: VideoSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    // Function to handle click and pass BOTH video and playlistType
    const handleClick = (video: Content) => {
        // ⭐ CRITICAL: Pass the specific playlistType along with the video content
        handleVideoPlay(video, playlistType); 
    }

    return (
        <section className="mt-4 px-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <button className="text-red-600 text-sm font-medium">See All</button>
            </div>

            <div className="relative">
                <div 
                    ref={scrollRef}
                    className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                >
                    {videos.map((video) => (
                        <div 
                            key={video.content_id} 
                            className="flex-shrink-0 w-64 overflow-hidden cursor-pointer active:scale-95 transition-transform"
                            onClick={() => handleClick(video)} 
                        >
                            <div className="">
                                <div 
                                    className="w-full h-[140px] relative rounded-2xl flex-shrink-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${video.thumbnail})` }}
                                >
                                    {video.is_premium === 'true' && (
                                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                            PRO
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 p-3 pl-0">
                                    <h3 className="font-normal text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
                                        {video.content_title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    )
}