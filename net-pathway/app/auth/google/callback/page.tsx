// Update /app/auth/google/callback/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuthStatus } = useAuthStore();
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

        if (!token) {
          throw new Error("No token received from authentication server");
        }

        setProcessingStep("storing token");
        // Store the token in both localStorage and cookies
        localStorage.setItem("token", token);

        // Set cookie with proper attributes
        document.cookie = `token=${token}; path=/; max-age=2592000; SameSite=Lax`;

        // If we have user data in URL params, use it directly
        if (userDataParam) {
          setProcessingStep("processing user data");
          try {
            const userData = JSON.parse(decodeURIComponent(userDataParam));
            localStorage.setItem("userData", JSON.stringify(userData));

            // Directly update the store state
            setProcessingStep("setting auth state");
            useAuthStore.setState({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            setDebugInfo((prev) => ({
              ...prev,
              userData,
              authStateSet: true,
              tokenSaved: !!localStorage.getItem("token"),
            }));

            // Show success and redirect
            toast.success("Successfully signed in with Google!");

            // Add a small delay to allow state to update
            setProcessingStep("preparing redirect");
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Force a check for auth status to verify our setup
            setProcessingStep("verifying auth state");
            const authCheck = await checkAuthStatus();

            setDebugInfo((prev) => ({
              ...prev,
              authStateCheck: authCheck,
              storeState: useAuthStore.getState(),
            }));

            // Redirect to dashboard with a short delay
            setProcessingStep("redirecting");
            setTimeout(() => {
              router.push("/dashboard");
            }, 500);

            return;
          } catch (e) {
            console.error("Failed to parse user data:", e);
            setDebugInfo((prev) => ({
              ...prev,
              userDataParseError: e instanceof Error ? e.message : String(e),
            }));
            // Continue to checkAuthStatus as fallback
          }
        }

        // If no userData or parsing failed, check auth status to get user info
        setProcessingStep("checking auth status");
        const success = await checkAuthStatus();
        setDebugInfo((prev) => ({
          ...prev,
          authCheckSuccess: success,
          storeState: useAuthStore.getState(),
        }));

        if (success) {
          toast.success("Successfully signed in with Google!");
          setProcessingStep("redirecting after auth check");
          router.push("/dashboard");
        } else {
          throw new Error("Failed to retrieve user information");
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
  }, [checkAuthStatus, router, searchParams]);

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
