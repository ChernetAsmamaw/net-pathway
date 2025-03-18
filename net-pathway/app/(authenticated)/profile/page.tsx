// app/(authenticated)/profile/page.tsx
"use client";

import { useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import { User, Mail, Camera, Loader } from "lucide-react";
import axios from "axios";
import VerificationBadge from "@/components/varification/VerificationBadge";
import ImageCropper from "@/components/profile/ImageCropper";

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
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await updateProfile(formData);

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
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  // Send verification email
  const handleSendVerificationEmail = async () => {
    try {
      setIsSendingVerification(true);
      await axios.post(
        `${API_URL}/verification/send`,
        {},
        { withCredentials: true }
      );
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Failed to send verification email:", error);
      toast.error("Failed to send verification email. Please try again later.");
    } finally {
      setIsSendingVerification(false);
    }
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
    // Close cropper
    setCropperImage(null);

    // Upload cropped image
    await uploadImage(croppedImageBase64);
  };

  // Upload image as base64
  const uploadImage = async (base64Image: string) => {
    setIsUploading(true);

    try {
      // Check if we should use the auth store method or direct API call
      if (uploadProfileImageBase64) {
        // Use auth store method
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

          // Refresh user data
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
      // Check if we should use auth store method or direct API call
      if (deleteProfileImage) {
        // Use auth store method
        const success = await deleteProfileImage();

        if (success) {
          toast.success("Profile image removed");
        } else {
          toast.error("Failed to delete image");
        }
      } else {
        // Direct API call (fallback)
        await axios.delete(`${API_URL}/profile/image`, {
          withCredentials: true,
        });

        toast.success("Profile image removed");

        // Refresh user data
        await refreshUserData();
      }
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast.error(error.response?.data?.message || "Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
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
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
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
            </div>

            {/* Email Verification Section */}
            {!user?.isEmailVerified && (
              <div className="bg-amber-50 p-4 rounded-xl border-l-4 border-amber-500">
                <h3 className="text-amber-800 font-medium mb-2">
                  Email Verification Required
                </h3>
                <p className="text-amber-700 mb-3">
                  Please verify your email address to access all features of Net
                  Pathway.
                </p>
                <button
                  onClick={handleSendVerificationEmail}
                  disabled={isSendingVerification}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {isSendingVerification
                    ? "Sending..."
                    : "Send Verification Email"}
                </button>
              </div>
            )}

            {/* Edit Profile Button */}
            <div className="flex space-x-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
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
