// components/chat/ChatDebugHelper.tsx
import React from "react";
import { Chat } from "@/store/useChatStore";

interface ChatDebugHelperProps {
  chat: Chat;
  currentUserId: string;
}

/**
 * This component helps debug chat issues by showing raw data
 * You can add this temporarily to your chat UI to see what data is being processed
 */
const ChatDebugHelper: React.FC<ChatDebugHelperProps> = ({
  chat,
  currentUserId,
}) => {
  if (!chat) return null;

  return (
    <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-xs overflow-auto max-h-60 mb-4">
      <h3 className="font-bold text-sm mb-2">Debug Information:</h3>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p>
            <strong>Chat ID:</strong> {chat._id}
          </p>
          <p>
            <strong>Using Mock:</strong>{" "}
            {chat._id.startsWith("mock-") ? "Yes" : "No"}
          </p>
          <p>
            <strong>Current User ID:</strong> {currentUserId}
          </p>

          <div className="mt-2">
            <p>
              <strong>Initiator:</strong>
            </p>
            <p>ID: {chat.initiator._id}</p>
            <p>Name: {chat.initiator.username}</p>
          </div>

          <div className="mt-2">
            <p>
              <strong>Mentor:</strong>
            </p>
            <p>ID: {chat.mentor._id}</p>
            <p>Name: {chat.mentor.username}</p>
          </div>
        </div>

        <div>
          <p>
            <strong>Mentor Profile:</strong>
          </p>
          <p>Title: {chat.mentorProfile.title}</p>
          <p>Company: {chat.mentorProfile.company}</p>

          <div className="mt-2">
            <p>
              <strong>Message Count:</strong> {chat.messages.length}
            </p>
            <p>
              <strong>Unread by:</strong> {chat.unreadBy.join(", ") || "None"}
            </p>
            <p>
              <strong>Is Active:</strong> {chat.isActive ? "Yes" : "No"}
            </p>
          </div>

          <div className="mt-2">
            <p>
              <strong>Current User is Initiator:</strong>{" "}
              {currentUserId === chat.initiator._id.toString() ? "Yes" : "No"}
            </p>
            <p>
              <strong>Current User is Mentor:</strong>{" "}
              {currentUserId === chat.mentor._id.toString() ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <p>
          <strong>ID Comparisons (should be identical):</strong>
        </p>
        <p>currentUserId.toString(): {currentUserId.toString()}</p>
        <p>chat.initiator._id.toString(): {chat.initiator._id.toString()}</p>
      </div>
    </div>
  );
};

export default ChatDebugHelper;
