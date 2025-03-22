"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // Fixed useState declaration
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const [message, setMessage] = useState("Verifying your email...");

  // In VerifyEmailPage component
  useEffect(() => {
    const verifyEmail = async () => {
      // Check for token in query parameters first
      let token = searchParams.get("token");

      // If not found in query, check if it's in the path
      if (!token && params) {
        // Handle the token from path parameters
        const pathParts = window.location.pathname.split("/");
        if (pathParts.length > 2) {
          token = pathParts[pathParts.length - 1];
        }
      }

      console.log("Token extracted from URL:", token);

      if (!token) {
        setVerificationStatus("error");
        setMessage("Invalid verification link. No token was provided.");
        return;
      }

      try {
        // Send token as query parameter
        console.log(
          "Sending verification request to:",
          `${API_URL}/verification/verify?token=${token}`
        );
        const response = await axios.get(
          `${API_URL}/verification/verify?token=${token}`
        );
        console.log("Verification response:", response.data);

        setVerificationStatus("success");
        setMessage("Your email has been successfully verified!");

        // Update local user state to reflect verification
        try {
          // Attempt to refresh user data
          await axios.get(`${API_URL}/users/profile`, {
            withCredentials: true,
          });
        } catch (refreshError) {
          console.log("Could not refresh user data:", refreshError);
        }
      } catch (error) {
        console.error("Email verification failed:", error);
        // Extract more detailed error message if available
        const errorMsg =
          error.response?.data?.message ||
          "The link may be expired or invalid.";
        setVerificationStatus("error");
        setMessage(`Email verification failed. ${errorMsg}`);
      }
    };

    verifyEmail();
  }, [searchParams, params, API_URL]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {verificationStatus === "loading" && (
          <>
            <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Your Email
            </h2>
            <p className="text-gray-600 mb-4">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {verificationStatus === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 text-green-500">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 inline-flex items-center transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </>
        )}

        {verificationStatus === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 text-red-500">
              <XCircle size={64} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/profile"
                className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors"
              >
                Manage Profile
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
