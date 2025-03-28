// components/chat/ChatListItem.tsx
import React from "react";
import { Chat } from "@/store/useChatStore";
import { formatDistanceToNow } from "date-fns";

interface ChatListItemProps {
  chat: Chat;
  currentUserId: string;
  onClick: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  currentUserId,
  onClick,
}) => {
  // Determine if this user has unread messages
  const hasUnread =
    Array.isArray(chat.unreadBy) &&
    chat.unreadBy.some((id) => String(id) === String(currentUserId));

  // Determine if current user is the mentor
  const isMentor = String(currentUserId) === String(chat.mentor._id);

  // Get the other participant in the conversation
  const otherUser = isMentor ? chat.initiator : chat.mentor;

  // Get last message if any
  const lastMessage =
    chat.messages && chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1]
      : null;

  // Format time
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        hasUnread ? "bg-sky-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-100 to-purple-100 flex items-center justify-center overflow-hidden">
            {otherUser.profilePicture ? (
              <img
                src={otherUser.profilePicture}
                alt={otherUser.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-sky-700">
                {otherUser.username
                  ? otherUser.username.charAt(0).toUpperCase()
                  : "?"}
              </span>
            )}
          </div>

          {/* Unread indicator */}
          {hasUnread && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <h3
              className={`font-medium text-gray-900 truncate ${
                hasUnread ? "font-semibold" : ""
              }`}
            >
              {otherUser.username || "User"}
            </h3>
            <span className="text-xs text-gray-500">
              {lastMessage
                ? formatTime(lastMessage.createdAt)
                : formatTime(chat.createdAt)}
            </span>
          </div>

          {/* Show role/title for mentor if current user is not the mentor */}
          {!isMentor && chat.mentorProfile && (
            <p className="text-sm text-gray-600 line-clamp-1">
              {chat.mentorProfile.title || "Mentor"} ·{" "}
              {chat.mentorProfile.company || "Company"}
            </p>
          )}

          {/* Show "Student" if current user is the mentor */}
          {isMentor && (
            <p className="text-sm text-gray-600 line-clamp-1">Student</p>
          )}

          {lastMessage && (
            <p
              className={`text-sm line-clamp-1 mt-1 ${
                hasUnread ? "text-gray-900 font-medium" : "text-gray-500"
              }`}
            >
              {String(lastMessage.sender._id) === String(currentUserId)
                ? "You: "
                : `${otherUser.username}: `}
              {lastMessage.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
