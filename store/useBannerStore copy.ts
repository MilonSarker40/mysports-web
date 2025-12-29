"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "@/utils/api";

export type BannerItem = {
  content_id: string;
  content_title: string;
  banner: string;
  thumbnail: string;
  url: string;
  content_type: string;
  is_premium: string;
};

type BannerState = {
  banners: BannerItem[];
  loading: boolean;
  error: string | null;
  fetchBanners: () => Promise<void>;
  setBanners: (b: BannerItem[]) => void;
};

export const useBannerStore = create<BannerState>()(
  devtools((set) => ({
    banner: [],
    loading: false,
    error: null,
    setBanners: (banners: BannerItem[]) => set({ banners }),
    fetchBanners: async () => {
      set({ loading: true, error: null });
      try {
        const res = await api.post(
          "/contentinfo/banner",
          // {}, 
          // {
          //   headers: {
          //     Authorization: `Bearer 5pake7mh5ln64h5t28kpvtv3iri`,
          //     "X-Custom-Header": "value",
          //   },
          // }
        );
        const data = res?.data?.banner ?? [];
        set({ banners: data, loading: false });
      } catch (err: any) {
        set({
          error: err?.message ?? "Failed to load banners",
          loading: false,
        });
      }
    },
  }))
);
