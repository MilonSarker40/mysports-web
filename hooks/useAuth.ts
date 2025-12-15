// hooks/useAuth.ts - CORRECTED
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import apiget from '@/utils/apiget'

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
      
      const response = await fetch(
  `${API_BASE_URL}/otp/${formattedNumber}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessinfo: {
        access_token: 'K165S6V6q4C6G7H0y9C4f5W7t5YeC6',
        referenceCode: '20210804113635',
      },
    }),
  }
);

      
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

  const verifyOTP = async (msisdn: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    clearError();

    try {
      const formatted = msisdn.startsWith("01")
        ? "880" + msisdn.slice(1)
        : msisdn;

      const verifyRes = await apiget.post(`/otp/${formatted}`, {
        accessinfo: {
          access_token: "K165S6V6q4C6G7H0y9C4f5W7t5YeC6",
          referenceCode: "20210804113635",
        },
      });

      if (verifyRes?.data?.result !== "success") {
        setError("Invalid OTP");
        return false;
      }

      // ✅ NOW CALL get-msisdn TO GET TOKEN
      const userRes = await apiget.get("/get-msisdn");

      const token = userRes?.data?.accessToken;
      const user = userRes?.data?.user_info;

      if (!token || !user) {
        setError("Authentication failed");
        return false;
      }

      const userInfo: UserInfo = {
        uuid: user.uuid,
        operatorname: user.operatorname,
        msisdn: user.msisdn,
        logo: user.logo,
      };

      login(token, userInfo);
      router.replace("/");
      return true;
    } catch (e: any) {
      setError(e?.response?.data?.message || "OTP verification failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
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