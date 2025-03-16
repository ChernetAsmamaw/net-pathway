// Edit Blog Post Route
// This file handles editing existing blog posts
// Path: /admin/blog/[blogId]

"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import BlogForm from "@/components/admin/BlogForm";
import { toast } from "react-hot-toast";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();

  const blogId = params?.blogId as string;

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      await checkAuthStatus();

      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      if (user?.role !== "admin") {
        toast.error("You don't have permission to access this page");
        router.push("/dashboard");
        return;
      }

      if (!blogId) {
        toast.error("Invalid blog post");
        router.push("/admin");
        return;
      }
    };

    checkAdminAccess();
  }, [checkAuthStatus, isAuthenticated, router, user, blogId]);

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
      <Navbar />
      <Sidebar onCollapse={() => {}} />
      <main className="pt-16 ml-64 transition-all duration-300">
        <div className="p-6 md:p-8">
          <BlogForm blogId={blogId} onCancel={() => router.push("/admin")} />
        </div>
      </main>
    </div>
  );
}
