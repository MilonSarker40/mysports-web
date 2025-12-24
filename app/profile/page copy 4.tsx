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

  useEffect(() => {
    setMounted(true)
  }, [])

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (!mounted) return
    if (!isLoggedIn) router.replace('/otp')
  }, [mounted, isLoggedIn, router])

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

  /* ---------------- UNSUBSCRIBE HANDLER ---------------- */
  const handleUnsubscribe = () => {
    // 🔑 instantly remove subscription from profile
    updateSubscription({ subscribed: false })

    // 🔁 go to subscription page
    router.push('/subscription')
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-4">
      {/* USER INFO */}
      <div className="bg-white mx-4 rounded-xl p-6 mb-6 shadow">
        <p className="text-center text-xl font-bold">
          {formatPhone(userInfo.msisdn)}
        </p>

        <p className="text-center text-sm text-gray-500 capitalize">
          {userInfo.operatorname}
        </p>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-500 text-white px-6 py-2 rounded disabled:bg-gray-400"
          >
            {isLoading ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </div>

      {/* SUBSCRIPTION SECTION */}
      {subscription?.subscribed ? (
        <div className="bg-white mx-4 rounded-xl p-6 shadow">
          <h2 className="font-bold mb-2">Your Subscription</h2>

          <div className="flex items-center text-lg font-medium">
            <FaBangladeshiTakaSign className="mr-1" />
            {subscription.price} / {subscription.day} day
          </div>

          <p className="capitalize mt-1 text-gray-600">
            {subscription.pack_name}
          </p>

          {/* ✅ UNSUBSCRIBE BUTTON */}
          <button
            onClick={handleUnsubscribe}
            className="mt-4 w-full bg-gray-400 text-white py-2 rounded"
          >
            Unsubscribe
          </button>
        </div>
      ) : (
        <div className="mx-4 text-center">
          <button
            onClick={() => router.push('/subscription')}
            className="bg-red-500 text-white px-6 py-3 rounded-lg"
          >
            View Subscription Plans
          </button>
        </div>
      )}
    </div>
  )
}
