'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OTPVerifyPage() {
  const router = useRouter()
  // Assuming a 4-digit OTP based on the image
  const [otp, setOtp] = useState(['', '', '', '']) 
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  // For production, you should pass this via state/query params from OTPPage
  const mobileNumber = '01679568805' 

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    // Basic number validation
    const cleanValue = value.replace(/[^0-9]/g, '')

    if (cleanValue.length > 1) {
      // Handle paste
      const pastedValues = cleanValue.split('').slice(0, 4 - index)
      const newOtp = [...otp]
      pastedValues.forEach((val, i) => {
        if (index + i < 4) {
          newOtp[index + i] = val
        }
      })
      setOtp(newOtp)
      
      // Focus next available input or verify button
      const nextIndex = Math.min(index + pastedValues.length, 3)
      if (nextIndex < 4 && inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus()
      }
      return
    }

    // Single character input
    if (cleanValue.length === 1 || cleanValue === '') {
        const newOtp = [...otp]
        newOtp[index] = cleanValue
        setOtp(newOtp)

        // Auto-focus next input
        if (cleanValue && index < 3) {
            if (inputRefs.current[index + 1]) {
                inputRefs.current[index + 1].focus()
            }
        }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
        if (!otp[index] && index > 0) {
            // Move to previous input on backspace if current is empty
            if (inputRefs.current[index - 1]) {
                inputRefs.current[index - 1].focus()
                // Clear the previous input's value for a seamless backspace experience
                const newOtp = [...otp]
                newOtp[index - 1] = ''
                setOtp(newOtp)
            }
        }
    }
  }

  const handleVerify = () => {
    const enteredOtp = otp.join('')
    if (enteredOtp.length === 4) {
      // Here you would typically verify the OTP with your backend
      console.log('Verifying OTP:', enteredOtp)
      // For demo, just go back to previous page
      router.back()
    }
  }

  const handleResendOTP = () => {
    // Implement OTP resend logic here
    console.log('Resending OTP...')
    // Optionally clear the OTP fields
    setOtp(['', '', '', ''])
    if (inputRefs.current[0]) {
        inputRefs.current[0].focus()
    }
  }

  return (
    <div className="min-h-screen bg-red-500 relative overflow-hidden flex flex-col items-center pt-20">
      
      {/* Back Arrow - styled to match image */}
      <div className="absolute top-4 left-4 cursor-pointer" onClick={() => router.back()}>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
      </div>

      {/* Decorative Background Elements (Stars/Dots) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <span className="absolute block w-2 h-2 bg-white rounded-full opacity-50 animate-pulse" style={{ top: '10%', left: '15%' }}></span>
        <span className="absolute block w-1 h-1 bg-white rounded-full opacity-50 animate-pulse delay-100" style={{ top: '25%', right: '20%' }}></span>
        <span className="absolute block w-3 h-3 bg-white rounded-full opacity-50 animate-pulse delay-200" style={{ top: '30%', left: '5%' }}></span>
        <span className="absolute block w-1 h-1 bg-white rounded-full opacity-50 animate-pulse delay-300" style={{ top: '5%', right: '5%' }}></span>
        <span className="absolute block w-2 h-2 bg-white rounded-full opacity-50 animate-pulse" style={{ top: '20%', left: '80%' }}></span>
        <span className="absolute block w-1 h-1 bg-white rounded-full opacity-50 animate-pulse delay-150" style={{ top: '15%', left: '40%' }}></span>
      </div>

      {/* Mobile Phone/Envelope Icon Section */}
      <div className="relative w-40 h-40 mt-8 mb-12 flex items-center justify-center">
        <div className="absolute w-28 h-48 bg-white rounded-2xl shadow-xl flex items-center justify-center">
          <div className="w-16 h-12 bg-red-500 rounded-lg flex items-center justify-center">
            {/* Envelope Icon */}
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
          </div>
        </div>
        {/* Yellow Notification Dot */}
        <div className="absolute -top-4 -right-4">
          <div className="w-4 h-4 rounded-full bg-yellow-300 animate-ping"></div>
          <div className="w-4 h-4 rounded-full bg-yellow-300 absolute top-0 left-0 animate-pulse"></div>
        </div>
        {/* Dashed Circle Effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-white opacity-20 rounded-full animate-spin-slow"></div>
      </div>

      {/* White Card Container */}
      <div className="bg-white rounded-t-3xl shadow-lg w-full flex-grow p-8 mt-10 flex flex-col items-center">

        {/* OTP Code Header */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-gray-900 mb-2">OTP Code</h1>
          {/* Displaying mobile number with '+0' prefix to match the image */}
          <p className="text-gray-600 font-medium">Enter the OTP sent to <strong>{mobileNumber}</strong></p> 
        </div>

        {/* OTP Input Boxes */}
        <div className="w-full max-w-sm mb-8">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4} // Allows paste of up to 4 characters
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                // Changed focus ring to red-500
                className="w-16 h-16 border-b-2 border-[#c8cccf] text-center text-2xl font-semibold text-black-900 focus:outline-none focus:border-red-500"
              />
            ))}
          </div>
        </div>

        {/* Resend OTP */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-xs">
            Don't receive the OTP?{' '}
            <button
              onClick={handleResendOTP}
              // Changed text color to red-500
              className="text-red-500 hover:text-red-600 font-medium ml-1"
            >
              RESEND OTP
            </button>
          </p>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={otp.join('').length !== 4}
          // Changed button color to red-500
          className="w-full max-w-xs bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-md text-lg"
        >
          VERIFY
        </button>
      </div>
    </div>
  )
}