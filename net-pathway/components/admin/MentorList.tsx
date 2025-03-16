"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Edit,
  Trash2,
  Plus,
  Eye,
  Users,
  MapPin,
  Star,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Mentor {
  _id: string;
  title: string;
  company: string;
  location: string;
  expertise: string[];
  availability: string;
  isActive: boolean;
  user: {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    isEmailVerified: boolean;
  };
  rating: number;
}

interface AdminMentorsListProps {
  searchQuery: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const AdminMentorsList: React.FC<AdminMentorsListProps> = ({ searchQuery }) => {
  const router = useRouter();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/mentors?page=${currentPage}&includeInactive=true`,
        {
          withCredentials: true,
        }
      );

      if (response.data.mentors) {
        setMentors(response.data.mentors);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch mentors:", error);
      toast.error("Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  // Filter mentors based on search query
  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  useEffect(() => {
    fetchMentors();
  }, [currentPage]);

  const handleDeleteMentor = async (mentorId: string) => {
    try {
      await axios.delete(`${API_URL}/mentors/${mentorId}`, {
        withCredentials: true,
      });

      setMentors(mentors.filter((mentor) => mentor._id !== mentorId));
      toast.success("Mentor profile deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete mentor:", error);
      toast.error("Failed to delete mentor");
    }
  };

  const toggleMentorStatus = async (mentorId: string) => {
    try {
      const response = await axios.patch(
        `${API_URL}/mentors/${mentorId}/toggle-status`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update mentor status in state
      setMentors(
        mentors.map((mentor) =>
          mentor._id === mentorId
            ? { ...mentor, isActive: !mentor.isActive }
            : mentor
        )
      );

      toast.success(response.data.message || "Mentor status updated");
    } catch (error) {
      console.error("Failed to update mentor status:", error);
      toast.error("Failed to update mentor status");
    }
  };

  const getAvailabilityBadgeColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "limited":
        return "bg-amber-100 text-amber-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && mentors.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {filteredMentors.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? "No mentors found matching your search"
              : "No mentors found"}
          </p>
          <Link
            href="/admin/mentor/new"
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm inline-flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Create First Mentor
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Mentor
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Expertise
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Location
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Availability
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  Rating
                </th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMentors.map((mentor) => (
                <tr key={mentor._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 relative overflow-hidden">
                        {mentor.user.profilePicture ? (
                          <Image
                            src={mentor.user.profilePicture}
                            alt={mentor.user.username}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            {mentor.user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {mentor.user.username}
                          </p>
                          {mentor.user.isEmailVerified ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {mentor.title} at {mentor.company}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.slice(0, 2).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full text-xs bg-sky-50 text-sky-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {mentor.expertise.length > 2 && (
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          +{mentor.expertise.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{mentor.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mentor.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {mentor.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityBadgeColor(
                        mentor.availability
                      )}`}
                    >
                      {mentor.availability}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{mentor.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/mentor/${mentor._id}`}
                        className="p-1 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded"
                        title="Edit Mentor"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => toggleMentorStatus(mentor._id)}
                        className={`p-1 rounded ${
                          mentor.isActive
                            ? "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                            : "text-green-600 hover:text-green-800 hover:bg-green-50"
                        }`}
                        title={mentor.isActive ? "Deactivate" : "Activate"}
                      >
                        {mentor.isActive ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMentor(mentor);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Delete Mentor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/mentorship/${mentor._id}`}
                        className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                        title="View Profile"
                        target="_blank"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            ))}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMentor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Delete Mentor Profile</h3>
            <p>
              Are you sure you want to delete the mentor profile for{" "}
              <span className="font-semibold">
                {selectedMentor.user.username}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMentor(selectedMentor._id)}
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

export default AdminMentorsList;
