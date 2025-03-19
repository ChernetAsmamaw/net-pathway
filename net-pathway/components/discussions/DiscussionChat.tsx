"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Send,
  Smile,
  Paperclip,
  ArrowLeft,
  Trash2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";

interface DiscussionChatProps {
  discussionId: string;
  onBack: () => void;
}

export default function DiscussionChat({
  discussionId,
  onBack,
}: DiscussionChatProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const {
    currentDiscussion,
    fetchDiscussionById,
    isLoading,
    sendMessage,
    deleteMessage,
    error,
  } = useDiscussionStore();

  const [isSending, setIsSending] = useState(false);

  // Fetch discussion data when component mounts
  useEffect(() => {
    fetchDiscussionById(discussionId);
  }, [discussionId, fetchDiscussionById]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentDiscussion?.messages]);

  // Format timestamp as relative time
  const formatMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    try {
      const result = await sendMessage(discussionId, message);
      if (result) {
        setMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await deleteMessage(discussionId, messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  if (isLoading && !currentDiscussion) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-white">
        <div className="flex items-center justify-center flex-grow">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading discussion...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !currentDiscussion) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100 flex items-center">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-900">
            Error Loading Discussion
          </h1>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to load discussion
            </h2>
            <p className="text-gray-600 mb-4">
              {error ||
                "There was an error loading this discussion. Please try again."}
            </p>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Back to Discussions
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDiscussion) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Discussion not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {currentDiscussion.title}
          </h1>
          <p className="text-sm text-gray-500">
            {currentDiscussion.participants.length} participants
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {!currentDiscussion.messages ||
        currentDiscussion.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          currentDiscussion.messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex items-start gap-3 ${
                msg.sender._id === user?._id ? "flex-row-reverse" : ""
              }`}
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                {msg.sender.profilePicture ? (
                  <Image
                    src={msg.sender.profilePicture}
                    alt={msg.sender.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-sky-100 to-purple-100 flex items-center justify-center text-sky-700 text-sm font-medium">
                    {msg.sender.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div
                className={`flex flex-col ${
                  msg.sender._id === user?._id ? "items-end" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {msg.sender.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatMessageTime(msg.createdAt)}
                  </span>

                  {/* Delete button (only for user's own messages) */}
                  {(msg.sender._id === user?._id || user?.role === "admin") && (
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div
                  className={`mt-1 px-4 py-2 rounded-xl ${
                    msg.sender._id === user?._id
                      ? "bg-sky-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
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
            disabled={isSending}
          />
          <button
            type="submit"
            className="p-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!message.trim() || isSending}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
