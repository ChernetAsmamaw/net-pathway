import React from "react";
import { CheckCircle, LucideIcon } from "lucide-react";

interface AssessmentSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isCompleted: boolean;
  onClick: () => void;
}

const AssessmentSection: React.FC<AssessmentSectionProps> = ({
  title,
  description,
  icon: Icon,
  isCompleted,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition-all border-l-4 ${
        isCompleted ? "border-green-500" : "border-gray-300"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-lg ${
            isCompleted
              ? "bg-green-50 text-green-600"
              : "bg-gray-50 text-sky-600"
          }`}
        >
          <Icon className="w-8 h-8" />
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>
          <p className="text-gray-500 mt-2">{description}</p>

          <div className="mt-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isCompleted
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {isCompleted ? "Completed" : "Not Completed"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSection;
