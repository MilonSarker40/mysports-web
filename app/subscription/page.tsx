'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaBangladeshiTakaSign } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!
const OTP_SEND_TOKEN = process.env.NEXT_PUBLIC_OTP_SEND_ACCESSTOKEN!

interface PackageItem {
  pack_name: string
  pack_type: string
  price: string
  base_price: string
  day: string
  is_subscribe: boolean
  sub_unsub_url: string
  billing_message: string
  is_promoted: boolean
}

export default function SubscriptionPage() {
  const router = useRouter()

  /* =============================
     STORE
  ============================= */
  const userInfo = useAuthStore((s) => s.userInfo)
  const updateSubscription = useAuthStore((s) => s.updateSubscription)

  /* =============================
     STATE
  ============================= */
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [operator, setOperator] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [hydrated, setHydrated] = useState(false)

  const fetchedRef = useRef(false)

  /* =============================
     HYDRATION
  ============================= */
  useEffect(() => {
    setHydrated(true)
  }, [])

  /* =============================
     AUTH GUARD
  ============================= */
  useEffect(() => {
    if (!hydrated) return
    if (!userInfo?.msisdn) {
      router.replace('/otp')
    }
  }, [hydrated, userInfo, router])

  /* =============================
     FETCH SUBSCRIPTION
  ============================= */
  const fetchSubscription = async () => {
    if (!userInfo?.msisdn) return

    try {
      setLoading(true)

      const res = await fetch(
        `${API_BASE_URL}/subscription/${userInfo.msisdn}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessinfo: {
              access_token: OTP_SEND_TOKEN,
              referenceCode: Date.now().toString(),
            },
          }),
        }
      )

      const data = await res.json()

      /* operator (backend typo safe) */
      setOperator(
        data?.user_info?.operatorname ||
          data?.user_info?.oparetorname ||
          null
      )

      /* safe pack list */
      const packList: PackageItem[] = Array.isArray(data?.pack_list)
        ? data.pack_list
        : []

      setPackages(packList)

      /* update Zustand for profile page */
      if (data?.user_info?.is_subscribe === true) {
        const activePack = packList.find((p) => p.is_subscribe)

        if (activePack) {
          updateSubscription({
            subscribed: true,
            pack_name: activePack.pack_name,
            price: activePack.price,
            day: activePack.day,
          })
        }
      } else {
        updateSubscription({ subscribed: false })
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load subscription info')
    } finally {
      setLoading(false)
    }
  }

  /* =============================
     INIT FETCH
  ============================= */
  useEffect(() => {
    if (!hydrated || fetchedRef.current) return
    fetchedRef.current = true
    fetchSubscription()
  }, [hydrated])

  /* =============================
     SUBSCRIBE / UNSUBSCRIBE
  ============================= */
  const handleSubscribe = (pkg: PackageItem) => {
    if (!pkg.sub_unsub_url) return
    window.location.href = pkg.sub_unsub_url
  }

  /* =============================
     LOADING
  ============================= */
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    )
  }

  /* =============================
     UI
  ============================= */
  return (
    <div className="min-h-screen bg-red-500 flex flex-col items-center">
      {/* HEADER */}
      <div className="w-full bg-red-500 p-4 text-center">
        <h1 className="text-white text-lg font-semibold">Subscription</h1>
      </div>

      {/* BODY */}
      <div className="bg-[#f5f5f5] rounded-t-3xl w-full flex-grow p-6">
        {operator && (
          <div className="flex justify-center items-center mt-5 mb-5">
            <img
              src="/images/robi-logo.png"
              alt="Robi Logo"
              className="w-20 h-20"
            />
          </div>
        )}

        <p className="text-gray-700 text-sm text-center mb-6">
          To enjoy all premium sports content please choose a package
        </p>

        {loading ? (
          <p className="text-center">Loading…</p>
        ) : (
          <div className="grid gap-4">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 text-center border"
              >
                <div className="bg-red-500 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-3">
                  <span className="text-white font-bold flex items-center gap-1">
                    <FaBangladeshiTakaSign /> {pkg.price}
                  </span>
                </div>

                <h2 className="font-semibold mb-2 capitalize">
                  {pkg.pack_name}
                </h2>

                <p className="text-xs text-gray-500 mb-5">
                  {pkg.billing_message}
                </p>

                <button
                  onClick={() => handleSubscribe(pkg)}
                  className={`w-full py-2 rounded-lg text-white ${
                    pkg.is_subscribe
                      ? 'bg-gray-400'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {pkg.is_subscribe ? 'Unsubscribe' : 'Subscribe'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="text-center mt-20 pb-4">
          <p className="text-gray-600 text-base mb-2">
            Watch Live Match, Sports News, videos
            <br />& Daily Sports Update
          </p>
          <p className="text-red-500 text-lg font-bold">
            Help Line : 22222
          </p>
        </div>
      </div>
    </div>
  )
}
