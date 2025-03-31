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
    image: string;
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
    image: string;
    matchPercentage: number;
    requirements: string[];
    universities: University[];
    aiRecommendation?: string;
  };
}

// Mock university data for demo
export const mockUniversityData = {
  id: 1,
  name: "Adama Science and Technology Institute",
  location: "Adama, Ethiopia",
  logo: "/placeholder-logo.png",
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
      ],
    },
  ],
};

// Mock data for sample paths
export const mockPaths = {
  engineering: {
    id: "engineering",
    title: "Engineering",
    description: "Explore various engineering disciplines and opportunities",
    image: "/ph-2.jpg",
    matchPercentage: 92,
    requirements: [
      "High school diploma or equivalent",
      "Minimum GPA of 3.0 in science subjects",
      "Entrance examination qualification",
      "English language proficiency",
    ],
    universities: [mockUniversityData],
    aiRecommendation:
      "Based on your strong performance in Mathematics and Physics, combined with your analytical problem-solving abilities shown in your behavioral assessment, Engineering is an excellent match for you. Your extracurricular activities in robotics and coding clubs further demonstrate your aptitude for technical disciplines.",
  },
  business: {
    id: "business",
    title: "Business Administration",
    description: "Explore business management and entrepreneurship paths",
    image: "/ph-2.jpg",
    matchPercentage: 78,
    requirements: [
      "High school diploma or equivalent",
      "Minimum GPA of 2.8",
      "Basic mathematics proficiency",
      "English language proficiency",
    ],
    universities: [
      {
        id: 4,
        name: "Addis Ababa University",
        location: "Addis Ababa, Ethiopia",
        logo: "/placeholder-logo.png",
        description:
          "Ethiopia's oldest and most prestigious higher education institution.",
        admissionDeadline: "June 1, 2025",
        programs: [
          {
            id: 5,
            name: "Bachelor of Business Administration",
            duration: "4 years",
            studyMode: "Full-time",
            tuitionFee: "38,000 ETB per year",
            description:
              "Core business fundamentals with specializations in marketing, finance, or management.",
            highlights: [
              "Business incubation center",
              "Industry partnerships",
              "Internship placements",
            ],
          },
        ],
      },
    ],
    aiRecommendation:
      "Your strong communication skills and leadership abilities, demonstrated in both your extracurricular activities and behavioral assessment, align well with Business Administration. Your participation in student government and entrepreneurship clubs indicates a natural inclination toward management roles and business development.",
  },
};

// Primary assessment results store
interface AssessmentResultsState {
  results: AssessmentResult[];
  selectedResult: ExtendedAssessmentResult | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAssessmentResults: () => Promise<AssessmentResult[]>;
  getAssessmentResult: (id: string) => Promise<ExtendedAssessmentResult | null>;
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
        // For now, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

        // Mock response data
        const results: AssessmentResult[] = [
          {
            id: "assessment-1",
            title: "Career Assessment - March 2025",
            description:
              "Software Engineering & Computer Science focused assessment",
            matchPercentage: 92,
            date: "March 15, 2025",
            status: "completed",
            result: {
              topPaths: [
                "Software Engineering",
                "Computer Science",
                "Data Science",
              ],
              strengthAreas: [
                "Mathematics",
                "Logical Reasoning",
                "Problem Solving",
              ],
              recommendations: [
                "Consider internships in tech",
                "Join coding clubs",
              ],
            },
            path: mockPaths.engineering,
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
              strengthAreas: [
                "Communication",
                "Creative Thinking",
                "Leadership",
              ],
              recommendations: [
                "Explore business courses",
                "Join public speaking clubs",
              ],
            },
            path: mockPaths.business,
          },
        ];

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
          // In a real implementation, this would be an API call
          // For now, simulate an API call with a delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Use mock data based on ID
          if (id === "assessment-1" || id === "engineering") {
            result = {
              id: "assessment-1",
              title: "Career Assessment - March 2025",
              description:
                "Software Engineering & Computer Science focused assessment",
              matchPercentage: 92,
              date: "March 15, 2025",
              status: "completed",
              result: {
                topPaths: [
                  "Software Engineering",
                  "Computer Science",
                  "Data Science",
                ],
                strengthAreas: [
                  "Mathematics",
                  "Logical Reasoning",
                  "Problem Solving",
                ],
                recommendations: [
                  "Consider internships in tech",
                  "Join coding clubs",
                ],
              },
              path: mockPaths.engineering,
            };
          } else if (id === "assessment-2" || id === "business") {
            result = {
              id: "assessment-2",
              title: "Career Assessment - January 2025",
              description: "General assessment with multiple career paths",
              matchPercentage: 78,
              date: "January 10, 2025",
              status: "completed",
              result: {
                topPaths: [
                  "Business Administration",
                  "Marketing",
                  "Psychology",
                ],
                strengthAreas: [
                  "Communication",
                  "Creative Thinking",
                  "Leadership",
                ],
                recommendations: [
                  "Explore business courses",
                  "Join public speaking clubs",
                ],
              },
              path: mockPaths.business,
            };
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

    // Clear the selected result
    clearSelectedResult: () => {
      set({ selectedResult: null });
    },
  })
);

export default useAssessmentResultsStore;
