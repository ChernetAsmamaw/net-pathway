"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import MentorForm from "@/components/admin/MentorForm";
import UserSelectionComponent from "@/components/admin/UserSelectionComponent";
import { toast } from "react-hot-toast";

export default function NewMentorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Check if userId is provided in URL
  const userId = searchParams.get("userId");

  // If userId is provided, we'll skip the user selection step
  const [userSelectionStep, setUserSelectionStep] = useState<boolean>(!userId);

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

      // If userId is provided, we'll use that directly
      if (userId) {
        setUserSelectionStep(false);
      }
    };

    checkAdminAccess();
  }, [checkAuth, isAuthenticated, router, user, userId]);

  const handleUserSelected = (selectedUserData: any) => {
    setSelectedUser(selectedUserData);
    setUserSelectionStep(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <div className="p-6 md:p-8">
          {userSelectionStep ? (
            <UserSelectionComponent
              onUserSelected={handleUserSelected}
              onCancel={() => router.push("/admin")}
            />
          ) : (
            <MentorForm
              onCancel={() => router.push("/admin")}
              initialUserId={userId || selectedUser?._id}
            />
          )}
        </div>
      </main>
    </div>
  );
}
