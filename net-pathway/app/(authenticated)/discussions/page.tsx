"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useDiscussionStore } from "@/store/useDiscussionStore";

import {
  MessageSquare,
  Search,
  Plus,
  Filter,
  Tag as TagIcon,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import CreateDiscussionModal from "@/components/discussions/CreateDiscussionModal";
import DiscussionCard from "@/components/discussions/DiscussionCard";

export default function DiscussionsPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const {
    discussions,
    fetchDiscussions,
    fetchUserDiscussions,
    fetchPopularTags,
    popularTags,
    pagination,
    setCurrentPage,
    filters,
    setFilters,
    isLoading,
    error,
  } = useDiscussionStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Check authentication
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuth, isAuthenticated, router]);

  // Fetch discussions and tags when component mounts
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDiscussions();
      fetchPopularTags();
    }
  }, [
    isAuthenticated,
    user,
    fetchDiscussions,
    fetchPopularTags,
    filters,
    pagination.currentPage,
  ]);

  // Handle discussion filter by tag
  const handleTagFilter = (tag: string) => {
    if (filters.tag === tag) {
      // If clicking on already selected tag, clear the filter
      setFilters({ tag: "" });
    } else {
      setFilters({ tag });
    }
  };

  // Handle search input
  const handleSearch = (searchTerm: string) => {
    setFilters({ search: searchTerm });
  };

  // Handle sort change
  const handleSortChange = (
    sortOption: "latest" | "oldest" | "activity" | "popular"
  ) => {
    setFilters({ sort: sortOption });
  };

  // Navigation to discussion detail
  const navigateToDiscussion = (discussionId: string) => {
    router.push(`/discussions/${discussionId}`);
  };

  // Toggle between all discussions and user discussions
  const toggleUserDiscussions = (showUserOnly: boolean) => {
    if (showUserOnly) {
      fetchUserDiscussions();
    } else {
      fetchDiscussions();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading discussions...</p>
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-sky-800 mb-2">
                  Discussions
                </h1>
                <p className="text-slate-600">
                  Join conversations, share knowledge, and connect with peers
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Discussion</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-sky-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/50 backdrop-blur-sm hover:bg-white transition-all"
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  showFilters || filters.tag
                    ? "bg-sky-100 text-sky-700"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {filters.tag && (
                  <span className="bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full text-xs">
                    1
                  </span>
                )}
              </button>

              <select
                value={filters.sort}
                onChange={(e) => handleSortChange(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="latest">Latest</option>
                <option value="activity">Most Active</option>
                <option value="popular">Popular</option>
                <option value="oldest">Oldest</option>
              </select>

              <button
                onClick={() => toggleUserDiscussions(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !filters.tag && filters.sort === "latest" && !filters.search
                    ? "bg-sky-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                All
              </button>

              <button
                onClick={() => toggleUserDiscussions(true)}
                className="px-4 py-2 rounded-lg transition-colors bg-white text-gray-600 hover:bg-gray-50"
              >
                My Discussions
              </button>
            </div>
          </div>

          {/* Tag Filters */}
          {showFilters && (
            <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-sky-600" />
                Filter by tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag.tag}
                    onClick={() => handleTagFilter(tag.tag)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors ${
                      filters.tag === tag.tag
                        ? "bg-sky-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag.tag}
                    <span className="text-xs opacity-75">({tag.count})</span>
                  </button>
                ))}

                {filters.tag && (
                  <button
                    onClick={() => setFilters({ tag: "" })}
                    className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-1"
                  >
                    Clear Filter <span className="text-lg">×</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="mb-6 bg-red-50 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">
                  Error loading discussions
                </h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={() => fetchDiscussions()}
                  className="mt-2 text-sm text-red-800 hover:text-red-900 font-medium flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Try again
                </button>
              </div>
            </div>
          )}

          {/* Discussions Grid */}
          {isLoading && discussions.length === 0 ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : discussions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No discussions found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {filters.search || filters.tag
                  ? "Try adjusting your search or filters to find more discussions"
                  : "Start a new discussion to connect with others"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors"
              >
                Start New Discussion
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discussions.map((discussion) => (
                  <DiscussionCard
                    key={discussion._id}
                    discussion={discussion}
                    onClick={() => navigateToDiscussion(discussion._id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, pagination.currentPage - 1))
                      }
                      disabled={pagination.currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNumber = pagination.currentPage;

                        if (pagination.totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (
                          pagination.currentPage >=
                          pagination.totalPages - 2
                        ) {
                          pageNumber = pagination.totalPages - 4 + i;
                        } else {
                          pageNumber = pagination.currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`px-4 py-2 rounded-lg border ${
                              pagination.currentPage === pageNumber
                                ? "bg-sky-600 text-white border-sky-600"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage(
                          Math.min(
                            pagination.totalPages,
                            pagination.currentPage + 1
                          )
                        )
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Create Discussion Modal */}
      {showCreateModal && (
        <CreateDiscussionModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
