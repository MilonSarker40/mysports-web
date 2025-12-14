// app/otp/page.tsx - FINAL SINGLE VERSION
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function OTPPage() {
  const router = useRouter()
  const { sendOTP, getMSISDN, isLoading, error, clearError } = useAuth()
  
  const [mobileNumber, setMobileNumber] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  useEffect(() => {
    const fetchNumber = async () => {
      console.log('🔄 Fetching MSISDN...')
      const fetchedMsisdn = await getMSISDN()
      console.log('Fetched MSISDN:', fetchedMsisdn)
      if (fetchedMsisdn) {
        setMobileNumber(fetchedMsisdn)
      }
    }
    fetchNumber()
  }, [])

  const handleSendOTP = async () => {
    if (!mobileNumber || mobileNumber.length < 11) {
      alert('Please enter a valid 11-digit mobile number.')
      return
    }

    clearError()
    setIsSending(true)
    
    // OTP পাঠানো
    const success = await sendOTP(mobileNumber)
    setIsSending(false)

    if (success) {
      router.push(`/otp/verify?msisdn=${mobileNumber}`)
    }
  }

  return (
    <div className="h-screen bg-red-500 relative overflow-hidden flex flex-col items-center pt-20">
      
      {/* Back Arrow */}
      <div className="absolute top-4 left-4 cursor-pointer" onClick={() => router.back()}>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Mobile Phone/Envelope Icon Section */}
      <div className="relative w-40 h-40 mt-8 mb-12 flex items-center justify-center">
        <div className="absolute w-28 h-48 bg-white rounded-2xl shadow-xl flex items-center justify-center">
          <div className="w-16 h-12 bg-red-500 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* White Card Container */}
      <div className="bg-white rounded-t-3xl shadow-lg w-full flex-grow p-8 mt-10 flex flex-col items-center">
        
        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-gray-900 mb-2">OTP Verification</h1>
          <p className="text-gray-600 text-xs mb-1">We will send you an One Time Password</p>
          <p className="text-gray-600 text-xs">on this mobile number</p>
        </div>

        {/* Mobile Number Input */}
        <div className="w-full max-w-xs mb-8">
          <label className="block text-xs font-bold text-gray-700 mb-2 text-center">
            Enter Mobile Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">+880</span>
            </div>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '')
                if (value.length <= 11) {
                  setMobileNumber(value)
                }
              }}
              className="w-full pl-12 pr-4 py-3 border-b-2 border-[#c8cccf] text-center text-black focus:outline-none focus:ring-0 focus:border-b-red-500 text-lg font-semibold"
              placeholder="017XXXXXXXX"
              disabled={isLoading || isSending}
              maxLength={11}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Enter your 11-digit mobile number
          </p>
        </div>

        {/* Send OTP Button */}
        <button
          onClick={handleSendOTP}
          disabled={!mobileNumber || mobileNumber.length < 11 || isLoading || isSending}
          className="w-full max-w-xs bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-md text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading || isSending ? 'SENDING...' : 'SEND OTP'}
        </button>
        
        {/* Debug Info */}
        <div className="mt-6 p-3 bg-gray-100 rounded w-full max-w-xs">
          <p className="text-xs text-gray-600 text-center">
            API Call: POST /otp/880{mobileNumber.substring(1)}
          </p>
        </div>
      </div>
    </div>
  )
}