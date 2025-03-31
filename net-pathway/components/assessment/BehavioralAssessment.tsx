import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle,
  X,
  BrainCircuit,
  AlertCircle,
} from "lucide-react";
import { useAssessmentStore } from "@/store/useAssessmentStore";

/**
 * BehavioralAssessment Component
 *
 * This component presents a multi-question assessment to determine personality traits
 * and career preferences using the RIASEC model, with questions loaded from the AssessmentStore.
 */

// RIASEC categories with descriptions
const riasecOptions = [
  {
    key: "realistic",
    name: "Realistic",
    description: "Practical, physical, hands-on, tool-oriented",
  },
  {
    key: "investigative",
    name: "Investigative",
    description: "Analytical, intellectual, scientific, explorative",
  },
  {
    key: "artistic",
    name: "Artistic",
    description: "Creative, original, independent, chaotic",
  },
  {
    key: "social",
    name: "Social",
    description: "Cooperative, supporting, helping, healing/nurturing",
  },
  {
    key: "enterprising",
    name: "Enterprising",
    description: "Competitive environments, leadership, persuading",
  },
  {
    key: "conventional",
    name: "Conventional",
    description: "Detail-oriented, organizing, clerical",
  },
];

const BehavioralAssessment = ({ onComplete, onCancel }) => {
  // Assessment store state and functions
  const {
    questions,
    assessmentData,
    responses,
    currentQuestion,
    isLoading,
    isSubmitting,
    fetchAssessmentQuestions,
    setResponse,
    nextQuestion,
    prevQuestion,
    submitAssessment,
  } = useAssessmentStore();

  // Local state for personality type selection and save progress
  const [selectedPersonalityTypes, setSelectedPersonalityTypes] = useState<
    string[]
  >([]);
  const [validationError, setValidationError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);

  // Fetch questions on component mount
  useEffect(() => {
    fetchAssessmentQuestions();
  }, [fetchAssessmentQuestions]);

  // Detect changes to trigger auto-save
  useEffect(() => {
    if (
      Object.keys(responses).length > 0 ||
      selectedPersonalityTypes.length > 0
    ) {
      setHasUnsavedChanges(true);
    }
  }, [responses, selectedPersonalityTypes]);

  // Auto-save timer
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setInterval(() => {
        setSaveProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setHasUnsavedChanges(false);
            return 0;
          }
          return prev + 10;
        });
      }, 250);

      if (saveProgress >= 100) {
        // Auto-save the current state to localStorage
        localStorage.setItem(
          "behavioral_assessment_data_autosave",
          JSON.stringify({
            responses,
            selectedTypes: selectedPersonalityTypes,
          })
        );
        setHasUnsavedChanges(false);
      }

      return () => clearInterval(timer);
    }
    return undefined;
  }, [hasUnsavedChanges, saveProgress, responses, selectedPersonalityTypes]);

  // Add keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the current question has been answered
      const currentQuestionId = questions[currentQuestion]?.id;
      const hasResponse =
        responses[currentQuestionId] !== null &&
        responses[currentQuestionId] !== undefined;

      // If Enter key is pressed and current question has a response
      if (event.key === "Enter" && hasResponse && !isSubmitting) {
        // Go to next question or submit if on last question
        if (currentQuestion < questions.length - 1) {
          nextQuestion();
        } else {
          handleSubmitAssessment();
        }
      }
      // Optionally handle left/right arrow keys for navigation
      else if (event.key === "ArrowLeft" && currentQuestion > 0) {
        prevQuestion();
      } else if (event.key === "ArrowRight" && hasResponse) {
        if (currentQuestion < questions.length - 1) {
          nextQuestion();
        }
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    currentQuestion,
    questions,
    responses,
    nextQuestion,
    prevQuestion,
    isSubmitting,
  ]);

  // Handle personality type selection/deselection
  const handlePersonalityTypeToggle = (type: string) => {
    setSelectedPersonalityTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Handle save progress (manual save)
  const handleSaveProgress = () => {
    localStorage.setItem(
      "behavioral_assessment_data_autosave",
      JSON.stringify({
        responses,
        selectedTypes: selectedPersonalityTypes,
      })
    );
    setHasUnsavedChanges(false);
  };

  // Handle save and exit
  const handleSaveAndExit = () => {
    handleSaveProgress();
    onCancel();
  };

  // Calculate completion percentage
  const completionPercentage = questions.length
    ? (Object.keys(responses).length / questions.length) * 100
    : 0;

  // Submit assessment with validation for personality types
  const handleSubmitAssessment = async () => {
    setValidationError("");

    // Require at least 2 personality types to be selected
    if (selectedPersonalityTypes.length < 2) {
      setValidationError(
        "Please select at least 2 personality types that describe you best."
      );
      return;
    }

    // Modify the results with personality type boosts before submission
    const combinedResults = {
      responses,
      selectedTypes: selectedPersonalityTypes,
      completedAt: new Date().toISOString(),
    };

    const success = await submitAssessment(combinedResults);

    if (success) {
      onComplete(combinedResults);
    }
  };

  // Handle next button click - either go to next question or submit
  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      nextQuestion();
    } else {
      await handleSubmitAssessment();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no questions are available
  if (!questions.length) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Failed to load assessment questions.</p>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="p-6">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Behavioral Assessment
          </h2>
        </div>
        <button
          onClick={handleSaveAndExit}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Save and exit"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-green-50 p-4 rounded-lg mb-6 flex items-start gap-3">
        <div>
          <p className="text-green-800 font-medium">Assessment Information</p>
          <p className="text-green-700 text-sm">
            This assessment will help identify your personality traits and
            career preferences. Answer each question honestly, and select at
            least 2 personality types that best describe you. Your progress is
            automatically saved.
          </p>
        </div>
      </div>

      {/* Progress bar and auto-save indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {Object.keys(responses).length} of {questions.length} questions
            answered
          </span>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${saveProgress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">Auto-saving...</span>
            </div>
          )}
          <button
            onClick={handleSaveProgress}
            className="text-sky-600 text-sm flex items-center gap-1 hover:text-sky-800"
          >
            <Save className="w-4 h-4" /> Save Progress
          </button>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-sky-600 rounded-full transition-all"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* RIASEC Personality Types Section */}
      <div className="my-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Select Your Personality Types
        </h3>
        <p className="text-gray-600 mb-6">
          Select at least 2 personality types that best describe you:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {riasecOptions.map((option) => (
            <div
              key={option.key}
              onClick={() => handlePersonalityTypeToggle(option.key)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedPersonalityTypes.includes(option.key)
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center mb-2">
                <div
                  className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                    selectedPersonalityTypes.includes(option.key)
                      ? "bg-green-600"
                      : "border border-gray-300"
                  }`}
                >
                  {selectedPersonalityTypes.includes(option.key) && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="font-medium text-gray-900">{option.name}</span>
              </div>
              <p className="text-gray-600 text-sm pl-8">{option.description}</p>
            </div>
          ))}
        </div>

        {validationError && (
          <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-600 text-sm">{validationError}</p>
          </div>
        )}
      </div>

      {/* Current question section */}
      <div className="my-6 p-6 bg-white rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Question {currentQuestion + 1} of {questions.length}
        </h3>
        <p className="text-lg text-gray-800 mb-6">{question.text}</p>

        <div className="space-y-3">
          {assessmentData?.responseOptions?.map((option) => (
            <div
              key={option.value}
              onClick={() => setResponse(question.id, option.value)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                responses[question.id] === option.value
                  ? "border-sky-500 bg-sky-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                    responses[question.id] === option.value
                      ? "bg-sky-600"
                      : "border border-gray-300"
                  }`}
                >
                  {responses[question.id] === option.value && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <span
                  className={
                    responses[question.id] === option.value ? "font-medium" : ""
                  }
                >
                  {option.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="px-4 py-2 flex items-center gap-2 text-gray-700 hover:text-sky-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>

        <button
          onClick={handleNext}
          disabled={responses[question.id] === undefined || isSubmitting}
          className="px-4 py-2 flex items-center gap-2 text-gray-700 hover:text-sky-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {currentQuestion < questions.length - 1 ? (
            <>
              Next <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Finish <CheckCircle className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Bottom action bar */}
      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        <button
          onClick={handleSaveAndExit}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Save & Exit
        </button>

        <button
          onClick={handleSubmitAssessment}
          disabled={
            completionPercentage < 100 ||
            selectedPersonalityTypes.length < 2 ||
            isSubmitting
          }
          className={`px-6 py-2 rounded-lg ${
            completionPercentage === 100 &&
            selectedPersonalityTypes.length >= 2 &&
            !isSubmitting
              ? "bg-sky-600 text-white hover:bg-sky-700 transition-colors"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Assessment"}
        </button>
      </div>
    </div>
  );
};

export default BehavioralAssessment;
