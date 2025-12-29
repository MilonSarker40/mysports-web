'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaBangladeshiTakaSign } from 'react-icons/fa6'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

export default function Profile() {
  const router = useRouter()
  const { handleLogout, isLoading } = useAuth()
  const { userInfo, isLoggedIn } = useAuthStore()

  /* -----------------------------
     HYDRATION SAFETY
  ----------------------------- */
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  /* -----------------------------
     AUTH GUARD
  ----------------------------- */
  useEffect(() => {
    if (!mounted) return

    // ❌ not logged in
    if (!isLoggedIn) {
      router.replace('/otp')
      return
    }

    // ⚠️ redirect ONLY if subscription exists AND not subscribed
    if (
      userInfo?.subscription &&
      userInfo.subscription.subscribed === false
    ) {
      router.replace('/subscription')
    }
  }, [isLoggedIn, userInfo, router, mounted])

  /* -----------------------------
     LOADING STATE
  ----------------------------- */
  if (!mounted || !isLoggedIn || !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    )
  }

  /* -----------------------------
     FORMAT PHONE
  ----------------------------- */
  const formatPhone = (p: string) =>
    `+${p.slice(0, 3)} ${p.slice(3, 7)}-${p.slice(7)}`

  const subscription = userInfo.subscription

  /* =============================
     UI
  ============================= */
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

      {/* SUBSCRIPTION INFO (ONLY IF SUBSCRIBED) */}
      {subscription?.subscribed && (
        <div className="bg-white mx-4 rounded-xl p-6 shadow">
          <div className="flex items-center text-lg font-medium">
            <FaBangladeshiTakaSign className="mr-1" />
            {subscription.price} / {subscription.day} day
          </div>

          <p className="capitalize mt-1 text-gray-600">
            {subscription.pack_name}
          </p>
        </div>
      )}
    </div>
  )
}
