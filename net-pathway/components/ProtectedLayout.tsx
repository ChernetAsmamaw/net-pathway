"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, checkAuth } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check auth on component mount
  useEffect(() => {
    async function verifyAuth() {
      setIsCheckingAuth(true);
      await checkAuth();
      setIsClientReady(true);
      setIsCheckingAuth(false);
    }

    verifyAuth();
  }, [checkAuth]);

  // Redirect if not authenticated
  useEffect(() => {
    if (isClientReady && !isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isClientReady, isLoading, isAuthenticated, router]);

  // Show loading state
  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Render protected content
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar onCollapse={setIsSidebarCollapsed} />
      <main
        className={`pt-16 ${
          isSidebarCollapsed ? "pl-20" : "pl-64"
        } transition-all duration-300`}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
