"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Camera } from "lucide-react";

const ProfilePage = () => {
  const router = useRouter();
  const {
    user,
    isLoading,
    error,
    successMessage,
    isSubmitting,
    isAuthenticated,
    updateProfile,
    updateProfileImage,
    deactivateAccount,
    clearMessages,
    checkAuthStatus,
  } = useAuthStore();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initAuth = async () => {
      const isAuthorized = await checkAuthStatus();
      if (!isAuthorized) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuthStatus, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  // Reset form data when user changes or editing mode toggles
  const resetForm = () => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
  };

  // Initialize form when user data loads or editing toggles
  useEffect(() => {
    if (user && (formData.username === "" || formData.email === "")) {
      resetForm();
    }
  }, [user]);

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          updateProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Open file dialog when clicking on profile image
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    if (!error) {
      setIsEditing(false);
    }
  };

  // Handle account deactivation
  const handleDeactivateAccount = async () => {
    try {
      const success = await deactivateAccount();
      if (success) {
        clearMessages();
        router.replace("/auth/login");
      } else {
        throw new Error("Failed to deactivate account");
      }
    } catch (error) {
      console.error("Deactivation error:", error);
      setShowDeactivateModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Sidebar onCollapse={setIsSidebarCollapsed} />
        <main
          className={`pt-16 ${
            isSidebarCollapsed ? "ml-20" : "ml-64"
          } transition-all duration-300`}
        >
          <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
            <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Sidebar onCollapse={setIsSidebarCollapsed} />
        <main
          className={`pt-16 ${
            isSidebarCollapsed ? "ml-20" : "ml-64"
          } transition-all duration-300`}
        >
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
            {/* <h1 className="text-2xl font-bold text-red-500">
              Authentication Error
            </h1>
            <p className="text-gray-600 mt-2">
              Please log in to view your profile.
            </p> */}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar onCollapse={setIsSidebarCollapsed} />
      <main
        className={`pt-16 ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-300`}
      >
        <div className="p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-sky-600 mb-6">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <div
                    className="w-32 h-32 bg-gradient-to-r from-sky-100 to-purple-100 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
                    onClick={triggerFileInput}
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.username}
                        className="h-full w-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <User className="w-16 h-16 text-sky-700" />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                      <div className="flex flex-col items-center text-white">
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">
                          Change Photo
                        </span>
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.username}
                  </h1>
                  <p className="text-gray-500">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-sky-100 text-sky-700 text-sm rounded-full">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              {successMessage && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                  {successMessage}
                  <button
                    className="absolute top-0 right-0 px-4 py-3"
                    onClick={clearMessages}
                  >
                    &times;
                  </button>
                </div>
              )}

              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                  <button
                    className="absolute top-0 right-0 px-4 py-3"
                    onClick={clearMessages}
                  >
                    &times;
                  </button>
                </div>
              )}

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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onClick={() => {
                          resetForm();
                          setIsEditing(false);
                          clearMessages();
                        }}
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
                        <p className="font-medium">{user.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <Mail className="w-5 h-5 text-sky-600" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        resetForm();
                        setIsEditing(true);
                        clearMessages();
                      }}
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                    >
                      Edit Profile
                    </button>
                    {/* Deactivation Modal */}
                    {showDeactivateModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Deactivate Account
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Are you sure you want to deactivate your account?
                            This action is reversible only by an administrator.
                          </p>
                          <div className="flex space-x-4 justify-end">
                            <button
                              onClick={() => setShowDeactivateModal(false)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleDeactivateAccount}
                              disabled={isSubmitting}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                              {isSubmitting ? "Deactivating..." : "Deactivate"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Update the deactivate button to open modal */}
                    <button
                      onClick={() => setShowDeactivateModal(true)}
                      className="px-4 py-2 border border-gray-300 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      Deactivate Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
