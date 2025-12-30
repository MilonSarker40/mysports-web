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
  const [otpInfo, setOtpInfo] = useState<any>(null);

  /* ----------------------------------
     SEND OTP
  ---------------------------------- */
  const sendOTP = useCallback(
    async ({ inputNumber }: { inputNumber: string }) => {
      setIsLoading(true);

      try {
        const msisdn = inputNumber;

        const res = await fetch(`${API_BASE}/otp/${msisdn}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OTP_SEND_ACCESSTOKEN}`,
          },
          body: JSON.stringify({
            accessinfo: {
              access_token: process.env.NEXT_PUBLIC_OTP_SEND_ACCESSTOKEN,
              referenceCode: Date.now().toString(),
            },
          }),
        });

        if (!res.ok) throw new Error("OTP_SEND_FAILED");

        const data = await res.json();

        if (data.result !== "success") {
          throw new Error("OTP_FAILED");
        }

        setOtpInfo(data.otp_info);

        localStorage.setItem("msisdn", msisdn);
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
    },
    []
  );

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
        if (!msisdn) throw new Error("SESSION_INVALID");

        const res = await fetch(
          `${API_BASE}/otp-validation/${msisdn}/${otp}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_OTP_VERIFICATION}`,
            },
            body: JSON.stringify({
              accessinfo: {
                access_token: process.env.NEXT_PUBLIC_OTP_VERIFICATION,
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

        // ✅ persist real backend values
        localStorage.setItem("otp_verified", "true");
        localStorage.setItem("user_uuid", data.uuid);
        localStorage.setItem("user_accesstoken", data.accessToken);

        // ✅ LOGIN (DO NOT FORCE subscription false)
        login(data.accessToken, {
          uuid: data.uuid,
          operatorname: "robi",
          msisdn,
          subscription: undefined, // 🔥 IMPORTANT
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
