// app/(authenticated)/chats/[id]/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { Send, Archive } from "lucide-react";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatHeader from "@/components/chat/ChatHeader";
import EmptyState from "@/components/chat/EmptyState";

export default function ChatDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const {
    currentChat,
    loadingChat,
    sendingMessage,
    fetchChatById,
    sendMessage,
    markChatAsRead,
    archiveChat,
    usingMockData,
  } = useChatStore();

  const [newMessage, setNewMessage] = useState("");
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatId = params?.id as string;

  // Check authentication
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };
    initAuth();
  }, [checkAuth, isAuthenticated, router]);

  // Fetch chat by ID and mark as read
  useEffect(() => {
    if (isAuthenticated && chatId) {
      console.log(
        `Fetching chat: ${chatId}, Authenticated: ${isAuthenticated}`
      );
      fetchChatById(chatId);
      markChatAsRead(chatId);
    }
  }, [isAuthenticated, chatId, fetchChatById, markChatAsRead]);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages]);

  // Get other user from the chat - safely extract values
  const getOtherUser = () => {
    if (!currentChat || !user) return null;

    // Safely get IDs and convert to strings for comparison
    // Make sure none of the properties are undefined
    const currentUserId = user._id?.toString() || ""; // Use _id instead of id
    const initiatorId = currentChat.initiator?._id?.toString() || "";

    if (currentUserId === initiatorId) {
      return currentChat.mentor;
    } else {
      return currentChat.initiator;
    }
  };

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    console.log(`Sending message in chat: ${chatId}`);
    const success = await sendMessage(chatId, newMessage);

    if (success) {
      setNewMessage("");
    }
  };

  // Handle archive chat
  const handleArchiveChat = async () => {
    console.log(`Archiving chat: ${chatId}`);
    const success = await archiveChat(chatId);

    if (success) {
      router.push("/chats");
    }

    setShowArchiveConfirm(false);
  };

  const otherUser = getOtherUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="h-screen max-h-screen flex flex-col overflow-hidden">
        {/* Chat Container */}
        <div className="flex-grow flex flex-col overflow-hidden p-4 sm:p-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full">
            {loadingChat && !currentChat ? (
              <div className="flex-grow flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : !currentChat ? (
              <EmptyState
                title="Chat not found"
                message="This chat may have been archived or doesn't exist"
                actionLabel="Back to chats"
                onAction={() => router.push("/chats")}
              />
            ) : (
              <>
                {/* Chat Header */}
                <ChatHeader
                  chat={currentChat}
                  currentUserId={user._id || ""} // Use _id instead of id
                  onBack={() => router.push("/chats")}
                  onArchive={() => setShowArchiveConfirm(true)}
                />

                {/* Messages Area */}
                <div className="flex-grow overflow-y-auto p-4">
                  {!currentChat.messages ||
                  currentChat.messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-4">
                      <div>
                        <p className="text-gray-500 mb-2">
                          No messages yet. Start the conversation with{" "}
                          {otherUser?.username || "this mentor"}!
                        </p>
                        <p className="text-gray-400 text-sm">
                          {currentChat.mentorProfile?.title || "Mentor"} at{" "}
                          {currentChat.mentorProfile?.company || "Company"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentChat.messages.map((message) => (
                        <ChatMessage
                          key={message._id}
                          message={message}
                          isOwnMessage={
                            message.sender?._id?.toString() ===
                            user._id?.toString()
                          }
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-100">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-grow px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      disabled={sendingMessage}
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !newMessage.trim()}
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {sendingMessage ? "Sending..." : "Send"}
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Archive Confirmation Modal */}
        {showArchiveConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Archive Chat
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to archive this chat? You won't be able to
                access it again.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowArchiveConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleArchiveChat}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
