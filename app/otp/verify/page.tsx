// app/otp/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function OTPPage() {
  const router = useRouter()
  const { sendOTP, getMSISDN, isLoading, error, clearError } = useAuth()
  
  const [mobileNumber, setMobileNumber] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  // Fetch mobile number on initial load
  useEffect(() => {
    const fetchNumber = async () => {
      const fetchedMsisdn = await getMSISDN()
      if (fetchedMsisdn) {
        setMobileNumber(fetchedMsisdn)
      }
    }
    fetchNumber()
  }, [getMSISDN])

  const handleSendOTP = async () => {
    if (!mobileNumber || mobileNumber.length < 11) {
      alert('Please enter a valid 11-digit mobile number.')
      return
    }

    clearError()
    setIsSending(true)
    
    // Convert 01XXXXXXXXX to 880XXXXXXXXXX format for API
    let formattedNumber = mobileNumber
    if (mobileNumber.startsWith('01') && mobileNumber.length === 11) {
      formattedNumber = '880' + mobileNumber.substring(1)
    }
    
    console.log('Sending OTP to formatted number:', formattedNumber)
    const success = await sendOTP(formattedNumber)
    setIsSending(false)

    if (success) {
      // Pass the original number (01 format) to verify page for display
      router.push(`/otp/verify?msisdn=${mobileNumber}`)
    }
  }

  // Format phone number display as user types
  const handlePhoneChange = (value: string) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '')
    
    // Limit to 11 digits
    if (digitsOnly.length <= 11) {
      setMobileNumber(digitsOnly)
    }
  }

  // Format phone number for display
  const formatPhoneDisplay = (phone: string) => {
    if (phone.length <= 3) return phone
    if (phone.length <= 7) return `${phone.slice(0, 3)}-${phone.slice(3)}`
    return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7, 11)}`
  }

  return (
    <div className="h-screen bg-red-500 relative overflow-hidden flex flex-col items-center pt-20">
      
      {/* Back Arrow */}
      <div className="absolute top-4 left-4 cursor-pointer" onClick={() => router.back()}>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4 z-20">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 shadow-lg">
            <div className="flex">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Background Elements */}
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
        
        {/* Loading Spinner when sending */}
        {(isLoading || isSending) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-2xl">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* White Card Container */}
      <div className="bg-white rounded-t-3xl shadow-lg w-full flex-grow p-8 mt-10 flex flex-col items-center">
        
        {/* OTP Verification Header */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-gray-900 mb-2">OTP Verification</h1>
          <p className="text-gray-600 text-xs mb-1">We will send you a One Time Password</p>
          <p className="text-gray-600 text-xs">on this mobile number</p>
          
          {/* Auto-detected indicator */}
          {mobileNumber && (
            <div className="mt-2 inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Auto-detected
            </div>
          )}
        </div>

        {/* Mobile Number Input */}
        <div className="w-full max-w-xs mb-8">
          <label className="block text-xs font-bold text-gray-700 mb-2 text-center">
            Enter Mobile Number
          </label>
          <div className="relative">
            {/* Country Code */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-700 font-medium">+880</span>
            </div>
            
            {/* Phone Input */}
            <input
              type="tel"
              value={formatPhoneDisplay(mobileNumber)}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="w-full pl-16 pr-4 py-4 border-b-2 border-[#c8cccf] text-center text-black focus:outline-none focus:ring-0 focus:border-b-red-500 text-lg font-semibold tracking-wider"
              placeholder="1XX-XXX-XXXX"
              disabled={isLoading || isSending}
              inputMode="numeric"
              maxLength={13} // For formatted display: 3-4-4 plus dashes
            />
            
            {/* Clear button */}
            {mobileNumber && (
              <button
                onClick={() => setMobileNumber('')}
                className="absolute inset-y-0 right-3 flex items-center"
                type="button"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Helper text */}
          <div className="flex justify-between mt-2">
            <p className="text-xs text-gray-500">
              Enter 11-digit number
            </p>
            <p className="text-xs text-gray-500">
              {mobileNumber.length}/11
            </p>
          </div>
          
          {/* Format example */}
          <div className="mt-1 text-center">
            <p className="text-xs text-gray-400">
              Example: 017XXXXXXXX
            </p>
          </div>
        </div>

        {/* Send OTP Button */}
        <button
          onClick={handleSendOTP}
          disabled={!mobileNumber || mobileNumber.length < 11 || isLoading || isSending}
          className="w-full max-w-xs bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-4 rounded-lg transition duration-200 shadow-md text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading || isSending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              SENDING OTP...
            </>
          ) : (
            'SEND OTP'
          )}
        </button>
        
        {/* API Info (for debugging) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-50 rounded-lg w-full max-w-xs">
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-600 font-medium">Debug Info</summary>
              <div className="mt-2 space-y-1">
                <p>Raw input: {mobileNumber}</p>
                <p>Formatted for API: 880{mobileNumber.substring(1)}</p>
                <p>Endpoint: /api/v1/otp/wap/880{mobileNumber.substring(1)}</p>
                <p>Status: {isLoading ? 'Loading...' : 'Ready'}</p>
              </div>
            </details>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 max-w-xs">
            By continuing, you agree to our{' '}
            <button className="text-red-500 hover:underline">Terms & Conditions</button>
            {' '}and{' '}
            <button className="text-red-500 hover:underline">Privacy Policy</button>
          </p>
        </div>
        
        {/* Support Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Need help? Call{' '}
            <a href="tel:22222" className="text-red-500 font-bold">22222</a>
          </p>
        </div>
      </div>
    </div>
  )
}