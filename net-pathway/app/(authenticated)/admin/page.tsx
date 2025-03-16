"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();

  // Check if user is authenticated and is an admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      await checkAuthStatus();

      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      if (user?.role !== "admin") {
        router.push("/dashboard");
        return;
      }
    };

    checkAdminAccess();
  }, [checkAuthStatus, isAuthenticated, router, user]);

  // Render the AdminDashboard component
  return <AdminDashboard />;
}
