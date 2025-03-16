"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "react-hot-toast";
import axios from "axios";

interface MentorFormProps {
  mentorId?: string; // If provided, we're editing an existing mentor
  onCancel?: () => void;
}

interface Mentor {
  title: string;
  company: string;
  location: string;
  bio: string;
  expertise: string[];
  experience: string;
  education: string;
  languages: string[];
  achievements: string[];
  availability: "available" | "limited" | "unavailable";
  userId?: string; // For admin to assign mentor to a user
}

export default function MentorForm({ mentorId, onCancel }: MentorFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");

  const [formData, setFormData] = useState<Mentor>({
    title: "",
    company: "",
    location: "",
    bio: "",
    expertise: [],
    experience: "",
    education: "",
    languages: [],
    achievements: [],
    availability: "available",
    userId: "",
  });

  // Fetch mentor if we're editing
  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);

      try {
        // Fetch users for dropdown
        const usersResponse = await axios.get(
          "http://localhost:5000/api/admin/users",
          {
            withCredentials: true,
          }
        );

        if (usersResponse.data.users) {
          setUsers(usersResponse.data.users);
        }

        // If we're editing, fetch mentor data
        if (mentorId) {
          const mentorResponse = await axios.get(
            `http://localhost:5000/api/mentors/${mentorId}`,
            {
              withCredentials: true,
            }
          );

          if (mentorResponse.data.mentor) {
            const {
              title,
              company,
              location,
              bio,
              expertise,
              experience,
              education,
              languages,
              achievements,
              availability,
              user,
            } = mentorResponse.data.mentor;

            setFormData({
              title: title || "",
              company: company || "",
              location: location || "",
              bio: bio || "",
              expertise: expertise || [],
              experience: experience || "",
              education: education || "",
              languages: languages || [],
              achievements: achievements || [],
              availability: availability || "available",
              userId: user?._id || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [mentorId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddExpertise = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && expertiseInput.trim()) {
      e.preventDefault();
      if (!formData.expertise.includes(expertiseInput.trim())) {
        setFormData({
          ...formData,
          expertise: [...formData.expertise, expertiseInput.trim()],
        });
      }
      setExpertiseInput("");
    }
  };

  const handleRemoveExpertise = (itemToRemove: string) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((item) => item !== itemToRemove),
    });
  };

  const handleAddLanguage = (e: React.KeyboardEvent) => {
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

  const handleRemoveLanguage = (itemToRemove: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((item) => item !== itemToRemove),
    });
  };

  const handleAddAchievement = (e: React.KeyboardEvent) => {
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

  const handleRemoveAchievement = (itemToRemove: string) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter(
        (item) => item !== itemToRemove
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Make sure all required fields are filled
      if (
        !formData.title.trim() ||
        !formData.company.trim() ||
        !formData.location.trim() ||
        !formData.bio.trim() ||
        !formData.userId
      ) {
        toast.error("Please fill all required fields");
        setIsLoading(false);
        return;
      }

      const payload = {
        ...formData,
        userId: formData.userId,
      };

      const url = mentorId
        ? `http://localhost:5000/api/mentors/${mentorId}`
        : "http://localhost:5000/api/mentors";

      const method = mentorId ? axios.put : axios.post;

      const response = await method(url, payload, {
        withCredentials: true,
      });

      toast.success(
        mentorId ? "Mentor updated successfully" : "Mentor created successfully"
      );

      // Redirect back to admin dashboard
      router.push("/admin");
    } catch (error) {
      console.error("Error saving mentor:", error);
      toast.error("Failed to save mentor");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-sky-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => (onCancel ? onCancel() : router.back())}
          className="flex items-center gap-2 text-sky-700 hover:text-sky-800 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {mentorId ? "Edit Mentor Profile" : "Create New Mentor"}
        </h2>
        <div></div> {/* Empty div to balance the flex layout */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="userId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            User *
          </label>
          <select
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            required
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Senior Software Engineer"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
            placeholder="Professional biography and experience summary"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Master's in Computer Science"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="expertise"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Areas of Expertise
          </label>
          <div className="relative">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.expertise.map((item, index) => (
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
            {formData.expertise.length === 0 && (
              <span className="text-sm text-gray-500">
                No expertise areas added yet
              </span>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="languages"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Languages
          </label>
          <div className="relative">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.languages.map((item, index) => (
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
            {formData.languages.length === 0 && (
              <span className="text-sm text-gray-500">
                No languages added yet
              </span>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="achievements"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Achievements
          </label>
          <div className="relative">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.achievements.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full"
              >
                <span className="text-sm">{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAchievement(item)}
                  className="text-green-700 hover:text-green-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {formData.achievements.length === 0 && (
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="available">Available</option>
            <option value="limited">Limited Availability</option>
            <option value="unavailable">Currently Unavailable</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => (onCancel ? onCancel() : router.back())}
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
            {isLoading ? "Saving..." : "Save Mentor"}
          </button>
        </div>
      </form>
    </div>
  );
}
