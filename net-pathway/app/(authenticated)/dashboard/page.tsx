"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useBlogStore } from "@/store/useBlogStore";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import VerificationNotice from "@/components/notifications/VerificationNotice";
import {
  ChevronRight,
  Book,
  Users,
  MessageCircle,
  ArrowRight,
  Eye,
  User,
  Tag,
  Clock,
  CalendarDays,
  MessageSquare,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [hideVerificationNotice, setHideVerificationNotice] = useState(false);

  // Blog store
  const {
    blogs,
    isLoading: isBlogsLoading,
    error: blogsError,
    fetchPublishedBlogs,
  } = useBlogStore();

  // Discussion store
  const {
    discussions,
    isLoading: isDiscussionsLoading,
    error: discussionsError,
    fetchDiscussions,
    setFilters,
  } = useDiscussionStore();

  // Fetch data when component mounts
  useEffect(() => {
    // Fetch recent posts (limit to 3)
    fetchPublishedBlogs(1, 3);

    // Set filters for recent discussions and fetch
    setFilters({ sort: "activity" });
    fetchDiscussions();
  }, [fetchPublishedBlogs, fetchDiscussions, setFilters]);

  // User stats data (could come from an API call)
  const userStats = {
    completionPercentage: 65,
    assessmentsCompleted: 2,
    totalAssessments: 3,
  };

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="mx-auto px-4 py-6">
      {/* Verification Notice */}
      {!user?.isEmailVerified && !hideVerificationNotice && (
        <VerificationNotice onDismiss={() => setHideVerificationNotice(true)} />
      )}

      {/* Welcome Section */}
      <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 border-l-4 border-purple-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-4xl font-bold text-sky-800">
              Welcome,{" "}
              <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                {user?.username || "User"}!
              </span>
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Ready to continue your journey with us?
            </p>
          </div>
          {/* Progress Stats
          <div className="mt-6 md:mt-0 bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-sky-600 h-2.5 rounded-full"
                  style={{ width: `${userStats.completionPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700 ml-4">
                {userStats.completionPercentage}%
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {userStats.assessmentsCompleted} of {userStats.totalAssessments}{" "}
              assessments completed
            </p>
          </div> */}
        </div>
      </div>

      {/* Quick Links/Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 group"
          onClick={() => router.push("/assessment")}
        >
          <div className="p-3 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
            <Book className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Continue Assessment</h3>
            <p className="text-sm text-gray-500">
              Complete your career profile
            </p>
          </div>
          <ChevronRight className="ml-auto w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
        </div>

        <div
          className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 group"
          onClick={() => router.push("/mentorship")}
        >
          <div className="p-3 rounded-full bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Find a Mentor</h3>
            <p className="text-sm text-gray-500">Connect with professionals</p>
          </div>
          <ChevronRight className="ml-auto w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
        </div>

        <div
          className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 group"
          onClick={() => router.push("/discussions")}
        >
          <div className="p-3 rounded-full bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Join Discussions</h3>
            <p className="text-sm text-gray-500">Engage with the community</p>
          </div>
          <ChevronRight className="ml-auto w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-xl shadow-md p-6 h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Posts
            </h2>
            <button
              onClick={() => router.push("/blogs")}
              className="text-sky-600 text-sm font-medium flex items-center hover:text-sky-800 transition-colors"
            >
              View all
              <ArrowRight className="ml-1 w-4 h-4" />
            </button>
          </div>

          {isBlogsLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : blogsError ? (
            <p className="text-gray-500 text-center py-8">
              Unable to load recent posts
            </p>
          ) : (
            <div className="space-y-4">
              {blogs.length > 0 ? (
                blogs.slice(0, 3).map((post) => (
                  <div
                    key={post._id}
                    className="border-b border-gray-100 last:border-0 pb-4 last:pb-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2"
                    onClick={() => router.push(`/blogs/${post._id}`)}
                  >
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {post.summary}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500 gap-4">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span>{post.author?.username || "Unknown"}</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        <span>
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        <span>{post.views || 0} views</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No recent posts available
                </p>
              )}
            </div>
          )}
        </div>

        {/* Recent Discussions */}
        <div className="bg-white rounded-xl shadow-md p-6 h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Discussions
            </h2>
            <button
              onClick={() => router.push("/discussions")}
              className="text-sky-600 text-sm font-medium flex items-center hover:text-sky-800 transition-colors"
            >
              View all
              <ArrowRight className="ml-1 w-4 h-4" />
            </button>
          </div>

          {isDiscussionsLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : discussionsError ? (
            <p className="text-gray-500 text-center py-8">
              Unable to load recent discussions
            </p>
          ) : (
            <div className="space-y-4">
              {discussions.length > 0 ? (
                discussions.slice(0, 3).map((discussion) => (
                  <div
                    key={discussion._id}
                    className="border-b border-gray-100 last:border-0 pb-4 last:pb-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2"
                    onClick={() =>
                      router.push(`/discussions/${discussion._id}`)
                    }
                  >
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {discussion.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {discussion.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {discussion.tags &&
                        discussion.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-sky-50 text-sky-700 rounded-full text-xs"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      {discussion.tags && discussion.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{discussion.tags.length - 2} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span>{discussion.creator?.username || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          <span>
                            {discussion.messages?.length || 0} replies
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>
                            {formatTimeAgo(
                              discussion.lastActivity || discussion.createdAt
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No recent discussions available
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
