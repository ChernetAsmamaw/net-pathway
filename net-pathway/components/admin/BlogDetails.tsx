"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { ArrowLeft, User, CalendarIcon, Clock, Eye, Tag } from "lucide-react";
import { toast } from "react-hot-toast";
import CommentSection from "@/components/admin/BlogCommentSection";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [blog, setBlog] = useState(null);

  // Extract the blog ID from the URL params
  const blogId = params?.blogId as string;

  // Check authentication
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuth, isAuthenticated, router]);

  // Fetch blog data directly without using the store
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId || !isAuthenticated) return;

      setIsLoading(true);
      try {
        console.log("Direct fetch - blogId:", blogId);
        const response = await axios.get(`${API_URL}/blogs/${blogId}`, {
          withCredentials: true,
        });

        console.log("Direct fetch - API response:", response.data);

        if (response.data.post) {
          setBlog(response.data.post);
        } else {
          toast.error("Blog post not found");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog post");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBlog();
    }
  }, [blogId, isAuthenticated]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="transition-all duration-300">
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sky-700 hover:text-sky-800 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to All Blogs</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-sky-700 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : blog ? (
            <>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Featured Image */}
                {blog.image && (
                  <div className="h-64 md:h-96 relative w-full">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content Container */}
                <div className="p-6 md:p-8">
                  {/* Title and Meta */}
                  <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {blog.title}
                    </h1>

                    <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-6">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{blog.author?.username || "Unknown Author"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          Published{" "}
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                      </div>
                      {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Updated {formatDate(blog.updatedAt)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{blog.views} views</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-sm flex items-center gap-1"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-sky-500">
                      <p className="text-gray-700 italic">{blog.summary}</p>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="prose prose-lg max-w-none">
                    {blog.content.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-800">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <CommentSection blogId={blogId} />
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <div className="mb-4 text-5xl">🔍</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Blog Post Not Found
              </h3>
              <p className="text-gray-600 mb-8">
                The blog post you're looking for doesn't exist or has been
                removed
              </p>
              <button
                onClick={() => router.push("/blogs")}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Go to Blogs
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
