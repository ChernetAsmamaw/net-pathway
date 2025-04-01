import { create } from "zustand";
import axios from "axios";

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

  careerPaths: null,
  isGeneratingPaths: false,

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

        return response.data.assessmentStatus;
      }

      set({ isLoading: false });
      return { transcript: false, extracurricular: false, behavioral: false };
    } catch (error: any) {
      console.error("Error fetching assessment status:", error);
      set({
        isLoading: false,
        error: "Failed to fetch assessment status",
      });
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
        { withCredentials: true }
      );

      if (response.status === 200) {
        set({
          academicCompleted: true,
          academicData: data,
          isLoading: false,
        });
        toast.success("Academic transcript saved successfully");
        return true;
      }

      set({ isLoading: false });
      return false;
    } catch (error: any) {
      console.error("Error saving academic data:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to save academic data",
      });
      toast.error(
        error.response?.data?.message || "Failed to save academic data"
      );
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
        { withCredentials: true }
      );

      if (response.status === 200) {
        set({
          extracurricularCompleted: true,
          extracurricularData: data,
          isLoading: false,
        });
        toast.success("Extracurricular activities saved successfully");
        return true;
      }

      set({ isLoading: false });
      return false;
    } catch (error: any) {
      console.error("Error saving extracurricular data:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          "Failed to save extracurricular data",
      });
      toast.error(
        error.response?.data?.message || "Failed to save extracurricular data"
      );
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
        { withCredentials: true }
      );

      if (response.status === 200) {
        set({
          behavioralCompleted: true,
          behavioralData: data,
          isLoading: false,
        });
        toast.success("Behavioral assessment saved successfully");
        return true;
      }

      set({ isLoading: false });
      return false;
    } catch (error: any) {
      console.error("Error saving behavioral data:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Failed to save behavioral data",
      });
      toast.error(
        error.response?.data?.message || "Failed to save behavioral data"
      );
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
        set({ isLoading: false });
        return response.data;
      }

      set({ isLoading: false });
      return null;
    } catch (error: any) {
      console.error("Error fetching combined data:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          "Failed to fetch combined assessment data",
      });

      // If error is about incomplete assessments, show appropriate message
      if (error.response?.status === 400) {
        toast.error("All assessment sections must be completed first");
      } else {
        toast.error("Failed to fetch assessment data");
      }

      return null;
    }
  },

  // Generate career paths based on assessment data
  generateCareerPaths: async () => {
    try {
      set({ isGeneratingPaths: true, error: null });

      const response = await axios.get(`${API_URL}/assessment/generate-paths`, {
        withCredentials: true,
      });

      if (response.data && response.data.paths) {
        const paths = response.data.paths;
        set({
          careerPaths: paths,
          isGeneratingPaths: false,
        });
        return paths;
      }

      set({ isGeneratingPaths: false });
      return null;
    } catch (error: any) {
      console.error("Error generating career paths:", error);
      set({
        isGeneratingPaths: false,
        error:
          error.response?.data?.message || "Failed to generate career paths",
      });

      toast.error(
        error.response?.data?.message || "Failed to generate career paths"
      );
      return null;
    }
  },

  // Check if all assessments are completed
  getAllCompleted: () => {
    const { academicCompleted, extracurricularCompleted, behavioralCompleted } =
      get();
    return academicCompleted && extracurricularCompleted && behavioralCompleted;
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
      careerPaths: null,
      error: null,
    });
  },
}));

export default useAssessmentStore;
