import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface VerificationCodeInputProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { refreshUserData } = useAuthStore();

  useEffect(() => {
    // Focus the first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input if current input is filled
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace to move to previous input
    if (
      e.key === "Backspace" &&
      !code[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split("");
    const newCode = [...code];

    digits.forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });

    setCode(newCode);

    // Focus the last input with digit or the next empty one
    const lastFilledIndex = Math.min(digits.length - 1, 5);
    if (inputRefs.current[lastFilledIndex]) {
      inputRefs.current[lastFilledIndex].focus();
    }
  };

  const verifyCode = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/verification/verify-code`,
        { code: fullCode },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Email verified successfully!");
        await refreshUserData();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to verify email. Please check your code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sendNewCode = async () => {
    setIsSending(true);
    try {
      await axios.post(
        `${API_URL}/verification/send-code`,
        {},
        { withCredentials: true }
      );
      toast.success("New verification code sent!");

      // Reset inputs
      setCode(Array(6).fill(""));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (error) {
      console.error("Error sending new code:", error);
      toast.error("Failed to send new verification code");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Verify Your Email
      </h2>
      <p className="text-gray-600 mb-6">
        Enter the 6-digit code sent to your email address
      </p>

      <div className="flex justify-center gap-2 mb-6">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={code[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center font-bold text-xl border-2 rounded-md focus:border-sky-500 focus:outline-none"
            />
          ))}
      </div>

      <div className="flex justify-between mb-4">
        <button
          type="button"
          onClick={sendNewCode}
          disabled={isSending}
          className="text-sky-600 hover:text-sky-800 text-sm"
        >
          {isSending ? "Sending..." : "Resend code"}
        </button>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={verifyCode}
          disabled={isLoading || code.some((digit) => !digit)}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default VerificationCodeInput;
