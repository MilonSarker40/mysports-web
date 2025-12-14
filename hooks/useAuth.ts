// hooks/useAuth.ts - CORRECTED
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = 'https://apiv2.mysports.com.bd/api/v1'

interface UserInfo {
  uuid: string
  operatorname: string
  msisdn: string
  logo: string
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { login, logout: zustandLogout } = useAuthStore()

  const clearError = () => setError(null)

  const getMSISDN = async (): Promise<string | null> => {
    setIsLoading(true)
    clearError()
    
    try {
      console.log('📡 Calling: GET /get-msisdn')
      const response = await fetch(`${API_BASE_URL}/get-msisdn`)
      
      if (!response.ok) {
        console.log('❌ get-msisdn failed, returning null')
        return null
      }
      
      const data = await response.json()
      console.log('✅ get-msisdn response:', data)
      
      if (data.success && data.user_info) {
        // 880XXXXXXXXXX থেকে 01XXXXXXXXX তে কনভার্ট
        const msisdn880 = data.user_info.msisdn // "8801810829499"
        if (msisdn880.startsWith('880') && msisdn880.length === 13) {
          const localFormat = '0' + msisdn880.substring(3) // "01810829499"
          console.log('🔄 Converted to local format:', localFormat)
          return localFormat
        }
        return msisdn880
      }
      
      return null
    } catch (error) {
      console.error('Error fetching MSISDN:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const sendOTP = async (msisdn: string): Promise<boolean> => {
    setIsLoading(true)
    clearError()
    
    try {
      // প্রথমে 01 ফরম্যাট চেক করুন
      if (!msisdn.startsWith('01') || msisdn.length !== 11) {
        setError('Please enter valid 11-digit number (e.g., 017XXXXXXXX)')
        return false
      }

      // 01XXXXXXXXX → 880XXXXXXXXXX
      const formattedNumber = '880' + msisdn.substring(1)
      console.log('📱 Formatted for API:', formattedNumber)
      
      // আপনার API অনুযায়ী: /otp/{msisdn} (NOT /otp/wap/{msisdn})
      console.log('📡 Calling: POST /otp/' + formattedNumber)
      
      const response = await fetch(`${API_BASE_URL}/otp/${formattedNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}) // আপনার API-তে বডি খালি থাকতে পারে
      })
      
      console.log('📊 Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ OTP API error:', errorText)
        
        // 508 এরর এর জন্য স্পেসিফিক হ্যান্ডলিং
        if (response.status === 508) {
          setError('OTP service is temporarily unavailable. Please try again.')
        } else {
          setError('Failed to send OTP. Please try again.')
        }
        return false
      }
      
      const data = await response.json()
      console.log('✅ OTP send response:', data)
      
      // আপনার API রেসপন্স: {"accessinfo": {...}}
      if (data.accessinfo) {
        return true
      }
      
      return false
      
    } catch (error) {
      console.error('🚨 Error sending OTP:', error)
      setError('Network error. Please check your connection.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async (msisdn: string, otpCode: string): Promise<boolean> => {
    setIsLoading(true)
    clearError()
    
    try {
      // OTP ভ্যালিডেশন
      if (otpCode.length !== 4 || !/^\d{4}$/.test(otpCode)) {
        setError('Please enter valid 4-digit OTP code')
        return false
      }

      // নম্বর ফরম্যাট ঠিক করা
      let formattedMsisdn = msisdn
      if (msisdn.startsWith('01') && msisdn.length === 11) {
        formattedMsisdn = '880' + msisdn.substring(1)
      }

      console.log('🔐 Verifying OTP:', {
        local: msisdn,
        api: formattedMsisdn,
        otp: otpCode
      })
      
      // OTP যাচাই API কল
      const response = await fetch(`${API_BASE_URL}/otp/${formattedMsisdn}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otpCode
        }),
      })
      
      console.log('📊 Verification status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Verify OTP error:', errorText)
        
        // ভুল OTP এর জন্য
        if (response.status === 400 || response.status === 401) {
          setError('Invalid OTP code. Please try again.')
        } else {
          setError('Verification failed. Please try again.')
        }
        return false
      }
      
      const data = await response.json()
      console.log('✅ Verify OTP response:', data)
      
      // আপনার API দুইটা রেসপন্স ফরম্যাট সাপোর্ট করে:
      // 1. {"accessinfo": {...}} - OTP পাঠানোর রেসপন্স
      // 2. {"otp_info": "8187", "result": "success"} - OTP যাচাই রেসপন্স
      
      if (data.result === 'success' || data.otp_info === otpCode) {
        // ইউজার ইনফো তৈরি (get-msisdn API থেকে ডেটা নিন)
        const userResponse = await fetch(`${API_BASE_URL}/get-msisdn`)
        let userData = null
        
        if (userResponse.ok) {
          userData = await userResponse.json()
        }
        
        const userInfo: UserInfo = {
          uuid: userData?.user_info?.uuid || data.accessinfo?.referenceCode || `user-${Date.now()}`,
          operatorname: userData?.user_info?.operatorname || 'robi',
          msisdn: formattedMsisdn,
          logo: userData?.user_info?.logo || "https://live-technologies-vod.akamaized.net/cinematic/assets/img/robi.png"
        }
        
        const accessToken = data.accessinfo?.access_token || userData?.accessToken || `token-${Date.now()}`
        
        // লগইন করান
        login(accessToken, userInfo)
        
        // হোম পেজে redirect
        router.replace('/')
        return true
      } else {
        setError('Invalid OTP. Please try again.')
        return false
      }
    } catch (error) {
      console.error('🚨 Error verifying OTP:', error)
      setError('Network error. Please check your connection.')
      return false
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleLogout = () => {
    zustandLogout()
    router.replace('/otp')
  }

  return { 
    isLoading, 
    error,
    clearError,
    getMSISDN, 
    sendOTP, 
    verifyOTP,
    handleLogout
  }
}