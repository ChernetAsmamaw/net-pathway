import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Mail, X, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface VerificationNoticeProps {
  onDismiss?: () => void;
}

const VerificationNotice: React.FC<VerificationNoticeProps> = ({
  onDismiss,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { user, refreshUserData } = useAuthStore();

  // Don't show if the user is verified or has dismissed the notice
  if (user?.isEmailVerified || isDismissed) {
    return null;
  }

  const handleSendVerification = async () => {
    try {
      setIsSending(true);

      await axios.post(
        `${API_URL}/verification/send`,
        {},
        { withCredentials: true }
      );

      toast.success("Verification email sent! Please check your inbox.");

      // Refresh user data in case verification was successful
      await refreshUserData();
    } catch (error) {
      console.error("Failed to send verification email:", error);
      toast.error("Failed to send verification email. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className="bg-amber-50 shadow-md rounded-lg p-4 mb-6 border-l-4 border-amber-500">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="mt-0.5">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-amber-800">Email not verified</h3>
            <p className="text-amber-700 text-sm mt-1">
              Please verify your email address to access all features of Net
              Pathway.
            </p>
            <button
              onClick={handleSendVerification}
              disabled={isSending}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-amber-800 hover:text-amber-900 disabled:opacity-50"
            >
              <Mail className="h-4 w-4" />
              {isSending ? "Sending..." : "Send verification email"}
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-amber-500 hover:text-amber-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default VerificationNotice;
