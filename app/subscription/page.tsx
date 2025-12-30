'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaBangladeshiTakaSign } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = 'https://apiv2.mysports.com.bd/api/v1'

interface PackageItem {
  pack_name: string
  pack_type: string
  price: string
  day: string
  is_subscribe: boolean
  sub_unsub_url: string
  billing_message: string
  loadSubApi: boolean
}

export default function SubscriptionPage() {
  const router = useRouter()
  const updateSubscription = useAuthStore((s) => s.updateSubscription)

  const [packages, setPackages] = useState<PackageItem[]>([])
  const [loading, setLoading] = useState(true)
  const fetchedRef = useRef(false)

  /* ---------------- FETCH SUBSCRIPTION ---------------- */
  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    const fetchSubscription = async () => {
      try {
        const uuid = localStorage.getItem('user_uuid')
        if (!uuid) {
          router.replace('/otp')
          return
        }

        const res = await fetch(
          `${API_BASE_URL}/subscription/uuid/${uuid}`,
          { method: 'POST' }
        )

        if (!res.ok) throw new Error('API failed')

        const data = await res.json()
        const packList: PackageItem[] = data?.pack_list ?? []

        setPackages(packList)

        // 🔥 detect active subscription
        const activePack = packList.find((p) => p.is_subscribe)

        updateSubscription(
          activePack
            ? {
                subscribed: true,
                pack_name: activePack.pack_name,
                price: activePack.price,
                day: activePack.day,
                billing_message: activePack.billing_message,
              }
            : { subscribed: false }
        )
      } catch (err) {
        console.error(err)
        toast.error('Failed to load subscription')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [router, updateSubscription])

  /* ---------------- SUB / UNSUB ---------------- */
  const handleAction = (pkg: PackageItem) => {
    if (!pkg.loadSubApi) {
      toast.info('Please wait, processing...')
      return
    }

    if (!pkg.sub_unsub_url) {
      toast.error('Subscription URL missing')
      return
    }

    // 🔁 Telco billing redirect
    window.location.href = pkg.sub_unsub_url
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-red-500">
      {/* HEADER */}
      <div className="p-4 text-center text-white font-semibold">
        Subscription
      </div>

      <div className="bg-[#f5f5f5] rounded-t-3xl p-6 min-h-screen">
        {loading ? (
          <p className="text-center">Loading…</p>
        ) : (
          <>
            {/* TEXT (outside map) */}
            <p className="text-gray-700 text-base text-center mt-5 mb-8">
              To enjoy all premium sports content please choose a package
            </p>

            <div className="grid gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.pack_name}
                  className="bg-white rounded-2xl p-5 text-center shadow"
                >
                  {/* PRICE */}
                  <div className="bg-red-500 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-3">
                    <FaBangladeshiTakaSign className="text-white" />
                    <span className="text-white font-bold ml-1">
                      {pkg.price}
                    </span>
                  </div>

                  {/* NAME */}
                  <h2 className="font-semibold capitalize">
                    {pkg.pack_name}
                  </h2>

                  {/* BILLING MESSAGE */}
                  <p className="text-xs text-gray-500 mb-4">
                    {pkg.billing_message}
                  </p>

                  {/* ACTION BUTTON */}
                  <button
                    disabled={!pkg.loadSubApi}
                    onClick={() => handleAction(pkg)}
                    className={`w-full py-3 rounded-lg text-white font-semibold transition
                      ${
                        !pkg.loadSubApi
                          ? 'bg-gray-400 cursor-not-allowed'
                          : pkg.is_subscribe
                          ? 'bg-gray-400'
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                  >
                    {!pkg.loadSubApi
                      ? 'Processing...'
                      : pkg.is_subscribe
                      ? 'Unsubscribe'
                      : 'Subscribe'}
                  </button>
                </div>
              ))}
            </div>

            {/* FOOTER INFO */}
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
    </div>
  )
}
