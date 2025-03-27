import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { Upload, FileText, Check, Loader } from "lucide-react";

interface TranscriptData {
  courses: Array<{
    name: string;
    grade: string;
    score: number;
    credits: number;
  }>;
  gpa: number;
  strengths: string[];
  extracurriculars: string[];
}

const TranscriptAnalyzer: React.FC<{
  onComplete: (data: TranscriptData) => void;
}> = ({ onComplete }) => {
  const { user } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "processing" | "success" | "error"
  >("idle");
  const [manualEntry, setManualEntry] = useState(false);
  const [transcriptData, setTranscriptData] = useState<TranscriptData>({
    courses: [],
    gpa: 0,
    strengths: [],
    extracurriculars: [],
  });

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus("idle");
    }
  };

  // Function to upload and analyze transcript
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);

    // Create form data
    const formData = new FormData();
    formData.append("transcript", file);

    try {
      // Upload with progress tracking
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/assessment/transcript/analyze`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Process response
      if (response.data && response.data.transcriptData) {
        setTranscriptData(response.data.transcriptData);
        setUploadStatus("success");
        onComplete(response.data.transcriptData);
      } else {
        setUploadStatus("error");
      }
    } catch (error) {
      console.error("Error uploading transcript:", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  // Function to handle manual transcript entry
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transcriptData.courses.length > 0 && transcriptData.gpa > 0) {
      onComplete(transcriptData);
      setUploadStatus("success");
    }
  };

  // Function to add a course to the manual entry
  const addCourse = () => {
    setTranscriptData((prev) => ({
      ...prev,
      courses: [...prev.courses, { name: "", grade: "", score: 0, credits: 0 }],
    }));
  };

  // Function to update a course in the manual entry
  const updateCourse = (index: number, field: string, value: any) => {
    const newCourses = [...transcriptData.courses];
    newCourses[index] = { ...newCourses[index], [field]: value };
    setTranscriptData((prev) => ({ ...prev, courses: newCourses }));
  };

  // Function to add extracurricular activity
  const addExtracurricular = () => {
    setTranscriptData((prev) => ({
      ...prev,
      extracurriculars: [...prev.extracurriculars, ""],
    }));
  };

  // Function to update extracurricular activity
  const updateExtracurricular = (index: number, value: string) => {
    const newExtracurriculars = [...transcriptData.extracurriculars];
    newExtracurriculars[index] = value;
    setTranscriptData((prev) => ({
      ...prev,
      extracurriculars: newExtracurriculars,
    }));
  };

  // Function to add academic strength
  const addStrength = () => {
    setTranscriptData((prev) => ({
      ...prev,
      strengths: [...prev.strengths, ""],
    }));
  };

  // Function to update academic strength
  const updateStrength = (index: number, value: string) => {
    const newStrengths = [...transcriptData.strengths];
    newStrengths[index] = value;
    setTranscriptData((prev) => ({ ...prev, strengths: newStrengths }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Academic Transcript Analysis
      </h2>
      <p className="text-gray-600">
        Upload your academic transcript to help us better match you with
        suitable programs.
      </p>

      <div className="mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setManualEntry(false)}
            className={`px-4 py-2 rounded-lg ${
              !manualEntry
                ? "bg-sky-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Upload Transcript
          </button>
          <button
            onClick={() => setManualEntry(true)}
            className={`px-4 py-2 rounded-lg ${
              manualEntry
                ? "bg-sky-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Manual Entry
          </button>
        </div>
      </div>

      {!manualEntry ? (
        <div className="space-y-6">
          {/* File Upload UI */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-sky-500 transition-colors cursor-pointer"
            onClick={() => document.getElementById("transcript-file")?.click()}
          >
            <input
              type="file"
              id="transcript-file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              PDF, Word, or Image files (max 10MB)
            </p>

            {file && (
              <div className="mt-4 p-3 bg-sky-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-sky-600 mr-2" />
                  <span className="text-sky-700">{file.name}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}
          </div>

          {/* Upload Progress/Status */}
          {uploadStatus === "uploading" && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-sky-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 flex items-center">
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Uploading and analyzing transcript...
              </p>
            </div>
          )}

          {uploadStatus === "processing" && (
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg flex items-center">
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Processing transcript data...
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
              <Check className="w-5 h-5 mr-2" />
              Transcript analysis complete!
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
              <p className="font-medium">Error analyzing transcript</p>
              <p className="text-sm mt-1">
                Please try again or use manual entry instead.
              </p>
            </div>
          )}

          {file && uploadStatus !== "success" && (
            <button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
            >
              {isUploading ? "Processing..." : "Analyze Transcript"}
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-6">
          {/* GPA Input */}
          <div>
            <label
              htmlFor="gpa"
              className="block text-sm font-medium text-gray-700"
            >
              Overall GPA
            </label>
            <input
              type="number"
              id="gpa"
              min="0"
              max="4.0"
              step="0.01"
              value={transcriptData.gpa || ""}
              onChange={(e) =>
                setTranscriptData((prev) => ({
                  ...prev,
                  gpa: parseFloat(e.target.value),
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border"
              required
            />
          </div>

          {/* Course Inputs */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Courses
              </label>
              <button
                type="button"
                onClick={addCourse}
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                + Add Course
              </button>
            </div>

            {transcriptData.courses.map((course, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Course Name"
                    value={course.name}
                    onChange={(e) =>
                      updateCourse(index, "name", e.target.value)
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Grade"
                    value={course.grade}
                    onChange={(e) =>
                      updateCourse(index, "grade", e.target.value)
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Score"
                    value={course.score || ""}
                    onChange={(e) =>
                      updateCourse(index, "score", parseFloat(e.target.value))
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Credits"
                    value={course.credits || ""}
                    onChange={(e) =>
                      updateCourse(index, "credits", parseFloat(e.target.value))
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border"
                    required
                  />
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const newCourses = [...transcriptData.courses];
                      newCourses.splice(index, 1);
                      setTranscriptData((prev) => ({
                        ...prev,
                        courses: newCourses,
                      }));
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Academic Strengths */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Academic Strengths
              </label>
              <button
                type="button"
                onClick={addStrength}
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                + Add Strength
              </button>
            </div>

            {transcriptData.strengths.map((strength, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Academic Strength"
                  value={strength}
                  onChange={(e) => updateStrength(index, e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newStrengths = [...transcriptData.strengths];
                    newStrengths.splice(index, 1);
                    setTranscriptData((prev) => ({
                      ...prev,
                      strengths: newStrengths,
                    }));
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Extracurricular Activities */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Extracurricular Activities
              </label>
              <button
                type="button"
                onClick={addExtracurricular}
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                + Add Activity
              </button>
            </div>

            {transcriptData.extracurriculars.map((activity, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Activity Description"
                  value={activity}
                  onChange={(e) => updateExtracurricular(index, e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newExtracurriculars = [
                      ...transcriptData.extracurriculars,
                    ];
                    newExtracurriculars.splice(index, 1);
                    setTranscriptData((prev) => ({
                      ...prev,
                      extracurriculars: newExtracurriculars,
                    }));
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
          >
            Submit Transcript Data
          </button>
        </form>
      )}
    </div>
  );
};

export default TranscriptAnalyzer;
