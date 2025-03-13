"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import Image from "next/image";
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "", // Changed from name to username to match API
    email: "",
    password: "",
    confirmPassword: "", // Added confirmPassword field
  });

  const { register } = useAuthStore();

  const handelRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!username || !email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!username.trim()) {
      toast.error("Username is required");
      setIsLoading(false);
      return;
    }

    try {
      await register(username, email, password);
      toast.success("Registration successful!");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 100);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? (error.response as any)?.data?.message || "Registration failed"
          : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="relative w-[350px] h-[150px] mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-100 to-purple-100 animate-pulse"></div>
            <Link href="/">
              <Image
                src="/logo-large.png"
                alt="Net Pathway"
                width={300}
                height={150}
                className="relative z-10"
              />
            </Link>
          </div>
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-sky-900 mb-1">
              Create Account
            </h2>
            <p className="text-slate-600">Start your career journey today</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] space-y-6">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
            <FcGoogle className="w-5 h-5" />
            <span className="text-gray-700 font-medium">
              Sign up with Google
            </span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                or register with email
              </span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handelRegistration}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="pl-10 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pl-10 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="pl-10 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-sky-700 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                href="/auth/login"
                className="font-medium text-sky-600 hover:text-sky-500"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
