"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import DiscussionChat from "@/components/discussions/DiscussionChat";
import { AlertCircle, Loader } from "lucide-react";

export default function DiscussionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const {
    currentDiscussion,
    fetchDiscussionById,
    isLoading,
    error,
    clearCurrentDiscussion,
  } = useDiscussionStore();

  // Extract discussion ID from URL params
  const discussionId = params?.id as string;

  // Check authentication
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuth, isAuthenticated, router]);

  // Fetch discussion data
  useEffect(() => {
    if (isAuthenticated && discussionId) {
      fetchDiscussionById(discussionId);
    }

    // Clear discussion data when component unmounts
    return () => {
      clearCurrentDiscussion();
    };
  }, [
    isAuthenticated,
    discussionId,
    fetchDiscussionById,
    clearCurrentDiscussion,
  ]);

  // Go back to discussions list
  const handleBack = () => {
    router.push("/discussions");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !currentDiscussion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Error Loading Discussion
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The discussion could not be loaded. It might have been deleted or you don't have permission to view it."}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors"
          >
            Back to Discussions
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !currentDiscussion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-sky-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading discussion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <DiscussionChat discussionId={discussionId} onBack={handleBack} />
      </main>
    </div>
  );
}
