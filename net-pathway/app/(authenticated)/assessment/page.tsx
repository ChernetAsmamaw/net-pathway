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
  Edit,
  PencilRuler,
  Sparkles,
} from "lucide-react";
import AcademicTranscriptForm from "@/components/assessment/AcademicTranscriptForm";
import ExtracurricularsForm from "@/components/assessment/ExtracurricularsForm";
import BehavioralAssessment from "@/components/assessment/BehavioralAssessment";
import AssessmentSection from "@/components/assessment/AssessmentSection";
import PathCard from "@/components/paths/PathCard";
import Link from "next/link";
import { toast } from "react-hot-toast";

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

  // State for existing assessment data
  const [academicData, setAcademicData] = useState(null);
  const [extracurricularData, setExtracurricularData] = useState(null);
  const [behavioralData, setBehavioralData] = useState(null);

  // State for tracking assessment changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data - in reality, this would come from the server
      const academicCompleted =
        localStorage.getItem("academic_assessment_completed") === "true";
      const extracurricularCompleted =
        localStorage.getItem("extracurricular_assessment_completed") === "true";
      const behavioralCompleted =
        localStorage.getItem("behavioral_assessment_completed") === "true";

      setCompletionStatus({
        academic: academicCompleted,
        extracurricular: extracurricularCompleted,
        behavioral: behavioralCompleted,
      });

      // Load saved assessment data for CRUD operations
      if (academicCompleted) {
        try {
          const savedAcademicData = JSON.parse(
            localStorage.getItem("academic_assessment_data") || "null"
          );
          setAcademicData(savedAcademicData);
        } catch (e) {
          console.error("Error parsing academic data", e);
        }
      }

      if (extracurricularCompleted) {
        try {
          const savedExtracurricularData = JSON.parse(
            localStorage.getItem("extracurricular_assessment_data") || "null"
          );
          setExtracurricularData(savedExtracurricularData);
        } catch (e) {
          console.error("Error parsing extracurricular data", e);
        }
      }

      if (behavioralCompleted) {
        try {
          const savedBehavioralData = JSON.parse(
            localStorage.getItem("behavioral_assessment_data") || "null"
          );
          setBehavioralData(savedBehavioralData);
        } catch (e) {
          console.error("Error parsing behavioral data", e);
        }
      }
    };

    fetchAssessmentStatus();
  }, [checkAuth, isAuthenticated, router]);

  const handleOpenModal = (
    modalType: "academic" | "extracurricular" | "behavioral"
  ) => {
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    // If there are unsaved changes, confirm before closing
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmClose) {
        return;
      }
      setHasUnsavedChanges(false);
    }
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

    // Update the local state with the new data
    setAcademicData(data);
    setHasUnsavedChanges(false);
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

    // Update the local state with the new data
    setExtracurricularData(data);
    setHasUnsavedChanges(false);
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

    // Update the local state with the new data
    setBehavioralData(data);
    setHasUnsavedChanges(false);
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
    router.push("/paths/generate");
  };

  // Function to edit existing assessment
  const handleEditAssessment = (type) => {
    handleOpenModal(type);
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
            <h1 className="text-3xl font-bold text-sky-800 mb-2">
              Career Assessment
            </h1>
            <p className="text-slate-600">
              Complete all three assessment sections to discover your
              personalized career path
            </p>
          </div>

          {/* Assessment Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Academic Transcript Section */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-full bg-blue-100 flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  {completionStatus.academic && (
                    <button
                      onClick={() => handleEditAssessment("academic")}
                      className="text-gray-500 hover:text-sky-600 transition-colors"
                      title="Edit assessment"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Academic Transcript
                </h2>
                <p className="text-gray-600 mb-4">
                  Enter your academic grades and subject performance
                </p>

                {completionStatus.academic ? (
                  <div className="mt-2 mb-4">
                    <div className="flex items-center text-green-600 mb-2">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Completed</span>
                    </div>
                    {academicData && (
                      <div className="text-sm text-gray-600 mt-2">
                        <p>GPA: {academicData.gpa}</p>
                        <p>Subjects: {academicData.subjects?.length || 0}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 mb-4">
                    <div className="flex items-center text-amber-600">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <span>Not completed</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleOpenModal("academic")}
                  className={`w-full mt-2 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    completionStatus.academic
                      ? "bg-sky-100 text-sky-700 hover:bg-sky-200"
                      : "bg-sky-600 text-white hover:bg-sky-700"
                  }`}
                >
                  {completionStatus.academic ? (
                    <>
                      <PencilRuler className="w-4 h-4" />
                      <span>Update Transcript</span>
                    </>
                  ) : (
                    <span>Start Assessment</span>
                  )}
                </button>
              </div>
            </div>

            {/* Extracurricular Section */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-full bg-green-100 flex-shrink-0">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  {completionStatus.extracurricular && (
                    <button
                      onClick={() => handleEditAssessment("extracurricular")}
                      className="text-gray-500 hover:text-sky-600 transition-colors"
                      title="Edit assessment"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Extracurriculars & Leadership
                </h2>
                <p className="text-gray-600 mb-4">
                  Document your activities, positions, and achievements
                </p>

                {completionStatus.extracurricular ? (
                  <div className="mt-2 mb-4">
                    <div className="flex items-center text-green-600 mb-2">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Completed</span>
                    </div>
                    {extracurricularData && (
                      <div className="text-sm text-gray-600 mt-2">
                        <p>
                          Activities:{" "}
                          {extracurricularData.activities?.length || 0}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 mb-4">
                    <div className="flex items-center text-amber-600">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <span>Not completed</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleOpenModal("extracurricular")}
                  className={`w-full mt-2 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    completionStatus.extracurricular
                      ? "bg-sky-100 text-sky-700 hover:bg-sky-200"
                      : "bg-sky-600 text-white hover:bg-sky-700"
                  }`}
                >
                  {completionStatus.extracurricular ? (
                    <>
                      <PencilRuler className="w-4 h-4" />
                      <span>Update Activities</span>
                    </>
                  ) : (
                    <span>Start Assessment</span>
                  )}
                </button>
              </div>
            </div>

            {/* Behavioral Assessment Section */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-full bg-purple-100 flex-shrink-0">
                    <BrainCircuit className="w-6 h-6 text-purple-600" />
                  </div>
                  {completionStatus.behavioral && (
                    <button
                      onClick={() => handleEditAssessment("behavioral")}
                      className="text-gray-500 hover:text-sky-600 transition-colors"
                      title="Edit assessment"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Behavioral Assessment
                </h2>
                <p className="text-gray-600 mb-4">
                  Complete a personality and aptitude assessment
                </p>

                {completionStatus.behavioral ? (
                  <div className="mt-2 mb-4">
                    <div className="flex items-center text-green-600 mb-2">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Completed</span>
                    </div>
                    {behavioralData && (
                      <div className="text-sm text-gray-600 mt-2">
                        <p>
                          Responses: {behavioralData.responses?.length || 0}{" "}
                          questions
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 mb-4">
                    <div className="flex items-center text-amber-600">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <span>Not completed</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleOpenModal("behavioral")}
                  className={`w-full mt-2 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    completionStatus.behavioral
                      ? "bg-sky-100 text-sky-700 hover:bg-sky-200"
                      : "bg-sky-600 text-white hover:bg-sky-700"
                  }`}
                >
                  {completionStatus.behavioral ? (
                    <>
                      <PencilRuler className="w-4 h-4" />
                      <span>Update Responses</span>
                    </>
                  ) : (
                    <span>Start Assessment</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Generate Path Button - Below assessment sections with glowing effect */}
          <div className="flex justify-center my-10">
            <button
              onClick={handleGeneratePath}
              disabled={!allAssessmentsCompleted()}
              className={`
                px-8 py-4 text-lg font-bold rounded-xl transition-all flex items-center gap-3
                ${
                  allAssessmentsCompleted()
                    ? "bg-gradient-to-r from-sky-600 via-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 border border-transparent"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }
                ${
                  allAssessmentsCompleted()
                    ? "animate-pulse shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                    : ""
                }
              `}
            >
              <Sparkles className="w-6 h-6" />
              Generate Your Career Path
              <Sparkles className="w-6 h-6" />
            </button>
          </div>

          {!allAssessmentsCompleted() && (
            <div className="text-center mb-8 text-amber-700 bg-amber-50 p-4 rounded-lg max-w-2xl mx-auto">
              <AlertCircle className="w-5 h-5 inline-block mr-2" />
              Complete all three assessments above to generate your personalized
              career path
            </div>
          )}

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
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Academic Transcript
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <AcademicTranscriptForm
                onSubmit={handleAcademicSubmit}
                onCancel={handleCloseModal}
                initialData={academicData}
                onDataChange={() => setHasUnsavedChanges(true)}
              />
            </div>
          </div>
        )}

        {/* Modal for Extracurricular Activities */}
        {activeModal === "extracurricular" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Extracurricular Activities
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <ExtracurricularsForm
                onSubmit={handleExtracurricularSubmit}
                onCancel={handleCloseModal}
                initialData={extracurricularData}
                onDataChange={() => setHasUnsavedChanges(true)}
              />
            </div>
          </div>
        )}

        {/* Modal for Behavioral Assessment */}
        {activeModal === "behavioral" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Behavioral Assessment
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <BehavioralAssessment
                onComplete={handleBehavioralSubmit}
                onCancel={handleCloseModal}
                initialData={behavioralData}
                onDataChange={() => setHasUnsavedChanges(true)}
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
