// app/(authenticated)/chats/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { MessageSquare, Inbox, Search } from "lucide-react";
import ChatListItem from "@/components/chat/ChatListItem";
import EmptyState from "@/components/chat/EmptyState";

export default function ChatsPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const { chats, loadingChats, fetchChats } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");

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

  // Fetch chats when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchChats();
    }
  }, [isAuthenticated, fetchChats]);

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const otherUser =
      user?.id === chat.initiator._id ? chat.mentor : chat.initiator;

    return (
      otherUser.username.toLowerCase().includes(query) ||
      (chat.mentorProfile?.title &&
        chat.mentorProfile.title.toLowerCase().includes(query)) ||
      (chat.mentorProfile?.company &&
        chat.mentorProfile.company.toLowerCase().includes(query)) ||
      chat.messages.some((msg) => msg.content.toLowerCase().includes(query))
    );
  });

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
      <main>
        <div className="p-6 md:p-8">
          {/* Header Section */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-700">
            <h1 className="text-3xl font-bold text-sky-800 mb-2">
              Chat Messages
            </h1>
            <p className="text-slate-600">
              Communicate with mentors and track your conversations
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Chat List */}
          {loadingChats ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredChats.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="divide-y divide-gray-100">
                {filteredChats.map((chat) => (
                  <ChatListItem
                    key={chat._id}
                    chat={chat}
                    currentUserId={user.id}
                    onClick={() => router.push(`/chats/${chat._id}`)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<Inbox className="w-16 h-16 text-gray-300" />}
              title="No chats found"
              message={
                searchQuery
                  ? "No chats match your search. Try different keywords or clear your search."
                  : "You haven't started any chats with mentors yet. Find a mentor and start a conversation!"
              }
              actionLabel={searchQuery ? "Clear search" : "Find mentors"}
              onAction={() =>
                searchQuery ? setSearchQuery("") : router.push("/mentorship")
              }
            />
          )}
        </div>
      </main>
    </div>
  );
}
