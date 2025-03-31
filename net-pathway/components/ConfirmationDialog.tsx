import React, { useEffect } from "react";
import { AlertTriangle, Info, AlertCircle, X } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "warning" | "error" | "info";
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = "warning",
}) => {
  // Add keyboard event handler for Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  // Icon and color based on type
  const getIconStyles = () => {
    switch (type) {
      case "error":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-600",
          buttonColor: "bg-red-600 hover:bg-red-700",
          icon: <AlertCircle className="w-6 h-6" />,
        };
      case "info":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
          icon: <Info className="w-6 h-6" />,
        };
      case "warning":
      default:
        return {
          bgColor: "bg-amber-100",
          textColor: "text-amber-600",
          buttonColor: "bg-amber-600 hover:bg-amber-700",
          icon: <AlertTriangle className="w-6 h-6" />,
        };
    }
  };

  const { bgColor, textColor, buttonColor, icon } = getIconStyles();

  // Handle confirm button click
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
  };

  // Handle cancel button click
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${bgColor} ${textColor} rounded-full`}>
              {icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 ${buttonColor} text-white rounded-lg transition-colors`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
