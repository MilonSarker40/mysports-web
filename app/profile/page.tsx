'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaBangladeshiTakaSign } from 'react-icons/fa6'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

export default function Profile() {
  const router = useRouter()
  const { handleLogout, isLoading } = useAuth()

  const { userInfo, isLoggedIn, updateSubscription } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  /* ------------------ MOUNT ------------------ */
  useEffect(() => {
    setMounted(true)
  }, [])

  /* ------------------ AUTH GUARD ------------------ */
  useEffect(() => {
    if (!mounted) return
    if (!isLoggedIn || !userInfo?.msisdn) {
      router.replace('/otp')
    }
  }, [mounted, isLoggedIn, userInfo, router])

  if (!mounted || !isLoggedIn || !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    )
  }

  const subscription = userInfo.subscription

  const formatPhone = (p: string) =>
    `+${p.slice(0, 3)} ${p.slice(3, 7)}-${p.slice(7)}`

  /* ------------------ UNSUBSCRIBE ------------------ */
  const handleUnsubscribe = () => {
    // 1️⃣ clear subscription from store (UI instantly hide হবে)
    updateSubscription({ subscribed: false })

    // 2️⃣ go to subscription page (operator will handle real unsubscribe)
    router.push('/subscription')
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-4">
      {/* ================= USER INFO ================= */}
      <div className="bg-white mx-4 rounded-xl p-6 mb-6 shadow">
        <p className="text-center text-sm text-gray-500 mb-1">
          Logged in with {userInfo.operatorname}
        </p>

        <p className="text-center text-xl font-bold">
          {formatPhone(userInfo.msisdn)}
        </p>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-500 text-white px-8 py-2 rounded"
          >
            {isLoading ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </div>

      {/* ================= SUBSCRIPTION CARD ================= */}
      {subscription?.subscribed === true && (
        <div className="bg-white mx-4 rounded-xl p-6 shadow">
          <h2 className="font-bold mb-3">Your Subscription</h2>

          {/* SAFE GUARDS */}
          {subscription.price && subscription.day && (
            <div className="flex items-center text-lg font-medium mb-1">
              <FaBangladeshiTakaSign className="mr-1" />
              {subscription.price} / {subscription.day} day
            </div>
          )}

          {subscription.pack_name && (
            <p className="capitalize text-gray-600 mb-4">
              {subscription.pack_name}
            </p>
          )}

          <button
            onClick={handleUnsubscribe}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg"
          >
            Unsubscribe
          </button>
        </div>
      )}
    </div>
  )
}
