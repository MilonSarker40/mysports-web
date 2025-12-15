'use client';

import React, { useEffect, useState } from 'react';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/useAppStore';

const API_BASE_URL = 'https://apiv2.mysports.com.bd/api/v1';

interface PackageItem {
  pack_name: string;
  pack_type: string;
  price: string;
  base_price: string;
  day: string;
  is_subscribe: boolean;
  sub_unsub_url: string;
  billing_message: string;
  message_en: string;
  message_bn: string;
  is_promoted: boolean;
  loadSubApi: boolean;
}

const SubscriptionPage = () => {
  const { user } = useAuthStore(); // msisdn from auth
  const { navigate, setUser } = useAppStore();

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [operator, setOperator] = useState<string | null>(null);
  const [operatorLogo, setOperatorLogo] = useState<string | null>(null);
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);

  // 🔹 Format MSISDN → 880XXXXXXXXXX
  const formatMsisdn = (msisdn: string) => {
    if (msisdn.startsWith('01')) {
      return '880' + msisdn.slice(1);
    }
    return msisdn;
  };

  // 🔹 Fetch subscription data
  useEffect(() => {
    if (!user?.msisdn) return;

    const fetchSubscriptionData = async () => {
      setLoading(true);

      try {
        const formattedMsisdn = formatMsisdn(user.msisdn);

        const res = await fetch(
          `${API_BASE_URL}/subscription/${formattedMsisdn}`
        );

        const data = await res.json();

        // Operator info
        setOperator(data?.user_info?.oparetorname || null);
        setOperatorLogo(data?.user_info?.logo || null);
        setIsAlreadySubscribed(!!data?.user_info?.is_subscribe);

        // Packages
        if (Array.isArray(data?.pack_list)) {
          setPackages(data.pack_list);
        }
      } catch (error) {
        console.error('Subscription API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user?.msisdn]);

  // 🔹 Subscribe handler
  const handleSubscribe = (pkg: PackageItem) => {
    if (!pkg.loadSubApi || !pkg.sub_unsub_url) return;

    setUser({
      subscribed: true,
      subscriptionType: pkg.pack_name,
      subscriptionDays: Number(pkg.day),
      subscriptionPrice: pkg.price,
    });

    // Telco consent redirect
    window.location.href = pkg.sub_unsub_url;
  };

  // 🔒 Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Please login to view subscriptions
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-500 flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-red-500 p-4 flex items-center justify-center relative">
        <div
          className="absolute left-4 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </div>
        <h1 className="text-white text-lg font-semibold">Subscription</h1>
      </div>

      {/* Content */}
      <div className="bg-[#f5f5f5] rounded-t-3xl w-full flex-grow p-6 flex flex-col items-center">
        {/* Operator Info */}
        {operator && (
          <div className="flex items-center gap-2 mb-4">
            {operatorLogo && (
              <img
                src={operatorLogo}
                alt={operator}
                className="h-6 object-contain"
              />
            )}
            <span className="text-gray-700 capitalize font-medium">
              {operator}
            </span>
          </div>
        )}

        {/* Already subscribed banner */}
        {isAlreadySubscribed && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm">
            You already have an active subscription
          </div>
        )}

        <p className="text-gray-700 text-sm max-w-[220px] text-center mt-2 mb-6 font-medium">
          To enjoy all content please choose a package
        </p>

        {/* Package List */}
        <div className="grid grid-cols-1 gap-4 w-full mb-5">
          {loading ? (
            <p className="text-center text-gray-500">
              Loading subscription packages...
            </p>
          ) : (
            packages.map((pkg, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-4 flex flex-col items-center text-center border border-gray-100"
              >
                <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-inner">
                  <span className="text-white flex items-center text-lg font-bold">
                    <FaBangladeshiTakaSign /> {pkg.price}
                  </span>
                </div>

                <h2 className="text-gray-800 text-lg font-semibold mb-1 capitalize">
                  {pkg.pack_name}
                </h2>

                <p className="text-gray-500 text-xs mb-4">
                  {pkg.billing_message}
                </p>

                <button
                  disabled={
                    pkg.is_subscribe || isAlreadySubscribed || !pkg.loadSubApi
                  }
                  onClick={() => handleSubscribe(pkg)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition
                    ${
                      pkg.is_subscribe || isAlreadySubscribed
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                >
                  {pkg.is_subscribe
                    ? 'Subscribed'
                    : isAlreadySubscribed
                    ? 'Active'
                    : 'Subscribe'}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-auto pb-4">
          <p className="text-gray-600 text-base mb-2">
            Watch Live Match, Sports News, Videos
            <br /> & Daily Sports Update
          </p>
          <p className="text-red-500 text-lg font-bold">Help Line : 22222</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
