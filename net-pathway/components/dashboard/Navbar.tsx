"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut, Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import NotificationDropdown from "../../components/notifications/NotificationDropdown";

const Navbar = () => {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const popupRef = useRef(null);
  const { user, logout } = useAuthStore();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutDialog(false);
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-[4.6rem] bg-white border-b border-gray-100 z-40 shadow-sm">
        <div className="h-full px-5 flex items-center justify-between">
          <div className="flex items-center gap-9">
            <Link href="/dashboard">
              <div className="relative w-[161px] h-[46px]">
                <Image
                  src="/logo-large.png"
                  alt="Net Pathway"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Dropdown */}
            <NotificationDropdown />

            <div className="relative" ref={popupRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-full transition duration-150"
                aria-label="Open profile menu"
                aria-expanded={isProfileOpen}
              >
                {user?.profilePicture ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={user.profilePicture}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-100 to-purple-100 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-5 h-5 text-sky-700" />
                  </div>
                )}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-1 border border-gray-100"
                  >
                    <div className="px-5 py-3 border-b border-gray-100">
                      <p className="text-base font-medium text-gray-900">
                        {user?.username || "User"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email || "loading..."}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition duration-150"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Profile Settings
                      </Link>
                      {/* Profile Settings link */}
                      <div className="px-3 py-1">
                        <div className="border-t border-gray-100"></div>
                      </div>
                      <button
                        onClick={() => {
                          setShowLogoutDialog(true);
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition duration-150"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutDialog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50"
              onClick={() => setShowLogoutDialog(false)}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.2,
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-white rounded-xl shadow-2xl p-6 mx-4 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sign Out
                  </h3>
                  <button
                    onClick={() => setShowLogoutDialog(false)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to sign out of your account?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowLogoutDialog(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
