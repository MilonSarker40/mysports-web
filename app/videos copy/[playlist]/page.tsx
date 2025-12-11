"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function PlaylistPage({ params }: { params: { playlist: string } }) {
  const router = useRouter();
  const playlistTitle = params.playlist || "Cricket";

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!playlistTitle) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      
      // This is the raw, unencoded title, e.g., "Popular Videos"
      const rawTitle = playlistTitle; 
      const endpoint = `/contentinfo/related-content?playlist_title=${rawTitle}`;
      
      console.log("[Playlist] GET", api.defaults?.baseURL + endpoint);

      try {
        // Note: The API call is a POST in your original code, not GET
        const res = await api.post(endpoint); 
        const list = res.data?.contents || [];

        if (list.length > 0) {
          setItems(list);
          setLoading(false);
          // SUCCESS → stop trying more encodings (now only one attempt)
          return; 
        }
      } catch (err: any) {
        console.error(
          "[Playlist] request failed:",
          err?.response?.status,
          err?.response?.data || err?.message
        );

        if (err?.response?.status === 403) {
          setError("Access forbidden (403). Check API permissions.");
        }
      }
      
      // If the single attempt failed:
      setError("No videos found for this playlist.");
      setLoading(false);
    };

    fetchData();
  }, [playlistTitle]);

  return (
    <div className="min-h-screen bg-gray-50 relative z-10 rounded-t-2xl">
      <header className="text-gray-600 py-4 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button className="p-1" onClick={() => router.back()}>←</button>
          <h1 className="text-base font-semibold">{playlistTitle}</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 pt-0">
        {loading && <p className="text-sm text-gray-500">Loading…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="space-y-6">
          {items.map((it: any) => (
            <div
              key={it.content_id}
              className="overflow-hidden border-b border-gray-200 cursor-pointer"
              onClick={() =>
                router.push(`/videos/${encodeURIComponent(playlistTitle)}/${it.content_id}`)
              }
            >
              <div className="relative rounded-2xl">
                <img
                  src={it.banner || it.thumbnail}
                  alt={it.content_title}
                  className="w-full h-48 rounded-2xl object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 bg-black/40 rounded-full flex items-center justify-center">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {it.is_premium === "true" && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs px-1 py-0.5 rounded font-bold">
                    PREMIUM
                  </div>
                )}
              </div>

              <div className="p-4 px-0">
                <h3 className="text-sm font-semibold text-gray-900">{it.content_title}</h3>
                {it.description && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{it.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {!loading && items.length === 0 && !error && (
          <p className="text-sm text-gray-500 mt-6">No videos found for this playlist.</p>
        )}
      </main>
    </div>
  );
}