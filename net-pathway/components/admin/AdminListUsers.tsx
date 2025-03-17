"use client";

import React, { useState, useEffect } from "react";
import {
  UserCog,
  Edit,
  Trash2,
  // Check,
  // X,
  // Shield,
  Briefcase,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import VerificationBadge from "@/components/varification/VerificationBadge";
import { useRouter } from "next/navigation";

interface User {
  _id: string; // Changed from id to _id to match the actual data structure
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  profilePicture: string | null;
  createdAt: string;
}

interface AdminUsersListProps {
  searchQuery: string;
}

const AdminUsersList: React.FC<AdminUsersListProps> = ({ searchQuery }) => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/admin/users?page=${currentPage}&search=${searchQuery}`,
        {
          withCredentials: true,
        }
      );

      // Add null check and default values for pagination
      setUsers(response.data.users || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
      // Set default values on error
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await axios.put(
        `${API_URL}/admin/user-role`,
        { userId, role: newRole },
        { withCredentials: true }
      );

      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success("User role updated successfully");
      setShowRoleModal(false);
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleCreateMentorProfile = (userId: string) => {
    router.push(`/admin/mentor/new?userId=${userId}`);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!userId) {
      toast.error("Invalid user ID");
      return;
    }

    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        withCredentials: true,
      });

      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "mentor":
        return "bg-sky-100 text-sky-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <UserCog className="w-5 h-5 text-sky-700" />
          User Management
        </h2>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  User
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Role
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Verified
                </th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 relative overflow-hidden">
                        {user.profilePicture ? (
                          <Image
                            src={user.profilePicture}
                            alt={user.username}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{user.email}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <VerificationBadge
                      isVerified={user.isEmailVerified}
                      size="sm"
                    />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                        className="p-1 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded"
                        title="Change Role"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Add Make Mentor button if user is not already a mentor */}
                      {user.role !== "mentor" && (
                        <button
                          onClick={() => handleCreateMentorProfile(user._id)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          title="Make Mentor"
                        >
                          <Briefcase className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-1">
            <button
              key="prev"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={`page-${page}`}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === page
                    ? "bg-sky-600 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              key="next"
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

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Change User Role</h3>

            <div className="space-y-4">
              <p>
                Change role for{" "}
                <span className="font-semibold">{selectedUser.username}</span>:
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateRole(selectedUser._id, "user")}
                  className={`flex-1 py-2 px-3 rounded-lg border ${
                    selectedUser.role === "user"
                      ? "bg-gray-100 border-gray-300"
                      : "hover:bg-gray-50"
                  }`}
                >
                  User
                </button>
                <button
                  onClick={() => handleUpdateRole(selectedUser._id, "mentor")}
                  className={`flex-1 py-2 px-3 rounded-lg border ${
                    selectedUser.role === "mentor"
                      ? "bg-sky-100 border-sky-300"
                      : "hover:bg-sky-50"
                  }`}
                >
                  Mentor
                </button>
                <button
                  onClick={() => handleUpdateRole(selectedUser._id, "admin")}
                  className={`flex-1 py-2 px-3 rounded-lg border ${
                    selectedUser.role === "admin"
                      ? "bg-purple-100 border-purple-300"
                      : "hover:bg-purple-50"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Delete User</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedUser.username}</span>?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(selectedUser._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersList;
