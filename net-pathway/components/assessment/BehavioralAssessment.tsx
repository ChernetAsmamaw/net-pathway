// components/assessment/BehavioralAssessment.tsx
import { useEffect } from "react";
import { useAssessmentStore } from "@/store/useAssessmentStore";

export default function BehavioralAssessment({ onComplete }) {
  const {
    questions,
    assessmentData,
    responses,
    currentQuestion,
    isLoading,
    isSubmitting,
    completed,
    results,
    fetchAssessmentQuestions,
    setResponse,
    nextQuestion,
    prevQuestion,
    submitAssessment,
  } = useAssessmentStore();

  // Fetch questions on component mount
  useEffect(() => {
    fetchAssessmentQuestions();
  }, [fetchAssessmentQuestions]);

  // Handle completion
  // Add this useEffect hook to handle keyboard events
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
          submitAssessment();
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
    submitAssessment,
    isSubmitting,
  ]);

  // Handle submission when at the last question
  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      nextQuestion();
    } else {
      const success = await submitAssessment();
      if (success) {
        // onComplete will be called via the completion effect
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load assessment questions.</p>
        <button
          onClick={fetchAssessmentQuestions}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Attribution */}
      {currentQuestion === 0 && assessmentData && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">{assessmentData.attribution}</p>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div
            className="h-2 bg-sky-600 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{question.text}</h3>

        {/* Response options */}
        <div className="space-y-3">
          {assessmentData.responseOptions.map((option) => (
            <div
              key={option.value}
              className={`p-3 border rounded-lg cursor-pointer transition-colors
                ${
                  responses[question.id] === option.value
                    ? "bg-sky-100 border-sky-500"
                    : "hover:bg-gray-50 border-gray-200"
                }`}
              onClick={() => setResponse(question.id, option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={responses[question.id] === null || isSubmitting}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg disabled:opacity-50"
        >
          {isSubmitting
            ? "Submitting..."
            : currentQuestion < questions.length - 1
            ? "Next"
            : "Submit"}
        </button>
      </div>
    </div>
  );
}
