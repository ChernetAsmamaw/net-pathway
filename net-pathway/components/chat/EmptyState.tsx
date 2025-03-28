// components/chat/EmptyState.tsx
import React, { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
