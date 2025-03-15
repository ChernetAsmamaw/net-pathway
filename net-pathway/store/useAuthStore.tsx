import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Set default axios config
axios.defaults.withCredentials = true;

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  profilePicture?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Auth methods
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;

  // Profile methods
  updateProfile: (data: {
    username?: string;
    email?: string;
  }) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  // Email/Password Login
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }

      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      set({
        isLoading: false,
        error: message,
        isAuthenticated: false,
      });
      return false;
    }
  },

  // Registration
  register: async (username: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.post(`${API_URL}/users/register`, {
        username,
        email,
        password,
      });

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }

      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      set({
        isLoading: false,
        error: message,
        isAuthenticated: false,
      });
      return false;
    }
  },

  // Logout
  logout: async () => {
    try {
      await axios.post(`${API_URL}/users/logout`);
    } catch (error) {
      console.log("Logout API error - continuing anyway");
    }

    // Always clear local state regardless of API response
    localStorage.removeItem("user");
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  // Check Authentication Status
  checkAuth: async () => {
    try {
      set({ isLoading: true });

      // First try to use stored user data for immediate UI rendering
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        set({
          user: JSON.parse(storedUser),
          isAuthenticated: true,
          isLoading: false,
        });
      }

      // Then validate with the server
      const response = await axios.get(`${API_URL}/users/profile`);

      if (response.data.user) {
        // Update with fresh data from server
        localStorage.setItem("user", JSON.stringify(response.data.user));
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      } else {
        // Clear auth if server doesn't recognize user
        localStorage.removeItem("user");
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      // On error, clear auth
      localStorage.removeItem("user");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Authentication failed",
      });
      return false;
    }
  },

  // Update Profile
  updateProfile: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.put(`${API_URL}/users/profile`, data);

      if (response.data.user) {
        // Update stored user
        const updatedUser = response.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));

        set({
          user: updatedUser,
          isLoading: false,
        });
        return true;
      }

      set({ isLoading: false });
      return false;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Profile update failed",
      });
      return false;
    }
  },
}));
