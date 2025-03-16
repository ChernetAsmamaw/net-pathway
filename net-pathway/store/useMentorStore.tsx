// store/useMentorStore.ts
import { create } from "zustand";
import axios from "axios";

// Define interfaces for better type safety
interface MentorUser {
  _id: string;
  username: string;
  email?: string;
  profilePicture?: string | null;
  isEmailVerified?: boolean;
}

export interface Mentor {
  _id?: string;
  title: string;
  company: string;
  location: string;
  bio: string;
  expertise: string[]; // Array of strings
  experience: string;
  education: string;
  languages: string[]; // Array of strings
  achievements: string[]; // Array of strings
  availability: "available" | "limited" | "unavailable";
  rating?: number;
  isActive?: boolean;
  user?: MentorUser | string;
  userId?: string;
}

interface MentorState {
  mentors: Mentor[];
  currentMentor: Mentor | null;
  isLoading: boolean;
  error: string | null;

  // CRUD operations
  fetchMentors: () => Promise<void>;
  fetchMentorById: (id: string) => Promise<void>;
  createMentor: (mentorData: Mentor) => Promise<boolean>;
  updateMentor: (id: string, mentorData: Mentor) => Promise<boolean>;
  deleteMentor: (id: string) => Promise<boolean>;

  // Helper for UI
  clearCurrentMentor: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useMentorStore = create<MentorState>((set, get) => ({
  mentors: [],
  currentMentor: null,
  isLoading: false,
  error: null,

  // Fetch all mentors
  fetchMentors: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get(`${API_URL}/mentors`, {
        withCredentials: true,
      });

      if (response.data && response.data.mentors) {
        // Process mentors to ensure arrays are properly initialized
        const processedMentors = response.data.mentors.map(
          (mentor: Mentor) => ({
            ...mentor,
            // Ensure these are arrays, even if they come back as null or undefined
            expertise: Array.isArray(mentor.expertise) ? mentor.expertise : [],
            languages: Array.isArray(mentor.languages) ? mentor.languages : [],
            achievements: Array.isArray(mentor.achievements)
              ? mentor.achievements
              : [],
          })
        );

        set({ mentors: processedMentors });
      }
    } catch (error: any) {
      console.error("Error fetching mentors:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch mentors",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch a specific mentor by ID
  fetchMentorById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get(`${API_URL}/mentors/${id}`, {
        withCredentials: true,
      });

      if (response.data && response.data.mentor) {
        // Process mentor to ensure arrays are properly initialized
        const processedMentor = {
          ...response.data.mentor,
          expertise: Array.isArray(response.data.mentor.expertise)
            ? response.data.mentor.expertise
            : [],
          languages: Array.isArray(response.data.mentor.languages)
            ? response.data.mentor.languages
            : [],
          achievements: Array.isArray(response.data.mentor.achievements)
            ? response.data.mentor.achievements
            : [],
        };

        set({ currentMentor: processedMentor });
      }
    } catch (error: any) {
      console.error(`Error fetching mentor with ID ${id}:`, error);
      set({
        error: error.response?.data?.message || "Failed to fetch mentor",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new mentor
  createMentor: async (mentorData: Mentor) => {
    try {
      set({ isLoading: true, error: null });

      // Prepare the data - ensure arrays are properly handled
      const preparedData = {
        ...mentorData,
        expertise: Array.isArray(mentorData.expertise)
          ? mentorData.expertise
          : [],
        languages: Array.isArray(mentorData.languages)
          ? mentorData.languages
          : [],
        achievements: Array.isArray(mentorData.achievements)
          ? mentorData.achievements
          : [],
      };

      const response = await axios.post(`${API_URL}/mentors`, preparedData, {
        withCredentials: true,
      });

      if (response.data && response.data.mentor) {
        // Update the mentors list by adding the new mentor
        const updatedMentors = [...get().mentors, response.data.mentor];
        set({ mentors: updatedMentors, currentMentor: response.data.mentor });
        return true;
      }

      return false;
    } catch (error: any) {
      console.error("Error creating mentor:", error);
      set({
        error: error.response?.data?.message || "Failed to create mentor",
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update an existing mentor
  updateMentor: async (id: string, mentorData: Mentor) => {
    try {
      set({ isLoading: true, error: null });

      // Prepare the data - ensure arrays are properly handled
      const preparedData = {
        ...mentorData,
        expertise: Array.isArray(mentorData.expertise)
          ? mentorData.expertise
          : [],
        languages: Array.isArray(mentorData.languages)
          ? mentorData.languages
          : [],
        achievements: Array.isArray(mentorData.achievements)
          ? mentorData.achievements
          : [],
      };

      const response = await axios.put(
        `${API_URL}/mentors/${id}`,
        preparedData,
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.mentor) {
        // Update the mentors list and current mentor
        const updatedMentors = get().mentors.map((mentor) =>
          mentor._id === id ? response.data.mentor : mentor
        );

        set({
          mentors: updatedMentors,
          currentMentor: response.data.mentor,
        });

        return true;
      }

      return false;
    } catch (error: any) {
      console.error(`Error updating mentor with ID ${id}:`, error);
      set({
        error: error.response?.data?.message || "Failed to update mentor",
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete a mentor
  deleteMentor: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      await axios.delete(`${API_URL}/mentors/${id}`, {
        withCredentials: true,
      });

      // Remove the mentor from the list
      const updatedMentors = get().mentors.filter(
        (mentor) => mentor._id !== id
      );
      set({
        mentors: updatedMentors,
        currentMentor:
          get().currentMentor?._id === id ? null : get().currentMentor,
      });

      return true;
    } catch (error: any) {
      console.error(`Error deleting mentor with ID ${id}:`, error);
      set({
        error: error.response?.data?.message || "Failed to delete mentor",
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear the current mentor (for UI state management)
  clearCurrentMentor: () => {
    set({ currentMentor: null });
  },
}));

export default useMentorStore;
