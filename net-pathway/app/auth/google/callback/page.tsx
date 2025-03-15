"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get token from URL if present
        const token = searchParams.get("token");

        if (token) {
          // Store the token in localStorage and cookies
          localStorage.setItem("token", token);
          document.cookie = `token=${token}; path=/`;
        }

        // Check auth status to get user info
        const success = await checkAuthStatus();

        if (success) {
          toast.success("Successfully signed in with Google!");
          router.push("/dashboard");
        } else {
          toast.error("Authentication failed.");
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Google auth callback error:", error);
        toast.error("Authentication failed. Please try again.");
        router.push("/auth/login");
      }
    };

    handleCallback();
  }, [checkAuthStatus, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
