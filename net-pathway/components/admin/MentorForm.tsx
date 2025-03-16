"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  X,
  Briefcase,
  MapPin,
  GraduationCap,
  Globe,
  Award,
  Tag,
} from "lucide-react";
import { useMentorStore } from "../../store/useMentorStore";
import { useRouter } from "next/navigation"; // Change from 'next/router' to 'next/navigation'
import { toast } from "react-hot-toast";

const MentorFormComponent = ({ mentorId }) => {
  const router = useRouter();
  const {
    currentMentor,
    isLoading,
    error,
    fetchMentorById,
    createMentor,
    updateMentor,
    clearCurrentMentor,
  } = useMentorStore();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    bio: "",
    expertise: [], // Initialize as empty array
    experience: "",
    education: "",
    languages: [], // Initialize as empty array
    achievements: [], // Initialize as empty array
    availability: "available",
  });

  // Input state for array fields
  const [expertiseInput, setExpertiseInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");

  // Fetch mentor data if editing
  useEffect(() => {
    if (mentorId) {
      fetchMentorById(mentorId);
    } else {
      clearCurrentMentor();
    }

    // Cleanup function
    return () => {
      clearCurrentMentor();
    };
  }, [mentorId, fetchMentorById, clearCurrentMentor]);

  // Update form when mentor data is loaded
  useEffect(() => {
    if (currentMentor) {
      setFormData({
        title: currentMentor.title || "",
        company: currentMentor.company || "",
        location: currentMentor.location || "",
        bio: currentMentor.bio || "",
        expertise: Array.isArray(currentMentor.expertise)
          ? currentMentor.expertise
          : [],
        experience: currentMentor.experience || "",
        education: currentMentor.education || "",
        languages: Array.isArray(currentMentor.languages)
          ? currentMentor.languages
          : [],
        achievements: Array.isArray(currentMentor.achievements)
          ? currentMentor.achievements
          : [],
        availability: currentMentor.availability || "available",
      });
    }
  }, [currentMentor]);

  // Display errors from the store
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle expertise array
  const handleAddExpertise = (e) => {
    if (e.key === "Enter" && expertiseInput.trim()) {
      e.preventDefault();

      // Don't add duplicates
      if (!formData.expertise.includes(expertiseInput.trim())) {
        setFormData({
          ...formData,
          expertise: [...formData.expertise, expertiseInput.trim()],
        });
      }
      setExpertiseInput("");
    }
  };

  const handleRemoveExpertise = (item) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((expertise) => expertise !== item),
    });
  };

  // Handle languages array
  const handleAddLanguage = (e) => {
    if (e.key === "Enter" && languageInput.trim()) {
      e.preventDefault();

      if (!formData.languages.includes(languageInput.trim())) {
        setFormData({
          ...formData,
          languages: [...formData.languages, languageInput.trim()],
        });
      }
      setLanguageInput("");
    }
  };

  const handleRemoveLanguage = (item) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((language) => language !== item),
    });
  };

  // Handle achievements array
  const handleAddAchievement = (e) => {
    if (e.key === "Enter" && achievementInput.trim()) {
      e.preventDefault();

      if (!formData.achievements.includes(achievementInput.trim())) {
        setFormData({
          ...formData,
          achievements: [...formData.achievements, achievementInput.trim()],
        });
      }
      setAchievementInput("");
    }
  };

  const handleRemoveAchievement = (item) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter(
        (achievement) => achievement !== item
      ),
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title.trim() ||
      !formData.company.trim() ||
      !formData.location.trim() ||
      !formData.bio.trim() ||
      !formData.experience.trim() ||
      !formData.education.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Ensure arrays are properly passed
      const mentorData = {
        ...formData,
        expertise: Array.isArray(formData.expertise) ? formData.expertise : [],
        languages: Array.isArray(formData.languages) ? formData.languages : [],
        achievements: Array.isArray(formData.achievements)
          ? formData.achievements
          : [],
      };

      let success;

      if (mentorId) {
        // Update existing mentor
        success = await updateMentor(mentorId, mentorData);
      } else {
        // Create new mentor
        success = await createMentor(mentorData);
      }

      if (success) {
        toast.success(
          mentorId
            ? "Mentor updated successfully"
            : "Mentor created successfully"
        );
        router.push("/mentorship");
      } else {
        toast.error("Failed to save mentor profile");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("An error occurred while saving the mentor profile");
    }
  };

  // Button-click handlers for array inputs
  const handleButtonAddExpertise = () => {
    if (
      expertiseInput.trim() &&
      !formData.expertise.includes(expertiseInput.trim())
    ) {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, expertiseInput.trim()],
      });
      setExpertiseInput("");
    }
  };

  const handleButtonAddLanguage = () => {
    if (
      languageInput.trim() &&
      !formData.languages.includes(languageInput.trim())
    ) {
      setFormData({
        ...formData,
        languages: [...formData.languages, languageInput.trim()],
      });
      setLanguageInput("");
    }
  };

  const handleButtonAddAchievement = () => {
    if (
      achievementInput.trim() &&
      !formData.achievements.includes(achievementInput.trim())
    ) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, achievementInput.trim()],
      });
      setAchievementInput("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center gap-2 text-sky-700 hover:text-sky-800 group"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {mentorId ? "Edit Mentor Profile" : "Create Mentor Profile"}
        </h2>
        <div></div> {/* Empty div for flex spacing */}
      </div>

      {isLoading && !currentMentor && mentorId ? (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Title *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Senior Software Engineer"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio *
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Your professional bio and experience summary"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Experience *
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="10+ years in Software Development"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="education"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Education *
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="Master's in Computer Science"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Expertise Array Field */}
          <div>
            <label
              htmlFor="expertise"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Areas of Expertise
            </label>
            <div className="relative flex">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="expertise"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyDown={handleAddExpertise}
                placeholder="Add a skill and press Enter"
                className="flex-grow pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleButtonAddExpertise}
                className="px-4 py-2 bg-sky-50 border-y border-r border-gray-300 rounded-r-lg text-sky-700 hover:bg-sky-100 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(formData.expertise) &&
                formData.expertise.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-sky-50 text-sky-700 rounded-full"
                  >
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExpertise(item)}
                      className="text-sky-700 hover:text-sky-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              {(!formData.expertise || formData.expertise.length === 0) && (
                <span className="text-sm text-gray-500">
                  No expertise areas added yet
                </span>
              )}
            </div>
          </div>

          {/* Languages Array Field */}
          <div>
            <label
              htmlFor="languages"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Languages
            </label>
            <div className="relative flex">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="languages"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyDown={handleAddLanguage}
                placeholder="Add a language and press Enter"
                className="flex-grow pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleButtonAddLanguage}
                className="px-4 py-2 bg-purple-50 border-y border-r border-gray-300 rounded-r-lg text-purple-700 hover:bg-purple-100 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(formData.languages) &&
                formData.languages.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full"
                  >
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(item)}
                      className="text-purple-700 hover:text-purple-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              {(!formData.languages || formData.languages.length === 0) && (
                <span className="text-sm text-gray-500">
                  No languages added yet
                </span>
              )}
            </div>
          </div>

          {/* Achievements Array Field */}
          <div>
            <label
              htmlFor="achievements"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Achievements
            </label>
            <div className="relative flex">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Award className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="achievements"
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                onKeyDown={handleAddAchievement}
                placeholder="Add an achievement and press Enter"
                className="flex-grow pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleButtonAddAchievement}
                className="px-4 py-2 bg-amber-50 border-y border-r border-gray-300 rounded-r-lg text-amber-700 hover:bg-amber-100 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(formData.achievements) &&
                formData.achievements.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full"
                  >
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(item)}
                      className="text-amber-700 hover:text-amber-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              {(!formData.achievements ||
                formData.achievements.length === 0) && (
                <span className="text-sm text-gray-500">
                  No achievements added yet
                </span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="availability"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="available">Available</option>
              <option value="limited">Limited Availability</option>
              <option value="unavailable">Currently Unavailable</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
              disabled={isLoading}
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MentorFormComponent;
