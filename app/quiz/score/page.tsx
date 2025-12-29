"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";
import { generateEncryptedToken } from "@/utils/aesTest";

const ScorePage = () => {
  const router = useRouter();

  // ✅ SINGLE SOURCE OF TRUTH
  const msisdn = useAuthStore((s) => s.userInfo?.msisdn);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCampaignActive, setIsCampaignActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* ---------------- GUARD ---------------- */
  useEffect(() => {
    if (!msisdn) {
      router.replace("/otp");
    }
  }, [msisdn, router]);

  /* ---------------- FETCH SCORE ---------------- */
  const fetchScore = useCallback(async () => {
    if (!msisdn) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const { encrypted } = generateEncryptedToken();

      const res = await axios.get(
        `http://103.250.69.18:8888/api/v3/portal/get-question-details/user-${msisdn}`,
        {
          headers: {
            Authorization: `Bearer ${encrypted}`,
          },
        }
      );

      // ❌ Campaign closed / daily limit crossed
      if (res.data?.error) {
        setIsCampaignActive(false);
        setErrorMessage(res.data.error.errorMessage);
        setData(null);
        return;
      }

      if (res.data?.success) {
        setData(res.data.success);
      } else {
        setErrorMessage("Unable to load score data.");
        setData(null);
      }
    } catch (err) {
      console.error("Score fetch failed:", err);
      setErrorMessage("Something went wrong. Please try again later.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [msisdn]);

  useEffect(() => {
    fetchScore();
  }, [fetchScore]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-red-600 text-white text-xl">
        Loading...
      </div>
    );
  }

  /* ---------------- DERIVED STATE ---------------- */
  const limit = data?.daily_points_limit;
  const points = data?.total_earn_points;

  const hasValidScore =
    typeof limit === "number" && typeof points === "number";

  const isLimitReached = hasValidScore && points >= limit;
  const canContinue = hasValidScore && points < limit;

  const showCampaignClosed = !isCampaignActive;
  const showError = !showCampaignClosed && !hasValidScore;

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-white text-gray-500 flex flex-col items-center justify-center px-6 text-center">
      {/* Back Button */}
      <button
        onClick={() =>
          isLimitReached || showError
            ? router.push("/home")
            : router.back()
        }
        className="absolute top-4 left-4 flex items-center gap-1 text-gray-500 text-sm"
      >
        <IoChevronBackOutline size={20} />
        Back
      </button>

      {/* Campaign Closed */}
      {showCampaignClosed && (
        <>
          <h1 className="text-3xl font-bold mb-2 text-red-500">
            Campaign Closed
          </h1>
          <p className="text-lg mb-6">
            {errorMessage ?? "The campaign is currently unavailable."}
          </p>
          <button
            className="text-base font-semibold text-white bg-red-600 px-10 py-3 rounded-lg"
            onClick={() => router.push("/home")}
          >
            Go Home
          </button>
        </>
      )}

      {/* Congratulations */}
      {isLimitReached && (
        <>
          <img
            src="/images/congratulations.png"
            alt="Congratulations"
            className="mb-4"
          />
          <h1 className="text-3xl font-bold mb-2 text-red-500">
            Congratulations!
          </h1>
          <p className="text-lg mb-6">
            You have successfully completed today’s quiz points.
          </p>
          <button
            className="text-base font-semibold text-white bg-red-600 px-10 py-3 rounded-lg"
            onClick={() => router.push("/home")}
          >
            Go Home
          </button>
        </>
      )}

      {/* Keep Going */}
      {canContinue && (
        <>
          <h1 className="text-3xl font-bold mb-2 text-red-400">
            Keep Going!
          </h1>
          <p className="text-xl font-semibold mt-4">
            {points}/{limit} points earned
          </p>
          <p className="text-base mt-4 mb-10 text-red-400">
            You're doing great. Keep playing to earn more points.
          </p>
          <button
            className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold text-lg shadow-lg"
            onClick={() => router.push("/quiz/quiz-page")}
          >
            Play More
          </button>
        </>
      )}

      {/* Generic Error */}
      {showError && (
        <>
          <h1 className="text-2xl font-bold mb-2 text-red-500">
            Error
          </h1>
          <p className="text-base mb-6">
            {errorMessage ?? "Failed to load quiz data."}
          </p>
          <button
            className="text-base font-semibold text-white bg-red-600 px-10 py-3 rounded-lg"
            onClick={() => router.push("/home")}
          >
            Go Home
          </button>
        </>
      )}
    </div>
  );
};

export default ScorePage;
