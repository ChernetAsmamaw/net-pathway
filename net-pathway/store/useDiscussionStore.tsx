// net-pathway/store/useDiscussionStore.tsx
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Define discussion types
export interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Discussion {
  _id: string;
  title: string;
  description: string;
  creator: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  participants: Array<{
    _id: string;
    username: string;
    profilePicture?: string;
  }>;
  messages?: Message[];
  tags: string[];
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  tag: string;
  count: number;
}

interface DiscussionState {
  discussions: Discussion[];
  currentDiscussion: Discussion | null;
  popularTags: Tag[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDiscussions: number;
  };
  filters: {
    search: string;
    tag: string;
    sort: "latest" | "oldest" | "activity" | "popular";
  };

  // CRUD operations
  fetchDiscussions: () => Promise<void>;
  fetchDiscussionById: (id: string) => Promise<void>;
  createDiscussion: (data: {
    title: string;
    description: string;
    tags: string[];
  }) => Promise<boolean>;
  updateDiscussion: (
    id: string,
    data: {
      title?: string;
      description?: string;
      tags?: string[];
    }
  ) => Promise<boolean>;
  deleteDiscussion: (id: string) => Promise<boolean>;

  // Message operations
  sendMessage: (
    discussionId: string,
    content: string
  ) => Promise<Message | null>;
  deleteMessage: (discussionId: string, messageId: string) => Promise<boolean>;

  // Tag operations
  fetchPopularTags: () => Promise<void>;

  // User discussions
  fetchUserDiscussions: () => Promise<void>;

  // UI state
  setCurrentPage: (page: number) => void;
  setFilters: (filters: Partial<DiscussionState["filters"]>) => void;
  clearCurrentDiscussion: () => void;
}

