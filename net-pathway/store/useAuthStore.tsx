import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isSubmitting: boolean;
  successMessage: string | null;

  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
  logout: () => Promise<boolean>;

  // Profile methods
  updateProfile: (data: { username?: string; email?: string }) => Promise<void>;
  updateProfileImage: (imageData: string) => Promise<void>;
  deactivateAccount: () => Promise<boolean>;
  clearMessages: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isSubmitting: false,
  successMessage: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        document.cookie = `token=${response.data.token}; path=/`;

        // Store user data in localStorage as fallback
        if (response.data.user) {
          localStorage.setItem("userData", JSON.stringify(response.data.user));
        }
      }

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Login error:", error);
      set({
        isLoading: false,
        error: "Login failed. Please check your credentials.",
        isAuthenticated: false,
      });
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        username,
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        document.cookie = `token=${response.data.token}; path=/`;

        // Store user data in localStorage as fallback
        if (response.data.user) {
          localStorage.setItem("userData", JSON.stringify(response.data.user));
        }
      }

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Registration error:", error);
      set({
        isLoading: false,
        error: "Registration failed. Please try again.",
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async (): Promise<boolean> => {
    set({ isLoading: true });
    try {
      // Clear token from localStorage first
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Optional: Call logout endpoint if needed
      try {
        await axios.post(`${API_URL}/users/logout`);
      } catch (error) {
        console.log("Logout endpoint error (continuing anyway):", error);
      }

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      set({ isLoading: false });
      return false;
    }
  },

  checkAuthStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ isAuthenticated: false, isLoading: false, user: null });
        return false;
      }

      try {
        // Updated endpoint and handling of nested user object
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data || !response.data.user) {
          throw new Error("Invalid response format");
        }

        set({
          user: {
            id: response.data.user._id,
            username: response.data.user.username,
            email: response.data.user.email,
            role: response.data.user.role,
            profileImage: response.data.user.profileImage || null,
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } catch (error) {
        console.error("API error:", error);

        // If the /profile endpoint isn't working, but we still have token data
        // Continue with limited user data from login response stored in localStorage
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } catch (e) {
            console.error("Error parsing stored user data:", e);
          }
        }

        // If we can't get user data and the API call failed, we should consider
        // the user as not authenticated
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Authentication failed. Please log in again.",
        });
        return false;
      }
    } catch (error) {
      // Token invalid or expired
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired",
      });
      return false;
    }
  },

  // Profile methods
  updateProfile: async (data) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/users/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.user) {
        // Update stored user data
        localStorage.setItem("userData", JSON.stringify(response.data.user));

        set({
          user: {
            ...get().user!,
            ...data,
          },
          isSubmitting: false,
          successMessage: "Profile updated successfully",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      set({
        isSubmitting: false,
        error: "Failed to update profile. Please try again.",
      });
    }
  },

  updateProfileImage: async (imageData) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      const token = localStorage.getItem("token");

      // Assuming backend has an endpoint for profile image updates
      // You may need to adjust this based on your actual API
      const response = await axios.put(
        `${API_URL}/users/profile-image`,
        { profileImage: imageData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update stored user data with new image
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        userData.profileImage = imageData;
        localStorage.setItem("userData", JSON.stringify(userData));

        set({
          user: {
            ...get().user!,
            profileImage: imageData,
          },
          isSubmitting: false,
          successMessage: "Profile image updated successfully",
        });
      }
    } catch (error) {
      console.error("Profile image update error:", error);
      set({
        isSubmitting: false,
        error: "Failed to update profile image. Please try again.",
      });
    }
  },

  deactivateAccount: async () => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/users/account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear user data
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      set({
        user: null,
        isAuthenticated: false,
        isSubmitting: false,
        successMessage: "Account deactivated successfully",
      });

      return true;
    } catch (error) {
      console.error("Account deactivation error:", error);
      set({
        isSubmitting: false,
        error: "Failed to deactivate account. Please try again.",
      });
      return false;
    }
  },

  clearMessages: () => {
    set({ error: null, successMessage: null });
  },
}));
