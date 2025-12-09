// app/profile/page.tsx
'use client'

import { useAppStore } from '@/store/useAppStore'
import { LogOut } from 'lucide-react'
import { FaBangladeshiTakaSign } from "react-icons/fa6";

export default function Profile() {
  const { user, setUser, navigate } = useAppStore()

  const handleUnsubscribe = () => {
    setUser({ 
      ...user, 
      subscribed: false, 
      subscriptionType: '',
      subscriptionDays: 0,
      subscriptionPrice: 0 
    })
  }

  const handleLogout = () => {
    console.log('Logging out...')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] relative z-10 rounded-t-3xl">
      {/* Header - Red Background */}
      <div className="p-6 text-white text-center pt-10">
        <p className="text-sm text-gray-700 mb-1">Your are logged in with</p>
        <p className="text-lg text-gray-900 font-bold">{user.phone}</p>
        <div className='flex justify-center items-center mt-6'>
          <button 
            onClick={handleLogout}
            className="bg-red-500 flex items-center justify-center text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-sm text-sm hover:bg-black"
          >
            <LogOut size={14} className="mr-2" />
            LOGOUT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-700 text-base max-w-[300px] m-auto mb-8">
            To enjoy all contents, please choose a package.
          </p>

          {user.subscribed ? (
            <div className="mb-8">
              <div className="bg-white flex justify-between items-center border border-gray-300 rounded-3xl p-5 mx-auto mb-6">
                {/* Price Circle - Like subscription page */}
                <div className="bg-black w-14 h-14 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-white flex justify-center items-center text-sm font-bold"><FaBangladeshiTakaSign /> {user.subscriptionPrice}</span>
                </div>
                <div className='text-left'>
                  {/* Package Name */}
                  <div className="font-bold text-gray-900 text-lg mb-1">
                    {user.subscriptionType}
                  </div>
                  
                  {/* Charge Details */}
                  <div className="text-gray-600 text-xs">
                    (VAT+SD+SC+Daily Charge)
                  </div>
                </div>
                {/* Unsubscribe Button */}
                <div>
                  <button 
                    onClick={handleUnsubscribe}
                    className="bg-red-500 text-sm text-white h-10 px-4 rounded-lg hover:bg-black transition-colors"
                  >
                    Unsubscribe
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center mb-8">
              <button 
                onClick={() => navigate('/subscription')}
                className="bg-red-500 text-white px-10 py-4 rounded-lg font-bold hover:bg-red-600 transition-colors text-base"
              >
                Choose Package
              </button>
            </div>
          )}

          {/* Description Text */}
          <div className="text-center text-gray-600 text-base max-w-[350px] m-auto mb-8 leading-relaxed">
            <p>Watch Live Match, Sports News, Videos & Daily Sports Update.</p>
          </div>

          {/* Help Line */}
          <div className="text-center">
            <p className="text-black text-base">
              Help line : <span className="font-bold">22222</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}