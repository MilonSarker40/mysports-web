// components/VideoPlayerModal.tsx
'use client'
import React, { RefObject } from 'react'

interface VideoPlayerModalProps {
    videoUrl: string | null
    handleCloseVideo: () => void
    videoRef: RefObject<HTMLVideoElement>
    title: string
}

export default function VideoPlayerModal({ 
    videoUrl, 
    handleCloseVideo, 
    videoRef,
    title
}: VideoPlayerModalProps) {

    if (!videoUrl) return null // Don't render if there's no URL

    return (
        <div className="fixed inset-0 bg-black z-[999999999] flex flex-col">
            {/* Header with Close Button */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
                <h3 className="text-white text-lg font-bold truncate pr-4">{title}</h3>
                
                {/* Close Button */}
                <button
                    onClick={handleCloseVideo}
                    className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Video Player - Takes full screen */}
            <div className="flex-1 flex items-center justify-center pt-12 pb-4">
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    playsInline
                    onEnded={handleCloseVideo}
                    src={videoUrl} 
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    )
}