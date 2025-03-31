// app/(authenticated)/paths/generate/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Sparkles,
  BarChart3,
  Compass,
  School,
  GraduationCap,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Loader,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function PathGeneratePage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const {
    academicCompleted,
    extracurricularCompleted,
    behavioralCompleted,
    fetchAssessmentStatus,
    fetchCombinedData,
    getAllCompleted,
    combinedData,
  } = useAssessmentStore();

  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [paths, setPaths] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadedData, setLoadedData] = useState<any>(null);

  // Animation frames
  const progressSteps = [
    "Analyzing academic strengths...",
    "Processing extracurricular activities...",
    "Evaluating personality traits...",
    "Matching with career domains...",
    "Finding compatible university programs...",
    "Ranking potential paths...",
    "Generating final recommendations...",
  ];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      // Check if all assessments are completed
      await fetchAssessmentStatus();
      if (!getAllCompleted()) {
        toast.error("Please complete all assessment sections first");
        router.push("/assessment");
        return;
      }
    };

    initAuth();
  }, [
    checkAuth,
    isAuthenticated,
    router,
    fetchAssessmentStatus,
    getAllCompleted,
  ]);

  // Simulate progress animation
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 2;
          return newProgress >= 100 ? 100 : newProgress;
        });

        setCurrentStep((prev) => {
          const stepValue = Math.floor(progress / (100 / progressSteps.length));
          return stepValue >= progressSteps.length
            ? progressSteps.length - 1
            : stepValue;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isGenerating, progress, progressSteps.length]);

  // Generate paths
  useEffect(() => {
    const generatePaths = async () => {
      try {
        // Check for previously loaded data
        let assessmentData = combinedData;

        // If no data in store, check session storage
        if (!assessmentData) {
          const storedData = sessionStorage.getItem("assessment_combined_data");
          if (storedData) {
            assessmentData = JSON.parse(storedData);
            setLoadedData(assessmentData);
          } else {
            // Fetch from API if not in session storage
            assessmentData = await fetchCombinedData();
          }
        }

        if (!assessmentData) {
          throw new Error("Could not retrieve assessment data");
        }

        // Give animation time to display before making the actual API call
        // This is just for user experience since the path generation is fairly quick
        setTimeout(async () => {
          try {
            // Make API call to generate paths based on assessment data
            const response = await axios.post(
              `${API_URL}/assessment/generate-paths`,
              assessmentData,
              { withCredentials: true }
            );

            if (response.data && response.data.paths) {
              setPaths(response.data.paths);

              // Store generated paths in session storage for use on results page
              sessionStorage.setItem(
                "generated_paths",
                JSON.stringify(response.data.paths)
              );

              // Mock API response for testing
            } else {
              // Mock paths for development if API is not yet implemented
              const mockPaths = [
                {
                  id: "engineering",
                  title: "Software Engineering",
                  description:
                    "A career in designing and developing software systems",
                  matchPercentage: 92,
                  strengths: [
                    "Problem Solving",
                    "Logical Thinking",
                    "Mathematics",
                  ],
                  universities: [
                    {
                      name: "MIT",
                      programs: ["Computer Science", "Software Engineering"],
                    },
                    { name: "Stanford", programs: ["Computer Science"] },
                  ],
                },
                {
                  id: "data-science",
                  title: "Data Science",
                  description:
                    "Analyzing and interpreting complex data to inform decisions",
                  matchPercentage: 88,
                  strengths: ["Analysis", "Statistics", "Programming"],
                  universities: [
                    {
                      name: "UC Berkeley",
                      programs: ["Data Science", "Statistics"],
                    },
                    {
                      name: "Carnegie Mellon",
                      programs: ["Machine Learning", "Data Analytics"],
                    },
                  ],
                },
                {
                  id: "cybersecurity",
                  title: "Cybersecurity",
                  description:
                    "Protecting systems, networks, and programs from digital attacks",
                  matchPercentage: 84,
                  strengths: [
                    "Problem Solving",
                    "Attention to Detail",
                    "Critical Thinking",
                  ],
                  universities: [
                    {
                      name: "Georgia Tech",
                      programs: ["Cybersecurity", "Information Security"],
                    },
                    { name: "Purdue", programs: ["Computer Security"] },
                  ],
                },
              ];

              setPaths(mockPaths);
              sessionStorage.setItem(
                "generated_paths",
                JSON.stringify(mockPaths)
              );
            }

            // Set to complete after a minimum of 3 seconds for UX
            setTimeout(() => {
              setProgress(100);
              setIsGenerating(false);
            }, 1000);
          } catch (callError) {
            console.error("Error calling path generation API:", callError);
            setError("Failed to generate career paths. Please try again.");
            setIsGenerating(false);
          }
        }, 3000); // Delay API call for animation
      } catch (error) {
        console.error("Error in path generation:", error);
        setError(
          "Failed to process assessment data. Please retry from the assessment page."
        );
        setIsGenerating(false);
      }
    };

    if (isAuthenticated && getAllCompleted()) {
      generatePaths();
    }
  }, [
    isAuthenticated,
    getAllCompleted,
    fetchCombinedData,
    combinedData,
    router,
  ]);

  const handleViewResults = () => {
    router.push("/paths");
  };

  const handleRetry = () => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-sky-600" />
            Career Path Generation
            <Sparkles className="w-8 h-8 text-sky-600" />
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            {isGenerating
              ? "We're analyzing your assessment data to find the perfect career paths for you."
              : error
              ? "We encountered an error while generating your career paths."
              : "Your personalized career paths are ready to explore!"}
          </p>
        </div>

        {isGenerating ? (
          <>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>Analyzing data...</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
            </div>

            {/* Current Step */}
            <div className="bg-sky-50 p-4 rounded-xl mb-8 flex items-center">
              <div className="mr-4">
                <Loader className="w-6 h-6 text-sky-600 animate-spin" />
              </div>
              <p className="text-sky-800 font-medium">
                {progressSteps[currentStep]}
              </p>
            </div>

            {/* Processing Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div
                className={`p-4 rounded-xl ${
                  currentStep >= 0 ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3
                    className={`w-5 h-5 ${
                      currentStep >= 0 ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  <h3
                    className={`font-medium ${
                      currentStep >= 0 ? "text-green-800" : "text-gray-500"
                    }`}
                  >
                    Academic Analysis
                  </h3>
                </div>
                <p
                  className={`text-sm ${
                    currentStep >= 0 ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  Analyzing subject strengths and academic performance
                </p>
              </div>

              <div
                className={`p-4 rounded-xl ${
                  currentStep >= 2 ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Compass
                    className={`w-5 h-5 ${
                      currentStep >= 2 ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  <h3
                    className={`font-medium ${
                      currentStep >= 2 ? "text-green-800" : "text-gray-500"
                    }`}
                  >
                    Personality Matching
                  </h3>
                </div>
                <p
                  className={`text-sm ${
                    currentStep >= 2 ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  Matching your personality traits to suitable careers
                </p>
              </div>

              <div
                className={`p-4 rounded-xl ${
                  currentStep >= 4 ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <School
                    className={`w-5 h-5 ${
                      currentStep >= 4 ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  <h3
                    className={`font-medium ${
                      currentStep >= 4 ? "text-green-800" : "text-gray-500"
                    }`}
                  >
                    Program Matching
                  </h3>
                </div>
                <p
                  className={`text-sm ${
                    currentStep >= 4 ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  Finding university programs that match your profile
                </p>
              </div>
            </div>
          </>
        ) : error ? (
          // Error State
          <div className="text-center py-8">
            <div className="bg-red-50 p-6 rounded-xl mb-8 max-w-lg mx-auto">
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          // Success State
          <>
            <div className="flex justify-center mb-8">
              <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Top Career Matches
              </h2>
              <p className="text-gray-600">
                Based on your assessment results, we've identified these career
                paths:
              </p>
            </div>

            <div className="space-y-4 mb-10">
              {paths.slice(0, 3).map((path, index) => (
                <div key={index} className="bg-sky-50 p-4 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <GraduationCap className="w-6 h-6 text-sky-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {path.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {path.description}
                        </p>
                      </div>
                    </div>
                    <div className="bg-sky-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {path.matchPercentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleViewResults}
                className="px-8 py-4 bg-gradient-to-r from-sky-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
              >
                <BookOpen className="w-5 h-5" />
                View Detailed Results
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
