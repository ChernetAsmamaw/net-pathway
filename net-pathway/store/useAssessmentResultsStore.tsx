// store/useAssessmentResultsStore.tsx
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Interface for assessment results
export interface AssessmentResult {
  id: string;
  title: string;
  description: string;
  matchPercentage: number;
  date: string;
  status: string;
  result: {
    topPaths: string[];
    strengthAreas: string[];
    recommendations: string[];
  };
  // Detailed path data
  path?: {
    id: string;
    title: string;
    description: string;
    image?: string;
    matchPercentage: number;
    requirements: string[];
    universities: University[];
    aiRecommendation?: string;
  };
}

interface University {
  id: number;
  name: string;
  location: string;
  logo: string;
  description: string;
  admissionDeadline: string;
  programs: Program[];
}

interface Program {
  id: number;
  name: string;
  duration: string;
  studyMode: string;
  tuitionFee: string;
  description: string;
  highlights: string[];
}

// Extended results with path data
export interface ExtendedAssessmentResult extends AssessmentResult {
  path: {
    id: string;
    title: string;
    description: string;
    image?: string;
    matchPercentage: number;
    requirements: string[];
    universities: University[];
    aiRecommendation?: string;
  };
}

// Primary assessment results store
interface AssessmentResultsState {
  results: AssessmentResult[];
  selectedResult: ExtendedAssessmentResult | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAssessmentResults: () => Promise<AssessmentResult[]>;
  getAssessmentResult: (id: string) => Promise<ExtendedAssessmentResult | null>;
  saveAssessmentResult: (result: AssessmentResult) => Promise<boolean>;
  clearSelectedResult: () => void;
}

