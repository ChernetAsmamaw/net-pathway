import React, { useState } from "react";
import { Mentor } from "@/store/useMentorStore";
import { useChatStore } from "@/store/useChatStore";
import {
  X,
  Mail,
  MapPin,
  Briefcase,
  Book,
  Award,
  Languages,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface MentorDetailsProps {
  mentor: Mentor;
  onClose: () => void;
}

const MentorDetails: React.FC<MentorDetailsProps> = ({ mentor, onClose }) => {
  const router = useRouter();
  const { initializeChat } = useChatStore();
  const [isStartingChat, setIsStartingChat] = useState(false);

  // Handle starting a chat with this mentor
  const handleStartChat = async () => {
    if (!mentor._id) {
      toast.error("Cannot start chat with this mentor");
      return;
    }

    setIsStartingChat(true);
    try {
      const chat = await initializeChat(mentor._id);
      if (chat) {
        // If chat was successfully created/retrieved, navigate to it
        router.push(`/chats/${chat._id}`);
      } else {
        toast.error("Failed to start chat");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Failed to start chat with this mentor");
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <div className="sticky top-0 z-10 bg-white flex justify-end p-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Profile image */}
            <div className="w-28 h-28 bg-gradient-to-r from-sky-100 to-purple-100 rounded-xl flex items-center justify-center shadow-md">
              {mentor.user?.profilePicture ? (
                <img
                  src={mentor.user.profilePicture}
                  alt={mentor.user.username}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-4xl font-bold text-sky-700">
                  {mentor.user?.username?.charAt(0) || "M"}
                </span>
              )}
            </div>

            {/* Basic info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {mentor.user?.username || "Mentor"}
              </h2>
              <h3 className="text-xl text-sky-700 font-medium mb-3">
                {mentor.title} at {mentor.company}
              </h3>

              <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{mentor.location}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span>{mentor.experience}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{mentor.availability || "Available"}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleStartChat}
                  disabled={isStartingChat}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4" />
                  {isStartingChat ? "Starting chat..." : "Chat with Mentor"}
                </button>

                <button className="px-4 py-2 border border-sky-600 text-sky-600 rounded-lg hover:bg-sky-50 transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact
                </button>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-gray-700 whitespace-pre-line">{mentor.bio}</p>
          </div>

          {/* Expertise */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise &&
                mentor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-sky-600" />
                Education
              </div>
            </h3>
            <p className="text-gray-700">{mentor.education}</p>
          </div>

          {/* Languages */}
          {mentor.languages && mentor.languages.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-sky-600" />
                  Languages
                </div>
              </h3>
              <div className="flex flex-wrap gap-2">
                {mentor.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-sky-600" />
                  Achievements
                </div>
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {mentor.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDetails;
