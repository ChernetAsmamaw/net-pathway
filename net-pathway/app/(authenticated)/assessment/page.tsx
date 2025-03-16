"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { Upload, FileText, BrainCircuit } from "lucide-react";
import TranscriptUpload from "@/components/assessment/TranscriptUpload";
import AptitudeTest from "@/components/assessment/AptitudeTest";

export default function AssessmentPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "intro" | "transcript" | "aptitude"
  >("intro");

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuth, isAuthenticated, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <div className="p-6 md:p-8">
          {/* Header Section */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-700">
            <h1 className="text-3xl font-bold text-sky-800 mb-2">
              Career Assessment
            </h1>
            <p className="text-slate-600">
              Complete your assessment to discover personalized career paths
            </p>
          </div>

          {activeSection === "intro" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => setActiveSection("transcript")}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-sky-50 text-sky-600 group-hover:bg-sky-100">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Upload Transcript
                    </h3>
                    <p className="text-gray-600">
                      Submit your academic records for a comprehensive analysis
                      of your educational background
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveSection("aptitude")}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Aptitude Test
                    </h3>
                    <p className="text-gray-600">
                      Take our comprehensive aptitude test to evaluate your
                      skills and interests
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "transcript" && (
            <TranscriptUpload onBack={() => setActiveSection("intro")} />
          )}

          {activeSection === "aptitude" && (
            <AptitudeTest onBack={() => setActiveSection("intro")} />
          )}
        </div>
      </main>
    </div>
  );
}
