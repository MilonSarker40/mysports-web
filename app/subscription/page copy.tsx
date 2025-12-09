// app/subscription/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useAppStore'
import { ArrowLeft, Smartphone } from 'lucide-react'

export default function Subscription() {
  const [step, setStep] = useState<'package' | 'phone' | 'otp' | 'success'>('package')
  const [phone, setPhone] = useState('+01679568805')
  const [otp, setOtp] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<number>(2)
  const { subscribeUser } = useStore()
  const router = useRouter()

  const packages = [
    { days: 2, price: 'b 2', details: '(VAT+SD+SC+ Daily charge)' },
    { days: 5, price: 'b 5', details: '(VAT+SD+SC+ Daily charge)' },
    { days: 14, price: 'b 12', details: '(VAT+SD+SC+ Daily charge)' },
  ]

  const handlePackageSelect = (days: number) => {
    setSelectedPackage(days)
    setStep('phone')
  }

  const handleSendOtp = () => {
    setStep('otp')
  }

  const handleVerifyOtp = () => {
    subscribeUser(selectedPackage)
    setStep('success')
  }

  const handleContinue = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4 border-b">
          <div className="flex items-center">
            <button 
              onClick={() => step === 'package' ? router.back() : setStep('package')}
              className="mr-3 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {step === 'package' ? 'Subscription' : 
               step === 'phone' ? 'OTP Verification' :
               step === 'otp' ? 'Enter OTP' : 'Success'}
            </h1>
          </div>
        </div>
      </header>

      <div className="p-4">
        {step === 'package' && (
          <div>
            <p className="text-gray-600 mb-6 text-center">
              To Enjoy All Content Please choose a package
            </p>

            <div className="space-y-4">
              {packages.map((pkg, index) => (
                <div 
                  key={index}
                  onClick={() => handlePackageSelect(pkg.days)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer active:scale-95"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">{pkg.days} Days</span>
                    <span className="font-bold text-blue-600">{pkg.price}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{pkg.details}</p>
                  <div className="w-full bg-blue-600 text-white text-center py-2 rounded-lg text-sm font-medium">
                    Subscribe
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-600">
                Watch Live Match, Sports News, videos & Daily Sports Update
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Help Line : <span className="font-semibold">22222</span>
              </p>
            </div>
          </div>
        )}

        {step === 'phone' && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <div className="text-center mb-6">
              <Smartphone size={48} className="mx-auto text-blue-600 mb-4" />
              <h2 className="text-xl font-bold mb-2">OTP Verification</h2>
              <p className="text-gray-600">
                We will send you an One Time Password on this mobile number
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Mobile Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              SEND OTP
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">OTP Code</h2>
              <p className="text-gray-600">
                Enter the OTP sent to <span className="font-semibold">{phone}</span>
              </p>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Enter OTP"
                className="w-full p-4 border border-gray-300 rounded-lg text-center text-2xl font-semibold tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={4}
              />
            </div>

            <p className="text-sm text-gray-600 text-center mb-6">
              Don&apos;t receive the OTP?{' '}
              <button className="text-blue-600 font-medium">RESEND OTP</button>
            </p>

            <button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 4}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              VERIFY
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="bg-white rounded-lg shadow-md p-8 mt-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                ✓
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Congrats!</h2>
            <p className="text-gray-600 mb-6">
              You have successfully subscribed {selectedPackage} days package!
            </p>
            
            <button
              onClick={handleContinue}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue Watch
            </button>
          </div>
        )}
      </div>
    </div>
  )
}