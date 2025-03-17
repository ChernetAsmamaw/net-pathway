import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import AdminListUsers from "./AdminListUsers";
import AdminBlogList from "./BlogList";
import AdminMentorList from "./MentorList";
import AdminStatistics from "./AdminStatistics";
import { UserCog, FileText, Briefcase, BarChart3, Plus } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState("stats");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "stats", name: "Dashboard", icon: BarChart3 },
    { id: "users", name: "Users", icon: UserCog },
    { id: "blogs", name: "Blog Posts", icon: FileText },
    { id: "mentors", name: "Mentors", icon: Briefcase },
  ];

  // Check if user is authenticated and is an admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      if (user?.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        router.push("/dashboard");
        return;
      }
    };

    checkAdminAccess();
  }, [checkAuth, isAuthenticated, router, user]);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Render create button based on active tab
  const renderCreateButton = () => {
    if (activeTab === "blogs") {
      return (
        <button
          onClick={() => router.push("/admin/blog/new")}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Create Blog Post
        </button>
      );
    } else if (activeTab === "mentors") {
      return (
        <button
          onClick={() => router.push("/admin/mentor/new")}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Create Mentor
        </button>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-6 px-6">
        {/* Header with tab navigation and create button */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white rounded-lg shadow-sm p-1 flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery("");
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
          {/* Add the create button here */}
          {renderCreateButton()}
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === "stats" && <AdminStatistics />}
          {activeTab === "users" && (
            <AdminListUsers searchQuery={searchQuery} />
          )}
          {activeTab === "blogs" && <AdminBlogList searchQuery={searchQuery} />}
          {activeTab === "mentors" && (
            <AdminMentorList searchQuery={searchQuery} />
          )}
        </div>
      </main>
    </div>
  );
}
