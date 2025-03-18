"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Search, Check, User } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

interface UserSelectionComponentProps {
  onUserSelected: (user: any) => void;
  onCancel: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const UserSelectionComponent: React.FC<UserSelectionComponentProps> = ({
  onUserSelected,
  onCancel,
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch regular users who are not already mentors
      const response = await axios.get(
        `${API_URL}/admin/users?page=${page}&search=${searchQuery}&role=user`,
        {
          withCredentials: true,
        }
      );

      if (response.data.users) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }
    onUserSelected(selectedUser);
  };

  // Filter users to only show those who aren't already mentors
  const filteredUsers = users.filter((user) => user.role !== "mentor");

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Select User</h2>
        <p className="text-gray-600">
          Choose a user to create a mentor profile for
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* User List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto mb-6 pr-2">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedUser?._id === user._id
                  ? "border-sky-500 bg-sky-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 relative overflow-hidden">
                {user.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt={user.username}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <p className="font-medium text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              {selectedUser?._id === user._id && (
                <Check className="w-5 h-5 text-sky-500" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg mb-6">
          <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No eligible users found</p>
          <p className="text-gray-400 text-sm">
            Try a different search or ensure there are regular users available
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mb-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-md border disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-4 py-2 rounded-md ${
                  pageNum === page
                    ? "bg-sky-600 text-white"
                    : "border hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            )
          )}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-md border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedUser}
          className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Continue with Selected User</span>
        </button>
      </div>
    </div>
  );
};

export default UserSelectionComponent;
