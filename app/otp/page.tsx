'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OTPPage() {
  const router = useRouter()
  // Initial state is hardcoded for demonstration, as in your original code
  const [mobileNumber, setMobileNumber] = useState('01679568805')

  const handleSendOTP = () => {
    // In a real application, you would send the OTP request to your backend here.
    console.log(`Sending OTP to: +${mobileNumber}`)
    // Navigate to OTP verification page
    router.push('/otp/verify')
  }

  return (
    <div className="h-screen bg-red-500 relative overflow-hidden flex flex-col items-center pt-20">
      
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
        
        {/* OTP Verification Header */}
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
              {/* Added '0' to match the image prefix */}
              {/* <span className="text-gray-500">+0</span> */}
            </div>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              // Changed focus ring to red-500
              className="w-full pl-9 pr-4 py-3 border-b-2 border-[#c8cccf] text-center text-black
         focus:outline-none focus:ring-0 focus:border-b-red-500
         text-lg font-semibold"
              placeholder="Enter mobile number"
            />
          </div>
        </div>

        {/* Send OTP Button */}
        <button
          onClick={handleSendOTP}
          // Changed button color to red-500
          className="w-full max-w-xs bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-md text-sm"
        >
          SEND OTP
        </button>
      </div>
    </div>
  )
}

