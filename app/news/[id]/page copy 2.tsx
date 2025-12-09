// app/news/[id]/page.tsx - Updated
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";

interface NewsDetails {
  content_id?: string;
  heading?: string;
  content?: string;
  body?: string;
  description?: string;
  banner?: string;
  thumbnail?: string;
  image_caption?: string;
  author?: string;
  publish_date?: string;
  content_type?: string;
  tags?: string[];
  views?: number;
  read_time?: string;
  is_premium?: string;
}

interface RelatedNews {
  content_id: string;
  heading: string;
  thumbnail?: string;
  banner?: string;
  content_type: string;
}

export default function NewsDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [newsDetails, setNewsDetails] = useState<NewsDetails | null>(null);
  const [relatedNews, setRelatedNews] = useState<RelatedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching details for content_id:", params.id);
        
        // First try direct API call
        const response = await api.post(`/contentinfo/news-details?content_id=${params.id}`);
        console.log("News Details API Response:", response.data);
        
        // Handle different response structures
        let data;
        if (response.data.data) {
          data = response.data.data; // If wrapped in data object
        } else if (response.data.success && response.data.data) {
          data = response.data.data; // If wrapped in success object
        } else {
          data = response.data; // Direct response
        }
        
        if (data) {
          // Transform to our interface
          const transformedData: NewsDetails = {
            content_id: data.content_id || params.id,
            heading: data.heading || data.title,
            content: data.content || data.body || data.description || data.details,
            body: data.body || data.content,
            description: data.description || data.summary,
            banner: data.banner || data.thumbnail || data.image,
            thumbnail: data.thumbnail || data.banner,
            image_caption: data.image_caption,
            author: data.author || data.reporter || "Sports Reporter",
            publish_date: data.publish_date || data.created_at || data.date,
            content_type: data.content_type || data.category,
            tags: data.tags || [],
            views: data.views || data.view_count,
            read_time: data.read_time,
            is_premium: data.is_premium
          };
          
          setNewsDetails(transformedData);
          
          // Fetch related news
          if (data.content_type) {
            try {
              const relatedResponse = await api.get(`/contentinfo/news?page_number=1&per_page_count=3`);
              if (Array.isArray(relatedResponse.data)) {
                // Filter out current news and take first 3
                const filtered = relatedResponse.data
                  .filter((news: any) => news.content_id !== params.id)
                  .slice(0, 3);
                setRelatedNews(filtered);
              } else if (relatedResponse.data.news) {
                const filtered = relatedResponse.data.news
                  .filter((news: any) => news.content_id !== params.id)
                  .slice(0, 3);
                setRelatedNews(filtered);
              }
            } catch (err) {
              console.error("Error fetching related news:", err);
            }
          }
        } else {
          setError("News article not found");
        }
      } catch (err: any) {
        console.error("Error fetching news details:", err);
        setError(err.response?.data?.message || err.message || "Failed to load news details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNewsDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !newsDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.928-.833-2.698 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">ওহো!</h1>
          <p className="text-gray-600 mb-6">{error || "নিউজ আর্টিকেল পাওয়া যায়নি"}</p>
          <button
            onClick={() => router.push("/news")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            নিউজ তালিকায় ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  const displayImage = newsDetails.banner || newsDetails.thumbnail;
  const displayTitle = newsDetails.heading;
  const displayContent = newsDetails.content || newsDetails.body || newsDetails.description;
  const displayCategory = newsDetails.content_type;
  const displayAuthor = newsDetails.author;
  const displayDate = newsDetails.publish_date;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Simple Back Button Only */}
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium py-2 transition duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          নিউজ তালিকায় ফিরে যান
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
                displayCategory === 'football' 
                  ? 'bg-green-100 text-green-800'
                  : displayCategory === 'cricket'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {displayCategory === 'football' ? 'ফুটবল' : 
                 displayCategory === 'cricket' ? 'ক্রিকেট' : 
                 displayCategory}
              </span>
              {newsDetails.is_premium === "true" && (
                <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1.5 rounded-full">
                  Premium
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {displayTitle}
            </h1>

            {/* Author Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {displayAuthor?.charAt(0) || "S"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{displayAuthor || "Sports Reporter"}</h3>
                  {displayDate && (
                    <p className="text-gray-600 text-sm">
                      প্রকাশিত: {new Date(displayDate).toLocaleDateString('bn-BD', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                {newsDetails.views && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="font-semibold">{newsDetails.views.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 ml-1">দেখেছেন</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">{newsDetails.read_time || "২"} মিনিট</span>
                  <span className="text-sm text-gray-500 ml-1">পড়া</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {displayImage && (
            <div className="mb-8">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={displayImage}
                  alt={displayTitle}
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/800x500?text=News+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                {newsDetails.image_caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 text-sm">
                    {newsDetails.image_caption}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="prose prose-lg max-w-none">
                {displayContent ? (
                  <div 
                    className="text-gray-700 leading-relaxed space-y-6 text-justify"
                    dangerouslySetInnerHTML={{ __html: displayContent }}
                  />
                ) : (
                  <div className="text-gray-700 leading-relaxed space-y-6 text-justify">
                    <p>এই নিউজের কন্টেন্ট এখনো যোগ করা হয়নি।</p>
                    <p>দুঃখিত অসুবিধার জন্য। আপনি চাইলে অন্য নিউজ পড়তে পারেন।</p>
                  </div>
                )}
              </article>

              {/* Tags */}
              {newsDetails.tags && newsDetails.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ট্যাগসমূহ</h3>
                  <div className="flex flex-wrap gap-2">
                    {newsDetails.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition duration-300 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Related News */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {relatedNews.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                      সম্পর্কিত নিউজ
                    </h3>
                    
                    <div className="space-y-6">
                      {relatedNews.map((news, index) => (
                        <div
                          key={index}
                          onClick={() => router.push(`/news/${news.content_id}`)}
                          className="group cursor-pointer"
                        >
                          <div className="flex gap-4">
                            {(news.thumbnail || news.banner) && (
                              <div className="flex-shrink-0">
                                <img
                                  src={news.thumbnail || news.banner}
                                  alt={news.heading}
                                  className="w-20 h-20 rounded-lg object-cover group-hover:scale-105 transition duration-300"
                                />
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition duration-300 line-clamp-2">
                                {news.heading}
                              </h4>
                              <span className="text-xs text-gray-500 mt-2 block">
                                {news.content_type === 'football' ? 'ফুটবল' : 
                                 news.content_type === 'cricket' ? 'ক্রিকেট' : 
                                 news.content_type}
                              </span>
                            </div>
                          </div>
                          {index < relatedNews.length - 1 && (
                            <div className="border-t border-gray-100 mt-6 pt-6"></div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => router.push("/news")}
                      className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition duration-300"
                    >
                      সকল নিউজ দেখুন
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                      সম্পর্কিত নিউজ
                    </h3>
                    <p className="text-gray-500 text-sm">কোন সম্পর্কিত নিউজ পাওয়া যায়নি</p>
                    <button
                      onClick={() => router.push("/news")}
                      className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition duration-300"
                    >
                      সকল নিউজ দেখুন
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}