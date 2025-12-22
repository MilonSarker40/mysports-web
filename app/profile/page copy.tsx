'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { LogOut } from 'lucide-react'
import { FaBangladeshiTakaSign } from 'react-icons/fa6'
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
    subscriptionPrice: 0,
  })

  /* ----------------------------------------
     LOAD SUBSCRIPTION DATA
  ---------------------------------------- */
  useEffect(() => {
    const savedSubscription = localStorage.getItem('userSubscription')
    if (savedSubscription) {
      try {
        const subscription = JSON.parse(savedSubscription)
        setUser((prev) => ({
          ...prev,
          ...subscription,
          phone: userInfo?.msisdn || prev.phone,
        }))
      } catch (err) {
        console.error('Subscription parse error', err)
      }
    }
  }, [userInfo])

  /* ----------------------------------------
     SUBSCRIBE / UNSUBSCRIBE (MOCK)
  ---------------------------------------- */
  const handleUnsubscribe = () => {
    const reset = {
      subscribed: false,
      subscriptionType: '',
      subscriptionDays: 0,
      subscriptionPrice: 0,
    }

    setUser((prev) => ({ ...prev, ...reset }))
    localStorage.setItem('userSubscription', JSON.stringify(reset))
    alert('Successfully unsubscribed!')
  }

  const handleSubscribe = () => {
    const sub = {
      subscribed: true,
      subscriptionType: 'Premium Package',
      subscriptionDays: 30,
      subscriptionPrice: 50,
    }

    setUser((prev) => ({ ...prev, ...sub }))
    localStorage.setItem('userSubscription', JSON.stringify(sub))
    alert('Successfully subscribed!')
  }

  /* ----------------------------------------
     UI
  ---------------------------------------- */
  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-4">
      {/* USER INFO */}
      <div className="bg-white mx-4 rounded-xl shadow-md p-6 mb-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl font-bold">
              {user.phone.slice(-2)}
            </span>
          </div>

          <p className="text-sm text-gray-600">Logged in with</p>
          <p className="text-xl font-bold text-gray-900">{user.phone}</p>
          <p className="text-sm text-gray-500 mt-1">
            {userInfo?.operatorname || 'Operator'}
          </p>
        </div>

        {/* ✅ LOGOUT BUTTON */}
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-500 flex items-center justify-center text-white font-medium py-3 px-8 rounded-lg hover:bg-red-600 transition disabled:bg-gray-400"
          >
            <LogOut size={16} className="mr-2" />
            {isLoading ? 'LOGGING OUT...' : 'LOGOUT'}
          </button>
        </div>
      </div>

      {/* SUBSCRIPTION */}
      <div className="bg-white mx-4 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold mb-4">Subscription</h2>

        {user.subscribed ? (
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-sm font-bold flex items-center">
                  <FaBangladeshiTakaSign className="mr-1" />
                  {user.subscriptionPrice}
                </span>
              </div>
              <div>
                <p className="font-bold">{user.subscriptionType}</p>
                <p className="text-sm text-gray-600">
                  {user.subscriptionDays} days remaining
                </p>
              </div>
            </div>

            <button
              onClick={handleUnsubscribe}
              className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600"
            >
              Unsubscribe
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">
              Subscribe to enjoy all premium sports content.
            </p>
            <button
              onClick={handleSubscribe}
              className="bg-red-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-600"
            >
              Subscribe Now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
