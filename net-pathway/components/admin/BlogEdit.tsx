// app/(authenticated)/admin/blog/new/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import BlogForm from "@/components/admin/BlogForm";
import { toast } from "react-hot-toast";

export default function NewBlogPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
          <BlogForm onCancel={() => router.push("/admin")} />
        </div>
      </main>
    </div>
  );
}
