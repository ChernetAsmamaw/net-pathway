"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  GraduationCap,
  Users,
  BrainCircuit,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Layers,
} from "lucide-react";
import AcademicTranscriptForm from "@/components/assessment/AcademicTranscriptForm";
import ExtracurricularsForm from "@/components/assessment/ExtracurricularsForm";
import BehavioralAssessment from "@/components/assessment/BehavioralAssessment";
import AssessmentSection from "@/components/assessment/AssessmentSection";
import PathCard from "@/components/paths/PathCard";
import Link from "next/link";

// Mock previous assessment data - This would come from an API call in a real implementation
const previousAssessments = [
  {
    id: "assessment-1",
    title: "Career Assessment - March 2025",
    description: "Software Engineering & Computer Science focused assessment",
    matchPercentage: 92,
    date: "March 15, 2025",
    status: "completed",
    result: {
      topPaths: ["Software Engineering", "Computer Science", "Data Science"],
      strengthAreas: ["Mathematics", "Logical Reasoning", "Problem Solving"],
      recommendations: ["Consider internships in tech", "Join coding clubs"],
    },
  },
  {
    id: "assessment-2",
    title: "Career Assessment - January 2025",
    description: "General assessment with multiple career paths",
    matchPercentage: 78,
    date: "January 10, 2025",
    status: "completed",
    result: {
      topPaths: ["Business Administration", "Marketing", "Psychology"],
      strengthAreas: ["Communication", "Creative Thinking", "Leadership"],
      recommendations: [
        "Explore business courses",
        "Join public speaking clubs",
      ],
    },
  },
];

