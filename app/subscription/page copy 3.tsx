"use client";

import { useEffect, useState, useRef } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = "https://apiv2.mysports.com.bd/api/v1";

interface PackageItem {
  pack_name: string;
  pack_type: string;
  price: string;
  base_price: string;
  day: string;
  is_subscribe: boolean;
  sub_unsub_url: string;
  billing_message: string;
  is_promoted: boolean;
}

export default function SubscriptionPage() {
  const router = useRouter();

  const userInfo = useAuthStore((s) => s.userInfo);
  const accessToken = useAuthStore((s) => s.accessToken);
  const updateSubscription = useAuthStore((s) => s.updateSubscription);

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [operator, setOperator] = useState<string | null>(null);
  const [subData, setSubData] = useState<any>(null);
  const [operatorLogo, setOperatorLogo] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const fetchedRef = useRef(false);

  /* -----------------------------
     HYDRATION
  ----------------------------- */
  useEffect(() => {
    setHydrated(true);
  }, []);

  /* -----------------------------
     AUTH GUARD
  ----------------------------- */
  useEffect(() => {
    if (!hydrated) return;

    if (!userInfo || !accessToken) {
      router.replace("/otp");
    }
  }, [hydrated, userInfo, accessToken, router]);

  /* -----------------------------
     FETCH SUBSCRIPTION
  ----------------------------- */
  const fetchSubscription = async () => {
    if (!userInfo?.msisdn || !accessToken) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/subscription/${userInfo.msisdn}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 5pake7mh5ln64h5t28kpvtv3iri`, // ✅ FIX
          },
          body: JSON.stringify({
            accessinfo: {
              access_token: 'K165S6V6q4C6G7H0y9C4f5W7t5YeC6',
              referenceCode: new Date().toString(),
            },
          }),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Session expired, please login again");
          router.replace("/otp");
          return;
        }
        throw new Error("Subscription API failed");
      }

      const data = await res.json();
      console.log("Subscription Data:", data);

      setSubData(data);
      const activePack = data?.pack_list?.find(
        (p: PackageItem) => p.is_subscribe
      );

      setOperator(data?.user_info?.oparetorname || null);
      setOperatorLogo(data?.user_info?.logo || null);
      setPackages(Array.isArray(data?.pack_list) ? data.pack_list : []);

      // ✅ UPDATE STORE (SUB / UNSUB BOTH)
      if (activePack) {
        updateSubscription({
          subscribed: true,
          pack_name: activePack.pack_name,
          price: activePack.price,
          day: activePack.day,
        });
      } else {
        updateSubscription({ subscribed: false });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subscription info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hydrated || fetchedRef.current) return;
    fetchedRef.current = true;
    fetchSubscription();
  }, [hydrated]);

  /* -----------------------------
     SUBSCRIBE / UNSUBSCRIBE
  ----------------------------- */
  const handleSubscribe = (pkg: PackageItem) => {
    if (!pkg.sub_unsub_url) return;
    window.location.href = pkg.sub_unsub_url;
  };

  /* -----------------------------
     LOADING
  ----------------------------- */
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  /* =============================
     UI
  ============================= */
  return subData && (
    <div className="min-h-screen bg-red-500 flex flex-col items-center">
      <div className="w-full bg-red-500 p-4 text-center">
        <h1 className="text-white text-lg font-semibold">Subscription</h1>
      </div>

      <div className="bg-[#f5f5f5] rounded-t-3xl w-full flex-grow p-6">
        {subData && (
          <div className="flex justify-center items-center gap-2 mb-4">
            {subData && (
              <img src={subData.user_info?.logo} alt={subData.user_info?.oparetorname} className="h-6" />
            )}
            <span className="capitalize font-medium">{subData.user_info?.oparetorname}</span>
          </div>
        )}

        <p className="text-gray-700 text-sm text-center mb-6">
          To enjoy all premium sports content please choose a package
        </p>

        {loading ? (
          <p className="text-center">Loading…</p>
        ) : (
          <div className="grid gap-4">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-4 text-center border"
              >
                <div className="bg-red-500 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3">
                  <span className="text-white font-bold flex items-center gap-1">
                    <FaBangladeshiTakaSign /> {pkg.price}
                  </span>
                </div>

                <h2 className="font-semibold capitalize">{pkg.pack_name}</h2>

                <p className="text-xs text-gray-500 mb-4">
                  {pkg.billing_message}
                </p>

                <button
                  onClick={() => handleSubscribe(pkg)}
                  className="w-full py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
                >
                  {pkg.is_subscribe ? "Unsubscribe" : "Subscribe"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-gray-600">Help Line : 22222</div>
      </div>
    </div>
  );
}
