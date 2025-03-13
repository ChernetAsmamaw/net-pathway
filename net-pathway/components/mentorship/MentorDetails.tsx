import { X, Calendar, Star, Globe, Trophy } from "lucide-react";
import Image from "next/image";

interface MentorDetailsProps {
  mentor: {
    name: string;
    title: string;
    company: string;
    image: string;
    bio: string;
    expertise: string[];
    rating: number;
    experience: string;
    education: string;
    languages: string[];
    achievements: string[];
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
              <Image
                src={mentor.image}
                alt={mentor.name}
                layout="fill"
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mentor.name}
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
              <p className="text-gray-600">{mentor.languages.join(", ")}</p>
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
              {mentor.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-sky-50 text-sky-700 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

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
        </div>

        <div className="p-6 border-t border-gray-100">
          <button className="w-full py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-medium">
            Schedule Session
          </button>
        </div>
      </div>
    </div>
  );
}