export default function AssessmentPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  // State for assessment sections completion status
  const [completionStatus, setCompletionStatus] = useState({
    academic: false,
    extracurricular: false,
    behavioral: false,
  });

  // State for active modal
  const [activeModal, setActiveModal] = useState<
    null | "academic" | "extracurricular" | "behavioral"
  >(null);

  // State for selected previous assessment
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();

    // Here you would fetch the user's assessment completion status from the API
    // This is a mock implementation for demonstration
    const fetchAssessmentStatus = async () => {
      // Mock API response - in reality, this would be an actual API call
      // For now, we're just simulating a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - in reality, this would come from the server
      setCompletionStatus({
        academic:
          localStorage.getItem("academic_assessment_completed") === "true",
        extracurricular:
          localStorage.getItem("extracurricular_assessment_completed") ===
          "true",
        behavioral:
          localStorage.getItem("behavioral_assessment_completed") === "true",
      });
    };

    fetchAssessmentStatus();
  }, [checkAuth, isAuthenticated, router]);

  const handleOpenModal = (
    modalType: "academic" | "extracurricular" | "behavioral"
  ) => {
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleAcademicSubmit = (data) => {
    console.log("Academic transcript data:", data);
    // In a real application, you would save this data to your backend
    // Here we're just using localStorage as a mock persistence layer
    localStorage.setItem("academic_assessment_data", JSON.stringify(data));
    localStorage.setItem("academic_assessment_completed", "true");

    setCompletionStatus((prev) => ({
      ...prev,
      academic: true,
    }));

    handleCloseModal();
    toast.success("Academic transcript saved successfully!");
  };

  const handleExtracurricularSubmit = (data) => {
    console.log("Extracurricular data:", data);
    // In a real application, you would save this data to your backend
    localStorage.setItem(
      "extracurricular_assessment_data",
      JSON.stringify(data)
    );
    localStorage.setItem("extracurricular_assessment_completed", "true");

    setCompletionStatus((prev) => ({
      ...prev,
      extracurricular: true,
    }));

    handleCloseModal();
    toast.success("Extracurricular activities saved successfully!");
  };

  const handleBehavioralSubmit = (data) => {
    console.log("Behavioral assessment data:", data);
    // In a real application, you would save this data to your backend
    localStorage.setItem("behavioral_assessment_data", JSON.stringify(data));
    localStorage.setItem("behavioral_assessment_completed", "true");

    setCompletionStatus((prev) => ({
      ...prev,
      behavioral: true,
    }));

    handleCloseModal();
    toast.success("Behavioral assessment completed successfully!");
  };

  // Function to check if all assessments are completed
  const allAssessmentsCompleted = () => {
    return (
      completionStatus.academic &&
      completionStatus.extracurricular &&
      completionStatus.behavioral
    );
  };

  // Handle generating path based on completed assessments
  const handleGeneratePath = () => {
    if (!allAssessmentsCompleted()) {
      toast.error("Please complete all assessment sections first!");
      return;
    }

    // In a real app, you would call your API endpoint to generate a path
    router.push("/path/generate");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <div className="p-6 md:p-8">
          {/* Header with Assessment Overview */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-sky-800 mb-2">
                  Career Assessment
                </h1>
                <p className="text-slate-600">
                  Complete all three assessment sections to discover your
                  personalized career path
                </p>
              </div>
              <button
                onClick={handleGeneratePath}
                disabled={!allAssessmentsCompleted()}
                className={`px-6 py-3 rounded-xl transition-colors flex items-center gap-2 ${
                  allAssessmentsCompleted()
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {allAssessmentsCompleted() ? (
                  <>
                    <CheckCircle className="w-5 h-5" /> Generate Your Path
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5" /> Complete All Sections
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Assessment Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Academic Transcript Section */}
            <AssessmentSection
              title="Academic Transcript"
              description="Enter your academic grades and subject performance"
              icon={GraduationCap}
              isCompleted={completionStatus.academic}
              onClick={() => handleOpenModal("academic")}
            />

            {/* Extracurricular Section */}
            <AssessmentSection
              title="Extracurriculars & Leadership"
              description="Document your activities, positions, and achievements"
              icon={Users}
              isCompleted={completionStatus.extracurricular}
              onClick={() => handleOpenModal("extracurricular")}
            />

            {/* Behavioral Assessment Section */}
            <AssessmentSection
              title="Behavioral Assessment"
              description="Complete a personality and aptitude assessment"
              icon={BrainCircuit}
              isCompleted={completionStatus.behavioral}
              onClick={() => handleOpenModal("behavioral")}
            />
          </div>

          {/* Previous Assessments Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Layers className="mr-2 text-sky-700" />
                Previous Assessment Results
              </h2>
              <Link
                href="/assessment/history"
                className="text-sky-600 flex items-center hover:text-sky-800 transition-colors"
              >
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {previousAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {previousAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => setSelectedAssessment(assessment)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {assessment.title}
                      </h3>
                      <span className="bg-sky-100 text-sky-800 text-sm font-medium px-2.5 py-0.5 rounded">
                        {assessment.matchPercentage}% Match
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {assessment.description}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{assessment.date}</span>
                      <span className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />{" "}
                        {assessment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow text-center">
                <p className="text-gray-500">
                  You haven't completed any assessments yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Academic Transcript */}
        {activeModal === "academic" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <AcademicTranscriptForm
                onSubmit={handleAcademicSubmit}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        )}

        {/* Modal for Extracurricular Activities */}
        {activeModal === "extracurricular" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <ExtracurricularsForm
                onSubmit={handleExtracurricularSubmit}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        )}

        {/* Modal for Behavioral Assessment */}
        {activeModal === "behavioral" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <BehavioralAssessment
                onComplete={handleBehavioralSubmit}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        )}

        {/* Modal for Previous Assessment Details */}
        {selectedAssessment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedAssessment.title}
                </h2>
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="bg-sky-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sky-800 font-medium">Match Score:</span>
                  <span className="bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {selectedAssessment.matchPercentage}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sky-800 font-medium">
                    Date Completed:
                  </span>
                  <span className="text-gray-700">
                    {selectedAssessment.date}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Top Career Paths
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedAssessment.result.topPaths.map((path, index) => (
                    <div
                      key={index}
                      className="bg-purple-50 p-3 rounded-lg text-center"
                    >
                      <span className="text-purple-800 font-medium">
                        {path}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Strength Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAssessment.result.strengthAreas.map(
                    (strength, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {strength}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Recommendations
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {selectedAssessment.result.recommendations.map(
                    (rec, index) => (
                      <li key={index}>{rec}</li>
                    )
                  )}
                </ul>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                  onClick={() => {
                    setSelectedAssessment(null);
                    router.push(`/paths/${selectedAssessment.id}`);
                  }}
                >
                  View Detailed Path
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
