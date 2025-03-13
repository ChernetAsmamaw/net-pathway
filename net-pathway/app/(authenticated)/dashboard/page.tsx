"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { useState } from "react";
import Image from "next/image";
// Add missing imports
import { ArrowRight } from "lucide-react";
// Update the import
import DashboardPathCard from "@/components/paths/DashboardPathCard";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
          <p className="text-gray-600">Loading your dashboard...</p>
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
          {/* Welcome Section with Animated Stats */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-700">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-sky-800">
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                    {user.username}!
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
              <Image
                src="/ph-2.jpg"
                alt="Career assessment"
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute p-10 inset-0 bg-gradient-to-r from-purple-500/90 to-sky-500/90"></div>
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

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
            {/* Main Content */}
            <div className="md:col-span-12 space-y-6">
              <div className="grid grid-cols-1 gap-6 mt-8">
                {/* Main Content */}
                <div className="space-y-4">
                  {/* Career Paths Section */}
                  <div className="mb-12">
                    <h2 className="text-xl font-semibold text-sky-800 mb-4 flex items-center">
                      <span className="inline-block w-1 h-6 bg-purple-700 mr-3 rounded"></span>
                      Paths You Explored In The Past
                    </h2>

                    {recentPaths && recentPaths.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recentPaths.map((path) => (
                          <DashboardPathCard key={path.id} path={path} />
                        ))}
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
                          <span className="inline-block w-1 h-6 bg-sky-700 mr-3 rounded"></span>
                          You don't have any previous paths. Take the
                          assessment.
                        </h2>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Add recentPaths data
const recentPaths = [
  {
    id: "1",
    title: "Software Engineering",
    description: "Comprehensive path to become a full-stack software engineer",
    image: "/ph-2.jpg",
    matchPercentage: 95,
    lastViewed: "2 days ago",
  },
  {
    id: "2",
    title: "Data Science",
    description: "Master data analysis, machine learning, and AI",
    image: "/ph-2.jpg",
    matchPercentage: 88,
    lastViewed: "1 week ago",
  },
  {
    id: "3",
    title: "Cloud Architecture",
    description: "Learn to design and manage cloud infrastructure",
    image: "/ph-2.jpg",
    matchPercentage: 82,
    lastViewed: "2 weeks ago",
  },
];
