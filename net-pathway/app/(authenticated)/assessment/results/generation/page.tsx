"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  useAssessmentResultsStore,
  mockPaths,
} from "@/store/useAssessmentResultsStore";
import AssessmentResultComponent from "@/components/assessment/AssessmentResultComponent";
import { toast } from "react-hot-toast";

export default function AssessmentGenerationPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedPath, setGeneratedPath] = useState(null);
  const [error, setError] = useState(null);

  // Check authentication
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      // Get combined assessment data from storage
      try {
        const combinedData = JSON.parse(
          sessionStorage.getItem("assessment_combined_data")
        );
        if (!combinedData) {
          throw new Error("No assessment data found");
        }

        // Simulate API call to generate assessment results
        await generateAssessmentResults(combinedData);
      } catch (error) {
        console.error("Error in assessment generation:", error);
        toast.error("Failed to generate assessment results");
        setError(error.message || "An error occurred");
        setIsGenerating(false);
      }
    };

    initAuth();
  }, [checkAuth, isAuthenticated, router]);

  // Simulate generating results (in a real app, this would call your backend API)
  const generateAssessmentResults = async (assessmentData) => {
    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, we'll use the engineering path
      const generatedResult = mockPaths.engineering;

      // In a real app, you'd save this to the backend
      // For now, we just set it in state
      setGeneratedPath(generatedResult);
      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating results:", error);
      setError("Failed to generate assessment results");
      setIsGenerating(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.push("/assessment");
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Generating Assessment
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Back to Assessment
          </button>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Generating Your Career Path
          </h2>
          <p className="text-gray-600 max-w-md text-center">
            We're analyzing your academic performance, extracurricular
            activities, and behavioral assessment to find your ideal career
            path...
          </p>
        </div>
      </div>
    );
  }

  if (!generatedPath) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Results Generated
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't generate results from your assessment data. Please try
            again.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Back to Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-green-50 p-4 rounded-xl mb-6 border border-green-200">
          <h2 className="text-green-800 font-semibold flex items-center gap-2">
            <span className="h-5 w-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
              ✓
            </span>
            Assessment Completed Successfully
          </h2>
          <p className="text-green-700 ml-7">
            Based on your assessment results, we've identified your ideal career
            path.
          </p>
        </div>

        <AssessmentResultComponent
          pathData={generatedPath}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