export const useAssessmentResultsStore = create<AssessmentResultsState>(
  (set, get) => ({
    results: [],
    selectedResult: null,
    isLoading: false,
    error: null,

    // Fetch all assessment results for a user
    fetchAssessmentResults: async () => {
      set({ isLoading: true, error: null });

      try {
        // In a real implementation, this would be an API call
        // For now, we'll use localStorage to simulate persistence
        const localResults = localStorage.getItem("assessment_history");
        let results: AssessmentResult[] = [];

        if (localResults) {
          results = JSON.parse(localResults);
        } else {
          // If no stored results, provide sample result
          const sampleResult = await get().getAssessmentResult("sample-1");
          results = sampleResult ? [sampleResult] : [];

          // Save to localStorage
          localStorage.setItem("assessment_history", JSON.stringify(results));
        }

        set({ results, isLoading: false });
        return results;
      } catch (error) {
        console.error("Error fetching assessment results:", error);
        set({
          isLoading: false,
          error: error.message || "Failed to fetch assessment results",
        });
        return [];
      }
    },

    // Get a specific assessment result by ID
    getAssessmentResult: async (id: string) => {
      const { results } = get();

      // Check if we already have the result in state
      let result = results.find((r) => r.id === id);

      if (!result) {
        set({ isLoading: true, error: null });

        try {
          // Check for newly generated path in session storage
          const generatedPath = sessionStorage.getItem("generated_path_result");
          if (generatedPath && (id === "latest" || id === "current")) {
            const pathData = JSON.parse(generatedPath);

            result = {
              id: "latest-assessment",
              title: `Career Assessment - ${new Date().toLocaleDateString(
                "en-US",
                { month: "long", year: "numeric" }
              )}`,
              description: `${pathData.title} focused assessment`,
              matchPercentage: pathData.matchPercentage,
              date: new Date().toISOString(),
              status: "completed",
              result: {
                topPaths: [
                  pathData.title.split(" & ")[0],
                  pathData.title.split(" & ")[1],
                ],
                strengthAreas: pathData.requirements
                  .filter((req) => req.includes("Strong"))
                  .map((req) => req.replace("Strong background in ", "")),
                recommendations: pathData.requirements.filter(
                  (req) => !req.includes("Strong") && !req.includes("Minimum")
                ),
              },
              path: pathData,
            };
          } else {
            // Check in localStorage
            const localResults = localStorage.getItem("assessment_history");
            if (localResults) {
              const storedResults = JSON.parse(localResults);
              result = storedResults.find((r: AssessmentResult) => r.id === id);
            }

            // If still not found, use sample data
            if (!result) {
              // Sample result for demo purposes
              result = {
                id: "sample-1",
                title: "Career Assessment - March 2025",
                description: "Engineering & Technology focused assessment",
                matchPercentage: 92,
                date: "2025-03-15T10:30:00Z",
                status: "completed",
                result: {
                  topPaths: ["Engineering", "Technology"],
                  strengthAreas: [
                    "Mathematics",
                    "Problem Solving",
                    "Analytical Thinking",
                  ],
                  recommendations: [
                    "Consider internships in tech",
                    "Join coding clubs",
                  ],
                },
                path: {
                  id: "engineering",
                  title: "Engineering & Technology",
                  description:
                    "A career path focused on designing, building, and optimizing systems, structures, and technologies to solve practical problems.",
                  matchPercentage: 92,
                  requirements: [
                    "High school diploma or equivalent",
                    "English language proficiency",
                    "Entrance examination qualification",
                    "Minimum GPA of 3.0 in science subjects",
                    "Strong background in Mathematics and Physics",
                    "Problem-solving aptitude",
                    "Highly recommended for students with your profile",
                  ],
                  universities: [
                    {
                      id: 1,
                      name: "Adama Science and Technology University",
                      location: "Adama, Ethiopia",
                      logo: "/logos/astu-logo.png",
                      description:
                        "A leading technical institution focused on science and engineering education.",
                      admissionDeadline: "May 15, 2025",
                      programs: [
                        {
                          id: 1,
                          name: "Bachelor of Science in Software Engineering",
                          duration: "4 years",
                          studyMode: "Full-time",
                          tuitionFee: "45,000 ETB per year",
                          description:
                            "A comprehensive program covering software development principles, programming languages, database management, and software project management.",
                          highlights: [
                            "Practical programming skills",
                            "Industry-focused curriculum",
                            "Internship opportunities",
                            "Modern computing facilities",
                          ],
                        },
                        {
                          id: 2,
                          name: "Bachelor of Science in Computer Science",
                          duration: "4 years",
                          studyMode: "Full-time",
                          tuitionFee: "42,000 ETB per year",
                          description:
                            "Focus on theoretical and practical aspects of computing including algorithms, data structures, artificial intelligence, and computer architecture.",
                          highlights: [
                            "Research opportunities",
                            "Advanced mathematics training",
                            "Computing laboratory access",
                            "AI and machine learning specialization available",
                          ],
                        },
                      ],
                    },
                  ],
                  aiRecommendation:
                    "Based on your strong performance in Mathematics and Physics, combined with your analytical problem-solving abilities shown in your behavioral assessment, Engineering is an excellent match for you. Your extracurricular activities in robotics and coding clubs further demonstrate your aptitude for technical disciplines.",
                },
              };
            }
          }

          if (result) {
            set({
              selectedResult: result as ExtendedAssessmentResult,
              isLoading: false,
            });
            return result as ExtendedAssessmentResult;
          } else {
            set({
              isLoading: false,
              error: "Assessment result not found",
            });
            return null;
          }
        } catch (error) {
          console.error("Error fetching assessment result:", error);
          set({
            isLoading: false,
            error: error.message || "Failed to fetch assessment result",
          });
          return null;
        }
      } else {
        // We already have the result, just update the selectedResult
        set({ selectedResult: result as ExtendedAssessmentResult });
        return result as ExtendedAssessmentResult;
      }
    },

    // Save a new assessment result
    saveAssessmentResult: async (result: AssessmentResult) => {
      try {
        set({ isLoading: true, error: null });

        // In a real implementation, this would be an API call
        // For now, we'll use localStorage to simulate persistence
        const existingResults = localStorage.getItem("assessment_history");
        let results: AssessmentResult[] = [];

        if (existingResults) {
          results = JSON.parse(existingResults);
        }

        // Add new result
        results = [result, ...results];

        // Save to localStorage
        localStorage.setItem("assessment_history", JSON.stringify(results));

        // Update state
        set({
          results,
          isLoading: false,
        });

        return true;
      } catch (error) {
        console.error("Error saving assessment result:", error);
        set({
          isLoading: false,
          error: error.message || "Failed to save assessment result",
        });
        return false;
      }
    },

    // Clear the selected result
    clearSelectedResult: () => {
      set({ selectedResult: null });
    },
  })
);

export default useAssessmentResultsStore;
