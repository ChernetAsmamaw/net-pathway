import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  AlertCircle,
  X,
  Save,
  CheckCircle,
} from "lucide-react";

/**
 * AcademicTranscriptForm Component
 *
 * This component allows users to input their academic transcript information,
 * including GPA and subject scores.
 *
 * Requirements:
 * - GPA is mandatory
 * - At least 5 subjects required for completion
 * - Subject percentages must be between 0-100
 * - "Save & Exit" saves progress but doesn't mark as completed
 * - "Save & Complete" only works when all requirements are met
 */

interface Subject {
  id: string;
  name: string;
  percentage: number;
}

interface AcademicTranscriptFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  onDataChange?: () => void;
}

const AcademicTranscriptForm: React.FC<AcademicTranscriptFormProps> = ({
  onSubmit,
  onCancel,
  initialData = null,
  onDataChange,
}) => {
  const predefinedSubjects = [
    "Amharic",
    "English",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Geography",
    "History",
    "Civics",
    "Information Technology",
    "Physical Education",
    "Art",
    "Music",
    "Economics",
    "Business Studies",
    "Accounting",
    "Other",
  ];

  // Initialize state with initial data or defaults
  const [subjects, setSubjects] = useState<Subject[]>(
    initialData?.subjects?.length > 0
      ? initialData.subjects
      : [
          { id: crypto.randomUUID(), name: "", percentage: 0 },
          { id: crypto.randomUUID(), name: "", percentage: 0 },
          { id: crypto.randomUUID(), name: "", percentage: 0 },
          { id: crypto.randomUUID(), name: "", percentage: 0 },
          { id: crypto.randomUUID(), name: "", percentage: 0 },
        ]
  );
  const [gpa, setGpa] = useState(initialData?.gpa || 0);
  const [customSubject, setCustomSubject] = useState("");
  const [showCustomSubjectInput, setShowCustomSubjectInput] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange();
    }
    setHasUnsavedChanges(true);
  }, [gpa, subjects, onDataChange]);

  // Auto-save timer
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setInterval(() => {
        setSaveProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            // Auto-save when progress reaches 100%
            const dataToSave = {
              subjects: subjects.filter((s) => s.name.trim() !== ""),
              gpa,
              submittedAt: new Date().toISOString(),
            };
            localStorage.setItem(
              "academic_assessment_data",
              JSON.stringify(dataToSave)
            );
            setHasUnsavedChanges(false);
            return 0;
          }
          return prev + 10;
        });
      }, 250);

      return () => clearInterval(timer);
    }
    return undefined;
  }, [hasUnsavedChanges, saveProgress, gpa, subjects]);

  // Handle field changes
  const handleSubjectChange = (
    id: string,
    field: keyof Subject,
    value: string | number
  ) => {
    setSubjects(
      subjects.map((subj) =>
        subj.id === id ? { ...subj, [field]: value } : subj
      )
    );
    // Clear any existing errors for this field
    if (errors[`subject-${id}-${field}`]) {
      setErrors((prev) => ({ ...prev, [`subject-${id}-${field}`]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate GPA (now required)
    if (gpa === 0 || gpa === null || gpa === undefined) {
      newErrors.gpa = "GPA is required";
    } else if (gpa < 0 || gpa > 4) {
      newErrors.gpa = "GPA must be between 0 and 4";
    }

    // Validate subjects
    const validSubjects = subjects.filter(
      (subject) => subject.name.trim() !== ""
    );
    if (validSubjects.length < 5) {
      newErrors.minimumSubjects = "Please add at least 5 subjects";
    }

    subjects.forEach((subject) => {
      if (subject.name) {
        // Only validate subjects that have a name
        if (subject.percentage < 0 || subject.percentage > 100) {
          newErrors[`subject-${subject.id}-percentage`] =
            "Percentage must be between 0 and 100";
        }
      }
    });

    // Check for duplicate subjects
    const subjectNames = subjects
      .map((s) => s.name)
      .filter((name) => name !== "");
    if (new Set(subjectNames).size !== subjectNames.length) {
      newErrors.duplicateSubjects = "Duplicate subjects are not allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save and exit without completion validation
  const handleSaveAndExit = () => {
    const dataToSave = {
      subjects: subjects.filter((s) => s.name.trim() !== ""),
      gpa,
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "academic_assessment_data",
      JSON.stringify(dataToSave)
    );

    // Save to localStorage but don't mark as completed
    localStorage.setItem("academic_assessment_completed", "false");
    setHasUnsavedChanges(false);

    onCancel();
  };

  // Handle manual save
  const handleSaveProgress = () => {
    const dataToSave = {
      subjects: subjects.filter((s) => s.name.trim() !== ""),
      gpa,
      submittedAt: new Date().toISOString(),
    };
    localStorage.setItem(
      "academic_assessment_data",
      JSON.stringify(dataToSave)
    );
    setHasUnsavedChanges(false);
    toast.success("Progress saved");
  };

  // Handle form submission with validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const validSubjects = subjects.filter((s) => s.name.trim() !== "");
      const dataToSubmit = {
        subjects: validSubjects,
        gpa,
        submittedAt: new Date().toISOString(),
      };

      // Submit to parent component
      onSubmit(dataToSubmit);

      // Save to localStorage and mark as completed
      localStorage.setItem(
        "academic_assessment_data",
        JSON.stringify(dataToSubmit)
      );
      localStorage.setItem("academic_assessment_completed", "true");
      setHasUnsavedChanges(false);
    }
  };

  // Handle removing a subject
  const handleRemoveSubject = (id: string) => {
    if (subjects.length > 5) {
      setSubjects(subjects.filter((s) => s.id !== id));
    } else {
      // Show an alert or toast
      toast.info("You need at least 5 subjects");
    }
  };

  // Add a custom subject
  const addCustomSubject = () => {
    if (customSubject.trim()) {
      setSubjects([
        ...subjects,
        { id: crypto.randomUUID(), name: customSubject, percentage: 0 },
      ]);
      setCustomSubject("");
      setShowCustomSubjectInput(false);
    }
  };

  // Count how many valid subjects we have
  const validSubjectCount = subjects.filter((s) => s.name.trim() !== "").length;
  const meetsMinimumSubjects = validSubjectCount >= 5;
  const isGpaValid = gpa > 0 && gpa <= 4;
  const canSubmit = meetsMinimumSubjects && isGpaValid;

  // A helper function to check if all fields are filled for a subject
  const isSubjectComplete = (subject: Subject) => {
    return (
      subject.name.trim() !== "" &&
      subject.percentage >= 0 &&
      subject.percentage <= 100
    );
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Academic Transcript
          </h2>
        </div>
        <button
          onClick={handleSaveAndExit}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Save and exit"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <p className="text-blue-800 font-medium">Important Note</p>
          <p className="text-blue-700 text-sm mb-2">
            Please add at least 5 subjects and provide your GPA to complete this
            section.
          </p>
          <p className="text-blue-700 text-sm">
            Enter percentage averages for each subject to get an accurate
            assessment. Your data will be saved when you exit even if
            incomplete.
          </p>
        </div>
      </div>

      {/* Auto-save indicator */}
      {hasUnsavedChanges && (
        <div className="mb-4 flex items-center gap-2 justify-end">
          <div className="w-24 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${saveProgress}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">Auto-saving...</span>
          <button
            onClick={handleSaveProgress}
            className="text-sky-600 text-sm flex items-center gap-1 hover:text-sky-800 ml-4"
          >
            <Save className="w-4 h-4" /> Save Now
          </button>
        </div>
      )}

      {/* Requirements Status */}
      <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-700 mb-3">
          Completion Requirements:
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full ${
                isGpaValid ? "bg-green-500" : "bg-gray-300"
              } flex items-center justify-center`}
            >
              {isGpaValid && <span className="text-white text-xs">✓</span>}
            </div>
            <span
              className={`text-sm ${
                isGpaValid ? "text-green-700" : "text-gray-600"
              }`}
            >
              Valid GPA provided (required)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full ${
                meetsMinimumSubjects ? "bg-green-500" : "bg-gray-300"
              } flex items-center justify-center`}
            >
              {meetsMinimumSubjects && (
                <span className="text-white text-xs">✓</span>
              )}
            </div>
            <span
              className={`text-sm ${
                meetsMinimumSubjects ? "text-green-700" : "text-gray-600"
              }`}
            >
              At least 5 subjects added ({validSubjectCount}/5)
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* GPA Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall GPA (0-4) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            max="4"
            step="0.01"
            value={gpa}
            onChange={(e) => setGpa(Number(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.gpa ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.gpa && (
            <p className="mt-1 text-sm text-red-600">{errors.gpa}</p>
          )}
        </div>

        {/* Subjects */}
        <div className="mb-6">
          {subjects.map((subject) => (
            <div key={subject.id} className="flex gap-3 mb-4 items-start">
              <div className="flex-1">
                <select
                  value={subject.name}
                  onChange={(e) =>
                    handleSubjectChange(subject.id, "name", e.target.value)
                  }
                  className={`w-full px-4 py-2 border rounded-lg bg-white focus:ring-blue-500 ${
                    errors[`subject-${subject.id}-name`]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Subject</option>
                  {predefinedSubjects.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {errors[`subject-${subject.id}-name`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[`subject-${subject.id}-name`]}
                  </p>
                )}
              </div>

              <div className="w-24">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subject.percentage}
                  onChange={(e) =>
                    handleSubjectChange(
                      subject.id,
                      "percentage",
                      Number(e.target.value)
                    )
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 ${
                    errors[`subject-${subject.id}-percentage`]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="%"
                />
                {errors[`subject-${subject.id}-percentage`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[`subject-${subject.id}-percentage`]}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveSubject(subject.id)}
                className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
                disabled={subjects.length <= 5}
                aria-label="Remove subject"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          {/* Custom Subject Input */}
          {showCustomSubjectInput ? (
            <div className="mt-3 flex gap-3">
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Enter custom subject"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addCustomSubject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowCustomSubjectInput(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustomSubjectInput(true)}
              className="mt-3 text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Custom Subject
            </button>
          )}

          {/* Add Subject Button */}
          <button
            type="button"
            onClick={() =>
              setSubjects([
                ...subjects,
                { id: crypto.randomUUID(), name: "", percentage: 0 },
              ])
            }
            className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500"
          >
            <Plus className="w-5 h-5 inline-block" /> Add Another Subject
          </button>
        </div>

        {/* Error Messages */}
        {errors.duplicateSubjects && (
          <p className="mb-4 text-sm text-red-600">
            {errors.duplicateSubjects}
          </p>
        )}

        {errors.minimumSubjects && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-600 text-sm">{errors.minimumSubjects}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleSaveAndExit}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Save & Exit
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
              canSubmit
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={!canSubmit}
          >
            {canSubmit && <CheckCircle className="w-4 h-4" />}
            Save & Complete
          </button>
        </div>
      </form>
    </div>
  );
};

export default AcademicTranscriptForm;