export const useDiscussionStore = create<DiscussionState>((set, get) => ({
  discussions: [],
  currentDiscussion: null,
  popularTags: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalDiscussions: 0,
  },
  filters: {
    search: "",
    tag: "",
    sort: "latest",
  },

  // Fetch all discussions with current filters and pagination
  fetchDiscussions: async () => {
    const { currentPage } = get().pagination;
    const { search, tag, sort } = get().filters;

    try {
      set({ isLoading: true, error: null });

      let queryParams = `page=${currentPage}`;
      if (search) queryParams += `&search=${encodeURIComponent(search)}`;
      if (tag) queryParams += `&tag=${encodeURIComponent(tag)}`;
      if (sort) queryParams += `&sort=${sort}`;

      const response = await axios.get(
        `${API_URL}/discussions?${queryParams}`,
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        set({
          discussions: response.data.discussions,
          pagination: {
            currentPage,
            totalPages: response.data.pagination.pages || 1,
            totalDiscussions: response.data.pagination.total || 0,
          },
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch discussions:", error);
      set({
        error: error.response?.data?.message || "Failed to load discussions",
      });
      toast.error("Failed to load discussions");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch a specific discussion by ID
  fetchDiscussionById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get(`${API_URL}/discussions/${id}`, {
        withCredentials: true,
      });

      if (response.data.discussion) {
        set({ currentDiscussion: response.data.discussion });
      }
    } catch (error: any) {
      console.error(`Failed to fetch discussion with ID ${id}:`, error);
      set({
        error: error.response?.data?.message || "Failed to load discussion",
      });
      toast.error("Failed to load discussion");
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new discussion
  createDiscussion: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.post(`${API_URL}/discussions`, data, {
        withCredentials: true,
      });

      if (response.data.discussion) {
        // Update the discussions list with the new discussion
        const discussions = [response.data.discussion, ...get().discussions];
        set({ discussions });
        toast.success("Discussion created successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Failed to create discussion:", error);
      set({
        error: error.response?.data?.message || "Failed to create discussion",
      });
      toast.error(
        error.response?.data?.message || "Failed to create discussion"
      );
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update an existing discussion
  updateDiscussion: async (id, data) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.put(`${API_URL}/discussions/${id}`, data, {
        withCredentials: true,
      });

      if (response.data.discussion) {
        // Update the discussion in state if it exists in the list
        const discussions = get().discussions.map((disc) =>
          disc._id === id ? response.data.discussion : disc
        );

        // Update currentDiscussion if it matches the updated one
        const currentDiscussion = get().currentDiscussion;
        if (currentDiscussion && currentDiscussion._id === id) {
          set({ currentDiscussion: response.data.discussion });
        }

        set({ discussions });
        toast.success("Discussion updated successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Failed to update discussion:", error);
      set({
        error: error.response?.data?.message || "Failed to update discussion",
      });
      toast.error(
        error.response?.data?.message || "Failed to update discussion"
      );
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete a discussion
  deleteDiscussion: async (id) => {
    try {
      set({ isLoading: true, error: null });

      await axios.delete(`${API_URL}/discussions/${id}`, {
        withCredentials: true,
      });

      // Remove the discussion from state
      const discussions = get().discussions.filter((disc) => disc._id !== id);
      set({ discussions });

      // Clear currentDiscussion if it matches the deleted one
      const currentDiscussion = get().currentDiscussion;
      if (currentDiscussion && currentDiscussion._id === id) {
        set({ currentDiscussion: null });
      }

      toast.success("Discussion deleted successfully");
      return true;
    } catch (error: any) {
      console.error("Failed to delete discussion:", error);
      set({
        error: error.response?.data?.message || "Failed to delete discussion",
      });
      toast.error(
        error.response?.data?.message || "Failed to delete discussion"
      );
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Send a message to a discussion
  sendMessage: async (discussionId, content) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.post(
        `${API_URL}/discussions/${discussionId}/messages`,
        { content },
        { withCredentials: true }
      );

      if (response.data.discussionMessage) {
        // Update the current discussion with the new message
        const currentDiscussion = get().currentDiscussion;
        if (currentDiscussion && currentDiscussion._id === discussionId) {
          const messages = [
            ...(currentDiscussion.messages || []),
            response.data.discussionMessage,
          ];
          set({
            currentDiscussion: { ...currentDiscussion, messages },
          });
        }
        return response.data.discussionMessage;
      }
      return null;
    } catch (error: any) {
      console.error("Failed to send message:", error);
      set({
        error: error.response?.data?.message || "Failed to send message",
      });
      toast.error("Failed to send message");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete a message from a discussion
  deleteMessage: async (discussionId, messageId) => {
    try {
      set({ isLoading: true, error: null });

      await axios.delete(
        `${API_URL}/discussions/${discussionId}/messages/${messageId}`,
        { withCredentials: true }
      );

      // Update the current discussion by removing the deleted message
      const currentDiscussion = get().currentDiscussion;
      if (
        currentDiscussion &&
        currentDiscussion._id === discussionId &&
        currentDiscussion.messages
      ) {
        const messages = currentDiscussion.messages.filter(
          (msg) => msg._id !== messageId
        );
        set({
          currentDiscussion: { ...currentDiscussion, messages },
        });
      }

      toast.success("Message deleted");
      return true;
    } catch (error: any) {
      console.error("Failed to delete message:", error);
      set({
        error: error.response?.data?.message || "Failed to delete message",
      });
      toast.error("Failed to delete message");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch popular tags
  fetchPopularTags: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get(`${API_URL}/discussions/tags`, {
        withCredentials: true,
      });

      if (response.data.tags) {
        set({ popularTags: response.data.tags });
      }
    } catch (error: any) {
      console.error("Failed to fetch tags:", error);
      set({
        error: error.response?.data?.message || "Failed to load tags",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch discussions where the user is a participant
  fetchUserDiscussions: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get(`${API_URL}/discussions/user`, {
        withCredentials: true,
      });

      if (response.data.discussions) {
        set({
          discussions: response.data.discussions,
          pagination: {
            currentPage: 1,
            totalPages: response.data.pagination.pages || 1,
            totalDiscussions: response.data.pagination.total || 0,
          },
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch user discussions:", error);
      set({
        error:
          error.response?.data?.message || "Failed to load your discussions",
      });
      toast.error("Failed to load your discussions");
    } finally {
      set({ isLoading: false });
    }
  },

  // Set current page for pagination
  setCurrentPage: (page) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        currentPage: page,
      },
    }));
  },

  // Set filters for discussions
  setFilters: (filters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
      pagination: {
        ...state.pagination,
        currentPage: 1, // Reset to page 1 when filters change
      },
    }));
  },

  // Clear the current discussion
  clearCurrentDiscussion: () => {
    set({ currentDiscussion: null });
  },
}));
