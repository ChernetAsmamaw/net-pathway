// components/mentorship/MentorDetails.tsx
import React from "react";
import {
  X,
  Mail,
  MapPin,
  Award,
  Book,
  Briefcase,
  Calendar,
  Globe,
  MessageSquare,
} from "lucide-react";
import ChatInitializer from "@/components/chat/ChatInitializer";

interface MentorProfile {
  _id: string;
  title: string;
  company: string;
  location: string;
  bio: string;
  expertise: string[];
  experience: string;
  education: string;
  languages: string[];
  achievements: string[];
  availability: string;
  rating: number;
  email?: string;
  phone?: string;
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
}

interface MentorDetailsProps {
  mentor: MentorProfile;
  onClose: () => void;
}

const MentorDetails: React.FC<MentorDetailsProps> = ({ mentor, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<"details" | "chat">(
    "details"
  );

  // Format availability for display
  const getAvailabilityClass = () => {
    switch (mentor.availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "limited":
        return "bg-yellow-100 text-yellow-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format availability label
  const getAvailabilityLabel = () => {
    switch (mentor.availability) {
      case "available":
        return "Available";
      case "limited":
        return "Limited Availability";
      case "unavailable":
        return "Currently Unavailable";
      default:
        return "Unknown Status";
    }
  };

  // Render star rating (out of 5)
  const renderRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${
            i <= mentor.rating ? "text-yellow-500" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return <div className="flex items-center">{stars}</div>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            Mentor Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 font-medium text-center ${
              activeTab === "details"
                ? "text-sky-600 border-b-2 border-sky-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Profile Details
          </button>
          <button
            className={`flex-1 py-3 font-medium text-center ${
              activeTab === "chat"
                ? "text-sky-600 border-b-2 border-sky-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("chat")}
          >
            <div className="flex items-center justify-center gap-1">
              <MessageSquare className="w-4 h-4" />
              Message
            </div>
          </button>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto p-6"
          style={{ maxHeight: "calc(90vh - 180px)" }}
        >
          {activeTab === "details" ? (
            <>
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                {/* Avatar */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-sky-100 to-purple-100 flex items-center justify-center overflow-hidden">
                  {mentor.user.profilePicture ? (
                    <img
                      src={mentor.user.profilePicture}
                      alt={mentor.user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-sky-700">
                      {mentor.user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                    {mentor.user.username}
                  </h3>
                  <p className="text-lg text-gray-700 mb-1">{mentor.title}</p>
                  <p className="text-gray-600 mb-3">{mentor.company}</p>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityClass()}`}
                    >
                      {getAvailabilityLabel()}
                    </span>
                    {/* <div className="flex items-center gap-1">
                      {renderRating()}
                      <span className="text-gray-500 text-sm ml-1">
                        ({mentor.rating}/5)
                      </span>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Location and Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-sky-600" />
                  <span className="text-gray-700">{mentor.location}</span>
                </div>
                {mentor.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-sky-600" />
                    <span className="text-gray-700">{mentor.email}</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  About
                </h4>
                <p className="text-gray-700 whitespace-pre-line">
                  {mentor.bio}
                </p>
              </div>

              {/* Expertise */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience and Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-sky-600" />
                    Experience
                  </h4>
                  <div className="text-gray-700">{mentor.experience}</div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Book className="w-5 h-5 text-sky-600" />
                    Education
                  </h4>
                  <div className="text-gray-700">{mentor.education}</div>
                </div>
              </div>

              {/* Languages */}
              {mentor.languages && mentor.languages.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-sky-600" />
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {mentor.achievements && mentor.achievements.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-sky-600" />
                    Achievements
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {mentor.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setActiveTab("chat")}
                  className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Message {mentor.user.username}
                </button>
              </div>
            </>
          ) : (
            <ChatInitializer
              mentorId={mentor._id}
              mentorName={mentor.user.username}
              title={mentor.title}
              company={mentor.company}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDetails;
