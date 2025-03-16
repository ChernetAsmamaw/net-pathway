"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

import { Search, Calendar, User, Eye } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface BlogPost {
  _id: string;
  title: string;
  summary: string;
  author: {
    username: string;
    profilePicture?: string;
  };
  publishedAt: string;
  views: number;
  tags: string[];
  image?: string;
}

export default function BlogsPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuth, isAuthenticated, router]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await axios.get(`${API_URL}/blogs/published`, {
          withCredentials: true,
        });
        setBlogs(response.data.posts);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to load blog posts");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBlogs();
    }
  }, [isAuthenticated]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

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
      <main
      // className={`pt-16 ${
      //   isSidebarCollapsed ? "ml-20" : "ml-64"
      // } transition-all duration-300`}
      >
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Blog Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/blogs/${blog._id}`)}
                >
                  {blog.image && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {blog.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-sky-50 text-sky-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{blog.author.username}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(blog.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{blog.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No blog posts found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
