"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuthStatus, isLoading } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  // Handle auth check and redirect in useEffect, not during render
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLocalLoading(true);
        const isAuthed = await checkAuthStatus();

        // Do the redirect inside useEffect, not during render
        if (!isAuthed) {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/auth/login");
      } finally {
        setLocalLoading(false);
      }
    };

    initAuth();
  }, [checkAuthStatus, router]);

  // Handle redirect for unauthenticated users in useEffect, not in render
  useEffect(() => {
    if (!localLoading && !isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, localLoading, isLoading, router]);

  // Show loading state if we're still checking auth
  if (localLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't try to redirect during render - just return null
  if (!isAuthenticated) {
    return null; // The useEffect will handle the redirect
  }

  // We should have user data here
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
          {/* Welcome Section with Animated Stats */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-700">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-sky-800">
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                    {user?.username || "User"}!
                  </span>
                </h1>
                <p className="mt-2 text-slate-600">
                  Your future exploration journey starts here!
                </p>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sky-700 pb-2">
                    <div className="w-12 h-12 flex items-center justify-center p-1.5 border rounded-full bg-sky-100 font-semibold text-md">
                      3
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Paths</div>
                </div>
              </div>
            </div>
          </div>

          {/* Career Assessment Banner */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-48">
              {/* Placeholder for image - can be updated later */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-sky-500"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-center">
                <h2 className="text-md md:text-xl font-bold text-white mb-3">
                  Discover Your Ideal Career Path
                </h2>
                <p className="text-white/90 mb-4 text-sm">
                  Take our AI-powered career assessment to uncover careers that
                  match your interests, strengths, and personality. Get
                  personalized university recommendations.
                </p>
                <button className="bg-white text-purple-700 px-4 py-3 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors w-max flex items-center gap-2">
                  Take an Assessment
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {/* Simple content without path cards */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-sky-800 mb-4 flex items-center">
                <span className="inline-block w-1 h-6 bg-purple-700 mr-3 rounded"></span>
                Welcome to Net Pathway
              </h2>
              <p className="text-gray-600">
                You've successfully logged in with Google Authentication. This
                simplified dashboard removes the path cards component to help
                diagnose the reload issue.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">Next Steps:</h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Take an assessment to discover your career path
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Connect with mentors in your field of interest
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Explore recommended university programs
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
