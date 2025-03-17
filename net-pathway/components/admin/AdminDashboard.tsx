// Modified version of components/admin/AdminDashboard.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import {
  UserCog,
  FileText,
  Briefcase,
  BarChart3,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  User,
  ArrowLeft,
} from "lucide-react";
import AdminStatistics from "./AdminStatistics";
import AdminListUsers from "./AdminListUsers";
import AdminBlogList from "./BlogList";
import AdminMentorList from "./MentorList";
import axios from "axios";

// User selection modal for mentor creation
const UserSelectionModal = ({ onSelect, onCancel }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    // Filter users when search query changes
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch users who are not already mentors (role=user)
      const response = await axios.get(
        `${API_URL}/admin/users?page=${currentPage}&role=user`,
        { withCredentials: true }
      );

      if (response.data.users) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Select User to Make a Mentor
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search box */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* User list */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id || user.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedUser &&
                        (selectedUser._id === user._id ||
                          selectedUser.id === user.id)
                          ? "bg-sky-50"
                          : ""
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="radio"
                          name="selectedUser"
                          checked={
                            selectedUser
                              ? selectedUser._id === user._id ||
                                selectedUser.id === user.id
                              : false
                          }
                          onChange={() => setSelectedUser(user)}
                          className="h-4 w-4 text-sky-600"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                            {user.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt={user.username}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <User className="h-5 w-5" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isEmailVerified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 mb-6">
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-lg ${
                      currentPage === page
                        ? "bg-sky-600 text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSelect(selectedUser)}
            disabled={!selectedUser}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
          >
            Continue with Selected User
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState("stats");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserSelectionModal, setShowUserSelectionModal] = useState(false);

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

  // Handle user selection for mentor creation
  const handleUserSelection = (selectedUser) => {
    if (selectedUser) {
      // Close the modal
      setShowUserSelectionModal(false);

      // Navigate to the mentor creation page with the selected user ID
      router.push(
        `/admin/mentor/new?userId=${selectedUser._id || selectedUser.id}`
      );
    } else {
      toast.error("Please select a user first");
    }
  };

  // Render create button based on active tab
  const renderCreateButton = () => {
    if (activeTab === "blogs") {
      return (
        <button
          onClick={() => router.push("/admin/blog/new")}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Create New Blog Post
        </button>
      );
    } else if (activeTab === "mentors") {
      return (
        <button
          onClick={() => setShowUserSelectionModal(true)}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Create New Mentor
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

      {/* User Selection Modal */}
      {showUserSelectionModal && (
        <UserSelectionModal
          onSelect={handleUserSelection}
          onCancel={() => setShowUserSelectionModal(false)}
        />
      )}
    </div>
  );
}
