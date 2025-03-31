// store/useAssessmentStore.tsx
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Define assessment data interfaces
interface Subject {
  name: string;
  percentage: number;
}

interface Activity {
  name: string;
  position: string;
  description: string;
}

interface AssessmentResponse {
  [key: number]: number;
}

interface AssessmentResults {
  riasec?: Record<string, number>;
  multiple_intelligence?: Record<string, number>;
}

interface AssessmentState {
  // Status trackers
  academicCompleted: boolean;
  extracurricularCompleted: boolean;
  behavioralCompleted: boolean;
  isLoading: boolean;
  error: string | null;

  // Assessment data
  academicData: { subjects: Subject[]; gpa: number } | null;
  extracurricularData: { activities: Activity[] } | null;
  behavioralData: {
    responses: AssessmentResponse;
    results: AssessmentResults;
  } | null;

  // Combined data
  combinedData: any | null;

  // Functions
  fetchAssessmentStatus: () => Promise<void>;

  saveAcademicData: (data: {
    subjects: Subject[];
    gpa: number;
  }) => Promise<boolean>;
  saveExtracurricularData: (data: {
    activities: Activity[];
  }) => Promise<boolean>;
  saveBehavioralData: (data: {
    responses: AssessmentResponse;
    results: AssessmentResults;
  }) => Promise<boolean>;

  fetchCombinedData: () => Promise<any>;

  resetAssessmentState: () => void;
  getAllCompleted: () => boolean;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  // Initial state
  academicCompleted: false,
  extracurricularCompleted: false,
  behavioralCompleted: false,
  isLoading: false,
  error: null,

  academicData: null,
  extracurricularData: null,
  behavioralData: null,
  combinedData: null,

  // Fetch assessment status from backend
  fetchAssessmentStatus: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get(`${API_URL}/assessment/status`, {
        withCredentials: true,
      });

      if (response.data.assessmentStatus) {
        const { transcript, extracurricular, behavioral } =
          response.data.assessmentStatus;

        set({
          academicCompleted: transcript || false,
          extracurricularCompleted: extracurricular || false,
          behavioralCompleted: behavioral || false,
          isLoading: false,
        });

        // If assessments are completed, fetch their data
        if (transcript) {
          // Additional logic to fetch academic data if needed
        }

        return response.data.assessmentStatus;
      }

      set({ isLoading: false });
      return { transcript: false, extracurricular: false, behavioral: false };
    } catch (error) {
      console.error("Error fetching assessment status:", error);
      set({ isLoading: false, error: "Failed to fetch assessment status" });
      return { transcript: false, extracurricular: false, behavioral: false };
    }
  },

  // Save academic transcript data
  saveAcademicData: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.post(
        `${API_URL}/assessment/academic-transcript`,
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        set({
          academicCompleted: true,
          academicData: data,
          isLoading: false,
        });
        return true;
      }

      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error("Error saving academic data:", error);
      set({ isLoading: false, error: "Failed to save academic data" });
      return false;
    }
  },

  // Save extracurricular data
  saveExtracurricularData: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.post(
        `${API_URL}/assessment/extracurricular`,
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        set({
          extracurricularCompleted: true,
          extracurricularData: data,
          isLoading: false,
        });
        return true;
      }

      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error("Error saving extracurricular data:", error);
      set({ isLoading: false, error: "Failed to save extracurricular data" });
      return false;
    }
  },

  // Save behavioral assessment data
  saveBehavioralData: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.post(
        `${API_URL}/assessment/behavioral`,
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        set({
          behavioralCompleted: true,
          behavioralData: data,
          isLoading: false,
        });
        return true;
      }

      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error("Error saving behavioral data:", error);
      set({ isLoading: false, error: "Failed to save behavioral data" });
      return false;
    }
  },

  // Fetch combined assessment data for path generation
  fetchCombinedData: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get(`${API_URL}/assessment/combined-data`, {
        withCredentials: true,
      });

      if (response.data) {
        set({
          combinedData: response.data,
          isLoading: false,
        });
        return response.data;
      }

      set({ isLoading: false });
      return null;
    } catch (error) {
      console.error("Error fetching combined data:", error);
      set({
        isLoading: false,
        error: "Failed to fetch combined assessment data",
      });
      return null;
    }
  },

  // Reset assessment state
  resetAssessmentState: () => {
    set({
      academicCompleted: false,
      extracurricularCompleted: false,
      behavioralCompleted: false,
      academicData: null,
      extracurricularData: null,
      behavioralData: null,
      combinedData: null,
      error: null,
    });
  },

  // Check if all assessments are completed
  getAllCompleted: () => {
    const { academicCompleted, extracurricularCompleted, behavioralCompleted } =
      get();
    return academicCompleted && extracurricularCompleted && behavioralCompleted;
  },
}));
