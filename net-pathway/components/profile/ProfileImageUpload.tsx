"use client";

import React, { useState, useRef } from "react";
import { Camera, Upload, Trash2, Loader } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ProfileImageUploadProps {
  onImageUpdated?: (imageUrl: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  onImageUpdated,
}) => {
  const { user, refreshUserData } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open file dialog when clicking the upload area
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
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

    // Upload file
    await uploadImage(file);
  };

  // Handle upload through file object
  const uploadImage = async (file: File) => {
    setIsUploading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("image", file);

      // Send to server
      const response = await axios.post(
        `${API_URL}/profile/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Update user data
      if (response.data.imageUrl) {
        toast.success("Profile image updated successfully");

        // Refresh user data to get the updated profile picture
        await refreshUserData();

        // Call callback if provided
        if (onImageUpdated) {
          onImageUpdated(response.data.imageUrl);
        }
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle image as base64 string (from cropper or other source)
  const uploadBase64Image = async (base64Image: string) => {
    setIsUploading(true);

    try {
      // Send to server
      const response = await axios.post(
        `${API_URL}/profile/image/upload`,
        { image: base64Image },
        {
          withCredentials: true,
        }
      );

      // Update user data
      if (response.data.imageUrl) {
        toast.success("Profile image updated successfully");

        // Refresh user data to get the updated profile picture
        await refreshUserData();

        // Call callback if provided
        if (onImageUpdated) {
          onImageUpdated(response.data.imageUrl);
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
  const deleteProfileImage = async () => {
    if (!user?.profilePicture) return;

    if (!confirm("Are you sure you want to remove your profile picture?")) {
      return;
    }

    setIsDeleting(true);

    try {
      await axios.delete(`${API_URL}/profile/image`, {
        withCredentials: true,
      });

      toast.success("Profile image removed");

      // Refresh user data
      await refreshUserData();

      // Call callback with null if provided
      if (onImageUpdated) {
        onImageUpdated("");
      }
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast.error(error.response?.data?.message || "Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
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
              <Upload className="w-8 h-8 text-sky-700 mb-1" />
              <span className="text-xs text-sky-700 font-medium">Upload</span>
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
            onClick={deleteProfileImage}
            className="absolute -bottom-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            title="Remove profile picture"
          >
            <Trash2 className="w-4 h-4" />
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
  );
};

export default ProfileImageUpload;
