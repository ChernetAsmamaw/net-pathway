"use client"; // Add this at the top of the file

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import DiscussionChat from "@/components/discussions/DiscussionChat";

export default function DiscussionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuthStatus, isAuthenticated, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading discussion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar onCollapse={setIsSidebarCollapsed} />
      <main
        className={`pt-16 ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-300`}
      >
        <DiscussionChat discussionId={params.id as string} />
      </main>
    </div>
  );
}
