"use client";

import { useEffect, useRef, useState } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = "https://apiv2.mysports.com.bd/api/v1";

interface PackageItem {
  pack_name: string;
  pack_type: string;
  price: string;
  day: string;
  is_subscribe: boolean;
  sub_unsub_url: string;
  billing_message: string;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const { updateSubscription } = useAuthStore();

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchedRef = useRef(false);

  /* ---------------- FETCH BY UUID ---------------- */
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchSubscription = async () => {
      try {
        setLoading(true);

        const uuid = localStorage.getItem("user_uuid");

        // ✅ UUID না থাকলে → login page
        if (!uuid) {
          toast.error("Session expired. Please login again.");
          router.replace("/otp");
          return;
        }

        const res = await fetch(
          `${API_BASE_URL}/subscription/uuid/${uuid}`,
          { method: "POST" }
        );

        if (!res.ok) {
          throw new Error(`API failed ${res.status}`);
        }

        const data = await res.json();

        const packList: PackageItem[] = Array.isArray(data?.pack_list)
          ? data.pack_list
          : [];

        setPackages(packList);

        const activePack = packList.find(p => p.is_subscribe);

        // 🔑 sync zustand (profile page)
        updateSubscription(
          activePack
            ? {
                subscribed: true,
                pack_name: activePack.pack_name,
                price: activePack.price,
                day: activePack.day,
              }
            : { subscribed: false }
        );
      } catch (e) {
        console.error(e);
        toast.error("Failed to load subscription");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [router, updateSubscription]);

  /* ---------------- SUB / UNSUB ---------------- */
  const handleAction = (pkg: PackageItem) => {
    if (!pkg.sub_unsub_url) return;
    window.location.href = pkg.sub_unsub_url;
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-red-500">
      <div className="p-4 text-center text-white font-semibold">
        Subscription
      </div>

      <div className="bg-[#f5f5f5] rounded-t-3xl p-6 min-h-screen">
        {loading ? (
          <p className="text-center">Loading…</p>
        ) : (
          <div className="grid gap-4">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 text-center shadow"
              >
                <div className="bg-red-500 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3">
                  <span className="text-white font-bold flex items-center gap-1">
                    <FaBangladeshiTakaSign /> {pkg.price}
                  </span>
                </div>

                <h2 className="font-semibold capitalize">
                  {pkg.pack_name}
                </h2>

                <p className="text-xs text-gray-500 mb-4">
                  {pkg.billing_message}
                </p>

                <button
                  onClick={() => handleAction(pkg)}
                  className={`w-full py-2 rounded text-white ${
                    pkg.is_subscribe
                      ? "bg-gray-400"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {pkg.is_subscribe ? "Unsubscribe" : "Subscribe"}
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-gray-600 mt-10">
          Help Line : <b>22222</b>
        </p>
      </div>
    </div>
  );
}
