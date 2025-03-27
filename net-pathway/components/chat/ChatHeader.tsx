// components/chat/ChatHeader.tsx
import React from "react";
import { Chat } from "@/store/useChatStore";
import { ArrowLeft, MoreVertical, Archive } from "lucide-react";

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

  // Always get the mentor for display
  const mentor = chat.mentor;

  return (
    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-100 to-purple-100 flex items-center justify-center overflow-hidden">
            {mentor?.profilePicture ? (
              <img
                src={mentor.profilePicture}
                alt={mentor.username || "Mentor"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-sky-700">
                {mentor?.username
                  ? mentor.username.charAt(0).toUpperCase()
                  : "M"}
              </span>
            )}
          </div>

          <div>
            <h3 className="font-medium text-gray-900">
              {mentor?.username || "Mentor"}
            </h3>
            <p className="text-xs text-gray-500">
              {chat.mentorProfile?.title || "Mentor"} ·{" "}
              {chat.mentorProfile?.company || "Company"}
            </p>
          </div>
        </div>
      </div>

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
  );
};

export default ChatHeader;
