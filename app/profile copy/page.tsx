// app/profile/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'
import { Phone, Gift, LogOut, Wifi, Crown } from 'lucide-react'

export default function Profile() {
  const { user, setUser } = useAppStore()
  const [showSubscription, setShowSubscription] = useState(false)

  const dataPackages = [
    { data: '500MB', duration: '3 Days', coins: 150 },
    { data: '500MB', duration: '3 Days', coins: 150 },
    { data: '500MB', duration: '3 Days', coins: 150 },
  ]

  const subscriptionPackages = [
    { duration: '2 Days', price: 'b 2', details: '(VAT+SD+SC+ Daily charge)' },
    { duration: '5 Days', price: 'b 5', details: '(VAT+SD+SC+ Daily charge)' },
    { duration: '14 Days', price: 'b 12', details: '(VAT+SD+SC+ Daily charge)' },
  ]

  const handleUnsubscribe = () => {
    setUser({ subscribed: false, subscriptionDays: 0 })
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4 border-b">
          <h1 className="text-xl font-bold text-center text-gray-900">Profile</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
              <div className="flex items-center text-gray-600 mt-1">
                <Phone size={16} className="mr-2" />
                <span className="text-sm">{user.phone}</span>
              </div>
            </div>
          </div>
          
          {user.subscribed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-green-600">
                <Crown size={16} className="mr-1" />
                <span className="text-sm font-medium">Subscribed ({user.subscriptionDays} days left)</span>
              </div>
              <button 
                onClick={handleUnsubscribe}
                className="text-red-600 text-sm font-medium hover:text-red-700 transition-colors"
              >
                Unsubscribe
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowSubscription(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Subscribe Now
            </button>
          )}
        </div>

        {/* Coins Card */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-md p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm opacity-90">Your Coin</p>
              <p className="text-3xl font-bold">{user.coins}</p>
            </div>
            <Gift size={32} className="opacity-90" />
          </div>
          <button className="w-full bg-white text-yellow-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
            <Gift size={20} className="mr-2" />
            Claim your gift!
          </button>
        </div>

        {/* Data Packages */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Data Packages</h3>
          <div className="space-y-3">
            {dataPackages.map((pkg, index) => (
              <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center space-x-3">
                  <Wifi size={20} className="text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900">{pkg.data}</div>
                    <div className="text-sm text-gray-600">{pkg.duration}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-yellow-600">{pkg.coins} Coin</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Watch Live Match, Sports News, videos & Daily Sports Update
          </p>
          <p className="text-sm text-gray-600">
            Help Line : <span className="font-semibold">22222</span>
          </p>
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Subscription</h2>
                <button 
                  onClick={() => setShowSubscription(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-600 mb-6 text-center">
                To Enjoy All Content Please choose a package
              </p>

              <div className="space-y-4">
                {subscriptionPackages.map((pkg, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">{pkg.duration}</span>
                      <span className="font-bold text-blue-600">{pkg.price}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{pkg.details}</p>
                    <Link 
                      href="/subscription"
                      onClick={() => setShowSubscription(false)}
                      className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Subscribe
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}