"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

import MentorForm from "@/components/admin/MentorForm";
import { toast } from "react-hot-toast";

export default function EditMentorPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  const mentorId = params?.mentorId as string;

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

      if (!mentorId) {
        toast.error("Invalid mentor");
        router.push("/admin");
        return;
      }
    };

    checkAdminAccess();
  }, [checkAuth, isAuthenticated, router, user, mentorId]);

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
      <main className="pt-16 ml-64 transition-all duration-300">
        <MentorForm
          mentorId={mentorId}
          onCancel={() => router.push("/admin")}
        />
      </main>
    </div>
  );
}
