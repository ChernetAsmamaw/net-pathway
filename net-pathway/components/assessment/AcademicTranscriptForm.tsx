import React, { useState } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  X,
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  percentage: number;
}

interface AcademicTranscriptFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const AcademicTranscriptForm: React.FC<AcademicTranscriptFormProps> = ({
  onSubmit,
  onCancel,
  initialData = null,
}) => {
  // List of predefined subjects
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

  // State for subjects
  const [subjects, setSubjects] = useState<Subject[]>(
    initialData?.subjects || [{ id: "1", name: "", percentage: 0 }]
  );

  // State for GPA
  const [gpa, setGpa] = useState<number>(initialData?.gpa || 0);

  // State for custom subject input
  const [customSubject, setCustomSubject] = useState("");
  const [showCustomSubjectInput, setShowCustomSubjectInput] = useState(false);

  // State for validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Add a new subject row
  const addSubject = () => {
    setSubjects([
      ...subjects,
      { id: `${subjects.length + 1}`, name: "", percentage: 0 },
    ]);
  };

  // Remove a subject row
  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((subject) => subject.id !== id));
    }
  };

  // Update subject data
  const updateSubject = (
    id: string,
    field: "name" | "percentage",
    value: string | number
  ) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id ? { ...subject, [field]: value } : subject
      )
    );

    // Clear error when user updates the field
    if (errors[`subject-${id}-${field}`]) {
      setErrors({
        ...errors,
        [`subject-${id}-${field}`]: "",
      });
    }
  };

  // Add custom subject
  const addCustomSubject = () => {
    if (customSubject.trim()) {
      // Find the next available ID
      const maxId = Math.max(...subjects.map((s) => parseInt(s.id)), 0);
      setSubjects([
        ...subjects,
        { id: `${maxId + 1}`, name: customSubject, percentage: 0 },
      ]);
      setCustomSubject("");
      setShowCustomSubjectInput(false);
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate each subject
    subjects.forEach((subject) => {
      if (!subject.name) {
        newErrors[`subject-${subject.id}-name`] = "Please select a subject";
      }

      if (subject.percentage < 0 || subject.percentage > 100) {
        newErrors[`subject-${subject.id}-percentage`] =
          "Percentage must be between 0 and 100";
      }
    });

    // Check for duplicate subjects
    const subjectNames = subjects
      .map((s) => s.name)
      .filter((name) => name !== "");
    const uniqueSubjectNames = new Set(subjectNames);

    if (uniqueSubjectNames.size !== subjectNames.length) {
      newErrors.duplicateSubjects = "Duplicate subjects are not allowed";
    }

    // Validate GPA
    if (gpa < 0 || gpa > 4) {
      newErrors.gpa = "GPA must be between 0 and 4";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Filter out any empty subjects
      const validSubjects = subjects.filter(
        (subject) => subject.name.trim() !== ""
      );

      onSubmit({
        subjects: validSubjects,
        gpa,
        submittedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Academic Transcript
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-yellow-800 font-medium">Important Note</p>
          <p className="text-yellow-700 text-sm">
            Please enter the percentage average for each subject you have taken.
            Add all relevant subjects to get an accurate assessment.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* File Upload (Coming Soon) */}
        <div className="mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 opacity-70 cursor-not-allowed">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">Upload Transcript</p>
            <p className="text-gray-400 text-sm mt-1">Coming Soon</p>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            For now, please enter your subjects and grades manually below.
          </p>
        </div>

        {/* GPA Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Overall GPA (0-4)
          </label>
          <input
            type="number"
            min="0"
            max="4"
            step="0.01"
            value={gpa}
            onChange={(e) => setGpa(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.gpa && (
            <p className="mt-1 text-sm text-red-600">{errors.gpa}</p>
          )}
        </div>

        {/* Subject Entries */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Subjects and Percentages
            </label>
          </div>

          {errors.duplicateSubjects && (
            <p className="mb-2 text-sm text-red-600">
              {errors.duplicateSubjects}
            </p>
          )}

          {/* Improved Subject Selection UI */}
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-sky-200 transition-colors shadow-sm"
              >
                <div className="flex-grow relative">
                  <select
                    value={subject.name}
                    onChange={(e) =>
                      updateSubject(subject.id, "name", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none bg-white pr-10"
                  >
                    <option value="">Select Subject</option>
                    {predefinedSubjects.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {errors[`subject-${subject.id}-name`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`subject-${subject.id}-name`]}
                    </p>
                  )}
                </div>

                <div className="w-32 relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={subject.percentage}
                    onChange={(e) =>
                      updateSubject(
                        subject.id,
                        "percentage",
                        Number(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 pr-8"
                    placeholder="%"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    %
                  </div>
                  {errors[`subject-${subject.id}-percentage`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`subject-${subject.id}-percentage`]}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeSubject(subject.id)}
                  className="p-2.5 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-lg"
                  aria-label="Remove subject"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Custom Subject */}
          {showCustomSubjectInput ? (
            <div className="mt-3 flex gap-3">
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Enter custom subject"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <button
                type="button"
                onClick={addCustomSubject}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomSubjectInput(false);
                  setCustomSubject("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustomSubjectInput(true)}
              className="mt-3 text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Custom Subject
            </button>
          )}

          {/* Add More Subjects Button */}
          <button
            type="button"
            onClick={addSubject}
            className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-sky-600 hover:border-sky-500 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Another Subject
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
          >
            <GraduationCap className="w-5 h-5" />
            Save Academic Transcript
          </button>
        </div>
      </form>
    </div>
  );
};

export default AcademicTranscriptForm;
