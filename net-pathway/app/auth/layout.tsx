"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuthentication = async () => {
      await checkAuth();

      // If authenticated, redirect to dashboard
      if (isAuthenticated) {
        router.replace("/dashboard");
      }
    };

    checkAuthentication();
  }, [checkAuth, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50">
      {children}
      <Toaster position="top-right" />
    </div>
  );
}
