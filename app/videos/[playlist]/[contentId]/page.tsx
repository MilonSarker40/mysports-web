"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import Hls from "hls.js";

type Content = {
  content_id?: string;
  content_title?: string;
  description?: string;
  url?: string;           // m3u8 or mp4 url
  playlist?: string;
  thumbnail?: string;     // image url
  [k: string]: any;
};

export default function VideoDetailClient({ params }: { params: { playlist: string; contentId: string } }) {
  const { playlist, contentId } = params;
  const router = useRouter();

  const [item, setItem] = useState<Content | null>(null);
  const [related, setRelated] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load primary details and related list
  useEffect(() => {
    if (!contentId) return;

    const playlistType = playlist ? String(playlist).toLowerCase() : "";
    const encodedPlaylist = encodeURIComponent(String(playlist || ""));

    (async () => {
      setLoading(true);
      setError("");
      setItem(null);
      try {
        const endpoint = `/contentinfo/details?playlist_type=${encodeURIComponent(playlistType)}&content_id=${encodeURIComponent(contentId)}`;
        console.log("[Details] POST", api.defaults?.baseURL + endpoint);
        const res = await api.post(endpoint);
        const data = res.data;
        const found = data?.content ?? (data?.contents && data.contents.length ? data.contents[0] : data);
        setItem(found || null);
      } catch (err: any) {
        console.warn("[Details] primary failed:", err?.response?.status, err?.response?.data || err?.message);

        // fallback to related-content -> try to find content there
        try {
          setLoadingRelated(true);
          console.log("[Details] Fallback: POST related-content");
          const r2 = await api.post(`/contentinfo/related-content?playlist_title=${encodedPlaylist}`);
          const contents: Content[] = r2.data?.contents || [];
          setRelated(contents);
          const found = contents.find((c) => String(c.content_id) === String(contentId));
          setItem(found || null);

          if (!found) {
            if (r2?.status === 404) setError("Video not found (404).");
            else setError("Video not found in playlist.");
          }
        } catch (e: any) {
          console.error("[Details] fallback failed:", e?.response?.status, e?.response?.data || e.message);
          setError("Failed to load video details.");
        } finally {
          setLoadingRelated(false);
        }
      } finally {
        setLoading(false);
      }

      // always attempt to populate related list (if not already)
      try {
        if (!related.length) {
          const rr = await api.post(`/contentinfo/related-content?playlist_title=${encodedPlaylist}`);
          setRelated(rr.data?.contents || []);
        }
      } catch {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist, contentId]);

  // When item changes, attach source and play (handles HLS)
  useEffect(() => {
    if (!item || !videoRef.current) return;
    const videoEl = videoRef.current;
    const src = (item?.url || item?.playlist) as string | null;
    if (!src) return;

    // Remove any previous src & Hls instance by recreating element source assignment flow.
    let hls: Hls | null = null;

    const attachAndPlay = async () => {
      try {
        if (videoEl.canPlayType && videoEl.canPlayType("application/vnd.apple.mpegurl")) {
          videoEl.src = src;
          await videoEl.play().catch(() => {});
        } else if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(videoEl);
          hls.on(Hls.Events.MANIFEST_PARSED, async () => {
            await videoEl.play().catch(() => {});
          });
        } else {
          videoEl.src = src;
          await videoEl.play().catch(() => {});
        }
      } catch (err) {
        console.warn("Video playback attach error:", err);
      }
    };

    attachAndPlay();

    return () => {
      if (hls) {
        try {
          hls.destroy();
        } catch {}
      }
      // pause/reset source
      try {
        videoEl.pause();
        // keep src if you want to resume later; if you'd like to clear:
        // videoEl.removeAttribute("src");
        // videoEl.load();
      } catch {}
    };
  }, [item]);

  // Click handler for thumbnails -> set item to clicked video and scroll to player
  const handleSelect = (c: Content) => {
    setError("");
    setItem(c);
    // scroll player into view
    const videoWrap = document.getElementById("video-player-wrap");
    if (videoWrap) videoWrap.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-t-2xl relative z-10 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="p-1 rounded hover:bg-gray-100">←</button>
          <h1 className="text-base font-semibold truncate">{playlist || "Playlist"}</h1>
        </div>

        {loading && <p className="text-sm text-gray-500">Loading video details...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {item ? (
          <div className="overflow-hidden">
            <div id="video-player-wrap" className="rounded-2xl">
              <video
                ref={videoRef}
                controls
                className="w-full h-[250px] rounded-2xl"
                playsInline
              />
            </div>

            <div className="p-4 px-0">
              <h2 className="text-base font-semibold text-red-500">{item.content_title}</h2>
              {item.description && <p className="text-sm text-gray-600 mt-2">{item.description}</p>}
            </div>
          </div>
        ) : (
          !loading && <p className="text-sm text-gray-500">Video not found.</p>
        )}

        {/* Related list / More videos */}
        <div className="mt-6 bg-[#f3f3f3] min-h-screen p-4 rounded-t-2xl mx-[-16px]">
          <h3 className="text-base font-medium mb-5">More Videos</h3>

          {loadingRelated && <p className="text-sm text-gray-500">Loading related videos...</p>}

          <div className="space-y-3">
            {related.length > 0 ? (
              related.map((c) => {
                const isActive = String(c.content_id) === String(item?.content_id);
                return (
                  <button
                    key={c.content_id || c.content_title}
                    onClick={() => handleSelect(c)}
                    className={`flex items-center gap-3 w-full text-left p-3 pt-0 border-b border-gray-300 px-0 focus:outline-none ${
                      isActive ? "" : ""
                    }`}
                  >
                    <div className="w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      {c.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.thumbnail} alt={c.content_title} className="w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No image</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-medium line-clamp-2">{c.content_title}</div>
                      {c.description && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{c.description}</div>}
                    </div>

                    {/* <div className="text-xs text-gray-400">{isActive ? "Playing" : "Play"}</div> */}
                  </button>
                );
              })
            ) : (
              !loadingRelated && <p className="text-sm text-gray-500">No related videos found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
