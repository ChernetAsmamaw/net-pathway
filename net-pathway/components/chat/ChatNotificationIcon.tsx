// components/chat/ChatNotificationIcon.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";

const ChatNotificationIcon: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { unreadCount, fetchUnreadCount } = useChatStore();

  // Fetch unread count when component mounts and when auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();

      // Poll for unread updates every minute
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchUnreadCount]);

  return (
    <button
      onClick={() => router.push("/chats")}
      className="relative p-2 rounded-full hover:bg-gray-200 transition-colors"
      aria-label="Chat messages"
    >
      <MessageSquare className="w-5 h-5 text-gray-700" />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default ChatNotificationIcon;
