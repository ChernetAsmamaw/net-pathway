// store/useAuthStore.tsx with profile image support
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Set default axios config
axios.defaults.withCredentials = true;

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  profilePicture?: string;
  isEmailVerified: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  authChecked: boolean;

  // Auth methods
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; isAdmin?: boolean; error?: any }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setGoogleAuthData: (token: string, userData: User) => boolean;

  // Profile methods
  updateProfile: (data: {
    username?: string;
    email?: string;
  }) => Promise<boolean>;
  uploadProfileImage: (file: File) => Promise<string | null>;
  uploadProfileImageBase64: (base64Image: string) => Promise<string | null>;
  deleteProfileImage: () => Promise<boolean>;

  // Email verification methods
  sendVerificationEmail: () => Promise<boolean>;
  refreshUserData: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  authChecked: false,

  sendVerificationEmail: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.post(
        `${API_URL}/verification/send`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Verification email sent successfully!");
        set({ isLoading: false });
        return true;
      }

      set({ isLoading: false });
      return false;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to send verification email";
      set({
        isLoading: false,
        error: message,
      });
      toast.error(message);
      return false;
    }
  },

  refreshUserData: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        withCredentials: true,
      });

      if (response.data.user) {
        const userData = response.data.user;
        // Update local storage and state with the fresh user data
        localStorage.setItem("user", JSON.stringify(userData));
        set({
          user: userData,
          isAuthenticated: true,
          error: null,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return false;
    }
  },

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
          authChecked: true,
        });
        return true;
      }

      set({ isLoading: false });
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
          authChecked: true,
        });

        // Show verification notification if not auto-verified (like for admins)
        if (!response.data.user.isEmailVerified) {
          // Send verification email automatically after registration
          try {
            await axios.post(
              `${API_URL}/verification/send`,
              {},
              {
                withCredentials: true,
              }
            );
            toast.success(
              "Verification email sent! Please check your inbox to verify your account."
            );
          } catch (verificationError) {
            console.error(
              "Failed to send initial verification email:",
              verificationError
            );
            toast.info("Please verify your email through your profile page.");
          }
        }

        return {
          success: true,
          isAdmin: response.data.user.role === "admin",
        };
      }

      set({ isLoading: false });
      return { success: false };
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      set({
        isLoading: false,
        error: message,
        isAuthenticated: false,
      });
      return {
        success: false,
        error: message,
      };
    }
  },

  // Google Auth Data Setter
  setGoogleAuthData: (token: string, userData: User) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));

      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        authChecked: true,
      });

      return true;
    } catch (error) {
      console.error("Failed to set Google auth data:", error);
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
    const currentState = get();

    // If we're already authenticated and have a user, no need to recheck
    if (
      currentState.authChecked &&
      currentState.isAuthenticated &&
      currentState.user
    ) {
      return true;
    }

    // Don't run multiple checks simultaneously
    if (currentState.isLoading) {
      return currentState.isAuthenticated;
    }

    set({ isLoading: true });

    try {
      // First try to use stored user data for immediate UI
      let foundUserLocally = false;
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData && userData.id) {
            set({
              user: userData,
              isAuthenticated: true,
            });
            foundUserLocally = true;
          }
        } catch (e) {
          console.error("Error parsing stored user data:", e);
          localStorage.removeItem("user");
        }
      }

      // Then validate with the server
      let serverValidationSuccessful = false;
      try {
        const response = await axios.get(`${API_URL}/users/profile`);

        if (response.data.user) {
          const serverUser = response.data.user;

          // Check if user data has changed, including verification status
          const needsUpdate =
            !currentState.user ||
            currentState.user.id !== serverUser.id ||
            currentState.user.role !== serverUser.role ||
            currentState.user.isEmailVerified !== serverUser.isEmailVerified ||
            currentState.user.profilePicture !== serverUser.profilePicture;

          if (needsUpdate) {
            localStorage.setItem("user", JSON.stringify(serverUser));
            set({
              user: serverUser,
              isAuthenticated: true,
            });
          }

          serverValidationSuccessful = true;
        }
      } catch (error) {
        console.error("Server validation failed:", error);
        // If server validation fails but we have local data, we'll still consider the user authenticated
        // This prevents flickering during temporary network issues
      }

      // Final auth state determination
      if (serverValidationSuccessful) {
        // Server validation succeeded - user is authenticated
        set({
          isLoading: false,
          authChecked: true,
        });
        return true;
      } else if (foundUserLocally) {
        // Server validation failed but we have local data - assume user is still authenticated
        // but mark that there was an error
        set({
          isLoading: false,
          authChecked: true,
          error: "Could not validate session with server",
        });
        return true;
      } else {
        // Neither server validation nor local data - user is not authenticated
        localStorage.removeItem("user");
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          authChecked: true,
        });
        return false;
      }
    } catch (error) {
      console.error("Authentication check error:", error);
      localStorage.removeItem("user");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        authChecked: true,
        error: "Authentication check failed",
      });
      return false;
    }
  },

  // Update Profile
  updateProfile: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.put(`${API_URL}/users/profile`, data, {
        withCredentials: true,
      });

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

  // Upload profile image using File object
  uploadProfileImage: async (file: File) => {
    try {
      set({ isLoading: true, error: null });

      // Create form data
      const formData = new FormData();
      formData.append("image", file);

      // Upload image
      const response = await axios.post(
        `${API_URL}/profile/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.imageUrl) {
        // Refresh user data to get updated profile image
        await get().refreshUserData();

        set({ isLoading: false });
        return response.data.imageUrl;
      }

      set({ isLoading: false });
      return null;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to upload profile image";
      set({
        isLoading: false,
        error: message,
      });
      return null;
    }
  },

  // Upload profile image using base64 string
  uploadProfileImageBase64: async (base64Image: string) => {
    try {
      set({ isLoading: true, error: null });

      // Upload image
      const response = await axios.post(
        `${API_URL}/profile/image/upload`,
        { image: base64Image },
        { withCredentials: true }
      );

      if (response.data.imageUrl) {
        // Refresh user data to get updated profile image
        await get().refreshUserData();

        set({ isLoading: false });
        return response.data.imageUrl;
      }

      set({ isLoading: false });
      return null;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to upload profile image";
      set({
        isLoading: false,
        error: message,
      });
      return null;
    }
  },

  // Delete profile image
  deleteProfileImage: async () => {
    try {
      set({ isLoading: true, error: null });

      await axios.delete(`${API_URL}/profile/image`, {
        withCredentials: true,
      });

      // Refresh user data to update profile image
      await get().refreshUserData();

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete profile image";
      set({
        isLoading: false,
        error: message,
      });
      return false;
    }
  },
}));
