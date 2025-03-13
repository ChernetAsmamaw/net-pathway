"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Send, Smile, Paperclip, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
}

interface DiscussionChatProps {
  discussionId: string;
}

export default function DiscussionChat({ discussionId }: DiscussionChatProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi everyone! I'm excited to start this discussion about software engineering careers.",
      sender: {
        id: "1",
        name: "Sarah Johnson",
        avatar: "/avatars/default.png",
      },
      timestamp: "2 hours ago",
    },
    // Add more sample messages here
  ]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: {
        id: "current-user",
        name: "You",
        avatar: "/avatars/default.png",
      },
      timestamp: "Just now",
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Software Engineering Career Path
          </h1>
          <p className="text-sm text-gray-500">24 participants</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender.id === "current-user" ? "flex-row-reverse" : ""
            }`}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={msg.sender.avatar}
                alt={msg.sender.name}
                fill
                className="object-cover"
              />
            </div>
            <div
              className={`flex flex-col ${
                msg.sender.id === "current-user" ? "items-end" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {msg.sender.name}
                </span>
                <span className="text-xs text-gray-500">{msg.timestamp}</span>
              </div>
              <div
                className={`mt-1 px-4 py-2 rounded-xl ${
                  msg.sender.id === "current-user"
                    ? "bg-sky-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-100"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5 text-gray-400" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Smile className="w-5 h-5 text-gray-400" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="p-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
