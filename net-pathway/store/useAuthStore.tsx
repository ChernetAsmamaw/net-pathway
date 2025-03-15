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
  setGoogleAuthData: (token: string, userData: any) => boolean; // Add this line

  // Profile methods
  updateProfile: (data: { username?: string; email?: string }) => Promise<void>;
  updateProfileImage: (imageData: string) => Promise<void>;
  deactivateAccount: () => Promise<boolean>;
  clearMessages: () => void;
}

// Helper function to get token from cookies
function getCookieToken() {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("token=")) {
      return cookie.substring(6);
    }
  }
  return null;
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
      const response = await axios.post(
        `${API_URL}/users/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.token) {
        // Store token in both localStorage and as a cookie
        localStorage.setItem("token", response.data.token);
        document.cookie = `token=${response.data.token}; path=/; max-age=2592000; SameSite=Lax`; // 30 days

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

  // Add this function inside the store definition
  setGoogleAuthData: (token: string, userData: any) => {
    // Store token
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; path=/; max-age=2592000; SameSite=Lax`;

    // Store user data
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }

    // Directly update auth state
    set({
      user: userData,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    return true;
  },

  checkAuthStatus: async () => {
    try {
      set({ isLoading: true, error: null });

      // Check for both token and userData
      const token = localStorage.getItem("token") || getCookie("token");
      const storedUserData = localStorage.getItem("userData");

      console.log(
        "Auth check - Token exists:",
        !!token,
        "Token start:",
        token?.substring(0, 5) || "none"
      );

      // Special handling for Google login - may not have traditional token but has user data
      if (!token && storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);

          // If we have valid user data from Google, try to fetch a new token or validate with backend
          const response = await fetch("/api/auth/validate-google-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userData }),
          });

          if (response.ok) {
            const data = await response.json();

            // Store the token we received
            if (data.token) {
              localStorage.setItem("token", data.token);
              setCookie("token", data.token, { expires: 7 });
            }

            // Update auth state with user data
            set({
              isAuthenticated: true,
              user: userData,
              isLoading: false,
            });

            return true;
          }
        } catch (error) {
          console.error("Failed to validate Google session:", error);
        }
      }

      // Continue with normal token validation if available
      if (token) {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          set({
            isAuthenticated: true,
            user: userData,
            isLoading: false,
          });

          // Update stored user data if needed
          localStorage.setItem("userData", JSON.stringify(userData));

          return true;
        } else {
          console.log("Token validation failed, clearing auth data");
          // Clear invalid token
          localStorage.removeItem("token");
          setCookie("token", "", { expires: -1 });

          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: "Session expired. Please login again.",
          });

          return false;
        }
      } else {
        console.log("Auth check - No token found in localStorage or cookies");
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: "Authentication check failed. Please try again.",
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
