"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { toast } from "react-hot-toast";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  // Check if user is authenticated and is an admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      await checkAuth();

      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      if (user?.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        router.push("/dashboard");
        return;
      }
    };

    checkAdminAccess();
  }, [checkAuth, isAuthenticated, router, user]);

  // Render the AdminDashboard component
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <AdminDashboard />
      </main>
    </div>
  );
}
