// app/news/[id]/page.tsx - Updated News Details Page
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";

interface NewsDetails {
  content_id?: string;
  heading?: string;
  news?: string;
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

export default function NewsDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [newsDetails, setNewsDetails] = useState<NewsDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching news details for content_id:", params.id);
        
        const response = await api.post(`/contentinfo/news-details?content_id=${params.id}`);
        console.log("Full API Response:", response.data);
        
        // Direct response (as shown in your example)
        const data = response.data;
        
        if (data) {
          console.log("News data received:", {
            content_id: data.content_id,
            heading: data.heading,
            hasNews: !!data.news,
            newsLength: data.news?.length,
            banner: data.banner,
            content_type: data.content_type
          });
          
          const transformedData: NewsDetails = {
            content_id: data.content_id || params.id,
            heading: data.heading,
            news: data.news, // This is the main content field
            content: data.news || data.content || data.body || data.description,
            body: data.body || data.news,
            description: data.description || data.summary,
            banner: data.banner || data.thumbnail || data.image,
            thumbnail: data.thumbnail || data.banner,
            image_caption: data.image_caption,
            author: data.author || "Sports Reporter",
            publish_date: data.publish_date,
            content_type: data.content_type || data.category,
            tags: data.tags || [],
            views: data.views,
            read_time: data.read_time,
            is_premium: data.is_premium
          };
          
          setNewsDetails(transformedData);
        } else {
          setError("News article not found");
        }
      } catch (err: any) {
        console.error("Error fetching news details:", err);
        console.error("Error details:", err.response?.data);
        setError("Failed to load news details. Please try again.");
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !newsDetails) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The requested news article could not be found."}</p>
          <button
            onClick={() => router.push("/news")}
            className="bg-black text-white font-medium py-2 px-6 rounded"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  const displayTitle = newsDetails.heading;
  const displayContent = newsDetails.news || newsDetails.content || newsDetails.body || newsDetails.description;
  const displayCategory = newsDetails.content_type;
  const displayImage = newsDetails.banner || newsDetails.thumbnail;

  // Function to format HTML content with proper styling
  const formatContent = (html: string) => {
    if (!html) return null;
    
    // Add Tailwind classes to HTML content
    const formattedHtml = html
      .replace(/<p>/g, '<p class="mb-4">')
      .replace(/<h1>/g, '<h1 class="text-2xl font-bold mt-6 mb-3">')
      .replace(/<h2>/g, '<h2 class="text-xl font-bold mt-5 mb-3">')
      .replace(/<h3>/g, '<h3 class="text-lg font-bold mt-4 mb-2">')
      .replace(/<ul>/g, '<ul class="list-disc pl-6 mb-4">')
      .replace(/<ol>/g, '<ol class="list-decimal pl-6 mb-4">')
      .replace(/<li>/g, '<li class="mb-1">')
      .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">');
    
    return formattedHtml;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-300">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-black font-medium"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* News Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Category Badge */}
        {displayCategory && (
          <div className="mb-4">
            <span className={`text-sm font-medium px-3 py-1 rounded ${
              displayCategory === 'football' 
                ? 'bg-green-100 text-green-800'
                : displayCategory === 'cricket'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {displayCategory === 'football' ? 'ফুটবল' : 
               displayCategory === 'cricket' ? 'ক্রিকেট' : 
               displayCategory}
            </span>
          </div>
        )}

        {/* News Title */}
        <h1 className="text-2xl font-bold text-black mb-6 leading-tight">
          {displayTitle}
        </h1>

        {/* Author and Date */}
        <div className="flex items-center justify-between mb-8 text-sm text-gray-600 border-b border-gray-300 pb-4">
          <div className="flex items-center">
            <span className="font-medium">{newsDetails.author || "Sports Reporter"}</span>
            {newsDetails.publish_date && (
              <span className="mx-2">•</span>
            )}
          </div>
          {newsDetails.publish_date && (
            <span>
              {new Date(newsDetails.publish_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          )}
        </div>

        {/* News Image */}
        {displayImage && (
          <div className="mb-8">
            <img
              src={displayImage}
              alt={displayTitle || "News image"}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/800x400?text=News+Image';
              }}
            />
            {newsDetails.image_caption && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                {newsDetails.image_caption}
              </p>
            )}
          </div>
        )}

        {/* News Content */}
        <div className="text-gray-800 leading-relaxed">
          {displayContent ? (
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: formatContent(displayContent) || displayContent }}
            />
          ) : (
            <div className="space-y-4">
              <p>No content available for this article.</p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            {newsDetails.views && (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{newsDetails.views.toLocaleString()} views</span>
              </div>
            )}
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{newsDetails.read_time || "2"} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Same as news list page */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 py-3">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-5 gap-2">
            {/* Result - Active */}
            <button className="flex flex-col items-center text-black">
              <span className="text-xs font-bold mb-1">Result</span>
              <div className="w-6 h-0.5 bg-black mt-1"></div>
            </button>

            {/* Quiz */}
            <button className="flex flex-col items-center text-gray-500">
              <span className="text-xs font-medium mb-1">Quiz</span>
            </button>

            {/* Home */}
            <button className="flex flex-col items-center text-gray-500">
              <span className="text-xs font-medium mb-1">Home</span>
            </button>

            {/* News */}
            <button 
              onClick={() => router.push("/news")}
              className="flex flex-col items-center text-gray-500"
            >
              <span className="text-xs font-medium mb-1">News</span>
            </button>

            {/* Profile */}
            <button className="flex flex-col items-center text-gray-500">
              <span className="text-xs font-medium mb-1">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Spacing for bottom nav */}
      <div className="pb-20"></div>

      {/* Custom CSS for article content */}
      <style jsx global>{`
        .article-content {
          font-size: 1.125rem;
          line-height: 1.7;
        }
        
        .article-content p {
          margin-bottom: 1.5rem;
          text-align: justify;
        }
        
        .article-content strong, .article-content b {
          font-weight: 600;
        }
        
        .article-content em, .article-content i {
          font-style: italic;
        }
        
        .article-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .article-content a:hover {
          color: #1d4ed8;
        }
        
        .article-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .article-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .article-content li {
          margin-bottom: 0.5rem;
        }
        
        .article-content h1, .article-content h2, .article-content h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        
        .article-content h1 {
          font-size: 1.875rem;
        }
        
        .article-content h2 {
          font-size: 1.5rem;
        }
        
        .article-content h3 {
          font-size: 1.25rem;
        }
        
        .article-content blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          font-style: italic;
          margin: 1.5rem 0;
          color: #4b5563;
        }
        
        .article-content img {
          max-width: 100%;
          height: auto;
          margin: 1.5rem 0;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}