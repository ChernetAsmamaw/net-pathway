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
import { toast } from "react-hot-toast";

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
  // Available subjects list
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

  // Initialize with initial data or default values
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    // If initialData has subjects, use them
    if (initialData?.subjects?.length > 0) {
      return initialData.subjects.map((s: any) => ({
        ...s,
        id: s.id || crypto.randomUUID(),
      }));
    }

    // Otherwise, start with 5 empty subject slots
    return [
      { id: crypto.randomUUID(), name: "", percentage: 0 },
      { id: crypto.randomUUID(), name: "", percentage: 0 },
      { id: crypto.randomUUID(), name: "", percentage: 0 },
      { id: crypto.randomUUID(), name: "", percentage: 0 },
      { id: crypto.randomUUID(), name: "", percentage: 0 },
    ];
  });

  // GPA state
  const [gpa, setGpa] = useState(initialData?.gpa || 0);

  // Custom subject input state
  const [customSubject, setCustomSubject] = useState("");
  const [showCustomSubjectInput, setShowCustomSubjectInput] = useState(false);

  // Validation errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Track if data has been modified since last save
  const [isDataModified, setIsDataModified] = useState(false);

  // Notify parent of changes
  useEffect(() => {
    if (onDataChange && isDataModified) {
      onDataChange();
    }
  }, [gpa, subjects, onDataChange, isDataModified]);

  // Handle subject changes
  const handleSubjectChange = (
    id: string,
    field: keyof Subject,
    value: string | number
  ) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === id ? { ...subject, [field]: value } : subject
      )
    );

    // Mark data as modified
    setIsDataModified(true);

    // Clear errors for this field
    if (errors[`subject-${id}-${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`subject-${id}-${field}`];
        return newErrors;
      });
    }
  };

  // Handle GPA change
  const handleGpaChange = (value: number) => {
    setGpa(value);
    setIsDataModified(true);

    // Clear GPA error if it exists
    if (errors.gpa) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.gpa;
        return newErrors;
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate GPA
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

    // Validate percentages for subjects with names
    subjects.forEach((subject) => {
      if (subject.name) {
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

  // Handle Save & Exit
  const handleSaveAndExit = () => {
    // Gather data from valid subjects
    const validSubjects = subjects.filter((s) => s.name.trim() !== "");

    // Prepare data
    const dataToSave = {
      subjects: validSubjects,
      gpa,
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem(
      "academic_assessment_data",
      JSON.stringify(dataToSave)
    );
    localStorage.setItem("academic_assessment_completed", "false");

    // Mark data as no longer modified after saving
    setIsDataModified(false);

    // Success message
    toast.success("Progress saved");

    // Exit form
    onCancel();
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Get valid subjects only
      const validSubjects = subjects.filter((s) => s.name.trim() !== "");

      // Prepare submission data
      const dataToSubmit = {
        subjects: validSubjects,
        gpa,
        submittedAt: new Date().toISOString(),
      };

      // Submit to parent
      onSubmit(dataToSubmit);

      // Save to localStorage and mark as completed
      localStorage.setItem(
        "academic_assessment_data",
        JSON.stringify(dataToSubmit)
      );
      localStorage.setItem("academic_assessment_completed", "true");

      // Mark data as no longer modified after saving
      setIsDataModified(false);

      toast.success("Academic transcript saved successfully!");
    } else {
      toast.error("Please fix the errors before submitting");
    }
  };

  // Add a custom subject
  const handleAddCustomSubject = () => {
    if (customSubject.trim()) {
      setSubjects([
        ...subjects,
        { id: crypto.randomUUID(), name: customSubject, percentage: 0 },
      ]);
      setCustomSubject("");
      setShowCustomSubjectInput(false);
      setIsDataModified(true);
    }
  };

  // Handle removing a subject
  const handleRemoveSubject = (id: string) => {
    if (subjects.length > 5) {
      setSubjects(subjects.filter((s) => s.id !== id));
      setIsDataModified(true);
    } else {
      toast.info("You need at least 5 subjects");
    }
  };

  // Handle manual saving of progress
  const handleSaveProgress = () => {
    // Gather data from valid subjects
    const validSubjects = subjects.filter((s) => s.name.trim() !== "");

    // Prepare data
    const dataToSave = {
      subjects: validSubjects,
      gpa,
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem(
      "academic_assessment_data",
      JSON.stringify(dataToSave)
    );

    // Mark data as saved
    setIsDataModified(false);

    // Success message
    toast.success("Progress saved");
  };

  // Count valid subjects
  const validSubjectCount = subjects.filter((s) => s.name.trim() !== "").length;
  const meetsMinimumSubjects = validSubjectCount >= 5;
  const isGpaValid = gpa > 0 && gpa <= 4;
  const canSubmit = meetsMinimumSubjects && isGpaValid;

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
            assessment.
          </p>
        </div>
      </div>

      {/* Save Controls */}
      {isDataModified && (
        <div className="mb-4 flex justify-end items-center gap-2">
          <span className="text-amber-600 text-sm">Unsaved changes</span>
          <button
            onClick={handleSaveProgress}
            className="text-sky-600 text-sm flex items-center gap-1 hover:text-sky-800 px-3 py-1 border border-sky-200 rounded-lg bg-sky-50"
          >
            <Save className="w-4 h-4" /> Save Progress
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
            onChange={(e) => handleGpaChange(Number(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg ${
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
                  className={`w-full px-4 py-2 border rounded-lg ${
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
                  className={`w-full px-4 py-2 border rounded-lg ${
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
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddCustomSubject}
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
            onClick={() => {
              setSubjects([
                ...subjects,
                { id: crypto.randomUUID(), name: "", percentage: 0 },
              ]);
              setIsDataModified(true);
            }}
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
