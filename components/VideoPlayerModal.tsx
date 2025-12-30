'use client'

import React, { RefObject } from 'react'
import { createPortal } from 'react-dom'

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
  title,
}: VideoPlayerModalProps) {
  if (!videoUrl) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
        <h3 className="text-white text-lg font-bold truncate pr-4">
          {title}
        </h3>

        <button
          onClick={handleCloseVideo}
          className="bg-black/60 rounded-full p-2 hover:bg-black/80 transition"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* VIDEO */}
      <div className="flex-1 flex items-center justify-center pt-12">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls
          autoPlay
          playsInline
          onEnded={handleCloseVideo}
          src={videoUrl}
        />
      </div>
    </div>,
    document.body
  )
}
