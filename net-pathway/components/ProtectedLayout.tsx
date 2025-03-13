"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, checkAuthStatus } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    // Check auth once on component mount
    checkAuthStatus();
    // Mark client as ready after hydration
    setIsClientReady(true);
  }, [checkAuthStatus]);

  // Add new useEffect for handling authentication redirect
  useEffect(() => {
    if (isClientReady && !isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, router, isClientReady]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-700"></div>
      </div>
    );
  }

  // If authentication is confirmed but we're still waiting for user data
  if (isAuthenticated && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Return null if not authenticated, but let useEffect handle the redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar
        onCollapse={(collapsed: boolean) => setIsSidebarCollapsed(collapsed)}
      />
      <main
        className={`${
          isSidebarCollapsed ? "pl-20" : "pl-64"
        } pt-16 transition-all duration-300`}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
