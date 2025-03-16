import React from "react";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

interface VerificationBadgeProps {
  isVerified: boolean;
  showSendButton?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  isVerified,
  showSendButton = false,
  size = "md",
  className = "",
}) => {
  const handleSendVerification = async () => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await axios.post(
        `${API_URL}/verification/send`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Failed to send verification email:", error);
      toast.error("Failed to send verification email. Please try again later.");
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "text-xs py-0.5 px-2",
    md: "text-sm py-1 px-3",
    lg: "text-base py-1.5 px-4",
  };

  // Icon sizes
  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`
          flex items-center gap-1 rounded-full
          ${
            isVerified
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }
          ${sizeClasses[size]}
        `}
      >
        {isVerified ? (
          <CheckCircle size={iconSizes[size]} className="text-green-600" />
        ) : (
          <XCircle size={iconSizes[size]} className="text-amber-600" />
        )}
        <span>{isVerified ? "Verified" : "Unverified"}</span>
      </div>

      {!isVerified && showSendButton && (
        <button
          onClick={handleSendVerification}
          className="text-sky-600 hover:text-sky-800 text-sm flex items-center gap-1"
        >
          <Mail size={iconSizes[size]} />
          <span>Send verification</span>
        </button>
      )}
    </div>
  );
};

export default VerificationBadge;
