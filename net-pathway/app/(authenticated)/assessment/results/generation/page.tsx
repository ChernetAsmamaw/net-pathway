"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { generateCareerPath } from "@/lib/careerPathGenerator";
import AssessmentResultComponent from "@/components/assessment/AssessmentResultComponent";
import { Sparkles, Loader, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AssessmentGenerationPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedPath, setGeneratedPath] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

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

        // Simulate progress animation
        const animationInterval = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev + 2;
            if (newProgress >= 100) {
              clearInterval(animationInterval);
              return 100;
            }
            return newProgress;
          });
        }, 50);

        // Update step based on progress
        const stepInterval = setInterval(() => {
          setCurrentStep((prev) => {
            const stepValue = Math.floor(
              progress / (100 / progressSteps.length)
            );
            return stepValue >= progressSteps.length
              ? progressSteps.length - 1
              : stepValue;
          });
        }, 100);

        // Allow animation to run for a bit before generating results
        setTimeout(() => {
          try {
            // Generate career path based on assessment data
            const { transcriptData, assessmentResults } = combinedData;
            const result = generateCareerPath(
              transcriptData,
              assessmentResults
            );

            // Save generated path to sessionStorage for persistence
            sessionStorage.setItem(
              "generated_path_result",
              JSON.stringify(result)
            );

            // Add to assessment history (in a real app, this would be an API call)
            const historyItem = {
              id: `assessment-${Date.now()}`,
              title: `Career Assessment - ${new Date().toLocaleDateString(
                "en-US",
                { month: "long", year: "numeric" }
              )}`,
              description: `${result.title} focused assessment`,
              matchPercentage: result.matchPercentage,
              date: new Date().toISOString(),
              status: "completed",
              result: {
                topPaths: [
                  result.title.split(" & ")[0],
                  result.title.split(" & ")[1],
                ],
                strengthAreas: result.requirements
                  .filter((req) => req.includes("Strong"))
                  .map((req) => req.replace("Strong background in ", "")),
                recommendations: result.requirements.filter(
                  (req) => !req.includes("Strong") && !req.includes("Minimum")
                ),
              },
              path: result,
            };

            // In a real implementation, this would be saved to the database
            // For now, we'll simulate by storing in localStorage
            const existingHistory = JSON.parse(
              localStorage.getItem("assessment_history") || "[]"
            );
            localStorage.setItem(
              "assessment_history",
              JSON.stringify([historyItem, ...existingHistory])
            );

            // Update state with generated path
            setGeneratedPath(result);

            // Ensure we're at 100% progress
            setProgress(100);

            // Small delay before finishing to allow the progress bar to complete
            setTimeout(() => {
              setIsGenerating(false);
              clearInterval(animationInterval);
              clearInterval(stepInterval);
            }, 500);
          } catch (generationError) {
            console.error("Error generating career path:", generationError);
            setError("Failed to analyze assessment data. Please try again.");
            setIsGenerating(false);
            clearInterval(animationInterval);
            clearInterval(stepInterval);
          }
        }, 2000);

        return () => {
          clearInterval(animationInterval);
          clearInterval(stepInterval);
        };
      } catch (error) {
        console.error("Error in assessment generation:", error);
        toast.error("Failed to generate assessment results");
        setError(error.message || "An error occurred");
        setIsGenerating(false);
      }
    };

    initAuth();
  }, [checkAuth, isAuthenticated, router]);

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
            <AlertCircle className="w-8 h-8 text-red-500" />
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
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-sky-600" />
              Generating Your Career Path
              <Sparkles className="w-8 h-8 text-sky-600" />
            </h1>
            <p className="text-gray-600 max-w-lg mx-auto">
              We're analyzing your assessment data to find the perfect career
              path for you.
            </p>
          </div>

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

          {/* Simple animation spinner */}
          <div className="flex flex-col items-center mt-12">
            <div className="w-20 h-20 border-8 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-500">Processing your assessment data...</p>
          </div>
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
