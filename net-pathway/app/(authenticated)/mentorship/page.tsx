"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import Image from "next/image";
import {
  Search,
  Briefcase,
  MapPin,
  Star,
  Calendar,
  Filter,
  ArrowRight,
} from "lucide-react";
import MentorCard from "@/components/mentorship/MentorCard";
import MentorDetails from "@/components/mentorship/MentorDetails";

const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Senior Software Engineer",
    company: "Microsoft",
    location: "Addis Ababa, Ethiopia",
    image: "/mentors/sarah.jpg",
    expertise: ["Software Development", "Cloud Computing", "AI/ML"],
    rating: 4.9,
    experience: "12 years",
    availability: "2 slots available",
    bio: "Experienced software engineer with a passion for mentoring young talents in tech.",
    education: "Ph.D. in Computer Science, MIT",
    languages: ["English", "Amharic"],
    achievements: [
      "Led teams at Microsoft and Google",
      "Published 15+ research papers",
      "Mentored 50+ successful developers",
    ],
  },
  // Add more mentors here
];

const filterOptions = {
  expertise: [
    { value: "all", label: "All Expertise" },
    { value: "software", label: "Software Development", icon: "💻" },
    { value: "data", label: "Data Science", icon: "📊" },
    { value: "cloud", label: "Cloud Computing", icon: "☁️" },
    { value: "ai", label: "Artificial Intelligence", icon: "🤖" },
    { value: "cybersecurity", label: "Cybersecurity", icon: "🔒" },
  ],
  availability: [
    { value: "all", label: "All Availability" },
    { value: "available", label: "Available Now", color: "text-green-600" },
    { value: "waitlist", label: "Waitlist", color: "text-orange-600" },
    { value: "booked", label: "Fully Booked", color: "text-red-600" },
  ],
};

export default function MentorshipPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    expertise: "all",
    availability: "all",
  });

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuthStatus, isAuthenticated, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentorship...</p>
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
          {/* Header Section */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-700">
            <h1 className="text-3xl font-bold text-sky-800 mb-2">
              Find Your Mentor
            </h1>
            <p className="text-slate-600">
              Connect with industry experts who can guide your career journey
            </p>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-sky-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search mentors by name, expertise, or company..."
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white/50 backdrop-blur-sm hover:bg-white transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <select
                  className="appearance-none px-4 py-3.5 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white hover:bg-gray-50 transition-colors cursor-pointer font-medium text-gray-700"
                  value={filters.expertise}
                  onChange={(e) =>
                    setFilters({ ...filters, expertise: e.target.value })
                  }
                >
                  {filterOptions.expertise.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  className="appearance-none px-4 py-3.5 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white hover:bg-gray-50 transition-colors cursor-pointer font-medium text-gray-700"
                  value={filters.availability}
                  onChange={(e) =>
                    setFilters({ ...filters, availability: e.target.value })
                  }
                >
                  {filterOptions.availability.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className={option.color}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Enhanced Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-4 right-4 z-10">
                  <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-sky-700 shadow-sm">
                    {mentor.rating} ⭐️
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={mentor.image}
                        alt={mentor.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-sky-700 transition-colors">
                      {mentor.name}
                    </h3>
                    <p className="text-gray-600 mt-1 flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {mentor.title} at {mentor.company}
                    </p>
                    <p className="text-gray-600 mt-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {mentor.location}
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {mentor.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-sm font-medium hover:bg-sky-100 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedMentor(mentor.id)}
                        className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 group"
                      >
                        <span>View Profile</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Mentor Details Modal */}
      {selectedMentor && (
        <MentorDetails
          mentor={mentors.find((m) => m.id === selectedMentor)!}
          onClose={() => setSelectedMentor(null)}
        />
      )}
    </div>
  );
}
