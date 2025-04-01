// components/assessment/CareerPathUniversities.tsx
import React, { useState } from "react";
import {
  Building2,
  MapPin,
  CalendarDays,
  Clock,
  Book,
  DollarSign,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface Program {
  id: number;
  name: string;
  duration: string;
  studyMode: string;
  tuitionFee: string;
  description: string;
  highlights: string[];
}

interface University {
  id: number;
  name: string;
  location: string;
  logo: string;
  description: string;
  admissionDeadline: string;
  programs: Program[];
}

interface CareerPathUniversitiesProps {
  universities: University[];
}

const CareerPathUniversities: React.FC<CareerPathUniversitiesProps> = ({
  universities,
}) => {
  const [activeUniversity, setActiveUniversity] = useState<number | null>(
    universities.length > 0 ? universities[0].id : null
  );
  const [expandedPrograms, setExpandedPrograms] = useState<number[]>([]);

  const selectedUniversity = universities.find(
    (uni) => uni.id === activeUniversity
  );

  const toggleProgram = (programId: number) => {
    setExpandedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId]
    );
  };

  if (universities.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          No universities available
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          There are currently no universities offering programs for this career
          path. Check back later or explore other paths.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* University Selection Tabs */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Available Universities
        </h2>
        <div className="flex flex-wrap gap-3">
          {universities.map((university) => (
            <button
              key={university.id}
              onClick={() => setActiveUniversity(university.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeUniversity === university.id
                  ? "bg-sky-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {university.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected University Details */}
      {selectedUniversity && (
        <div className="mb-8">
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                {selectedUniversity.logo ? (
                  <img
                    src={selectedUniversity.logo}
                    alt={selectedUniversity.name}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {selectedUniversity.name}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    <span>{selectedUniversity.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4 text-sky-600" />
                    <span>
                      Application Deadline:{" "}
                      {selectedUniversity.admissionDeadline}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700">
                  {selectedUniversity.description}
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available Programs
          </h3>
          <div className="space-y-4">
            {selectedUniversity.programs.map((program) => (
              <div
                key={program.id}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <div
                  className="p-4 bg-white cursor-pointer"
                  onClick={() => toggleProgram(program.id)}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-900">
                      {program.name}
                    </h4>
                    <button
                      className="p-1 rounded-full hover:bg-gray-100"
                      aria-label={
                        expandedPrograms.includes(program.id)
                          ? "Collapse"
                          : "Expand"
                      }
                    >
                      {expandedPrograms.includes(program.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-sky-600" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Book className="w-4 h-4 text-sky-600" />
                      <span>{program.studyMode}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-sky-600" />
                      <span>{program.tuitionFee}</span>
                    </div>
                  </div>
                </div>

                {expandedPrograms.includes(program.id) && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 mb-4">{program.description}</p>

                    <h5 className="font-medium text-gray-900 mb-2">
                      Program Highlights
                    </h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {program.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex justify-end">
                      <Link
                        href="#"
                        className="text-sky-600 flex items-center gap-1 hover:text-sky-800"
                      >
                        <span>Visit Program Website</span>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPathUniversities;
