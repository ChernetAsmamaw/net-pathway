// components/assessment/BehavioralAssessment.tsx
import React, { useState, useEffect } from "react";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { toast } from "react-hot-toast";

// Sample questions array - in production this would come from API or a data file
const QUESTIONS = [
  {
    id: 1,
    question: "I enjoy solving complex problems and puzzles.",
    category: "logical_mathematical",
  },
  {
    id: 2,
    question: "I prefer working in teams rather than individually.",
    category: "interpersonal",
  },
  {
    id: 3,
    question: "I am good at visualizing objects and creating mental images.",
    category: "visual_spatial",
  },
  {
    id: 4,
    question: "I enjoy creative writing and expressing myself through words.",
    category: "verbal_linguistic",
  },
  {
    id: 5,
    question: "I am very aware of my own feelings and motivations.",
    category: "intrapersonal",
  },
  // RIASEC questions
  {
    id: 6,
    question: "I enjoy working with my hands and building things.",
    category: "realistic",
  },
  {
    id: 7,
    question: "I like to investigate how things work and conduct experiments.",
    category: "investigative",
  },
  {
    id: 8,
    question: "I enjoy creating art, music, or other forms of self-expression.",
    category: "artistic",
  },
  {
    id: 9,
    question: "I enjoy helping and teaching others.",
    category: "social",
  },
  {
    id: 10,
    question: "I like to lead and persuade others.",
    category: "enterprising",
  },
  {
    id: 11,
    question:
      "I prefer following clear instructions and established procedures.",
    category: "conventional",
  },
  // In a real implementation, you would have many more questions
];

interface BehavioralAssessmentProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  onDataChange?: () => void;
}

const BehavioralAssessment: React.FC<BehavioralAssessmentProps> = ({
  onComplete,
  onCancel,
  initialData,
  onDataChange,
}) => {
  // Use assessment store
  const { saveBehavioralData } = useAssessmentStore();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Initialize responses from initialData if available
  useEffect(() => {
    if (initialData && initialData.responses) {
      setResponses(initialData.responses);
      if (onDataChange) {
        onDataChange();
      }
    }
  }, [initialData, onDataChange]);

  // Update progress when responses change
  useEffect(() => {
    const completedQuestions = Object.keys(responses).length;
    const progressPercentage = (completedQuestions / QUESTIONS.length) * 100;
    setProgress(progressPercentage);
  }, [responses]);

  const handleAnswerSelect = (questionId: number, value: number) => {
    setResponses((prev) => {
      const newResponses = { ...prev, [questionId]: value };
      if (onDataChange) {
        onDataChange();
      }
      return newResponses;
    });

    // Auto-advance to next question if not on the last question
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    // Multiple intelligences categories
    const categories: { [key: string]: number } = {
      logical_mathematical: 0,
      interpersonal: 0,
      visual_spatial: 0,
      verbal_linguistic: 0,
      intrapersonal: 0,
    };

    // RIASEC categories
    const riasec: { [key: string]: number } = {
      realistic: 0,
      investigative: 0,
      artistic: 0,
      social: 0,
      enterprising: 0,
      conventional: 0,
    };

    // Count responses by category
    let categoryCounts: { [key: string]: number } = {};

    QUESTIONS.forEach((question) => {
      const response = responses[question.id];
      if (response !== undefined) {
        if (!categoryCounts[question.category]) {
          categoryCounts[question.category] = 0;
        }
        categoryCounts[question.category]++;

        // Update the appropriate category total
        if (
          [
            "logical_mathematical",
            "interpersonal",
            "visual_spatial",
            "verbal_linguistic",
            "intrapersonal",
          ].includes(question.category)
        ) {
          categories[question.category] += response;
        } else {
          riasec[question.category] += response;
        }
      }
    });

    // Calculate averages for multiple intelligence categories
    Object.keys(categories).forEach((category) => {
      if (categoryCounts[category] > 0) {
        categories[category] = Math.round(
          (categories[category] / (categoryCounts[category] * 5)) * 100
        );
      }
    });

    // Calculate averages for RIASEC categories
    Object.keys(riasec).forEach((category) => {
      if (categoryCounts[category] > 0) {
        riasec[category] = Math.round(
          (riasec[category] / (categoryCounts[category] * 5)) * 100
        );
      }
    });

    return {
      categories,
      riasec,
    };
  };

  const handleSubmit = async () => {
    // Check if all questions have been answered
    const unansweredQuestions = QUESTIONS.filter(
      (q) => responses[q.id] === undefined
    );

    if (unansweredQuestions.length > 0) {
      if (
        !window.confirm(
          `You have ${unansweredQuestions.length} unanswered questions. Do you want to submit anyway?`
        )
      ) {
        return;
      }
    }

    setIsSubmitting(true);

    // Calculate results
    const results = calculateResults();

    // Prepare data for submission
    const submissionData = {
      responses,
      results: {
        multiple_intelligence: results.categories,
        riasec: results.riasec,
      },
    };

    // Save to assessment store
    try {
      const success = await saveBehavioralData(submissionData);

      if (success) {
        // Call the onComplete callback with the data
        onComplete(submissionData);
      } else {
        toast.error("Failed to save assessment. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting behavioral assessment:", error);
      toast.error("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSaveAndExit = async () => {
    // Check if there are any responses
    if (Object.keys(responses).length === 0) {
      onCancel();
      return;
    }

    setIsSubmitting(true);

    // Calculate partial results
    const results = calculateResults();

    // Prepare data for submission
    const submissionData = {
      responses,
      results: {
        multiple_intelligence: results.categories,
        riasec: results.riasec,
      },
    };

    // Save locally or to assessment store based on completion
    const isComplete = Object.keys(responses).length === QUESTIONS.length;

    if (isComplete) {
      try {
        const success = await saveBehavioralData(submissionData);

        if (success) {
          toast.success("Assessment progress saved");
          onCancel();
        } else {
          toast.error("Failed to save progress. Please try again.");
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error("Error saving assessment progress:", error);
        toast.error("An error occurred. Please try again.");
        setIsSubmitting(false);
      }
    } else {
      // Save locally without API call for incomplete assessment
      // In a real app, you might want to save progress to localStorage
      localStorage.setItem(
        "behavioral_assessment_progress",
        JSON.stringify(submissionData)
      );
      toast.success("Assessment progress saved locally");
      setIsSubmitting(false);
      onCancel();
    }
  };

  return (
    <div className="p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-sky-600 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Current Question */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {QUESTIONS[currentQuestion]?.question}
        </h3>

        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() =>
                handleAnswerSelect(QUESTIONS[currentQuestion]?.id, value)
              }
              className={`w-full p-3 text-left rounded-lg transition-colors ${
                responses[QUESTIONS[currentQuestion]?.id] === value
                  ? "bg-sky-100 border-2 border-sky-500"
                  : "bg-white border-2 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                    responses[QUESTIONS[currentQuestion]?.id] === value
                      ? "bg-sky-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {value}
                </div>
                <span>
                  {value === 1
                    ? "Strongly Disagree"
                    : value === 2
                    ? "Disagree"
                    : value === 3
                    ? "Neutral"
                    : value === 4
                    ? "Agree"
                    : "Strongly Agree"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div>
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSaveAndExit}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save & Exit"}
          </button>
          {currentQuestion < QUESTIONS.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50"
              disabled={responses[QUESTIONS[currentQuestion]?.id] === undefined}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BehavioralAssessment;
