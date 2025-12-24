// app/news/[id]/page.tsx - Updated News Details Page
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import { FaArrowLeftLong } from "react-icons/fa6";

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
    <div className="min-h-screen bg-white relative z-10 rounded-t-2xl">
      {/* Back Button Header */}
      <div className="">
        <div className="mx-auto max-w-4xl px-4 py-4 pb-0 flex items-center">
          <button onClick={() => router.back()} className="text-black font-medium hover:text-red-500 flex justify-center items-center">
            <FaArrowLeftLong className="pr-1" /> News Details
          </button>
        </div>
      </div>
      {/* News Content */}
      <div className="container mx-auto px-4 py-6 top-[-10px]">

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
              <p className="text-xs text-gray-500 mt-2 text-center">
                {newsDetails.image_caption}
              </p>
            )}
          </div>
        )}

         {/* News Title */}
        <h1 className="text-lg font-bold text-black mb-6 leading-tight">
          {displayTitle}
        </h1>

        {/* News Content */}
        <div className="text-gray-800">
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
      </div>

      {/* Custom CSS for article content */}
      <style jsx global>{`
        .article-content {
          font-size:14px;
          line-height: 1.7;
        }
        
        .article-content p {
          margin-bottom: 0;
          text-align: justify;
        }
        
        .article-content strong, .article-content b {
          font-weight: 500;
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
          font-size:20px;
        }
        
        .article-content h2 {
          font-size: 1.5rem;
        }
        
        .article-content h3 {
          font-size: 18px;
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