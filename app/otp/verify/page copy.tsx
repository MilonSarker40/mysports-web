'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function OTPVerifyPage() {
  const router = useRouter()
  const { verifyOTP, sendOTP, isLoading } = useAuth()

  /* -----------------------------
     STATE
  ----------------------------- */
  const [otp, setOtp] = useState(['', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  /* -----------------------------
     GET NUMBER FROM STORAGE
  ----------------------------- */
  const mobileNumber =
    typeof window !== 'undefined'
      ? localStorage.getItem('msisdn')
      : null

  /* -----------------------------
     SAFETY + AUTO FOCUS
  ----------------------------- */
  useEffect(() => {
    if (!mobileNumber) {
      router.replace('/otp')
      return
    }
    inputRefs.current[0]?.focus()
  }, [mobileNumber, router])

  /* -----------------------------
     INPUT CHANGE
  ----------------------------- */
  const handleChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '')

    if (cleanValue.length > 1) {
      const pasted = cleanValue.split('').slice(0, 4 - index)
      const newOtp = [...otp]

      pasted.forEach((v, i) => {
        if (index + i < 4) newOtp[index + i] = v
      })

      setOtp(newOtp)
      return
    }

    const newOtp = [...otp]
    newOtp[index] = cleanValue
    setOtp(newOtp)

    if (cleanValue && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  /* -----------------------------
     BACKSPACE
  ----------------------------- */
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp]
      newOtp[index - 1] = ''
      setOtp(newOtp)
      inputRefs.current[index - 1]?.focus()
    }
  }

  /* -----------------------------
     VERIFY OTP
  ----------------------------- */
  const handleVerify = async () => {
    const enteredOtp = otp.join('')
    if (enteredOtp.length !== 4) return

    await verifyOTP(enteredOtp)
  }

  /* -----------------------------
     RESEND OTP ✅ FIXED
  ----------------------------- */
  const handleResendOTP = async () => {
    await sendOTP() // ✅ NO ARGUMENT
    setOtp(['', '', '', ''])
    inputRefs.current[0]?.focus()
  }

  /* =============================
     UI (UNCHANGED)
  ============================= */
  return (
    <div className="min-h-screen bg-red-500 relative overflow-hidden flex flex-col items-center pt-10">
      <div
        className="absolute top-4 left-4 cursor-pointer"
        onClick={() => router.back()}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </div>

      <div className="bg-white rounded-t-3xl shadow-lg w-full flex-grow p-8 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-gray-900 mb-2">OTP Code</h1>
          <p className="text-gray-600 font-medium">
            Enter the OTP sent to <strong>{mobileNumber}</strong>
          </p>
        </div>

        <div className="flex justify-center space-x-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-16 h-16 border-b-2 border-[#c8cccf] text-center text-2xl font-semibold focus:outline-none focus:border-red-500"
            />
          ))}
        </div>

        <p className="text-gray-600 text-xs mb-8">
          Don&apos;t receive the OTP?
          <button onClick={handleResendOTP} className="text-red-500 font-medium ml-1">
            RESEND OTP
          </button>
        </p>

        <button
          onClick={handleVerify}
          disabled={otp.join('').length !== 4 || isLoading}
          className="w-full max-w-xs bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 rounded-lg"
        >
          {isLoading ? 'VERIFYING...' : 'VERIFY'}
        </button>
      </div>
    </div>
  )
}
