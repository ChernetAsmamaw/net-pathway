import Image from "next/image";
import { Briefcase, MapPin, Star } from "lucide-react";

interface MentorCardProps {
  mentor: {
    id: number;
    name: string;
    title: string;
    company: string;
    location: string;
    image: string;
    expertise: string[];
    rating: number;
    availability: string;
  };
  onClick: () => void;
}

export default function MentorCard({ mentor, onClick }: MentorCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative w-32 h-32 mb-4">
          <Image
            src={mentor.image}
            alt={mentor.name}
            layout="fill"
            className="rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{mentor.name}</h3>
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
        <div className="flex items-center justify-center gap-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{mentor.rating}</span>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {mentor.expertise.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="text-center">
          <span className="text-sm text-green-600 font-medium">
            {mentor.availability}
          </span>
        </div>
      </div>
    </div>
  );
}
