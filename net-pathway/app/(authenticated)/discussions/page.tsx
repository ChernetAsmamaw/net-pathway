"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  MessageSquare,
  Users,
  Search,
  Plus,
  Hash,
  ArrowRight,
  Clock,
} from "lucide-react";
import Image from "next/image";
import CreateDiscussionModal from "@/components/discussions/CreateDiscussionModal";
import DiscussionCard from "@/components/discussions/DiscussionCard";

// Temporary data structure - replace with API integration
const discussions = [
  {
    id: 1,
    title: "Software Engineering Career Path",
    description: "Let's discuss the best path to become a software engineer",
    creator: {
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
    },
    participants: 24,
    messages: 156,
    lastActive: "2 hours ago",
    tags: ["career", "software", "engineering"],
  },
  // Add more discussions...
];

export default function DiscussionsPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuthStatus, isAuthenticated, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading discussions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar onCollapse={setIsSidebarCollapsed} />
      <main
        className={`pt-16 ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-300`}
      >
        <div className="p-6 md:p-8">
          {/* Header Section */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-700">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-sky-800 mb-2">
                  Discussions
                </h1>
                <p className="text-slate-600">
                  Join conversations, share knowledge, and connect with peers
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Discussion</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-sky-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/50 backdrop-blur-sm hover:bg-white transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {["all", "popular", "recent", "my-discussions"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeFilter === filter
                      ? "bg-sky-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() +
                    filter.slice(1).replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Discussions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discussions.map((discussion) => (
              <DiscussionCard
                key={discussion.id}
                discussion={discussion}
                onClick={() => router.push(`/discussions/${discussion.id}`)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Create Discussion Modal */}
      {showCreateModal && (
        <CreateDiscussionModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
