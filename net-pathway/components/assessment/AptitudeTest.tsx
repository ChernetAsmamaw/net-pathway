import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import BehavioralAssessment from "./BehavioralAssessment";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/useAssessmentStore";

export default function AptitudeTest({ onBack }) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);
  const { resetAssessment, results, getTopCareerGroups } = useAssessmentStore();

  // Reset assessment state when component mounts
  useEffect(() => {
    resetAssessment();
  }, [resetAssessment]);

  const handleComplete = () => {
    setIsCompleted(true);
  };

  const handleGeneratePath = () => {
    router.push("/pathway/generate");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6 flex items-center">
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          Behavioral Assessment
        </h2>
      </div>

      {!isCompleted ? (
        <BehavioralAssessment onComplete={handleComplete} />
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Assessment Completed!</h3>
          <p className="text-gray-600 mb-6">
            Your responses have been recorded. Based on your answers, we'll
            generate personalized educational and career path recommendations.
          </p>

          {results && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg text-left max-w-xl mx-auto">
              <h4 className="font-medium text-lg mb-4">
                Your Profile Highlights:
              </h4>

              {/* Display RIASEC scores */}
              {results.riasec && (
                <div className="mb-4">
                  <p className="font-medium text-sm text-gray-700 mb-2">
                    RIASEC Profile:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(results.riasec)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([category, score]) => (
                        <div
                          key={category}
                          className="flex items-center justify-between p-2 bg-white rounded border"
                        >
                          <span className="capitalize">{category}</span>
                          <span className="font-medium">
                            {Math.round(score * 20)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Display top career groups */}
              <div className="mt-4">
                <p className="font-medium text-sm text-gray-700 mb-2">
                  Top Career Fields:
                </p>
                <div className="space-y-2">
                  {getTopCareerGroups()
                    .slice(0, 3)
                    .map((groupName) => (
                      <div
                        key={groupName}
                        className="p-2 bg-white rounded border"
                      >
                        <span className="capitalize">{groupName}</span>
                      </div>
                    ))}
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Click "Generate Path" to see detailed recommendations based on
                your assessment results.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Return to Assessment Page
            </button>
            <button
              onClick={handleGeneratePath}
              className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Generate Path
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
