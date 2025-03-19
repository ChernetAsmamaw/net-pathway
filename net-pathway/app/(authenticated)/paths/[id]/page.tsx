"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import PathCard from "@/components/paths/PathCard";
import { pathsData } from "../page";

export default function PathDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeUniversity, setActiveUniversity] = useState<string | null>(null);
  const [pathData, setPathData] = useState<any>(null);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuthStatus, isAuthenticated, router]);

  useEffect(() => {
    const foundPath = pathsData.find((path) => path.id === params.id);
    if (foundPath) {
      setPathData(foundPath);
      if (foundPath.universities.length > 0 && activeUniversity === null) {
        setActiveUniversity(foundPath.universities[0].id);
      }
    } else {
      router.push("/paths");
    }
  }, [params.id, activeUniversity, router]);

  if (!user || !pathData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading path details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <PathCard
          pathData={pathData}
          activeUniversity={activeUniversity}
          onUniversityChange={setActiveUniversity}
          onBack={() => router.back()}
        />
      </main>
    </div>
  );
}
