"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/authStore";

const API_BASE = "https://apiv2.mysports.com.bd/api/v1";

export function useAuth() {
  const router = useRouter();

  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const [isLoading, setIsLoading] = useState(false);

  const [opt, setOtp] = useState(null);

  /* ----------------------------------
     SEND OTP
  ---------------------------------- */
  const sendOTP = useCallback(async () => {
    setIsLoading(true);

    try {
      // 1️⃣ Detect Robi SIM
      const detectRes = await fetch(`${API_BASE}/get-msisdn`, {
        method: "GET",
        cache: "no-store",
      });

      if (!detectRes.ok) throw new Error("DETECT_FAILED");

      const detectData = await detectRes.json();

      const msisdn = detectData?.user_info?.msisdn;
      const operator = detectData?.user_info?.operatorname;
      const accessToken = detectData?.accessToken;

      if (!msisdn || operator !== "robi" || !accessToken) {
        toast.error("Please use Robi SIM mobile data");
        return false;
      }

      // 2️⃣ SEND OTP (HEADER + BODY BOTH ✅)
      const otpRes = await fetch(`${API_BASE}/otp/${msisdn}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OTP_SEND_ACCESSTOKEN}`, // ✅ REQUIRED
        },
        body: JSON.stringify({
          accessinfo: {
            access_token: process.env.NEXT_PUBLIC_OTP_SEND_ACCESSTOKEN, // ✅ REQUIRED
            referenceCode: Date.now().toString(),
          },
        }),
      });

      if (!otpRes.ok) {
        throw new Error(`OTP_FAILED_${otpRes.status}`);
      }

      const otpData = await otpRes.json();

      if (otpData.result !== "success") {
        throw new Error("OTP_FAILED");
      }

      setOtp(otpData.otp_info);

      // 3️⃣ Save temp session
      localStorage.setItem("msisdn", msisdn);
      localStorage.setItem("accessToken", accessToken);
      localStorage.removeItem("otp_verified");

      toast.success("OTP sent successfully");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("OTP send failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ----------------------------------
     VERIFY OTP
  ---------------------------------- */
  const verifyOTP = useCallback(
    async (otp: string) => {
      if (otp.length !== 4) {
        toast.error("Enter 4 digit OTP");
        return false;
      }

      setIsLoading(true);

      try {
        const msisdn = localStorage.getItem("msisdn");
        const accessToken = localStorage.getItem("accessToken");

        if (!msisdn || !accessToken) {
          throw new Error("SESSION_INVALID");
        }

        const res = await fetch(`${API_BASE}/otp-validation/${msisdn}/${otp}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OTP_VERIFICATION}`, // ✅ REQUIRED
          },
          body: JSON.stringify({
            accessinfo: {
              access_token: process.env.NEXT_PUBLIC_OTP_VERIFICATION, // ✅ REQUIRED
              referenceCode: Date.now().toString(),
            },
          }),
        });

        const resData = await res.json();

        if (resData.message_body !== "success") {
          toast.error("Wrong OTP");
          return false;
        }

        // ✅ LOGIN SUCCESS
        localStorage.setItem("otp_verified", "true");
        localStorage.setItem("user_uuid", resData.uuid);
        localStorage.setItem("user_accesstoken", resData.accessToken);

        login(accessToken, {
          uuid: crypto.randomUUID(),
          operatorname: "robi",
          msisdn,
          subscription: { subscribed: false },
        });

        toast.success("Login successful");
        router.replace("/profile");
        return true;
      } catch (err) {
        console.error(err);
        toast.error("OTP verification failed");
        handleLogout();
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  /* ----------------------------------
     LOGOUT
  ---------------------------------- */
  const handleLogout = useCallback(() => {
    logout();
    localStorage.clear();
    router.replace("/otp");
  }, [logout, router]);

  return {
    isLoading,
    sendOTP,
    verifyOTP,
    handleLogout,
  };
}
