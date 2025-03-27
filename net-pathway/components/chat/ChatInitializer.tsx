// components/chat/ChatInitializer.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";
import { Send } from "lucide-react";

interface ChatInitializerProps {
  mentorId: string;
  mentorName: string;
  title: string;
  company: string;
}

const ChatInitializer: React.FC<ChatInitializerProps> = ({
  mentorId,
  mentorName,
  title,
  company,
}) => {
  const router = useRouter();
  const { initializeChat } = useChatStore();
  const [initialMessage, setInitialMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!initialMessage.trim() && !confirm("Start chat without a message?")) {
      return;
    }

    setIsCreating(true);

    try {
      // Create the chat
      const chat = await initializeChat(mentorId);

      if (chat) {
        if (initialMessage.trim()) {
          // If there's an initial message, send it
          await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay
          await useChatStore.getState().sendMessage(chat._id, initialMessage);
        }

        // Navigate to the chat
        router.push(`/chats/${chat._id}`);
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
      alert("Failed to start chat. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-medium text-gray-900 mb-2">
        Send a message to {mentorName}
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        {title} at {company}
      </p>

      <form onSubmit={handleStartChat} className="space-y-3">
        <textarea
          value={initialMessage}
          onChange={(e) => setInitialMessage(e.target.value)}
          placeholder={`Introduce yourself to ${mentorName}...`}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 h-24 resize-none"
        />

        <button
          type="submit"
          disabled={isCreating}
          className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isCreating ? "Starting chat..." : "Start Conversation"}
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatInitializer;
