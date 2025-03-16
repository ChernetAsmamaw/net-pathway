import React, { useState } from "react";
import { UserCog, FileText, Briefcase, BarChart3 } from "lucide-react";
import AdminStatistics from "./AdminStatistics";
import AdminListUsers from "./AdminListUsers";
import AdminBlogList from "./AdminBlogList";
import AdminMentorList from "./MentorList";
import { useRouter } from "next/navigation";

export default function AdminTabs() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("stats");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "stats", name: "Dashboard", icon: BarChart3 },
    { id: "users", name: "Users", icon: UserCog },
    { id: "blogs", name: "Blog Posts", icon: FileText },
    { id: "mentors", name: "Mentors", icon: Briefcase },
  ];

  return (
    <div>
      {/* Tab navigation */}
      <div className="bg-white rounded-lg shadow-sm p-1 mb-6 flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery(""); // Reset search when changing tabs
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-sky-100 text-sky-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Search input for list views */}
      {activeTab !== "stats" && (
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder={`Search ${
              activeTab === "users"
                ? "users..."
                : activeTab === "blogs"
                ? "blog posts..."
                : "mentors..."
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <span className="absolute left-3 top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
      )}

      {/* Tab content */}
      <div>
        {activeTab === "stats" && <AdminStatistics />}
        {activeTab === "users" && <AdminListUsers searchQuery={searchQuery} />}
        {activeTab === "blogs" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-700" />
                Blog Post Management
              </h2>
              <button
                onClick={() => router.push("/admin/blog/new")}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Blog Post
              </button>
            </div>
            <AdminBlogList searchQuery={searchQuery} />
          </div>
        )}
        {activeTab === "mentors" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-sky-700" />
                Mentor Management
              </h2>
              <button
                onClick={() => router.push("/admin/mentor/new")}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Mentor
              </button>
            </div>
            <AdminMentorList searchQuery={searchQuery} />
          </div>
        )}
      </div>
    </div>
  );
}
