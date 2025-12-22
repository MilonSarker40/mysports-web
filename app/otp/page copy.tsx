'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function OTPPage() {
  const router = useRouter()
  const { sendOTP, isLoading } = useAuth()

  /* -----------------------------
     USER INPUT (UI ONLY)
  ----------------------------- */
  const [mobileNumber, setMobileNumber] = useState('')

  const handleSendOTP = async () => {
    // 🔹 UI validation only
    if (!mobileNumber) return

    // ❗ IMPORTANT: number পাঠানো হচ্ছে না
    const ok = await sendOTP()
    if (ok) {
      router.push('/otp/verify')
    }
  }

  return (
    <div className="min-h-screen bg-red-500 relative overflow-hidden flex flex-col items-center pt-10">
      
      {/* Back Arrow */}
      <div
        className="absolute top-4 left-4 cursor-pointer"
        onClick={() => router.back()}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </div>

      {/* Icon */}
      <div className="relative w-40 h-40 mt-8 mb-12 flex items-center justify-center">
        <div className="absolute w-28 h-48 bg-white rounded-2xl shadow-xl flex items-center justify-center">
          <div className="w-16 h-12 bg-red-500 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
        </div>
      </div>

      {/* White Card */}
      <div className="bg-white rounded-t-3xl shadow-lg w-full flex-grow p-8 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-gray-900 mb-2">
            OTP Verification
          </h1>
          <p className="text-gray-600 text-xs mb-1">
            We will send you an One Time Password
          </p>
          <p className="text-gray-600 text-xs">
            on this mobile number
          </p>
        </div>

        {/* Mobile Input (UI only) */}
        <div className="w-full max-w-xs mb-8">
          <label className="block text-xs font-bold text-gray-700 mb-2 text-center">
            Enter Mobile Number
          </label>

          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="018XXXXXXXX"
            className="w-full pl-4 pr-4 py-3 border-b-2 border-[#c8cccf] text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Send OTP */}
        <button
          onClick={handleSendOTP}
          disabled={isLoading}
          className="w-full max-w-xs bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 rounded-lg"
        >
          {isLoading ? 'SENDING OTP...' : 'SEND OTP'}
        </button>
      </div>
    </div>
  )
}
