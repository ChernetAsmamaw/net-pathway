"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import VerificationNotice from "@/components/notifications/VerificationNotice";
import { useState } from "react";
import { ChevronRight, Book, Users, MessageCircle } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [hideVerificationNotice, setHideVerificationNotice] = useState(false);

  // Mock data for demonstration
  const recentPaths = [
    { title: "Full Stack Development", progress: 60 },
    { title: "Cloud Architecture", progress: 30 },
  ];

  const recentPosts = [
    { title: "How I landed my first tech job", author: "Jane Doe", views: 24 },
    { title: "Tips for learning React", author: "John Smith", views: 18 },
  ];

  const popularDiscussions = [
    { title: "Career Switch Success Stories", replies: 45, active: true },
    { title: "Best Resources for Beginners", replies: 32, active: false },
  ];

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
          <div className="flex gap-6 mt-6 md:mt-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-sky-700">
                <div className="w-16 h-16 flex items-center justify-center border-2 rounded-full bg-sky-50 font-semibold text-xl">
                  {recentPaths.length}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-500 mt-2">
                Active Paths
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Section */}
        <div className="lg:col-span-2">
          {/* Explore Paths Section - Single Card */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Recent Path
          </h2>

          <div
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer hover:translate-y-[-5px] border border-gray-100"
            onClick={() => router.push("/paths")}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-3 rounded-lg mr-4">
                    <Book size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Engineering
                    </h3>
                    <p className="text-sm text-gray-500">
                      Software Engineering
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-gray-600">
                  Explore various engineering disciplines and opportunities with
                  personalized match percentage, recommended universities and
                  program suggestions.
                </p>

                <div className="mt-4 flex items-center">
                  <div className="mr-4">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      92% Match
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    2 universities • 4 programs
                  </div>
                </div>
              </div>

              <div className="ml-4 flex-shrink-0">
                <ChevronRight className="h-6 w-6 text-gray-400" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button className="text-sky-600 font-medium text-sm flex items-center hover:text-sky-800 transition-colors">
                Explore all paths
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Recent Posts */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Recent Posts
            </h2>
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">By {post.author}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {post.views} Views
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Discussions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Popular Discussions
            </h2>
            <div className="space-y-4">
              {popularDiscussions.map((discussion, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-800">
                    {discussion.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">
                      {discussion.replies} replies
                    </span>
                    {discussion.active && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
