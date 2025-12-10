// app/news/page.tsx - Load more (4 items) without full reload
"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface NewsItem {
  content_id: string;
  heading: string;
  banner?: string;
  thumbnail?: string;
  content_type: string;
  is_premium: string;
}

export default function NewsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  // load-more related
  const PER_LOAD_COUNT = 4; // number of items to load on each "আরো নিউজ দেখুন" click
  const [nextPageToLoad, setNextPageToLoad] = useState(initialPage + 1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let mounted = true;

    const normalizePayloadToList = (payload: any): NewsItem[] => {
      if (!payload) return [];
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload.news)) return payload.news;
      if (Array.isArray(payload.data?.news)) return payload.data.news;
      return [];
    };

    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.post(
          `/contentinfo/news?page_number=${initialPage}&per_page_count=${Math.max(5, PER_LOAD_COUNT)}`
        );
        if (!mounted) return;
        const payload = response.data;
        const items = normalizePayloadToList(payload);

        setNewsList(items);
        // use total_pages if provided (prefer server's knowledge)
        const tp = payload?.total_pages ?? payload?.data?.total_pages;
        setTotalPages(tp ?? 1);

        // decide hasMore: if server tells total_pages > initialPage, or items length equals per_page count
        if (typeof tp === "number") {
          setHasMore(initialPage < tp);
          setNextPageToLoad(initialPage + 1);
        } else {
          // fallback: if returned items >= per_page_count then we assume there could be more
          setHasMore(items.length >= PER_LOAD_COUNT);
          setNextPageToLoad(initialPage + 1);
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load news");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchNews();

    return () => {
      mounted = false;
    };
  }, [initialPage]);

  const handleRefresh = () => {
    // keep client-side refresh: re-fetch initial page data
    router.push(`/news?page=${initialPage}`);
  };

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    router.push(`/news?page=${page}`);
  };

  // New: load more (4 items) without full page reload
  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const response = await api.post(
        `/contentinfo/news?page_number=${nextPageToLoad}&per_page_count=${PER_LOAD_COUNT}`
      );
      const payload = response.data;
      // normalize
      const newItems: NewsItem[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.news)
        ? payload.news
        : Array.isArray(payload.data?.news)
        ? payload.data.news
        : [];

      if (newItems.length > 0) {
        setNewsList((prev) => [...prev, ...newItems]);
      }

      // Update hasMore using server total_pages if available
      const tp = payload?.total_pages ?? payload?.data?.total_pages;
      if (typeof tp === "number") {
        setHasMore(nextPageToLoad < tp);
      } else {
        // if server doesn't provide total_pages, infer: if returned less than PER_LOAD_COUNT => no more
        setHasMore(newItems.length >= PER_LOAD_COUNT);
      }

      setNextPageToLoad((p) => p + 1);
    } catch (err: any) {
      // you can surface an error toast here; for now set a simple error state
      setError(err?.response?.data?.message || "Failed to load more news");
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4" />
          <p className="text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!newsList.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No News Found</h1>
          <p className="text-gray-600 mb-6">Unable to load news articles at the moment.</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pb-8 pt-5 bg-[#f3f3f3] rounded-t-2xl relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 max-w-4xl mx-auto">
          {/* Banner Image with Heading - First news item */}
          {newsList.length > 0 && (
            <div className="mb-0 pb-6 border-b border-gray-400">
              <div className="relative rounded-xl overflow-hidden mb-4">
                <img
                  src={newsList[0].banner || newsList[0].thumbnail}
                  alt={newsList[0].heading}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/1200x400?text=News+Image";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {newsList[0].is_premium === "true" && (
                  <span className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <Link href={`/news/${newsList[0].content_id}`}>
                <h2 className="text-lg font-bold text-gray-900 hover:text-red-600 transition-colors duration-300">
                  {newsList[0].heading}
                </h2>
              </Link>
            </div>
          )}

          {/* Other news items */}
          {newsList.slice(1).map((news) => (
            <div key={news.content_id} className="overflow-hidden transition-shadow border-b border-gray-400 last:border-b-0">
              <div className="p-4 px-0">
                <div className="flex lg:flex-row gap-3 lg:gap-6">
                  {/* Image */}
                  {(news.thumbnail || news.banner) && (
                    <div className="w-1/3 flex-shrink-0">
                      <div className="relative h-20 lg:h-24 rounded-xl overflow-hidden">
                        <img
                          src={news.thumbnail || news.banner}
                          alt={news.heading}
                          className="w-full h-full hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/400x300?text=News+Image";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        {news.is_premium === "true" && (
                          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className={`${news.thumbnail || news.banner ? "w-2/3" : ""}`}>
                    <Link href={`/news/${news.content_id}`}>
                      <h2 className="text-sm font-medium text-gray-900 mb-3 hover:text-red-600 transition-colors duration-300 line-clamp-2">
                        {news.heading}
                      </h2>
                    </Link>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2 py-1 bg-gray-200 text-gray-700 rounded">
                        {news.content_type === "football" ? "ফুটবল" :
                         news.content_type === "cricket" ? "ক্রিকেট" :
                         news.content_type}
                      </span>
                      <span className="text-xs text-gray-500">২ মিনিট পড়া</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-600">Page {initialPage} of {totalPages}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(initialPage - 1)}
                disabled={initialPage === 1}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition duration-300 ${
                  initialPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                আগের
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition duration-300 ${
                        initialPage === pageNum
                          ? "bg-red-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="px-2 text-gray-400">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition duration-300 ${
                        initialPage === totalPages
                          ? "bg-red-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => handlePageChange(initialPage + 1)}
                disabled={initialPage === totalPages}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition duration-300 ${
                  initialPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                পরের
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Load More Button (Alternative to pagination): now loads 4 items per click without reload */}
        {totalPages === 1 && newsList.length >= PER_LOAD_COUNT && (
          <div className="mt-8 text-center">
            {hasMore ? (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-3 px-6 rounded-lg transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingMore ? "লোড হচ্ছে..." : "আরো নিউজ দেখুন"}
              </button>
            ) : (
              <div className="text-gray-500 text-sm">আর কোনও নিউজ নেই</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
