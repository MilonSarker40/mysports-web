"use client";

import React, { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

import { useAuthStore } from "@/store/authStore";
import { generateEncryptedToken } from "@/utils/aesTest";

const QuizPage = () => {
  const router = useRouter();

  // ✅ SINGLE SOURCE OF TRUTH
  const msisdn = useAuthStore((s) => s.userInfo?.msisdn);
  const subscribed = useAuthStore(
    (s) => s.userInfo?.subscription?.subscribed
  );

  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<any>(null);
  const [selected, setSelected] = useState<number | null>(null);

  /* ---------------- GUARDS ---------------- */
  useEffect(() => {
    if (!msisdn) {
      router.replace("/otp");
      return;
    }

    if (subscribed === false) {
      router.replace("/subscription");
      return;
    }
  }, [msisdn, subscribed, router]);

  /* ---------------- FETCH QUESTION ---------------- */
  const fetchQuestion = async () => {
    if (!msisdn) return;

    try {
      setLoading(true);
      const { encrypted } = generateEncryptedToken();

      const res = await axios.get(
        `http://103.250.69.18:8888/api/v3/portal/get-question-details/user-${msisdn}`,
        {
          headers: {
            Authorization: `Bearer ${encrypted}`,
          },
        }
      );

      // ❌ daily limit crossed
      if (res.data?.error?.statusCode === 403) {
        router.push("/quiz/score");
        return;
      }

      if (res.data?.success) {
        setQuestion(res.data.success);
        setSelected(null);
      }
    } catch (err) {
      console.error("Question fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [msisdn]);

  /* ---------------- SUBMIT ANSWER ---------------- */
  const handleNext = async () => {
    if (selected === null || !question) return;

    const q = question.question_info;

    try {
      setLoading(true);
      const { encrypted } = generateEncryptedToken();

      const res = await axios.get(
        `http://103.250.69.18:8888/api/v3/portal/score-update/user-${msisdn}/question-${q.id}/ans-${selected}`,
        {
          headers: {
            Authorization: `Bearer ${encrypted}`,
          },
        }
      );

      const result = res.data?.success?.answer;

      if (result === "right") {
        toast.success("🎉 Correct Answer!", { autoClose: 1200 });
      } else {
        toast.error("❌ Wrong Answer!", { autoClose: 1200 });
      }

      fetchQuestion();
      console.log("Answer submit response:", res.data);
    } catch (err) {
      console.error("Answer submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OPTIONS ---------------- */
  const renderOptions = () => {
    const q = question?.question_info;
    if (!q) return null;

    const options = [
      { id: 1, text: q.option_1 },
      { id: 2, text: q.option_2 },
      { id: 3, text: q.option_3 },
      { id: 4, text: q.option_4 },
    ].filter((o) => o.text?.trim());

    return options.map((opt) => {
      const isSelected = selected === opt.id;

      return (
        <button
          key={opt.id}
          onClick={() => setSelected(opt.id)}
          className={`w-full rounded-xl px-4 py-3 flex gap-3 text-left border
            ${
              isSelected
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-black border-gray-200"
            }
          `}
        >
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center
              ${
                isSelected
                  ? "bg-white text-red-600"
                  : "bg-gray-200 text-gray-600"
              }
            `}
          >
            {opt.id}
          </span>
          <span>{opt.text}</span>
        </button>
      );
    });
  };

  if (loading && !question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-600 text-white">
        Loading...
      </div>
    );
  }

  if (!question) return null;

  const q = question.question_info;
  const dailyLimit = question.daily_points_limit ?? 0;
  const totalEarn = question.total_earn_points ?? 0;

  return (
    <div className="min-h-screen bg-[#f3f3f3] relative z-20 rounded-t-3xl pb-20">
      {/* HEADER */}
      <div className="flex items-center px-4 py-4 relative">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1"
        >
          <IoChevronBackOutline size={20} /> Back
        </button>
        <h3 className="absolute left-1/2 -translate-x-1/2 font-semibold">
          Quiz
        </h3>
      </div>

      {/* QUESTION */}
      <div className="bg-white text-black mx-4 mt-10 p-4 rounded-2xl">
        <div className="flex justify-between mb-3">
          <span className="text-red-600 font-semibold">Question</span>
          <span className="text-sm font-semibold">
            {totalEarn}/{dailyLimit}
          </span>
        </div>
        <h2 className="text-center font-bold">{q.question_title}</h2>
      </div>

      {/* OPTIONS */}
      <div className="bg-white mx-4 mt-6 p-6 rounded-2xl space-y-3">
        {renderOptions()}
      </div>

      {/* NEXT BUTTON */}
      <div className="mt-10 mx-5 rounded-2x">
        <button
          onClick={handleNext}
          disabled={selected === null || loading}
          className={`w-full py-4 rounded-xl font-semibold
            ${
              selected
                ? "bg-red-600 text-white"
                : "bg-red-300 text-white"
            }
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
