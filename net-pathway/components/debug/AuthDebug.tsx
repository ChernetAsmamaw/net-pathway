// Create a new file: components/debug/AuthDebug.tsx

"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthDebug() {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const checkAuth = () => {
    // Check local storage
    const token = localStorage.getItem("token");
    const userDataRaw = localStorage.getItem("userData");
    let userData = null;
    try {
      if (userDataRaw) {
        userData = JSON.parse(userDataRaw);
      }
    } catch (e) {
      console.error("Failed to parse userData", e);
    }

    // Check cookies
    const getCookieToken = () => {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("token=")) {
          return cookie.substring(6);
        }
      }
      return null;
    };

    // Get auth store state
    const storeState = useAuthStore.getState();

    setDebugInfo({
      localStorage: {
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 15)}...` : null,
        hasUserData: !!userData,
        userData: userData,
      },
      cookies: {
        hasToken: !!getCookieToken(),
        tokenPreview: getCookieToken()
          ? `${getCookieToken()!.substring(0, 15)}...`
          : null,
      },
      storeState: {
        isAuthenticated: storeState.isAuthenticated,
        isLoading: storeState.isLoading,
        hasUser: !!storeState.user,
        user: storeState.user,
        error: storeState.error,
      },
    });
  };

  const fixAuth = async () => {
    // Try to recover auth state from localStorage
    const userDataRaw = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    if (userDataRaw && token) {
      try {
        const userData = JSON.parse(userDataRaw);

        // Update auth store state
        useAuthStore.setState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Recheck auth state
        checkAuth();

        // Force reload if needed
        // window.location.reload();

        return true;
      } catch (e) {
        console.error("Failed to fix auth state", e);
        return false;
      }
    } else {
      console.warn("Cannot fix auth state - missing token or userData");
      return false;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-50"
        title="Debug Auth State"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Auth Debug</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={checkAuth}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Check Auth State
            </button>

            <button
              onClick={fixAuth}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Try to Fix Auth
            </button>

            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Reload Page
            </button>
          </div>

          {debugInfo && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
