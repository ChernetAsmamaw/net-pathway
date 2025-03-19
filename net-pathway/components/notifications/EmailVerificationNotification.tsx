import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNotificationStore } from "../../store/useNotificationStore";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const EmailVerificationNotification: React.FC = () => {
  const { user, refreshUserData } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [isSending, setIsSending] = useState(false);

  // If user is verified, don't show notification
  if (!user || user.isEmailVerified) return null;

  const handleSendVerification = async () => {
    setIsSending(true);
    try {
      await axios.post(
        `${API_URL}/verification/send`,
        {},
        { withCredentials: true }
      );

      toast.success("Verification email sent! Please check your inbox.");

      // Add to notifications
      addNotification({
        type: "success",
        title: "Verification Email Sent",
        message:
          "Please check your inbox and follow the instructions to verify your email.",
        dismissible: true,
      });

      // Refresh user data to check if verification status changed
      await refreshUserData();
    } catch (error) {
      console.error("Failed to send verification email:", error);
      toast.error("Failed to send verification email. Please try again later.");

      // Add error notification
      addNotification({
        type: "warning",
        title: "Verification Email Failed",
        message:
          "We couldn't send the verification email. Please try again later.",
        dismissible: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-amber-50 rounded-lg p-4 mb-6 flex items-start gap-3 border-l-4 border-amber-500">
      <Mail className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
      <div className="flex-grow">
        <h3 className="font-medium text-amber-800">
          Verify your email address
        </h3>
        <p className="text-amber-700 text-sm mt-1">
          Please verify your email address to access all features of Net
          Pathway.
        </p>
        <button
          onClick={handleSendVerification}
          disabled={isSending}
          className="mt-2 text-sm font-medium text-amber-800 hover:text-amber-900 disabled:opacity-50 flex items-center gap-1.5"
        >
          <Mail className="w-4 h-4" />
          {isSending ? "Sending..." : "Send verification email"}
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationNotification;
