"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div>
      {/* Welcome Section */}
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
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-sky-500"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
            <h2 className="text-md md:text-xl font-bold text-white mb-3">
              Discover Your Ideal Career Path
            </h2>
            <p className="text-white/90 mb-4 text-sm">
              Take our AI-powered career assessment to uncover careers that
              match your interests, strengths, and personality. Get personalized
              university recommendations.
            </p>
            <button
              onClick={() => router.push("/assessment")}
              className="bg-white text-purple-700 px-4 py-3 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors w-max flex items-center gap-2"
            >
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

      {/* Quick Actions Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Explore Paths",
            description:
              "Discover recommended career paths based on your profile",
            action: () => router.push("/paths"),
            color: "from-sky-500 to-sky-600",
          },
          {
            title: "Find Mentors",
            description: "Connect with industry professionals for guidance",
            action: () => router.push("/mentorship"),
            color: "from-purple-500 to-purple-600",
          },
          {
            title: "Join Discussions",
            description: "Participate in community conversations",
            action: () => router.push("/discussions"),
            color: "from-sky-600 to-purple-500",
          },
        ].map((item, index) => (
          <div
            key={index}
            onClick={item.action}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
          >
            <div
              className={`w-12 h-12 mb-4 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
