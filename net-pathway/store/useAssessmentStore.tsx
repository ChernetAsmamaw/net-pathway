import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface AssessmentResults {
  riasec?: Record<string, number>;
  multiple_intelligence?: Record<string, number>;
  career_anchors?: Record<string, number>;
  work_dimensions?: Record<string, number>;
}

interface AssessmentState {
  questions: any[];
  responses: Record<number, number>;
  currentQuestion: number;
  assessmentData: any;
  results: AssessmentResults | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  completed: boolean;

  // Data fetching
  fetchAssessmentQuestions: () => Promise<void>;

  // Assessment interaction
  setResponse: (questionId: number, value: number) => void;
  setCurrentQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;

  // Submission
  submitAssessment: () => Promise<boolean>;

  // Results
  calculateResults: () => AssessmentResults;
  getTopCareerGroups: () => string[];

  // State management
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  questions: [],
  responses: {},
  currentQuestion: 0,
  assessmentData: null,
  results: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  completed: false,

  // Fetch assessment questions from JSON file
  fetchAssessmentQuestions: async () => {
    try {
      set({ isLoading: true, error: null });

      // Load questions from public JSON file
      const response = await fetch("/data/career-assessment.json");
      if (!response.ok) {
        throw new Error("Failed to load assessment data");
      }

      const assessmentData = await response.json();

      // Initialize empty responses
      const initialResponses = {};
      assessmentData.questions.forEach((q) => {
        initialResponses[q.id] = null;
      });

      set({
        assessmentData,
        questions: assessmentData.questions,
        responses: initialResponses,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading assessment:", error);
      set({
        error: error.message || "Failed to load assessment",
        isLoading: false,
      });
      toast.error("Failed to load assessment questions");
    }
  },

  // Set response for a question
  setResponse: (questionId, value) => {
    set((state) => ({
      responses: {
        ...state.responses,
        [questionId]: value,
      },
    }));
  },

  // Set current question index
  setCurrentQuestion: (index) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      set({ currentQuestion: index });
      // Scroll to top for better UX
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }
    }
  },

  // Move to next question
  nextQuestion: () => {
    const { currentQuestion, questions, responses } = get();
    const currentQuestionId = questions[currentQuestion]?.id;

    // Only proceed if current question is answered
    if (
      responses[currentQuestionId] !== null &&
      responses[currentQuestionId] !== undefined
    ) {
      if (currentQuestion < questions.length - 1) {
        set({ currentQuestion: currentQuestion + 1 });
        // Scroll to top for better UX
        if (typeof window !== "undefined") {
          window.scrollTo(0, 0);
        }
      } else {
        // At the last question - could trigger submission
        const results = get().calculateResults();
        set({ results });
      }
    }
  },

  // Move to previous question
  prevQuestion: () => {
    const { currentQuestion } = get();
    if (currentQuestion > 0) {
      set({ currentQuestion: currentQuestion - 1 });
      // Scroll to top for better UX
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }
    }
  },

  // Calculate assessment results
  calculateResults: () => {
    const { assessmentData, responses } = get();

    if (!assessmentData || !assessmentData.scoringCategories) {
      return null;
    }

    // Initialize results object
    const results: AssessmentResults = {};

    // Loop through each main category
    Object.entries(assessmentData.scoringCategories).forEach(
      ([categoryGroup, categories]) => {
        results[categoryGroup] = {};

        // For each subcategory, calculate score
        Object.entries(categories as Record<string, number[]>).forEach(
          ([categoryName, questionIds]) => {
            // Calculate average score for this category
            let sum = 0;
            let count = 0;

            questionIds.forEach((id) => {
              if (responses[id] !== null && responses[id] !== undefined) {
                sum += responses[id];
                count++;
              }
            });

            // Store average score (or 0 if no answers)
            results[categoryGroup][categoryName] = count > 0 ? sum / count : 0;
          }
        );
      }
    );

    return results;
  },

  // Get top career groups based on results
  getTopCareerGroups: () => {
    const { assessmentData, results } = get();

    if (!results || !assessmentData || !assessmentData.careerGroupings) {
      return [];
    }

    // Calculate score for each career group
    const careerGroupScores = {};

    Object.entries(assessmentData.careerGroupings).forEach(
      ([groupName, groupData]) => {
        const relevantCategories = groupData.relevantCategories || [];
        let totalScore = 0;
        let categoryCount = 0;

        // Calculate average score from relevant categories
        relevantCategories.forEach((category) => {
          // Find which category group this belongs to
          for (const [groupKey, categories] of Object.entries(results)) {
            if (categories[category] !== undefined) {
              totalScore += categories[category];
              categoryCount++;
              break;
            }
          }
        });

        careerGroupScores[groupName] =
          categoryCount > 0 ? totalScore / categoryCount : 0;
      }
    );

    // Sort and return top career groups
    return Object.entries(careerGroupScores)
      .sort((a, b) => b[1] - a[1])
      .map(([groupName]) => groupName);
  },

  // Submit assessment to API
  submitAssessment: async () => {
    const { responses } = get();

    // Calculate results before submission
    const results = get().calculateResults();
    set({ results, isSubmitting: true, error: null });

    try {
      // Submit to backend API
      const response = await axios.post(
        `${API_URL}/assessment/behavioral`,
        {
          responses,
          results,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        set({ completed: true, isSubmitting: false });
        toast.success("Assessment submitted successfully!");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to submit assessment");
      }
    } catch (error) {
      console.error("Assessment submission error:", error);

      // Handle 404 errors specially - if the endpoint doesn't exist yet
      if (error.response?.status === 404) {
        // Store locally as fallback when API endpoint is missing
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "assessment_responses",
            JSON.stringify(responses)
          );
          localStorage.setItem("assessment_results", JSON.stringify(results));
          localStorage.setItem(
            "assessment_completed",
            new Date().toISOString()
          );
        }

        set({ completed: true, isSubmitting: false });
        toast.success("Assessment completed! (Saved locally)");
        return true;
      }

      set({
        error: error.message || "Failed to submit assessment",
        isSubmitting: false,
      });
      toast.error("Failed to submit assessment. Please try again.");
      return false;
    }
  },

  // Reset assessment state
  resetAssessment: () => {
    const { questions } = get();

    // Initialize empty responses
    const initialResponses = {};
    questions.forEach((q) => {
      initialResponses[q.id] = null;
    });

    set({
      responses: initialResponses,
      currentQuestion: 0,
      results: null,
      completed: false,
      error: null,
    });
  },
}));
