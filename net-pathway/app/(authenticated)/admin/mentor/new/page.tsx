// New Mentor Route
// This file handles creating a new mentor
// Path: /admin/mentor/new

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import MentorForm from "@/components/admin/MentorForm";
import { toast } from "react-hot-toast";

export default function NewMentorPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      await checkAuth();

      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      if (user?.role !== "admin") {
        toast.error("You don't have permission to access this page");
        router.push("/dashboard");
        return;
      }
    };

    checkAdminAccess();
  }, [checkAuth, isAuthenticated, router, user]);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <div className="p-6 md:p-8">
          <MentorForm onCancel={() => router.push("/admin")} />
        </div>
      </main>
    </div>
  );
}
