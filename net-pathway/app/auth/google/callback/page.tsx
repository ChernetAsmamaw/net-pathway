"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setGoogleAuthData } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [processingStep, setProcessingStep] = useState("initializing");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setProcessingStep("getting parameters");
        // Get token from URL if present
        const token = searchParams.get("token");
        const userDataParam = searchParams.get("userData");

        setDebugInfo({
          hasToken: !!token,
          hasUserData: !!userDataParam,
          tokenStart: token ? token.substring(0, 20) + "..." : "none",
        });

        if (!token || !userDataParam) {
          throw new Error("Missing authentication data from server");
        }

        setProcessingStep("processing user data");
        try {
          const userData = JSON.parse(decodeURIComponent(userDataParam));

          // Use the dedicated method for Google auth
          setProcessingStep("setting auth state");
          const success = setGoogleAuthData(token, userData);

          setDebugInfo((prev) => ({
            ...prev,
            userData,
            authStateSet: success,
            tokenSaved: !!localStorage.getItem("token"),
          }));

          if (success) {
            // Show success message
            toast.success("Successfully signed in with Google!");

            // Add a small delay before redirecting
            setProcessingStep("preparing redirect");
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Redirect to dashboard
            setProcessingStep("redirecting");
            router.push("/dashboard");
          } else {
            throw new Error("Failed to set authentication state");
          }
        } catch (e) {
          console.error("Failed to process authentication data:", e);
          setDebugInfo((prev) => ({
            ...prev,
            processingError: e instanceof Error ? e.message : String(e),
          }));
          throw e;
        }
      } catch (error) {
        console.error("Google auth callback error:", error);
        setError(
          error instanceof Error ? error.message : "Authentication failed"
        );
        setDebugInfo((prev) => ({
          ...prev,
          errorDetails: error instanceof Error ? error.message : String(error),
          finalStoreState: useAuthStore.getState(),
        }));

        // Navigate back to login after displaying error
        setTimeout(() => {
          router.push("/auth/login");
        }, 5000);
      }
    };

    handleCallback();
  }, [router, searchParams, setGoogleAuthData]);

  // Function to check current authentication state
  const checkCurrentAuthState = () => {
    const state = useAuthStore.getState();
    const hasLocalToken = !!localStorage.getItem("token");

    // Check if cookie token exists
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

    const cookieToken = getCookieToken();

    setDebugInfo((prev) => ({
      ...prev,
      currentAuthState: {
        isAuthenticated: state.isAuthenticated,
        hasUser: !!state.user,
        username: state.user?.username || "none",
        hasLocalStorageToken: hasLocalToken,
        hasCookieToken: !!cookieToken,
      },
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50">
      <div className="text-center max-w-lg p-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-600 text-xl font-semibold mb-2">
              Authentication Error
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600 mb-6">
              Redirecting to login page in a few seconds...
            </p>

            <div className="text-left mt-4 bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-60">
              <p className="font-semibold mb-2">Debug Information:</p>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>

            <button
              onClick={checkCurrentAuthState}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
            >
              Check Auth State
            </button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 mb-2">Completing authentication...</p>
            <p className="text-gray-500 text-sm">
              Current step: {processingStep}
            </p>

            <div className="text-left mt-8 bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-60">
              <p className="font-semibold mb-2">Debug Information:</p>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>

            <button
              onClick={checkCurrentAuthState}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
            >
              Check Auth State
            </button>
          </>
        )}
      </div>
    </div>
  );
}
