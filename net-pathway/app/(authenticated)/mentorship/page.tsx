"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { toast } from "react-hot-toast";

import { Search, Filter } from "lucide-react";
import MentorCard from "@/components/mentorship/MentorCard"; // Use our simplified component
import MentorDetails from "@/components/mentorship/MentorDetails"; // Use our simplified component

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Mentor {
  _id: string;
  title: string;
  company: string;
  location: string;
  bio: string;
  expertise: string[];
  experience: string;
  education: string;
  languages: string[];
  achievements: string[];
  availability: string;
  rating: number;
  isActive: boolean;
  email?: string;
  phone?: string;
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
}

export default function MentorshipPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  // Filter states
  const [filterExpertise, setFilterExpertise] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");

  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Authentication check
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuth, isAuthenticated, router]);

  // Fetch mentors
  useEffect(() => {
    const fetchMentors = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      try {
        // Build query with filters
        let query = `${API_URL}/mentors?page=${currentPage}`;

        if (filterExpertise !== "all") {
          query += `&expertise=${encodeURIComponent(filterExpertise)}`;
        }

        if (filterAvailability !== "all") {
          query += `&availability=${filterAvailability}`;
        }

        const response = await axios.get(query, {
          withCredentials: true,
        });

        if (response.data.mentors) {
          setMentors(response.data.mentors);
          setTotalPages(response.data.pagination.pages || 1);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
        toast.error("Failed to load mentors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, [isAuthenticated, currentPage, filterExpertise, filterAvailability]);

  // Extract unique expertise areas for filter dropdown
  const expertiseAreas = React.useMemo(() => {
    const areas = new Set<string>();
    areas.add("all");

    mentors.forEach((mentor) => {
      if (mentor.expertise && Array.isArray(mentor.expertise)) {
        mentor.expertise.forEach((area) => areas.add(area));
      }
    });

    return Array.from(areas);
  }, [mentors]);

  // Filter mentors based on search query
  const filteredMentors = React.useMemo(() => {
    if (!searchQuery.trim()) return mentors;

    return mentors.filter((mentor) => {
      const searchLower = searchQuery.toLowerCase();

      return (
        mentor.title.toLowerCase().includes(searchLower) ||
        mentor.company.toLowerCase().includes(searchLower) ||
        mentor.location.toLowerCase().includes(searchLower) ||
        mentor.user?.username.toLowerCase().includes(searchLower) ||
        (mentor.expertise &&
          mentor.expertise.some((skill) =>
            skill.toLowerCase().includes(searchLower)
          ))
      );
    });
  }, [mentors, searchQuery]);

  // Reset to first page when changing filters
  useEffect(() => {
    setCurrentPage(1);
  }, [filterExpertise, filterAvailability]);

  // Loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <div className="p-6 md:p-8">
          {/* Header Section */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-700">
            <h1 className="text-3xl font-bold text-sky-800 mb-2">
              Find a Mentor
            </h1>
            <p className="text-slate-600">
              Connect with industry experts who can guide your career journey
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mentors by name, expertise, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={filterExpertise}
                    onChange={(e) => setFilterExpertise(e.target.value)}
                    className="appearance-none pl-10 pr-8 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="all">All Expertise</option>
                    {expertiseAreas
                      .filter((area) => area !== "all")
                      .map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                  </select>
                  <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>

                <div className="relative">
                  <select
                    value={filterAvailability}
                    onChange={(e) => setFilterAvailability(e.target.value)}
                    className="appearance-none pl-10 pr-8 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="all">All Availability</option>
                    <option value="available">Available</option>
                    <option value="limited">Limited</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                  <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-sky-700 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredMentors.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                  <MentorCard
                    key={mentor._id}
                    mentor={mentor}
                    onClick={() => setSelectedMentor(mentor)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      // Show pages around current page for better UX
                      let pageNum = currentPage;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 border rounded-lg ${
                            currentPage === pageNum
                              ? "bg-sky-600 text-white"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

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
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <div className="mb-4 text-5xl">👨‍🏫</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No mentors found
              </h3>
              <p className="text-gray-600 mb-8">
                {searchQuery ||
                filterExpertise !== "all" ||
                filterAvailability !== "all"
                  ? "Try adjusting your search criteria"
                  : "Check back later for new mentors"}
              </p>
              {(searchQuery ||
                filterExpertise !== "all" ||
                filterAvailability !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterExpertise("all");
                    setFilterAvailability("all");
                  }}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mentor Details Modal */}
      {selectedMentor && (
        <MentorDetails
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
        />
      )}
    </div>
  );
}
