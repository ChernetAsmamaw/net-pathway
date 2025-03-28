// components/chat/ChatHeader.tsx
import React from "react";
import { Chat } from "@/store/useChatStore";
import { ArrowLeft, MoreVertical, Archive, MessageCircle } from "lucide-react";

interface ChatHeaderProps {
  chat: Chat;
  currentUserId: string;
  onBack: () => void;
  onArchive: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  currentUserId,
  onBack,
  onArchive,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  // Determine if current user is the mentor or the initiator
  const isMentor = currentUserId === chat.mentor._id.toString();

  // Get both users for display
  const mentorUser = chat.mentor;
  const studentUser = chat.initiator;

  // Format mentor subtitle (title and company)
  const mentorSubtitle = chat.mentorProfile
    ? `${chat.mentorProfile.title}${
        chat.mentorProfile.company ? ` · ${chat.mentorProfile.company}` : ""
      }`
    : "Mentor";

  // Format student subtitle (high school if available)
  // Note: We need to fetch the user's high school from the API or store
  // For now, use a placeholder
  const studentSubtitle = studentUser.highSchool?.name || "Student";

  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-lg font-medium text-sky-700 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Message
        </h2>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-10 w-48">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onArchive();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
              >
                <Archive className="w-4 h-4" />
                Archive Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dual user display */}
      <div className="flex items-center gap-2 justify-center bg-gray-50 p-3 rounded-xl">
        {/* Student/Initiator */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="text-right">
            <p className="font-medium text-gray-900">{studentUser.username}</p>
            <p className="text-xs text-gray-500">{studentSubtitle}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-sky-100 flex items-center justify-center overflow-hidden">
            {studentUser.profilePicture ? (
              <img
                src={studentUser.profilePicture}
                alt={studentUser.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-sky-700">
                {studentUser.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <div className="mx-2 px-2 py-1 bg-gray-200 rounded-full text-xs text-gray-500 font-medium">
          and
        </div>

        {/* Mentor */}
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-sky-100 flex items-center justify-center overflow-hidden">
            {mentorUser.profilePicture ? (
              <img
                src={mentorUser.profilePicture}
                alt={mentorUser.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-purple-700">
                {mentorUser.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{mentorUser.username}</p>
            <p className="text-xs text-gray-500">{mentorSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Current user indicator */}
      {/* <div className="mt-2 text-center">
        <span className="text-xs text-gray-500">
          You are signed in as{" "}
          <span className="font-medium">
            {isMentor ? mentorUser.username : studentUser.username}
          </span>
        </span>
      </div> */}
    </div>
  );
};

export default ChatHeader;
