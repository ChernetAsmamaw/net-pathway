"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { Search, CalendarIcon, Clock, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  tags: string[];
  views: number;
  image?: string;
}

export default function BlogListPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuthStatus, isAuthenticated, router]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/blogs/published", {
          withCredentials: true
        });
        
        if (response.data.posts) {
          setBlogs(response.data.posts);
        }
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

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    blog.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
      <Navbar />
      <Sidebar onCollapse={setIsSidebarCollapsed} />
      <main className={`pt-16 ${isSidebarCollapsed ? "ml-20" : "ml-64"} transition-all duration-300`}>
        <div className="p-6 md:p-8">
          {/* Header Section */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-700">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-sky-800 mb-2">Blog Posts</h1>
                <p className="text-slate-600">Stay updated with the latest insights and articles</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blog posts by title, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Blog Posts Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-sky-700 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <Link key={blog._id} href={`/blogs/${blog._id}`}>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
                    {blog.image ? (
                      <div className="h-48 relative">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-r from-sky-100 to-purple-100 flex items-center justify-center">
                        <span className="text-3xl">📝</span>
                      </div>
                    )}
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-sky-700 transition-colors">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 mb-4 flex-grow">{blog.summary}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-sky-50 text-sky-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded-full text-xs">
                            +{blog.tags.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatDate(blog.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{blog.views} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <div className="mb-4 text-5xl">📝</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No blog posts found</h3>
              <p className="text-gray-600 mb-8">
                {searchQuery ? 'Try adjusting your search' : 'Check back later for new content'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}