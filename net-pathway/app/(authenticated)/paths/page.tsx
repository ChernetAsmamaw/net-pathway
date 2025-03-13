"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import Image from "next/image";
import { ArrowRight, Building2, GraduationCap, Search } from "lucide-react";
import Link from "next/link";

// Shared data to be used across both pages
export const pathsData = [
  {
    id: "engineering",
    title: "Engineering",
    description: "Explore various engineering disciplines and opportunities",
    image: "/ph-2.jpg",
    matchPercentage: 92,
    requirements: [
      "High school diploma or equivalent",
      "Minimum GPA of 3.0 in science subjects",
      "Entrance examination qualification",
      "English language proficiency",
    ],
    universities: [
      {
        id: 1,
        name: "Adama Science and Technology Institute",
        location: "Adama, Ethiopia",
        logo: "/placeholder-logo.png",
        description:
          "A leading technical institution focused on science and engineering education.",
        admissionDeadline: "May 15, 2025",
        programs: [
          {
            id: 1,
            name: "Bachelor of Science in Software Engineering",
            duration: "4 years",
            studyMode: "Full-time",
            tuitionFee: "45,000 ETB per year",
            description:
              "A comprehensive program covering software development principles, programming languages, database management, and software project management.",
            highlights: [
              "Practical programming skills",
              "Industry-focused curriculum",
              "Internship opportunities",
            ],
          },
          {
            id: 2,
            name: "Bachelor of Science in Computer Science",
            duration: "4 years",
            studyMode: "Full-time",
            tuitionFee: "42,000 ETB per year",
            description:
              "Focus on theoretical and practical aspects of computing including algorithms, data structures, artificial intelligence, and computer architecture.",
            highlights: [
              "Research opportunities",
              "Advanced mathematics training",
              "Computing laboratory access",
            ],
          },
        ],
      },
      {
        id: 2,
        name: "University of Gonder",
        location: "Gonder, Ethiopia",
        logo: "/placeholder-logo.png",
        description:
          "An established university with strong engineering programs.",
        admissionDeadline: "June 5, 2025",
        programs: [
          {
            id: 3,
            name: "Bachelor of Science in Computer Science",
            duration: "4 years",
            studyMode: "Full-time",
            tuitionFee: "40,000 ETB per year",
            description:
              "A program focused on computing fundamentals with specialization tracks in AI and data science.",
            highlights: [
              "Modern computer labs",
              "Industry connections",
              "Research opportunities",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "medicine",
    title: "Medicine",
    description: "Discover medical and healthcare career paths",
    image: "/ph-2.jpg",
    matchPercentage: 85,
    requirements: [
      "High school diploma with excellent grades in biology and chemistry",
      "Minimum GPA of 3.5 in science subjects",
      "Entrance examination qualification",
      "Interview process",
    ],
    universities: [
      {
        id: 3,
        name: "Addis Ababa University",
        location: "Addis Ababa, Ethiopia",
        logo: "/placeholder-logo.png",
        description:
          "Ethiopia's premier institution for medical education and research.",
        admissionDeadline: "April 30, 2025",
        programs: [
          {
            id: 4,
            name: "Doctor of Medicine",
            duration: "6 years",
            studyMode: "Full-time",
            tuitionFee: "60,000 ETB per year",
            description:
              "Comprehensive medical training including basic sciences, clinical rotations, and specialization options.",
            highlights: [
              "Hospital-based training",
              "Research opportunities",
              "International partnerships",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "business",
    title: "Business Administration",
    description: "Explore business management and entrepreneurship paths",
    image: "/ph-2.jpg",
    matchPercentage: 78,
    requirements: [
      "High school diploma or equivalent",
      "Minimum GPA of 2.8",
      "Basic mathematics proficiency",
      "English language proficiency",
    ],
    universities: [
      {
        id: 4,
        name: "Addis Ababa University",
        location: "Addis Ababa, Ethiopia",
        logo: "/placeholder-logo.png",
        description:
          "Ethiopia's oldest and most prestigious higher education institution.",
        admissionDeadline: "June 1, 2025",
        programs: [
          {
            id: 5,
            name: "Bachelor of Business Administration",
            duration: "4 years",
            studyMode: "Full-time",
            tuitionFee: "38,000 ETB per year",
            description:
              "Core business fundamentals with specializations in marketing, finance, or management.",
            highlights: [
              "Business incubation center",
              "Industry partnerships",
              "Internship placements",
            ],
          },
        ],
      },
      {
        id: 5,
        name: "Bahir Dar University",
        location: "Bahir Dar, Ethiopia",
        logo: "/placeholder-logo.png",
        description:
          "A growing university with strong emphasis on business education.",
        admissionDeadline: "May 20, 2025",
        programs: [
          {
            id: 6,
            name: "Bachelor of Commerce",
            duration: "3 years",
            studyMode: "Full-time",
            tuitionFee: "35,000 ETB per year",
            description:
              "Focused on commercial practices, entrepreneurship, and business development.",
            highlights: [
              "Practical business projects",
              "Entrepreneurship competitions",
              "Local business connections",
            ],
          },
        ],
      },
    ],
  },
];

export default function Paths() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPaths, setFilteredPaths] = useState([]);
  const [sortOption, setSortOption] = useState("match"); // Default sort by match percentage

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuthStatus, isAuthenticated, router]);

  // Filter and sort paths
  useEffect(() => {
    let result = [...pathsData];

    // Filter based on search query
    if (searchQuery.trim() !== "") {
      result = result.filter(
        (path) =>
          path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          path.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort based on selected option
    if (sortOption === "match") {
      result.sort((a, b) => b.matchPercentage - a.matchPercentage);
    } else if (sortOption === "alpha") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "universities") {
      result.sort((a, b) => b.universities.length - a.universities.length);
    }

    setFilteredPaths(result);
  }, [searchQuery, sortOption, pathsData]);

  // Initial setup of filtered paths
  useEffect(() => {
    setFilteredPaths(
      [...pathsData].sort((a, b) => b.matchPercentage - a.matchPercentage)
    );
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your paths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar onCollapse={setIsSidebarCollapsed} />
      <main
        className={`pt-16 ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-300`}
      >
        <div className="p-6 md:p-8">
          {/* Header Section with Search */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-sky-800 mb-2">
                  Your Career Paths
                </h1>
                <p className="text-gray-600">
                  Explore your personalized career paths based on your
                  assessment results
                </p>
              </div>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search paths..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Results summary */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
            <p className="text-gray-600 mb-2 sm:mb-0">
              Showing {filteredPaths.length} career paths
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Sort by:</span>
              <select
                className="border rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="match">Match Percentage</option>
                <option value="alpha">Alphabetical</option>
                <option value="universities">Universities Count</option>
              </select>
            </div>
          </div>

          {/* Empty state */}
          {filteredPaths.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <div className="mb-4">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No paths found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or explore other career options
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors"
              >
                View All Paths
              </button>
            </div>
          )}

          {/* Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => (
              <Link href={`/paths/${path.id}`} key={path.id}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={path.image}
                      alt={path.title}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-sky-700 shadow-sm">
                      {path.matchPercentage}% Match
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center justify-between group-hover:text-sky-700 transition-colors">
                      {path.title}
                      <ArrowRight className="w-5 h-5 text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 duration-300" />
                    </h2>
                    <p className="text-gray-600 mb-4">{path.description}</p>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-5 h-5 text-sky-600 flex-shrink-0" />
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">
                            {path.universities.length}
                          </span>{" "}
                          Universities Available
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-5 h-5 text-sky-600 flex-shrink-0" />
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">
                            {path.universities.reduce(
                              (total, uni) => total + uni.programs.length,
                              0
                            )}
                          </span>{" "}
                          Programs Available
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
