"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { Search, Briefcase, MapPin, Filter, Star } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import MentorDetails from "@/components/mentorship/MentorDetails";

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
  availability: "available" | "limited" | "unavailable";
  rating: number;
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
}

export default function MentorListPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [filterExpertise, setFilterExpertise] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");

  // Extract unique expertise areas for filter dropdown
  const expertiseAreas = [
    "all",
    ...new Set(mentors.flatMap((mentor) => mentor.expertise)),
  ];

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuthStatus, isAuthenticated, router]);

  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/mentors", {
          withCredentials: true,
        });

        if (response.data.mentors) {
          // Filter only active mentors for regular users
          const activeMentors = response.data.mentors.filter(
            (mentor: Mentor) => mentor.isActive
          );
          setMentors(activeMentors);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
        toast.error("Failed to load mentors");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMentors();
    }
  }, [isAuthenticated]);

  const filteredMentors = mentors.filter((mentor) => {
    // Text search
    const textMatch =
      mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.user?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Expertise filter
    const expertiseMatch =
      filterExpertise === "all" || mentor.expertise.includes(filterExpertise);

    // Availability filter
    const availabilityMatch =
      filterAvailability === "all" ||
      mentor.availability === filterAvailability;

    return textMatch && expertiseMatch && availabilityMatch;
  });

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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-sky-800 mb-2">
                  Find a Mentor
                </h1>
                <p className="text-slate-600">
                  Connect with industry experts who can guide your career
                  journey
                </p>
              </div>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor._id}
                  onClick={() => setSelectedMentor(mentor)}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                      {mentor.user?.profilePicture ? (
                        <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <Image
                            src={mentor.user.profilePicture}
                            alt={mentor.user.username}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-r from-sky-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                          {mentor.user?.username?.charAt(0).toUpperCase() ||
                            "M"}
                        </div>
                      )}

                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-sky-700 transition-colors">
                        {mentor.user?.username || "Unnamed Mentor"}
                      </h3>

                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{mentor.title}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{mentor.location}</span>
                      </div>

                      {mentor.rating > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(mentor.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : i < mentor.rating
                                  ? "text-yellow-400 fill-yellow-400 opacity-50"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            {mentor.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 space-y-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {mentor.expertise.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-sky-50 text-sky-700 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {mentor.expertise.length > 3 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded-full text-xs">
                            +{mentor.expertise.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            mentor.availability === "available"
                              ? "bg-green-100 text-green-800"
                              : mentor.availability === "limited"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {mentor.availability === "available"
                            ? "Available"
                            : mentor.availability === "limited"
                            ? "Limited Availability"
                            : "Currently Unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

// import React, { useState, useEffect } from "react";
// import {
//   Briefcase,
//   Edit,
//   Trash2,
//   Plus,
//   Eye,
//   Users,
//   MapPin,
// } from "lucide-react";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// import Image from "next/image";
// import Link from "next/link";
// import VerificationBadge from "@/components/VerificationBadge";

// interface Mentor {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   expertise: string[];
//   availability: string;
//   isActive: boolean;
//   user: {
//     id: string;
//     username: string;
//     email: string;
//     profilePicture: string | null;
//     isEmailVerified: boolean;
//   };
//   rating: number;
// }

// interface AdminMentorsListProps {
//   searchQuery: string;
// }

// const AdminMentorsList: React.FC<AdminMentorsListProps> = ({ searchQuery }) => {
//   const [mentors, setMentors] = useState<Mentor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchMentors = async () => {
//     try {
//       setLoading(true);
//       const API_URL =
//         process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
//       const response = await axios.get(
//         `${API_URL}/mentors?page=${currentPage}&search=${searchQuery}&includeInactive=true`,
//         {
//           withCredentials: true,
//         }
//       );

//       setMentors(response.data.mentors);
//       setTotalPages(response.data.pagination.pages);
//     } catch (error) {
//       console.error("Failed to fetch mentors:", error);
//       toast.error("Failed to load mentors");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMentors();
//   }, [currentPage, searchQuery]);

//   const handleDeleteMentor = async (mentorId: string) => {
//     try {
//       const API_URL =
//         process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
//       await axios.delete(`${API_URL}/mentors/${mentorId}`, {
//         withCredentials: true,
//       });

//       setMentors(mentors.filter((mentor) => mentor.id !== mentorId));
//       toast.success("Mentor profile deleted successfully");
//       setShowDeleteModal(false);
//     } catch (error) {
//       console.error("Failed to delete mentor:", error);
//       toast.error("Failed to delete mentor");
//     }
//   };

//   const toggleMentorStatus = async (mentorId: string) => {
//     try {
//       const API_URL =
//         process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
//       const response = await axios.patch(
//         `${API_URL}/mentors/${mentorId}/toggle-status`,
//         {},
//         {
//           withCredentials: true,
//         }
//       );

//       setMentors(
//         mentors.map((mentor) =>
//           mentor.id === mentorId
//             ? { ...mentor, isActive: !mentor.isActive }
//             : mentor
//         )
//       );

//       toast.success(response.data.message);
//     } catch (error) {
//       console.error("Failed to update mentor status:", error);
//       toast.error("Failed to update mentor status");
//     }
//   };

//   const getAvailabilityBadgeColor = (availability: string) => {
//     switch (availability) {
//       case "available":
//         return "bg-green-100 text-green-800";
//       case "limited":
//         return "bg-amber-100 text-amber-800";
//       case "unavailable":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   if (loading && mentors.length === 0) {
//     return (
//       <div className="flex justify-center py-8">
//         <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold flex items-center gap-2">
//           <Briefcase className="w-5 h-5 text-sky-700" />
//           Mentor Management
//         </h2>
//         <Link
//           href="/admin/mentor/create"
//           className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm flex items-center gap-1"
//         >
//           <Plus className="w-4 h-4" />
//           Create Mentor Profile
//         </Link>
//       </div>

//       {mentors.length === 0 ? (
//         <div className="text-center py-8 bg-gray-50 rounded-lg">
//           <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//           <p className="text-gray-500 mb-4">No mentors found</p>
//           <Link
//             href="/admin/mentor/create"
//             className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm inline-flex items-center gap-1"
//           >
//             <Plus className="w-4 h-4" />
//             Create First Mentor
//           </Link>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded-lg overflow-hidden">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
//                   Mentor
//                 </th>
//                 <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
//                   Expertise
//                 </th>
//                 <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
//                   Location
//                 </th>
//                 <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
//                   Status
//                 </th>
//                 <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
//                   Availability
//                 </th>
//                 <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
//                   Rating
//                 </th>
//                 <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {mentors.map((mentor) => (
//                 <tr key={mentor.id} className="hover:bg-gray-50">
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-gray-200 relative overflow-hidden">
//                         {mentor.user.profilePicture ? (
//                           <Image
//                             src={mentor.user.profilePicture}
//                             alt={mentor.user.username}
//                             fill
//                             className="object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center text-gray-500">
//                             {mentor.user.username.charAt(0).toUpperCase()}
//                           </div>
//                         )}
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <p className="font-medium text-gray-900">
//                             {mentor.user.username}
//                           </p>
//                           <VerificationBadge
//                             isVerified={mentor.user.isEmailVerified}
//                             size="sm"
//                           />
//                         </div>
//                         <p className="text-xs text-gray-500">
//                           {mentor.title} at {mentor.company}
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4">
//                     <div className="flex flex-wrap gap-1">
//                       {mentor.expertise.slice(0, 2).map((skill, index) => (
//                         <span
//                           key={index}
//                           className="px-2 py-1 rounded-full text-xs bg-sky-50 text-sky-700"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                       {mentor.expertise.length > 2 && (
//                         <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
//                           +{mentor.expertise.length - 2}
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-1 text-gray-600">
//                       <MapPin className="w-4 h-4" />
//                       <span className="text-sm">{mentor.location}</span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         mentor.isActive
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {mentor.isActive ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityBadgeColor(
//                         mentor.availability
//                       )}`}
//                     >
//                       {mentor.availability}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-1">
//                       <div className="text-amber-500">★</div>
//                       <span>{mentor.rating.toFixed(1)}</span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4 text-right">
//                     <div className="flex items-center justify-end gap-2">
//                       <Link
//                         href={`/admin/mentor/edit/${mentor.id}`}
//                         className="p-1 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded"
//                         title="Edit Mentor"
//                       >
//                         <Edit className="w-4 h-4" />
//                       </Link>
//                       <button
//                         onClick={() => toggleMentorStatus(mentor.id)}
//                         className={`p-1 rounded ${
//                           mentor.isActive
//                             ? "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
//                             : "text-green-600 hover:text-green-800 hover:bg-green-50"
//                         }`}
//                         title={mentor.isActive ? "Deactivate" : "Activate"}
//                       >
//                         {mentor.isActive ? (
//                           <Eye className="w-4 h-4" />
//                         ) : (
//                           <Eye className="w-4 h-4" />
//                         )}
//                       </button>
//                       <button
//                         onClick={() => {
//                           setSelectedMentor(mentor);
//                           setShowDeleteModal(true);
//                         }}
//                         className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
//                         title="Delete Mentor"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                       <Link
//                         href={`/mentorship/${mentor.id}`}
//                         className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
//                         title="View Profile"
//                         target="_blank"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </Link>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-6">
//           <div className="flex space-x-1">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 border rounded-lg disabled:opacity-50"
//             >
//               Previous
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`px-4 py-2 border rounded-lg ${
//                   currentPage === page
//                     ? "bg-sky-600 text-white"
//                     : "hover:bg-gray-50"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}
//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 border rounded-lg disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && selectedMentor && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <h3 className="text-lg font-bold mb-4">Delete Mentor Profile</h3>
//             <p>
//               Are you sure you want to delete the mentor profile for{" "}
//               <span className="font-semibold">
//                 {selectedMentor.user.username}
//               </span>
//               ? This action cannot be undone.
//             </p>

//             <div className="flex justify-end gap-2 mt-6">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDeleteMentor(selectedMentor.id)}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminMentorsList;
