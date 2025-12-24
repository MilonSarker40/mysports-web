"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { isRobiNumber } from "@/utils/robicheck";

const API_BASE = "https://apiv2.mysports.com.bd/api/v1";

export default function OTPPage() {
  const router = useRouter();
  const { sendOTP, isLoading } = useAuth();

  // UI only (backend does NOT use this)
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);

  useEffect(() => {
    getMsisdnHeader();
  }, []);

  const getMsisdnHeader = async () => {
    const detectRes = await fetch(`${API_BASE}/get-msisdn`, {
      method: "GET",
      cache: "no-store",
    });

    const detectData = await detectRes.json();
    let msisdn = detectData?.user_info?.msisdn;
    const operator = detectData?.user_info?.operatorname;
    const accessToken = detectData?.accessToken;

    if (!msisdn || operator !== "robi" || !accessToken) {
      toast.error("Please use Robi SIM mobile data");
      msisdn = null;
      return false;
    }

    setMobileNumber(msisdn || "null");
  };

  const handleSendOTP = async () => {
    if (!mobileNumber) {
      toast.error("Please use Robi SIM mobile data");
      return;
    }

    if (!isRobiNumber(mobileNumber)) {
      toast.error("Please enter a valid Robi SIM number");
      return;
    }

    const ok = await sendOTP({ inputNumber: mobileNumber as string });
    if (ok) {
      router.push("/otp/verify");
    }
  };

  return (
    <div className="min-h-screen bg-red-500 relative overflow-hidden flex flex-col items-center pt-10">
      {/* Back Arrow */}
      <div
        className="absolute top-4 left-4 cursor-pointer"
        onClick={() => router.back()}
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

      {/* Icon */}
      <div className="relative w-40 h-40 mt-8 mb-12 flex items-center justify-center">
        <div className="absolute w-28 h-48 bg-white rounded-2xl shadow-xl flex items-center justify-center">
          <div className="w-16 h-12 bg-red-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
        </div>
      </div>

      {/* White Card */}
      <div className="bg-white rounded-t-3xl shadow-lg w-full flex-grow p-8 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-gray-900 mb-2">
            OTP Verification
          </h1>
          <p className="text-gray-600 text-xs mb-1">
            We will send you a One Time Password
          </p>
          <p className="text-gray-600 text-xs">
            on your Robi SIM mobile number
          </p>
        </div>

        {/* Mobile Input (UI only) */}
        <div className="w-full max-w-xs mb-8">
          <label className="block text-xs font-bold text-gray-700 mb-2 text-center">
            Mobile Number (Robi SIM)
          </label>

          <input
            type="tel"
            value={(mobileNumber as string) || ""}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Robi SIM number"
            className="w-full pl-4 pr-4 py-3 border-b-2 border-[#c8cccf] text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <p className="text-[10px] text-gray-500 text-center mt-2">
            OTP will be sent to your Robi SIM number automatically
          </p>
        </div>

        {/* Send OTP */}
        <button
          onClick={handleSendOTP}
          disabled={isLoading}
          className="w-full max-w-xs bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 rounded-lg"
        >
          {isLoading ? "SENDING OTP..." : "SEND OTP"}
        </button>
      </div>
    </div>
  );
}
