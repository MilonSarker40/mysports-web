"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/authStore";

/* =====================
   ENV CONFIG
===================== */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
const OTP_SEND_TOKEN = process.env.NEXT_PUBLIC_OTP_SEND_ACCESSTOKEN!;
const OTP_VERIFY_TOKEN = process.env.NEXT_PUBLIC_OTP_VERIFICATION!;

export function useAuth() {
  const router = useRouter();

  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const [isLoading, setIsLoading] = useState(false);

  /* =================================
     SEND OTP
  ================================= */
  const sendOTP = useCallback(async () => {
    setIsLoading(true);

    try {
      /* 1️⃣ Detect Robi SIM */
      const detectRes = await fetch(`${API_BASE}/get-msisdn`, {
        method: "GET",
        cache: "no-store",
      });

      if (!detectRes.ok) throw new Error("DETECT_FAILED");

      const detectData = await detectRes.json();

      const msisdn = detectData?.user_info?.msisdn;
      const operator = detectData?.user_info?.operatorname;

      if (!msisdn || operator !== "robi") {
        toast.error("Please use Robi SIM mobile data");
        return false;
      }

      /* 2️⃣ Send OTP */
      const otpRes = await fetch(`${API_BASE}/otp/${msisdn}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessinfo: {
            access_token: OTP_SEND_TOKEN,
            referenceCode: Date.now().toString(),
          },
        }),
      });

      if (!otpRes.ok) throw new Error("OTP_FAILED");

      const otpData = await otpRes.json();

      if (otpData.result !== "success") {
        throw new Error("OTP_FAILED");
      }

      /* 3️⃣ Save temp session */
      localStorage.setItem("msisdn", msisdn);

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

  /* =================================
     VERIFY OTP
  ================================= */
  const verifyOTP = useCallback(
    async (otp: string) => {
      if (otp.length !== 4) {
        toast.error("Enter 4 digit OTP");
        return false;
      }

      setIsLoading(true);

      try {
        const msisdn = localStorage.getItem("msisdn");
        if (!msisdn) throw new Error("SESSION_INVALID");

        const res = await fetch(
          `${API_BASE}/otp-validation/${msisdn}/${otp}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accessinfo: {
                access_token: OTP_VERIFY_TOKEN,
                referenceCode: Date.now().toString(),
              },
            }),
          }
        );

        const data = await res.json();

        if (data.message_body !== "success") {
          toast.error("Wrong OTP");
          return false;
        }

        /* ✅ LOGIN SUCCESS */
        login(OTP_SEND_TOKEN, {
          uuid: data.uuid ?? crypto.randomUUID(),
          operatorname: "robi",
          msisdn,
          subscription: { subscribed: false }, // real status will come from Subscription/Profile page
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

  /* =================================
     LOGOUT
  ================================= */
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
