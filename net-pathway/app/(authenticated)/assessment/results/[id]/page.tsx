"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Book,
  MapPin,
  Clock,
  CalendarDays,
  DollarSign,
  CheckCircle,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Loader,
} from "lucide-react";
import Link from "next/link";
import { pathsData } from "../../page";

interface Program {
  id: number;
  name: string;
  duration: string;
  studyMode: string;
  tuitionFee: string;
  description: string;
  highlights: string[];
}

interface University {
  id: number;
  name: string;
  location: string;
  logo: string;
  description: string;
  admissionDeadline: string;
  programs: Program[];
}

interface PathData {
  id: string;
  title: string;
  description: string;
  image: string;
  matchPercentage: number;
  requirements: string[];
  universities: University[];
  aiRecommendation?: string;
}

const AssessmentResultPage = () => {
  const router = useRouter();
  const params = useParams();
  const [pathData, setPathData] = useState<PathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeUniversity, setActiveUniversity] = useState<number | null>(null);
  const [expandedPrograms, setExpandedPrograms] = useState<number[]>([]);

  // Fetch the path data based on the ID in the URL
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // For now, we'll use the mock data from pathsData
        const id = params?.id as string;
        const foundPath = pathsData.find((path) => path.id === id);

        if (foundPath) {
          setPathData(foundPath);
          // Set the first university as active by default if universities exist
          if (foundPath.universities && foundPath.universities.length > 0) {
            setActiveUniversity(foundPath.universities[0].id);
          }
        } else {
          // Handle not found scenario
          console.error("Path not found");
        }
      } catch (error) {
        console.error("Error fetching path data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  const selectedUniversity = pathData?.universities?.find(
    (uni) => uni.id === activeUniversity
  );

  const toggleProgram = (programId: number) => {
    setExpandedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId]
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 text-sky-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading assessment results...</p>
        </div>
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Path Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the career path you're looking for. It may have
            been removed or doesn't exist.
          </p>
          <button
            onClick={() => router.push("/assessment")}
            className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Back to Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="relative h-56 bg-gradient-to-r from-sky-600 to-purple-700">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors z-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Path Title and Match Percentage */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-6 h-6 text-white" />
                  <span className="text-white/80 font-medium">
                    Career Pathway
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {pathData.title}
                </h1>
                <p className="text-white/90 max-w-2xl">
                  {pathData.description}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                <span className="text-2xl font-bold">
                  {pathData.matchPercentage}%
                </span>
                <span className="text-sm opacity-90">Match</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* AI Recommendation Section */}
          {pathData.aiRecommendation && (
            <div className="mb-8 bg-sky-50 p-4 rounded-xl border-l-4 border-sky-500">
              <div className="flex gap-3">
                <div className="mt-1">
                  <Info className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sky-900 mb-1">
                    Why This Path Matches You
                  </h3>
                  <p className="text-sky-800">{pathData.aiRecommendation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Requirements Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Path Requirements
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pathData.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* University Selection Tabs */}
          {pathData.universities && pathData.universities.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Available Universities
                </h2>
                <div className="flex flex-wrap gap-3">
                  {pathData.universities.map((university) => (
                    <button
                      key={university.id}
                      onClick={() => setActiveUniversity(university.id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeUniversity === university.id
                          ? "bg-sky-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {university.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected University Details */}
              {selectedUniversity && (
                <div className="mb-8">
                  <div className="bg-gray-50 rounded-xl p-5 mb-6">
                    <div className="flex flex-col md:flex-row items-start gap-4">
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        {selectedUniversity.logo ? (
                          <Image
                            src={selectedUniversity.logo}
                            alt={selectedUniversity.name}
                            width={80}
                            height={80}
                            className="p-2"
                          />
                        ) : (
                          <Building2 className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {selectedUniversity.name}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-sky-600" />
                            <span>{selectedUniversity.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4 text-sky-600" />
                            <span>
                              Application Deadline:{" "}
                              {selectedUniversity.admissionDeadline}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          {selectedUniversity.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Available Programs
                  </h3>
                  <div className="space-y-4">
                    {selectedUniversity.programs.map((program) => (
                      <div
                        key={program.id}
                        className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                      >
                        <div
                          className="p-4 bg-white cursor-pointer border-l-4 border-sky-600 rounded-l"
                          onClick={() => toggleProgram(program.id)}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-gray-900">
                              {program.name}
                            </h4>
                            <button
                              className="p-1 rounded-full hover:bg-gray-100"
                              aria-label={
                                expandedPrograms.includes(program.id)
                                  ? "Collapse"
                                  : "Expand"
                              }
                            >
                              {expandedPrograms.includes(program.id) ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-sky-600" />
                              <span>{program.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Book className="w-4 h-4 text-sky-600" />
                              <span>{program.studyMode}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-sky-600" />
                              <span>{program.tuitionFee}</span>
                            </div>
                          </div>
                        </div>

                        {expandedPrograms.includes(program.id) && (
                          <div className="p-6 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-700 mb-6">
                              {program.description}
                            </p>

                            <h5 className="font-medium text-gray-900 mb-3">
                              Program Highlights
                            </h5>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                              {program.highlights.map((highlight, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">
                                    {highlight}
                                  </span>
                                </li>
                              ))}
                            </ul>

                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                              <div className="text-xs text-gray-500">
                                Program ID: {program.id}
                              </div>
                              <Link
                                href="#"
                                className="text-sky-600 flex items-center gap-1 hover:text-sky-800 font-medium text-sm"
                              >
                                <span>Visit Program Website</span>
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No universities available
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                There are currently no universities offering programs for this
                career path. Check back later or explore other paths.
              </p>
              <button
                onClick={() => router.push("/paths")}
                className="mt-6 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Explore Other Paths
              </button>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => router.push("/assessment")}
              className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Back to Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResultPage;
