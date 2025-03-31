import React, { useState } from "react";
import { Users, Plus, Trash2, AlertCircle, X } from "lucide-react";

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
}

const ExtracurricularsForm: React.FC<ExtracurricularsFormProps> = ({
  onSubmit,
  onCancel,
  initialData = null,
}) => {
  // List of predefined activities
  const predefinedActivities = [
    "Student Council",
    "Model UN",
    "Debate Club",
    "Soccer Team",
    "Basketball Team",
    "Track and Field",
    "Swimming",
    "Volleyball",
    "Chess Club",
    "Mathematics Club",
    "Science Club",
    "Robotics Club",
    "Coding Club",
    "Art Club",
    "Music Band",
    "Choir",
    "Drama Club",
    "School Newspaper",
    "Yearbook Committee",
    "Environmental Club",
    "Community Service",
    "Red Cross/Red Crescent",
    "Entrepreneurship Club",
    "National Honor Society",
    "Other",
  ];

  // State for activities
  const [activities, setActivities] = useState<Activity[]>(
    initialData?.activities || [
      { id: "1", name: "", position: "", description: "" },
    ]
  );

  // State for custom activity input
  const [customActivity, setCustomActivity] = useState("");
  const [showCustomActivityInput, setShowCustomActivityInput] = useState(false);

  // State for validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Add a new activity row
  const addActivity = () => {
    setActivities([
      ...activities,
      {
        id: `${activities.length + 1}`,
        name: "",
        position: "",
        description: "",
      },
    ]);
  };

  // Remove an activity row
  const removeActivity = (id: string) => {
    if (activities.length > 1) {
      setActivities(activities.filter((activity) => activity.id !== id));
    }
  };

  // Update activity data
  const updateActivity = (id: string, field: keyof Activity, value: string) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    );

    // Clear error when user updates the field
    if (errors[`activity-${id}-${field}`]) {
      setErrors({
        ...errors,
        [`activity-${id}-${field}`]: "",
      });
    }
  };

  // Add custom activity
  const addCustomActivity = () => {
    if (customActivity.trim()) {
      // Find the next available ID
      const maxId = Math.max(...activities.map((a) => parseInt(a.id)), 0);
      setActivities([
        ...activities,
        {
          id: `${maxId + 1}`,
          name: customActivity,
          position: "",
          description: "",
        },
      ]);
      setCustomActivity("");
      setShowCustomActivityInput(false);
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate each activity
    activities.forEach((activity) => {
      if (!activity.name) {
        newErrors[`activity-${activity.id}-name`] = "Please select an activity";
      }

      if (!activity.position) {
        newErrors[`activity-${activity.id}-position`] =
          "Please enter your position";
      }

      if (!activity.description) {
        newErrors[`activity-${activity.id}-description`] =
          "Please provide a description";
      } else if (activity.description.length > 200) {
        newErrors[`activity-${activity.id}-description`] =
          "Description should be less than 200 characters";
      }
    });

    // Check for minimum of 5 activities if not all filled
    const filledActivities = activities.filter(
      (a) => a.name && a.position && a.description
    );
    if (filledActivities.length < 1) {
      newErrors.minActivities = "Please document at least one activity";
    }

    // Check for duplicate activities
    const activityNames = activities
      .map((a) => a.name)
      .filter((name) => name !== "");
    const uniqueActivityNames = new Set(activityNames);

    if (uniqueActivityNames.size !== activityNames.length) {
      newErrors.duplicateActivities = "Duplicate activities are not allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Filter out any empty activities
      const validActivities = activities.filter(
        (activity) =>
          activity.name.trim() !== "" &&
          activity.position.trim() !== "" &&
          activity.description.trim() !== ""
      );

      onSubmit({
        activities: validActivities,
        submittedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Extracurriculars & Leadership
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-purple-800 font-medium">Why This Matters</p>
          <p className="text-purple-700 text-sm">
            Extracurricular activities and leadership roles provide valuable
            insights into your skills, interests, and potential. Try to document
            at least 5 significant activities.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Activities List */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Activities and Positions
            </label>
          </div>

          {errors.minActivities && (
            <p className="mb-2 text-sm text-red-600">{errors.minActivities}</p>
          )}

          {errors.duplicateActivities && (
            <p className="mb-2 text-sm text-red-600">
              {errors.duplicateActivities}
            </p>
          )}
          <div className="space-y-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:border-purple-200 transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-700 font-medium flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-sm font-bold">
                      {activity.id}
                    </span>
                    <span>Activity</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeActivity(activity.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Remove activity"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Activity Name - Improved Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Activity Name
                    </label>
                    <div className="relative">
                      <select
                        value={activity.name}
                        onChange={(e) =>
                          updateActivity(activity.id, "name", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white pr-10"
                      >
                        <option value="">Select Activity</option>
                        {predefinedActivities.map((name) => (
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
                    </div>
                    {errors[`activity-${activity.id}-name`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`activity-${activity.id}-name`]}
                      </p>
                    )}
                  </div>

                  {/* Position Held - Improved Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Position Held
                    </label>
                    <input
                      type="text"
                      value={activity.position}
                      onChange={(e) =>
                        updateActivity(activity.id, "position", e.target.value)
                      }
                      placeholder="e.g., President, Captain, Member, Volunteer"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    {errors[`activity-${activity.id}-position`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`activity-${activity.id}-position`]}
                      </p>
                    )}
                  </div>

                  {/* Description - Improved Textarea */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={activity.description}
                      onChange={(e) =>
                        updateActivity(
                          activity.id,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe your role, responsibilities, and achievements"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                    />
                    <div className="mt-1.5 flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Briefly describe your involvement and achievements
                      </p>
                      <span
                        className={`text-xs ${
                          activity.description.length > 180
                            ? "text-amber-600"
                            : "text-gray-500"
                        }`}
                      >
                        {activity.description.length}/200 characters
                      </span>
                    </div>
                    {errors[`activity-${activity.id}-description`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`activity-${activity.id}-description`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Activity */}
          {showCustomActivityInput ? (
            <div className="mt-4 flex gap-3">
              <input
                type="text"
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                placeholder="Enter custom activity"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                type="button"
                onClick={addCustomActivity}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomActivityInput(false);
                  setCustomActivity("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustomActivityInput(true)}
              className="mt-4 text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Custom Activity
            </button>
          )}

          {/* Add More Activities Button */}
          <button
            type="button"
            onClick={addActivity}
            className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-purple-600 hover:border-purple-500 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Another Activity
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
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            Save Activities
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExtracurricularsForm;
