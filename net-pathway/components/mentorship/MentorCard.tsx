import React from "react";
import Image from "next/image";
import { Briefcase, MapPin, Star, Mail, Phone } from "lucide-react";

interface MentorCardProps {
  mentor: {
    _id: string;
    title: string;
    company: string;
    location: string;
    expertise: string[];
    rating: number;
    availability: string;
    email?: string;
    phone?: string;
    user: {
      username: string;
      profilePicture?: string;
    };
  };
  onClick: () => void;
}

export default function MentorCard({ mentor, onClick }: MentorCardProps) {
  // Get the first letter of username for the avatar fallback
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "M";
  };

  // Determine availability badge color
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "limited":
        return "bg-amber-100 text-amber-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format availability text
  const formatAvailability = (availability: string) => {
    switch (availability) {
      case "available":
        return "Available";
      case "limited":
        return "Limited Availability";
      case "unavailable":
        return "Currently Unavailable";
      default:
        return availability;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative w-24 h-24 mb-4">
          {mentor.user?.profilePicture ? (
            <Image
              src={mentor.user.profilePicture}
              alt={mentor.user.username}
              layout="fill"
              className="rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
              {getInitial(mentor.user.username)}
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          {mentor.user.username}
        </h3>
        <div className="flex items-center gap-2 text-gray-600 mt-1">
          <Briefcase className="w-4 h-4" />
          <span className="text-sm">{mentor.title}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mt-1">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{mentor.location}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* <div className="flex items-center justify-center gap-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{mentor.rating.toFixed(1)}</span>
        </div> */}

        <div className="flex flex-wrap gap-2 justify-center">
          {mentor.expertise.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
          {mentor.expertise.length > 3 && (
            <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs">
              +{mentor.expertise.length - 3} more
            </span>
          )}
        </div>

        <div className="text-center mt-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(
              mentor.availability
            )}`}
          >
            {formatAvailability(mentor.availability)}
          </span>
        </div>

        <div className="pt-4 mt-4 border-t border-gray-100 flex justify-center gap-3">
          {mentor.email && (
            <div className="flex items-center gap-1 text-xs text-sky-600">
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </div>
          )}
          {mentor.phone && (
            <div className="flex items-center gap-1 text-xs text-sky-600">
              <Phone className="w-3 h-3" />
              <span>Phone</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
