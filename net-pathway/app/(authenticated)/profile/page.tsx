"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Camera,
  Loader,
  MapPin,
  School,
  Calendar,
  Info,
  Tag,
  Code,
  Clock,
  CheckCircle,
  X,
  ExternalLink,
  Star,
} from "lucide-react";
import axios from "axios";
import VerificationBadge from "@/components/verification/VerificationBadge";
import ImageCropper from "@/components/profile/ImageCropper";
import VerificationCodeInput from "@/components/verification/VerificationCodeInput";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ProfilePage() {
  const {
    user,
    updateProfile,
    uploadProfileImageBase64,
    deleteProfileImage,
    refreshUserData,
  } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data with user data or empty values
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    location: user?.location || "",
    highSchoolName: user?.highSchool?.name || "",
    graduationYear: user?.highSchool?.graduationYear?.toString() || "",
    educationYear: user?.educationYear || "Other",
    bio: user?.bio || "",
    interests: user?.interests?.join(", ") || "",
    skills: user?.skills?.join(", ") || "",
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : "",
  });

  // Refresh form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        location: user.location || "",
        highSchoolName: user.highSchool?.name || "",
        graduationYear: user.highSchool?.graduationYear?.toString() || "",
        educationYear: user.educationYear || "Other",
        bio: user.bio || "",
        interests: user.interests?.join(", ") || "",
        skills: user.skills?.join(", ") || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    }
  }, [user]);

  // Handle profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.username.trim()) {
        toast.error("Username is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        toast.error("Valid email is required");
        setIsSubmitting(false);
        return;
      }

      // Convert comma-separated strings to arrays
      const interests = formData.interests
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
      const skills = formData.skills
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);

      // Format highSchool object
      const highSchool = {
        name: formData.highSchoolName,
        graduationYear: formData.graduationYear
          ? Number(formData.graduationYear)
          : null,
      };

      // Prepare updated profile data
      const updatedProfileData = {
        username: formData.username,
        email: formData.email,
        location: formData.location,
        highSchool,
        educationYear: formData.educationYear,
        bio: formData.bio,
        interests,
        skills,
        dateOfBirth: formData.dateOfBirth || null,
      };

      const success = await updateProfile(updatedProfileData);

      if (success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form data when canceling edit
  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        location: user.location || "",
        highSchoolName: user.highSchool?.name || "",
        graduationYear: user.highSchool?.graduationYear?.toString() || "",
        educationYear: user.educationYear || "Other",
        bio: user.bio || "",
        interests: user.interests?.join(", ") || "",
        skills: user.skills?.join(", ") || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    }
    setIsEditing(false);
  };

  // Image upload functions
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    // Convert file to base64 for cropper
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCropperImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Clear input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle cropped image
  const handleCroppedImage = async (croppedImageBase64: string) => {
    setCropperImage(null);
    await uploadImage(croppedImageBase64);
  };

  // Upload image as base64
  const uploadImage = async (base64Image: string) => {
    setIsUploading(true);

    try {
      // Use auth store method if available
      if (uploadProfileImageBase64) {
        const imageUrl = await uploadProfileImageBase64(base64Image);

        if (imageUrl) {
          toast.success("Profile image updated successfully");
        } else {
          toast.error("Failed to upload image");
        }
      } else {
        // Direct API call (fallback)
        const response = await axios.post(
          `${API_URL}/profile/image/upload`,
          { image: base64Image },
          { withCredentials: true }
        );

        if (response.data.imageUrl) {
          toast.success("Profile image updated successfully");
          await refreshUserData();
        }
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete profile image
  const handleDeleteImage = async () => {
    if (!user?.profilePicture) return;

    if (!confirm("Are you sure you want to remove your profile picture?")) {
      return;
    }

    setIsDeleting(true);

    try {
      if (deleteProfileImage) {
        const success = await deleteProfileImage();

        if (success) {
          toast.success("Profile image removed");
        } else {
          toast.error("Failed to delete image");
        }
      } else {
        await axios.delete(`${API_URL}/profile/image`, {
          withCredentials: true,
        });

        toast.success("Profile image removed");
        await refreshUserData();
      }
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast.error(error.response?.data?.message || "Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle send verification email
  const handleSendVerification = async () => {
    setIsSendingVerification(true);
    try {
      const response = await axios.post(
        `${API_URL}/verification/send-code`,
        {},
        { withCredentials: true }
      );

      toast.success("Verification code sent! Please check your inbox.");
      setShowVerificationInput(true);
    } catch (error) {
      console.error("Failed to send verification code:", error);
      toast.error("Failed to send verification code. Please try again later.");
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleVerificationSuccess = async () => {
    await refreshUserData();
    setShowVerificationInput(false);
    toast.success("Your email has been verified!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-sky-600 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Profile image */}
            <div className="relative group">
              <div
                className="w-32 h-32 bg-gradient-to-r from-sky-100 to-purple-100 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={handleUploadClick}
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Camera className="w-8 h-8 text-sky-700 mb-1" />
                    <span className="text-xs text-sky-700 font-medium">
                      Upload
                    </span>
                  </div>
                )}

                {/* Overlay for upload */}
                {!isUploading && !isDeleting && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                    <div className="flex flex-col items-center text-white">
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-sm font-medium">Change Photo</span>
                    </div>
                  </div>
                )}

                {/* Loading overlay */}
                {(isUploading || isDeleting) && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-full">
                    <Loader className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Delete button - only show if user has a profile image */}
              {user?.profilePicture && !isUploading && !isDeleting && (
                <button
                  onClick={handleDeleteImage}
                  className="absolute -bottom-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove profile picture"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Text label */}
            <p className="mt-3 text-sm text-gray-500">
              {user?.profilePicture
                ? "Click to change your profile picture"
                : "Click to upload a profile picture"}
            </p>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.username}
              </h1>
              {/* Verification Badge */}
              <VerificationBadge
                isVerified={user?.isEmailVerified || false}
                showSendButton={!user?.isEmailVerified}
                size="md"
              />
            </div>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-sky-100 text-sky-700 text-sm rounded-full">
              {user?.role &&
                user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>

            {/* Basic Info Summary */}
            <div className="mt-3 flex flex-wrap gap-3">
              {user?.location && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>{user.location}</span>
                </div>
              )}

              {user?.highSchool?.name && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <School className="w-4 h-4 text-sky-600" />
                  <span>{user.highSchool.name}</span>
                </div>
              )}

              {user?.educationYear && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>{user.educationYear}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Code Input Modal */}
      {showVerificationInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <VerificationCodeInput
              onSuccess={handleVerificationSuccess}
              onCancel={() => setShowVerificationInput(false)}
            />
          </div>
        </div>
      )}

      {/* Profile Content */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab(0)}
            className={`py-3 px-5 font-medium text-sm transition-colors flex-1 text-center ${
              activeTab === 0
                ? "text-sky-700 border-b-2 border-sky-500 bg-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`py-3 px-5 font-medium text-sm transition-colors flex-1 text-center ${
              activeTab === 1
                ? "text-sky-700 border-b-2 border-sky-500 bg-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`py-3 px-5 font-medium text-sm transition-colors flex-1 text-center ${
              activeTab === 2
                ? "text-sky-700 border-b-2 border-sky-500 bg-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Skills & Bio
          </button>
        </div>

        <div className="p-6">
          {/* Edit/Save buttons */}
          <div className="flex justify-end mb-6">
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Email verification section - always visible */}
          {!user?.isEmailVerified && (
            <div className="bg-amber-50 p-4 rounded-xl border-l-4 border-amber-500 mb-6">
              <h3 className="font-medium text-amber-800 mb-1">
                Email Verification Required
              </h3>
              <p className="text-amber-700 text-sm mb-3">
                Please verify your email address to access all features of Net
                Pathway.
              </p>
              <button
                onClick={handleSendVerification}
                disabled={isSendingVerification}
                className="px-3 py-1.5 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {isSendingVerification
                  ? "Sending..."
                  : "Send Verification Code"}
              </button>
            </div>
          )}

          {/* Tab 1: Basic Info */}
          {activeTab === 0 && (
            <div>
              {isEditing ? (
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="City, Country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-sky-600" />
                      <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-medium">{user?.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <Mail className="w-5 h-5 text-sky-600" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-sky-600" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">
                          {user?.location || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-sky-600" />
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium">
                          {user?.dateOfBirth
                            ? new Date(user.dateOfBirth).toLocaleDateString()
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Education */}
          {activeTab === 1 && (
            <div>
              {isEditing ? (
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="highSchoolName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      High School Name
                    </label>
                    <input
                      type="text"
                      id="highSchoolName"
                      value={formData.highSchoolName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          highSchoolName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="graduationYear"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Graduation Year
                      </label>
                      <input
                        type="number"
                        id="graduationYear"
                        value={formData.graduationYear}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            graduationYear: e.target.value,
                          })
                        }
                        min="1900"
                        max="2100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="educationYear"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Education Year
                      </label>
                      <div className="relative"></div>
                      <select
                        id="educationYear"
                        value={formData.educationYear}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            educationYear: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 appearance-none bg-white"
                      >
                        <option value="Freshman Year">Freshman Year</option>
                        <option value="Sophomore Year">Sophomore Year</option>
                        <option value="Junior Year">Junior Year</option>
                        <option value="Senior Year">Senior Year</option>
                        <option value="Gap Year">Gap Year</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <School className="w-5 h-5 text-sky-600" />
                      <div>
                        <p className="text-sm text-gray-500">High School</p>
                        <p className="font-medium">
                          {user?.highSchool?.name || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-sky-600" />
                      <div>
                        <p className="text-sm text-gray-500">Graduation Year</p>
                        <p className="font-medium">
                          {user?.highSchool?.graduationYear || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <Clock className="w-5 h-5 text-sky-600" />
                      <div>
                        <p className="text-sm text-gray-500">Education Year</p>
                        <p className="font-medium">
                          {user?.educationYear || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Education resource links */}
                  <div className="mt-6 bg-blue-50 p-5 rounded-xl">
                    <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      Related Educational Resources
                    </h3>
                    <ul className="space-y-2 pl-7 text-blue-700">
                      <li className="hover:underline cursor-pointer">
                        <a href="#" className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Career guidance for{" "}
                          {user?.educationYear || "students"}
                        </a>
                      </li>
                      <li className="hover:underline cursor-pointer">
                        <a href="#" className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Scholarship opportunities
                        </a>
                      </li>
                      <li className="hover:underline cursor-pointer">
                        <a href="#" className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Student networking events
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Skills & Bio */}
          {activeTab === 2 && (
            <div>
              {isEditing ? (
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Biography
                    </label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="interests"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Interests (comma separated)
                    </label>
                    <input
                      type="text"
                      id="interests"
                      value={formData.interests}
                      onChange={(e) =>
                        setFormData({ ...formData, interests: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Reading, Music, Sports..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="skills"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      id="skills"
                      value={formData.skills}
                      onChange={(e) =>
                        setFormData({ ...formData, skills: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Programming, Design, Writing..."
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-3 mb-2">
                      <Info className="w-5 h-5 text-sky-600 mt-0.5" />
                      <h3 className="text-md font-medium text-gray-900">
                        Biography
                      </h3>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap pl-8">
                      {user?.bio || "No biography provided yet."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-start gap-3 mb-3">
                        <Tag className="w-5 h-5 text-sky-600 mt-0.5" />
                        <h3 className="text-md font-medium text-gray-900">
                          Interests
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-8">
                        {user?.interests && user.interests.length > 0 ? (
                          user.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm"
                            >
                              {interest}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">
                            No interests listed yet.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-start gap-3 mb-3">
                        <Code className="w-5 h-5 text-sky-600 mt-0.5" />
                        <h3 className="text-md font-medium text-gray-900">
                          Skills
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-8">
                        {user?.skills && user.skills.length > 0 ? (
                          user.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills listed yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skill assessment promotion */}
                  {user?.skills && user.skills.length > 0 && (
                    <div className="mt-6 bg-purple-50 p-5 rounded-xl">
                      <h3 className="font-medium text-purple-800 mb-2">
                        Skill Recommendations
                      </h3>
                      <p className="text-purple-700 text-sm mb-3">
                        Based on your skills, you might be interested in these
                        career paths:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                        {user.skills.includes("Programming") && (
                          <div className="flex items-center gap-2 text-purple-800">
                            <CheckCircle className="w-4 h-4" />
                            <span>Software Development</span>
                          </div>
                        )}
                        {user.skills.includes("Design") && (
                          <div className="flex items-center gap-2 text-purple-800">
                            <CheckCircle className="w-4 h-4" />
                            <span>UX/UI Design</span>
                          </div>
                        )}
                        {user.skills.includes("Writing") && (
                          <div className="flex items-center gap-2 text-purple-800">
                            <CheckCircle className="w-4 h-4" />
                            <span>Content Creation</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-purple-800">
                          <CheckCircle className="w-4 h-4" />
                          <span>Career Assessment</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button
                          className="text-sm bg-purple-200 text-purple-800 px-3 py-1.5 rounded-lg hover:bg-purple-300 transition-colors"
                          onClick={() => (window.location.href = "/assessment")}
                        >
                          Take full assessment →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Cropper Modal */}
      {cropperImage && (
        <ImageCropper
          imageSrc={cropperImage}
          onCropComplete={handleCroppedImage}
          onCancel={() => setCropperImage(null)}
          aspect={1}
        />
      )}
    </div>
  );
}
