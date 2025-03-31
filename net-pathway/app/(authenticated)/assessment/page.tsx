"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useAssessmentResultsStore } from "@/store/useAssessmentResultsStore";
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
  Star,
} from "lucide-react";
import AcademicTranscriptForm from "@/components/assessment/AcademicTranscriptForm";
import ExtracurricularsForm from "@/components/assessment/ExtracurricularsForm";
import BehavioralAssessment from "@/components/assessment/BehavioralAssessment";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Link from "next/link";
import { toast } from "react-hot-toast";
import AssessmentResultComponent from "@/components/assessment/AssessmentResultComponent";

export default function AssessmentPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const {
    academicCompleted,
    extracurricularCompleted,
    behavioralCompleted,
    isLoading,
    academicData,
    extracurricularData,
    behavioralData,
    fetchAssessmentStatus,
    saveAcademicData,
    saveExtracurricularData,
    saveBehavioralData,
    fetchCombinedData,
    getAllCompleted,
  } = useAssessmentStore();

  const {
    results,
    isLoading: isLoadingResults,
    fetchAssessmentResults,
  } = useAssessmentResultsStore();

  // State for active modal
  const [activeModal, setActiveModal] = useState<
    null | "academic" | "extracurricular" | "behavioral"
  >(null);

  // State for selected previous assessment
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // State for tracking assessment changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  // State for generation loading
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();

    // Fetch assessment completion status from backend
    const getAssessmentStatus = async () => {
      await fetchAssessmentStatus();
      await fetchAssessmentResults();
    };

    if (isAuthenticated) {
      getAssessmentStatus();
    }
  }, [
    checkAuth,
    isAuthenticated,
    router,
    fetchAssessmentStatus,
    fetchAssessmentResults,
  ]);

  const handleOpenModal = (
    modalType: "academic" | "extracurricular" | "behavioral"
  ) => {
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    // If there are unsaved changes, show confirmation dialog
    if (hasUnsavedChanges) {
      setPendingAction("closeModal");
      setShowConfirmDialog(true);
      return;
    }
    setActiveModal(null);
    setHasUnsavedChanges(false);
  };

  const handleConfirmAction = () => {
    if (pendingAction === "closeModal") {
      setActiveModal(null);
      setHasUnsavedChanges(false);
    }

    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  const handleAcademicSubmit = async (data) => {
    try {
      const success = await saveAcademicData(data);

      if (success) {
        toast.success("Academic transcript saved successfully!");
        setHasUnsavedChanges(false);
        handleCloseModal();
      } else {
        toast.error("Failed to save academic data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving academic data:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleExtracurricularSubmit = async (data) => {
    try {
      const success = await saveExtracurricularData(data);

      if (success) {
        toast.success("Extracurricular activities saved successfully!");
        setHasUnsavedChanges(false);
        handleCloseModal();
      } else {
        toast.error("Failed to save extracurricular data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving extracurricular data:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleBehavioralSubmit = async (data) => {
    try {
      const success = await saveBehavioralData(data);

      if (success) {
        toast.success("Behavioral assessment completed successfully!");
        setHasUnsavedChanges(false);
        handleCloseModal();
      } else {
        toast.error("Failed to save behavioral data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving behavioral data:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Function to check if all assessments are completed
  const allAssessmentsCompleted = () => {
    return getAllCompleted();
  };

  // Handle generating path based on completed assessments
  const handleGeneratePath = async () => {
    if (!allAssessmentsCompleted()) {
      toast.error("Please complete all assessment sections first!");
      return;
    }

    setIsGenerating(true);

    try {
      // Fetch combined data from all assessments
      const combinedData = await fetchCombinedData();

      if (!combinedData) {
        toast.error("Failed to fetch assessment data. Please try again.");
        setIsGenerating(false);
        return;
      }

      // Store combined data in sessionStorage for use on the results page
      sessionStorage.setItem(
        "assessment_combined_data",
        JSON.stringify(combinedData)
      );

      // Navigate to the path generation page
      router.push("/assessment/results/generation");
    } catch (error) {
      console.error("Error generating path:", error);
      toast.error("Failed to generate path. Please try again.");
      setIsGenerating(false);
    }
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

  // Loading state while fetching initial assessment status
  if (isLoading && !academicData && !extracurricularData && !behavioralData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your assessment data...</p>
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
                  {academicCompleted && (
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

                {academicCompleted ? (
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
                    academicCompleted
                      ? "bg-sky-100 text-sky-700 hover:bg-sky-200"
                      : "bg-sky-600 text-white hover:bg-sky-700"
                  }`}
                >
                  {academicCompleted ? (
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
                  {extracurricularCompleted && (
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

                {extracurricularCompleted ? (
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
                    extracurricularCompleted
                      ? "bg-sky-100 text-sky-700 hover:bg-sky-200"
                      : "bg-sky-600 text-white hover:bg-sky-700"
                  }`}
                >
                  {extracurricularCompleted ? (
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
                  {behavioralCompleted && (
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

                {behavioralCompleted ? (
                  <div className="mt-2 mb-4">
                    <div className="flex items-center text-green-600 mb-2">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Completed</span>
                    </div>
                    {behavioralData && (
                      <div className="text-sm text-gray-600 mt-2">
                        <p>Assessment: Completed</p>
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
                    behavioralCompleted
                      ? "bg-sky-100 text-sky-700 hover:bg-sky-200"
                      : "bg-sky-600 text-white hover:bg-sky-700"
                  }`}
                >
                  {behavioralCompleted ? (
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
              disabled={!allAssessmentsCompleted() || isGenerating}
              className={`
                px-8 py-4 text-lg font-bold rounded-xl transition-all flex items-center gap-3
                ${
                  allAssessmentsCompleted() && !isGenerating
                    ? "bg-gradient-to-r from-sky-600 via-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 border border-transparent"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }
                ${
                  allAssessmentsCompleted() && !isGenerating
                    ? "animate-pulse shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                    : ""
                }
              `}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Path...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate Your Career Path
                  <Sparkles className="w-6 h-6" />
                </>
              )}
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

            {isLoadingResults ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : results && results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.slice(0, 3).map((assessment) => (
                  <div
                    key={assessment.id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
                    onClick={() =>
                      router.push(`/assessment/results/${assessment.id}`)
                    }
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {assessment.title}
                      </h3>
                      <div className="flex items-center gap-1 bg-sky-100 text-sky-800 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {assessment.matchPercentage}%
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {assessment.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {assessment.result.topPaths
                        .slice(0, 2)
                        .map((path, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                          >
                            {path}
                          </span>
                        ))}
                      {assessment.result.topPaths.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{assessment.result.topPaths.length - 2} more
                        </span>
                      )}
                    </div>
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

        {/* Confirmation Dialog for Unsaved Changes */}
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          title="Unsaved Changes"
          message="You have unsaved changes. Are you sure you want to exit without saving?"
          onConfirm={handleConfirmAction}
          onCancel={() => setShowConfirmDialog(false)}
          confirmLabel="Discard Changes"
          cancelLabel="Continue Editing"
          type="warning"
        />
      </main>
    </div>
  );
}
