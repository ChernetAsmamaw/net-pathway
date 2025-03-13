import Image from "next/image";
import {
  Building2,
  GraduationCap,
  MapPin,
  BookOpen,
  Clock,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

interface Program {
  id: string;
  name: string;
  duration: string;
  studyMode: string;
  tuitionFee: string;
  description: string;
  highlights?: string[];
}

interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  admissionDeadline: string;
  programs: Program[];
}

interface PathData {
  id: string;
  title: string;
  description: string;
  image: string;
  matchPercentage: number;
  requirements: string[];
  universities: University[];
}

interface PathCardProps {
  pathData: PathData;
  activeUniversity: string | null;
  onUniversityChange: (id: string) => void;
  onBack: () => void;
}

export default function PathCard({
  pathData,
  activeUniversity,
  onUniversityChange,
  onBack,
}: PathCardProps) {
  return (
    <div className="p-6 md:p-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sky-700 hover:text-sky-800 mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Paths</span>
      </button>

      {/* Path Header */}
      <div className="relative h-56 rounded-2xl overflow-hidden mb-8 shadow-lg">
        <Image
          src={pathData.image}
          alt={pathData.title}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-sky-900/80"></div>
        <div className="absolute inset-0 p-8 flex flex-col justify-center">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-block mb-3 w-max">
            <span className="text-white font-medium">
              {pathData.matchPercentage}% Match
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {pathData.title}
          </h1>
          <p className="text-white/90 max-w-2xl">{pathData.description}</p>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-sky-800 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          General Requirements
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pathData.requirements.map((req, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-sky-500"></div>
              <span className="text-gray-700">{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Universities Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-sky-800 flex items-center">
          <Building2 className="w-5 h-5 mr-2" />
          Available Universities
        </h2>

        {/* University tabs */}
        <div className="flex overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex space-x-2">
            {pathData.universities.map((university) => (
              <button
                key={university.id}
                onClick={() => onUniversityChange(university.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeUniversity === university.id
                    ? "bg-sky-700 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {university.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active university details */}
        {pathData.universities.map((university) => (
          <div
            key={university.id}
            className={activeUniversity === university.id ? "block" : "hidden"}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* ... Rest of the university and program details ... */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-sky-700" />
                    </div>
                  </div>

                  <div className="flex-grow">
                    {/* University header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {university.name}
                        </h3>
                        <p className="text-gray-500 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {university.location}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-full flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Application Deadline: {university.admissionDeadline}
                        </div>
                        <button className="text-sm bg-sky-50 text-sky-700 px-3 py-1 rounded-full flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Visit Website
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6">
                      {university.description}
                    </p>

                    {/* Programs */}
                    <h4 className="font-medium text-gray-900 mb-4">
                      Available Programs:
                    </h4>
                    <div className="space-y-6">
                      {university.programs.map((program) => (
                        <div
                          key={program.id}
                          className="bg-gray-50 rounded-lg p-6 transition-all hover:shadow-md"
                        >
                          {/* Program content */}
                          <div className="flex flex-col">
                            <div className="flex items-start gap-3 mb-4">
                              <GraduationCap className="w-6 h-6 text-sky-700 flex-shrink-0 mt-1" />
                              <div>
                                <h4 className="font-medium text-lg text-gray-900">
                                  {program.name}
                                </h4>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                                  <p className="text-sm text-gray-500 flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    Duration: {program.duration}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Study Mode: {program.studyMode}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Tuition: {program.tuitionFee}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-4">
                              {program.description}
                            </p>

                            {program.highlights && (
                              <div className="mt-3">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">
                                  Program Highlights:
                                </h5>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                  {program.highlights.map((highlight, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm flex items-center gap-2 bg-white p-2 rounded-md"
                                    >
                                      <div className="h-2 w-2 rounded-full bg-sky-500"></div>
                                      {highlight}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="mt-4 flex justify-end">
                              <button className="px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors text-sm flex items-center gap-1">
                                <span>Apply Now</span>
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
