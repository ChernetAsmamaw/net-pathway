"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import MentorForm from "@/components/admin/MentorForm";
import UserSelectionModal from "@/components/admin/UserSelectionModal";
import { toast } from "react-hot-toast";

export default function NewMentorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  // Check if userId was passed in URL
  const userId = searchParams.get("userId");

  // If no userId was provided, we need to show the user selection modal first
  const [showUserSelection, setShowUserSelection] = useState(!userId);

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

      // If no userId was provided, we'll show the user selection modal
      if (!userId) {
        setShowUserSelection(true);
      }
    };

    checkAdminAccess();
  }, [checkAuth, isAuthenticated, router, user, userId]);

  // Handle user selection from the modal
  const handleUserSelect = (selectedUser) => {
    if (selectedUser) {
      // Redirect to the same page but with the userId parameter
      router.push(
        `/admin/mentor/new?userId=${selectedUser._id || selectedUser.id}`
      );
    }
  };

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

  // If we need to select a user first and no user ID was provided, show the embedded selection modal
  if (showUserSelection && !userId) {
    // Import and use the UserSelectionModal component (same as in AdminDashboard)
    return (
      <div className="p-6 md:p-8">
        <UserSelectionModal
          onSelect={handleUserSelect}
          onCancel={() => router.push("/admin")}
        />
      </div>
    );
  }

  // If we have a userId, show the mentor form
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
