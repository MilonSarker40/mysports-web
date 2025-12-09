'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const SubscriptionPage = () => {
  const { setUser, navigate } = useAppStore();

  const packages = [
    { id: 1, price: 2, duration: 'Daily', description: '(VAT+SD+SC+ Daily charge)', days: 1 },
    { id: 2, price: 5, duration: '5 Days', description: '(VAT+SD+SC+ Daily charge)', days: 5 },
    { id: 3, price: 12, duration: '14 Days', description: '(VAT+SD+SC+ Daily charge)', days: 14 },
  ];

  const handleSubscribe = (pkg) => {
    // Update user subscription with price
    setUser({
      subscribed: true,
      subscriptionType: pkg.duration,
      subscriptionDays: pkg.days,
      subscriptionPrice: pkg.price // Add price to user data
    });
    
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-red-500 flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-red-500 p-4 flex items-center justify-center relative">
        <div className="absolute left-4 cursor-pointer">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </div>
        <h1 className="text-white text-lg font-semibold">Subscription</h1>
      </div>

      {/* Main Content Card */}
      <div className="bg-[#f5f5f5] rounded-t-3xl w-full flex-grow p-6 sm:p-8 flex flex-col items-center relative">
        <p className="text-gray-700 text-sm max-w-[200px] text-center mt-3 mb-8 font-medium">
          To Enjoy All Content Please chose a package
        </p>

        {/* Subscription Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 w-full mb-5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl p-4 flex flex-col items-center justify-between text-center border border-gray-100"
            >
              <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-inner">
                <span className="text-white flex justify-center items-center text-lg font-bold"><FaBangladeshiTakaSign /> {pkg.price}</span>
              </div>
              <h2 className="text-gray-800 text-lg font-semibold mb-1">{pkg.duration}</h2>
              <p className="text-gray-500 text-xs mb-4">{pkg.description}</p>
              <button
                onClick={() => handleSubscribe(pkg)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-sm text-base"
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>

        {/* Footer Text */}
        <div className="text-center mt-auto pb-4">
          <p className="text-gray-600 text-base mb-2">
            Watch Live Match, Sports News, videos<br />& Daily Sports Update
          </p>
          <p className="text-red-500 text-lg font-bold">
            Help Line : 22222
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;