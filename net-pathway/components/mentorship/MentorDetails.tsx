import React from "react";
import {
  X,
  Calendar,
  Star,
  Globe,
  Trophy,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";

interface MentorDetailsProps {
  mentor: {
    _id: string;
    title: string;
    company: string;
    location: string;
    image?: string;
    bio: string;
    expertise: string[];
    rating: number;
    experience: string;
    education: string;
    languages: string[];
    achievements: string[];
    email?: string;
    phone?: string;
    user?: {
      username: string;
      email?: string;
      profilePicture?: string;
    };
  };
  onClose: () => void;
}

export default function MentorDetails({ mentor, onClose }: MentorDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              {mentor.user?.profilePicture ? (
                <Image
                  src={mentor.user.profilePicture}
                  alt={mentor.user?.username || mentor.title}
                  layout="fill"
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-xl font-semibold">
                  {mentor.user?.username?.charAt(0).toUpperCase() ||
                    mentor.title.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mentor.user?.username || "Mentor"}
              </h2>
              <p className="text-gray-600">
                {mentor.title} at {mentor.company}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div className="bg-sky-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-sky-700 mb-3">
              Contact Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-sky-600" />
                <a
                  href={`mailto:${mentor.email || mentor.user?.email}`}
                  className="text-sky-600 hover:underline"
                >
                  {mentor.email || mentor.user?.email || "Email not provided"}
                </a>
              </div>
              {mentor.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-sky-600" />
                  <a
                    href={`tel:${mentor.phone}`}
                    className="text-sky-600 hover:underline"
                  >
                    {mentor.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" />
                <span className="text-gray-700">{mentor.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-600">{mentor.bio}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-sky-700 mb-2">
                <Star className="w-5 h-5" />
                <span className="font-medium">Experience</span>
              </div>
              <p className="text-gray-600">{mentor.experience}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <Globe className="w-5 h-5" />
                <span className="font-medium">Languages</span>
              </div>
              <p className="text-gray-600">
                {mentor.languages && mentor.languages.length > 0
                  ? mentor.languages.join(", ")
                  : "No languages specified"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Education</span>
              </div>
              <p className="text-gray-600">{mentor.education}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise && mentor.expertise.length > 0 ? (
                mentor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-sky-50 text-sky-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No expertise specified</p>
              )}
            </div>
          </div>

          {mentor.achievements && mentor.achievements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Achievements
              </h3>
              <ul className="space-y-2">
                {mentor.achievements.map((achievement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
