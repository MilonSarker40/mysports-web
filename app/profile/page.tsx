// app/profile/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { LogOut } from 'lucide-react'
import { FaBangladeshiTakaSign } from "react-icons/fa6"
import { useRouter } from 'next/navigation'

interface UserProfile {
  phone: string
  subscribed: boolean
  subscriptionType: string
  subscriptionDays: number
  subscriptionPrice: number
}

export default function Profile() {
  const router = useRouter()
  const { handleLogout, isLoading } = useAuth()
  const { userInfo } = useAuthStore()
  
  const [user, setUser] = useState<UserProfile>({
    phone: userInfo?.msisdn || 'Not available',
    subscribed: false,
    subscriptionType: '',
    subscriptionDays: 0,
    subscriptionPrice: 0
  })

  // Load user data from localStorage or API
  useEffect(() => {
    const loadUserData = () => {
      // Try to get subscription data from localStorage
      const savedSubscription = localStorage.getItem('userSubscription')
      if (savedSubscription) {
        try {
          const subscription = JSON.parse(savedSubscription)
          setUser(prev => ({
            ...prev,
            ...subscription,
            phone: userInfo?.msisdn || prev.phone
          }))
        } catch (error) {
          console.error('Error parsing subscription data:', error)
        }
      }
    }

    loadUserData()
  }, [userInfo])

  const handleUnsubscribe = () => {
    setUser({ 
      ...user, 
      subscribed: false, 
      subscriptionType: '',
      subscriptionDays: 0,
      subscriptionPrice: 0 
    })
    
    // Save to localStorage
    localStorage.setItem('userSubscription', JSON.stringify({
      subscribed: false,
      subscriptionType: '',
      subscriptionDays: 0,
      subscriptionPrice: 0
    }))
    
    alert('Successfully unsubscribed!')
  }

  const handleSubscribe = () => {
    // Mock subscription for demo
    const newSubscription = {
      subscribed: true,
      subscriptionType: 'Premium Package',
      subscriptionDays: 30,
      subscriptionPrice: 50
    }
    
    setUser({ 
      ...user, 
      ...newSubscription
    })
    
    // Save to localStorage
    localStorage.setItem('userSubscription', JSON.stringify(newSubscription))
    
    alert('Successfully subscribed to Premium Package!')
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-4">
      {/* User Info Card */}
      <div className="bg-white mx-4 rounded-xl shadow-md p-6 mb-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl font-bold">
              {user.phone.slice(-2)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Logged in with</p>
          <p className="text-xl font-bold text-gray-900">{user.phone}</p>
          <p className="text-sm text-gray-500 mt-1">{userInfo?.operatorname || 'Operator'}</p>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
          <button 
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-500 flex items-center justify-center text-white font-medium py-3 px-8 rounded-lg transition duration-200 shadow-sm hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <LogOut size={16} className="mr-2" />
            {isLoading ? 'LOGGING OUT...' : 'LOGOUT'}
          </button>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-white mx-4 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Subscription</h2>
        
        {user.subscribed ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white flex items-center text-sm font-bold">
                    <FaBangladeshiTakaSign className="mr-1" /> {user.subscriptionPrice}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">{user.subscriptionType}</div>
                  <div className="text-sm text-gray-600">{user.subscriptionDays} days remaining</div>
                </div>
              </div>
              <button 
                onClick={handleUnsubscribe}
                className="bg-red-500 text-white text-sm py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Unsubscribe
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-6">
              Subscribe to enjoy all sports content including live matches, news, and videos.
            </p>
            <button 
              onClick={handleSubscribe}
              className="bg-red-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-600 transition-colors"
            >
              Subscribe Now
            </button>
          </div>
        )}

        {/* Features List */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">Features Included:</h3>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Live Sports Matches
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Sports News & Updates
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Exclusive Videos
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Daily Sports Highlights
            </li>
          </ul>
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-2">Need help?</p>
          <p className="text-black font-bold text-lg">
            Call: <span className="text-red-500">22222</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">24/7 Customer Support</p>
        </div>
      </div>

      {/* App Info */}
      <div className="text-center mt-8 mb-6">
        <p className="text-sm text-gray-500">MySports App v1.0.0</p>
        <p className="text-xs text-gray-400 mt-1">© 2024 MySports. All rights reserved.</p>
      </div>
    </div>
  )
}