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

  /* ---------------- HYDRATION ---------------- */
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

  /* ---------------- PROFILE UNSUBSCRIBE ---------------- */
  const handleUnsubscribe = () => {
    // শুধু UI state clear
    updateSubscription({
      subscribed: false,
      pack_name: undefined,
      billing_message: undefined,
      price: undefined,
      day: undefined,
    })

    // subscription page এ পাঠানো
    router.push('/subscription')
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#f5f5f5] rounded-t-2xl relative pt-4">
      {/* USER INFO */}
      <div className="bg-white mx-4 rounded-xl p-6 mb-10 mt-5 shadow">
        <p className="text-center">You Are Logged In With</p>
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
        <>
        <h2 className="font-medium text-center px-10 mb-10">To enjoy all premium sports content please choose a package</h2>
        <div className="bg-white mx-4 rounded-xl p-6 shadow">
          <div className="flex items-center text-lg font-medium">
            <span className="flex items-center bg-red-500 text-white px-3 py-1 w-20 h-20 rounded-full">
              <FaBangladeshiTakaSign className="mr-1" />
              {subscription.price}
            </span> 
            <span className='pl-5'>
             <p className="capitalize font-bold mt-1 text-black">
              {subscription.pack_name}
            </p>
            <p className="capitalize mt-1 text-sm text-gray-600">
              {subscription.billing_message}
            </p>
          </span>
          </div>
          <button
            onClick={handleUnsubscribe}
            className="w-full bg-red-500 text-white py-3 mt-5 rounded-lg"
          >
            Unsubscribe
          </button>
        </div>
        <div className="mt-10 text-center px-8">
          <p className="text-base text-gray-600">
            Watch Live Match, Sports News, videos & Daily Sports Update
          </p>
          <p className="text-base text-red-500 font-bold mt-5">
            Help Line : <span className="font-bold">22222</span>
          </p>
        </div>
        </>
      )}
    </div>
  )
}
