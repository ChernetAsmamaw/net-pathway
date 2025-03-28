// components/chat/ChatMessage.tsx
import React from "react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  read: boolean;
  createdAt: string;
}

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  // Format message time
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "recently";
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className="flex items-end max-w-[80%] md:max-w-[70%] gap-2">
        {/* Avatar for others' messages */}
        {!isOwnMessage && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-100 to-purple-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
            {message.sender.profilePicture ? (
              <img
                src={message.sender.profilePicture}
                alt={message.sender.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-sky-700">
                {message.sender.username
                  ? message.sender.username.charAt(0).toUpperCase()
                  : "?"}
              </span>
            )}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`rounded-xl p-3 ${
            isOwnMessage
              ? "bg-sky-600 text-white rounded-br-none"
              : "bg-gray-100 text-gray-800 rounded-bl-none"
          }`}
        >
          {/* For other users' messages, display username if available */}
          {!isOwnMessage && (
            <div className="font-medium text-xs text-sky-700 mb-1">
              {message.sender.username}
            </div>
          )}

          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          <div
            className={`text-xs mt-1 text-right ${
              isOwnMessage ? "text-sky-200" : "text-gray-500"
            }`}
          >
            {formatTime(message.createdAt)}
          </div>
        </div>

        {/* Avatar for own messages */}
        {isOwnMessage && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-100 to-purple-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
            {message.sender.profilePicture ? (
              <img
                src={message.sender.profilePicture}
                alt={message.sender.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-sky-700">
                {message.sender.username
                  ? message.sender.username.charAt(0).toUpperCase()
                  : "Y"}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
