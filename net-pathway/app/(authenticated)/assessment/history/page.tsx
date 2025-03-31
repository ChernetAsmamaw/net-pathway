"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAssessmentResultsStore } from "@/store/useAssessmentResultsStore";
import {
  ArrowLeft,
  Filter,
  Search,
  Calendar,
  Sparkles,
  CheckCircle,
  ChevronRight,
  Eye,
  Star,
  User,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AssessmentHistoryPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const { results, isLoading, fetchAssessmentResults } =
    useAssessmentResultsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [sortOption, setSortOption] = useState("latest");

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

  // Fetch assessment results
  useEffect(() => {
    if (isAuthenticated) {
      fetchAssessmentResults();
    }
  }, [isAuthenticated, fetchAssessmentResults]);

  // Filter and sort results based on search query and sort option
  useEffect(() => {
    if (!results) return;

    let filtered = [...results];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (result) =>
          result.title.toLowerCase().includes(query) ||
          result.description.toLowerCase().includes(query) ||
          result.result.topPaths.some((path) =>
            path.toLowerCase().includes(query)
          )
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "latest":
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "highMatch":
        filtered.sort((a, b) => b.matchPercentage - a.matchPercentage);
        break;
      case "lowMatch":
        filtered.sort((a, b) => a.matchPercentage - b.matchPercentage);
        break;
    }

    setFilteredResults(filtered);
  }, [results, searchQuery, sortOption]);

  const handleViewDetails = (id) => {
    router.push(`/assessment/results/${id}`);
  };

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
      <main className="p-6 md:p-8">
        {/* Header with Assessment Overview */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-sky-800 mb-2">
                Assessment History
              </h1>
              <p className="text-slate-600">
                View and compare your previous assessment results
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search assessments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="py-3 border-0 focus:ring-0 bg-transparent text-gray-600"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highMatch">Highest Match</option>
                  <option value="lowMatch">Lowest Match</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Results List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="space-y-6">
            {filteredResults.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden cursor-pointer"
                onClick={() => handleViewDetails(assessment.id)}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                      <div className="p-2 rounded-full bg-sky-100">
                        <Sparkles className="w-5 h-5 text-sky-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {assessment.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 flex items-center gap-1.5">
                        <Star className="w-4 h-4" />
                        <span className="font-medium">
                          {assessment.matchPercentage}%
                        </span>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        <span>{assessment.status}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{assessment.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Top Career Paths
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {assessment.result.topPaths.map((path, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                          >
                            {path}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Strength Areas
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {assessment.result.strengthAreas.map((strength, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Recommendations
                      </h3>
                      <ul className="text-xs text-gray-700 space-y-1 pl-5 list-disc">
                        {assessment.result.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{assessment.date}</span>
                    </div>
                    <button className="text-sky-600 flex items-center gap-1 hover:text-sky-800 transition-colors">
                      View Full Results
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No assessment results found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "No results match your search criteria. Try different keywords or clear your search."
                : "You haven't completed any assessments yet. Start one to view your results here."}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <Link
                href="/assessment"
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors inline-block"
              >
                Start Assessment
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
