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
  Mail,
  Phone,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface MentorFormProps {
  mentorId?: string;
  onCancel?: () => void;
}

const MentorForm: React.FC<MentorFormProps> = ({ mentorId, onCancel }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Form state with simple array handling
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    bio: "",
    expertise: [] as string[],
    experience: "",
    education: "",
    languages: [] as string[],
    achievements: [] as string[],
    email: "",
    phone: "",
    availability: "available" as "available" | "limited" | "unavailable",
  });

  // Input state for array fields
  const [expertiseInput, setExpertiseInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");

  // Fetch mentor data if editing
  useEffect(() => {
    if (mentorId) {
      fetchMentor();
    }
  }, [mentorId]);

  const fetchMentor = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${API_URL}/mentors/${mentorId}`, {
        withCredentials: true,
      });

      if (response.data.mentor) {
        const mentorData = response.data.mentor;
        setFormData({
          title: mentorData.title || "",
          company: mentorData.company || "",
          location: mentorData.location || "",
          bio: mentorData.bio || "",
          expertise: Array.isArray(mentorData.expertise)
            ? mentorData.expertise
            : [],
          experience: mentorData.experience || "",
          education: mentorData.education || "",
          languages: Array.isArray(mentorData.languages)
            ? mentorData.languages
            : [],
          achievements: Array.isArray(mentorData.achievements)
            ? mentorData.achievements
            : [],
          email: mentorData.email || mentorData.user?.email || "",
          phone: mentorData.phone || "",
          availability: mentorData.availability || "available",
        });
      }
    } catch (error) {
      console.error("Error fetching mentor:", error);
      toast.error("Failed to load mentor data");
    } finally {
      setIsFetching(false);
    }
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add item to an array field
  const handleAddItem = (
    field: "expertise" | "languages" | "achievements",
    value: string
  ) => {
    if (!value.trim()) return;

    if (!formData[field].includes(value.trim())) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()],
      });
    }
  };

  // Remove item from an array field
  const handleRemoveItem = (
    field: "expertise" | "languages" | "achievements",
    item: string
  ) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((i) => i !== item),
    });
  };

  // Handle keypresses (Enter) in array input fields
  const handleKeypress = (
    e: React.KeyboardEvent,
    field: "expertise" | "languages" | "achievements",
    value: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) {
        handleAddItem(field, value);

        // Clear the corresponding input
        if (field === "expertise") setExpertiseInput("");
        if (field === "languages") setLanguageInput("");
        if (field === "achievements") setAchievementInput("");
      }
    }
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.bio ||
      !formData.experience ||
      !formData.education
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    try {
      let response;

      if (mentorId) {
        // Update existing mentor
        response = await axios.put(`${API_URL}/mentors/${mentorId}`, formData, {
          withCredentials: true,
        });
      } else {
        // Create new mentor
        response = await axios.post(`${API_URL}/mentors`, formData, {
          withCredentials: true,
        });
      }

      if (response.data) {
        toast.success(
          mentorId
            ? "Mentor updated successfully"
            : "Mentor created successfully"
        );
        if (onCancel) {
          onCancel();
        } else {
          router.push("/admin");
        }
      }
    } catch (error: any) {
      console.error("Error saving mentor:", error);
      toast.error(
        error.response?.data?.message || "Failed to save mentor profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center py-10">
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
          {mentorId ? "Edit Mentor Profile" : "Create Mentor Profile"}
        </h2>
        <div></div> {/* Spacer for flex alignment */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
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

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 123 456 7890"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
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
          <div className="flex">
            <div className="flex-grow">
              <div className="relative flex">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="expertise"
                  value={expertiseInput}
                  onChange={(e) => setExpertiseInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeypress(e, "expertise", expertiseInput)
                  }
                  placeholder="Add a skill and press Enter"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddItem("expertise", expertiseInput);
                    setExpertiseInput("");
                  }}
                  className="px-4 py-2 bg-sky-50 border border-gray-300 rounded-r-lg text-sky-700 hover:bg-sky-100"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.expertise.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-sky-50 text-sky-700 rounded-full"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem("expertise", item)}
                  className="text-sky-700 hover:text-sky-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {formData.expertise.length === 0 && (
              <p className="text-sm text-gray-500">No expertise added yet</p>
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
          <div className="flex">
            <div className="flex-grow">
              <div className="relative flex">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="languages"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeypress(e, "languages", languageInput)
                  }
                  placeholder="Add a language and press Enter"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddItem("languages", languageInput);
                    setLanguageInput("");
                  }}
                  className="px-4 py-2 bg-purple-50 border border-gray-300 rounded-r-lg text-purple-700 hover:bg-purple-100"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.languages.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem("languages", item)}
                  className="text-purple-700 hover:text-purple-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {formData.languages.length === 0 && (
              <p className="text-sm text-gray-500">No languages added yet</p>
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
          <div className="flex">
            <div className="flex-grow">
              <div className="relative flex">
                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="achievements"
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeypress(e, "achievements", achievementInput)
                  }
                  placeholder="Add an achievement and press Enter"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddItem("achievements", achievementInput);
                    setAchievementInput("");
                  }}
                  className="px-4 py-2 bg-amber-50 border border-gray-300 rounded-r-lg text-amber-700 hover:bg-amber-100"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.achievements.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem("achievements", item)}
                  className="text-amber-700 hover:text-amber-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {formData.achievements.length === 0 && (
              <p className="text-sm text-gray-500">No achievements added yet</p>
            )}
          </div>
        </div>

        {/* Availability */}
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

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => (onCancel ? onCancel() : router.back())}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MentorForm;
