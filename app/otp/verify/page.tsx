'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function OTPVerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyOTP, isLoading, error, clearError } = useAuth()
  
  const msisdn = searchParams.get('msisdn') || ''
  const [otp, setOtp] = useState(['', '', '', ''])
  const [timer, setTimer] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Timer effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Take only last character
    setOtp(newOtp)

    // Auto focus next
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto submit if all filled
    if (newOtp.every(digit => digit !== '') && index === 3) {
      handleVerify()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpCode = otp.join('')
    if (otpCode.length !== 4) {
      alert('Please enter 4-digit OTP')
      return
    }

    clearError()
    const success = await verifyOTP(msisdn, otpCode)
    
    if (!success) {
      // Clear OTP on failure
      setOtp(['', '', '', ''])
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
    }
  }

  const handleResendOTP = () => {
    // Implement resend logic here
    setTimer(60)
    setOtp(['', '', '', ''])
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
    alert('New OTP sent!')
  }

  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 11) {
      return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`
    }
    return phone
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
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4 z-20">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 shadow-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Phone/Envelope Icon */}
      <div className="relative w-40 h-40 mt-8 mb-8 flex items-center justify-center">
        <div className="absolute w-28 h-48 bg-white rounded-2xl shadow-xl flex items-center justify-center">
          <div className="w-16 h-12 bg-red-500 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
          </div>
        </div>
        
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-2xl">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* White Card Container */}
      <div className="bg-white rounded-t-3xl shadow-lg w-full flex-grow p-8 mt-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-gray-900 mb-2">OTP Verification</h1>
          <p className="text-gray-600 text-xs mb-1">Enter the 4-digit code sent to</p>
          <p className="text-gray-800 font-semibold text-sm">
            +880 {formatPhoneNumber(msisdn.substring(1))}
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="w-full max-w-xs mb-8">
          <div className="flex justify-between space-x-3 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                disabled={isLoading}
              />
            ))}
          </div>
          
          {/* Timer */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              {timer > 0 ? (
                <>Code expires in <span className="font-bold text-red-500">{timer}s</span></>
              ) : (
                <span className="text-red-500 font-medium">Code expired</span>
              )}
            </p>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={otp.join('').length !== 4 || isLoading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-md text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mb-4"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                VERIFYING...
              </>
            ) : (
              'VERIFY OTP'
            )}
          </button>

          {/* Resend OTP */}
          <div className="text-center">
            <button
              onClick={handleResendOTP}
              disabled={timer > 0 || isLoading}
              className="text-sm text-red-500 hover:text-red-600 disabled:text-gray-400"
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
            </button>
          </div>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-50 rounded-lg w-full max-w-xs">
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-600 font-medium">Debug Info</summary>
              <div className="mt-2 space-y-1">
                <p>MSISDN: {msisdn}</p>
                <p>OTP: {otp.join('')}</p>
                <p>API Format: 880{msisdn.substring(1)}</p>
                <p>Status: {isLoading ? 'Loading...' : 'Ready'}</p>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}