import React, { useState, useEffect } from "react";
import { Users, Trash2, Plus, X, AlertCircle } from "lucide-react";

/**
 * ExtracurricularsForm Component
 *
 * This component allows users to document their extracurricular activities,
 * including positions held and descriptions of responsibilities.
 *
 * Features:
 * - Add/remove activities
 * - Document activity name, position/role, and description
 * - Auto-save progress when exiting
 * - Validate inputs before submission
 * - Require at least 5 valid activities to complete
 */

interface Activity {
  id: string;
  name: string;
  position: string;
  description: string;
}

interface ExtracurricularsFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  onDataChange?: () => void;
}

const ExtracurricularsForm: React.FC<ExtracurricularsFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  onDataChange,
}) => {
  // State for activities - initialize with at least 5 activity slots
  const [activities, setActivities] = useState<Activity[]>(
    initialData?.activities?.length > 0
      ? initialData.activities
      : [
          {
            id: crypto.randomUUID(),
            name: "Student Council",
            position: "Member",
            description: "Participated in student government activities.",
          },
          {
            id: crypto.randomUUID(),
            name: "Sports Team",
            position: "Team Member",
            description: "Participated in school sports competitions.",
          },
          {
            id: crypto.randomUUID(),
            name: "Volunteer Work",
            position: "Volunteer",
            description: "Volunteered at local community events.",
          },
          {
            id: crypto.randomUUID(),
            name: "",
            position: "",
            description: "",
          },
          {
            id: crypto.randomUUID(),
            name: "",
            position: "",
            description: "",
          },
        ]
  );

  // State for validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Effect to notify parent when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange();
    }
  }, [activities, onDataChange]);

  // Handle adding a new activity
  const handleAddActivity = () => {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      name: "",
      position: "",
      description: "",
    };
    setActivities([...activities, newActivity]);
  };

  // Handle removing an activity
  const handleRemoveActivity = (id: string) => {
    if (activities.length > 5) {
      setActivities(activities.filter((activity) => activity.id !== id));
    } else {
      // Instead of removing, just clear the fields if we're at the minimum of 5
      setActivities(
        activities.map((activity) =>
          activity.id === id
            ? { ...activity, name: "", position: "", description: "" }
            : activity
        )
      );

      // Show a message to the user
      setErrors({
        ...errors,
        minimumActivities:
          "You need at least 5 activities. This activity was cleared instead of removed.",
      });

      // Clear the error message after a delay
      setTimeout(() => {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.minimumActivities;
          return newErrors;
        });
      }, 3000);
    }
  };

  // Handle save and exit
  const handleSaveAndExit = () => {
    // Filter out incomplete activities
    const validActivities = activities.filter(
      (activity) => activity.name.trim() !== ""
    );

    // Save current state to localStorage
    localStorage.setItem(
      "extracurricular_assessment_data",
      JSON.stringify({ activities: validActivities })
    );

    // Save but don't mark as completed
    localStorage.setItem("extracurricular_assessment_completed", "false");

    // Exit form
    onCancel();
  };

  // Handle field change for an activity
  const handleActivityChange = (
    id: string,
    field: keyof Activity,
    value: string
  ) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    );

    // Clear any error for this field
    if (errors[`activity-${id}-${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`activity-${id}-${field}`];
        return newErrors;
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Count valid activities
    const validActivities = activities.filter(
      (activity) => activity.name.trim() !== ""
    );

    if (validActivities.length < 5) {
      newErrors.count = `At least 5 activities required. You currently have ${validActivities.length}.`;
      return false;
    }

    // Validate each activity has necessary fields
    validActivities.forEach((activity) => {
      if (!activity.position.trim()) {
        newErrors[`activity-${activity.id}-position`] =
          "Position/role is required";
      }

      if (!activity.description.trim()) {
        newErrors[`activity-${activity.id}-description`] =
          "Description is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Filter to only include valid activities
      const validActivities = activities.filter(
        (activity) => activity.name.trim() !== ""
      );

      // Submit the form data with filtered activities
      onSubmit({
        activities: validActivities,
      });

      // Mark as completed
      localStorage.setItem("extracurricular_assessment_completed", "true");
    }
  };

  // Count valid activities
  const validActivityCount = activities.filter(
    (activity) => activity.name.trim() !== ""
  ).length;
  const meetsMinimumRequirement = validActivityCount >= 5;

  // Check if all valid activities have position and description
  const allActivitiesComplete = activities
    .filter((activity) => activity.name.trim() !== "")
    .every(
      (activity) =>
        activity.position.trim() !== "" && activity.description.trim() !== ""
    );

  // Only allow completion if minimum requirements are met
  const canComplete = meetsMinimumRequirement && allActivitiesComplete;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Extracurricular Activities
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

      <div className="bg-purple-50 p-4 rounded-lg mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
        <div>
          <p className="text-purple-800 font-medium">Important Note</p>
          <p className="text-purple-700 text-sm">
            You must document at least 5 extracurricular activities to complete
            this section. Each activity requires a name, position/role, and
            description. Your data will be saved automatically when you exit.
          </p>
        </div>
      </div>

      {/* Requirements Status */}
      <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-700 mb-3">
          Completion Requirements:
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full ${
                meetsMinimumRequirement ? "bg-green-500" : "bg-gray-300"
              } flex items-center justify-center`}
            >
              {meetsMinimumRequirement && (
                <span className="text-white text-xs">✓</span>
              )}
            </div>
            <span
              className={`text-sm ${
                meetsMinimumRequirement ? "text-green-700" : "text-gray-600"
              }`}
            >
              At least 5 activities added ({validActivityCount}/5)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full ${
                allActivitiesComplete ? "bg-green-500" : "bg-gray-300"
              } flex items-center justify-center`}
            >
              {allActivitiesComplete && (
                <span className="text-white text-xs">✓</span>
              )}
            </div>
            <span
              className={`text-sm ${
                allActivitiesComplete ? "text-green-700" : "text-gray-600"
              }`}
            >
              All activities have position and description
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={handleAddActivity}
              className="text-sky-600 hover:text-sky-800 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Activity
            </button>
          </div>

          {errors.count && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 text-sm">{errors.count}</p>
            </div>
          )}

          {errors.minimumActivities && (
            <div className="mb-4 p-3 bg-amber-50 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <p className="text-amber-700 text-sm">
                {errors.minimumActivities}
              </p>
            </div>
          )}

          <div className="space-y-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 border rounded-lg ${
                  activity.name
                    ? "bg-gray-50 border-gray-200"
                    : "bg-gray-50 border-dashed border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium">Activity Information</h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveActivity(activity.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={
                      activities.length <= 5
                        ? "Clear activity"
                        : "Remove activity"
                    }
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={activity.name}
                      onChange={(e) =>
                        handleActivityChange(
                          activity.id,
                          "name",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                      placeholder="e.g., Debate Club, Sports Team"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position/Role<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={activity.position}
                      onChange={(e) =>
                        handleActivityChange(
                          activity.id,
                          "position",
                          e.target.value
                        )
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500 ${
                        errors[`activity-${activity.id}-position`]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., President, Team Captain"
                    />
                    {errors[`activity-${activity.id}-position`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`activity-${activity.id}-position`]}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={activity.description}
                    onChange={(e) =>
                      handleActivityChange(
                        activity.id,
                        "description",
                        e.target.value
                      )
                    }
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500 ${
                      errors[`activity-${activity.id}-description`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Describe your responsibilities, achievements, and skills developed"
                  />
                  {errors[`activity-${activity.id}-description`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`activity-${activity.id}-description`]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {activities.length === 0 && (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">
                No activities added. Click "Add Activity" to get started.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSaveAndExit}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Save & Exit
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg ${
              canComplete
                ? "bg-sky-600 text-white hover:bg-sky-700 transition-colors"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={!canComplete}
          >
            Save & Complete
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExtracurricularsForm;
