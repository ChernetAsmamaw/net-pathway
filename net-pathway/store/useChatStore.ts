// store/useChatStore.ts
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
}

interface Message {
  _id: string;
  content: string;
  sender: User;
  read: boolean;
  createdAt: string;
}

interface MentorProfile {
  _id: string;
  title: string;
  company: string;
  expertise: string[];
}

export interface Chat {
  _id: string;
  initiator: User;
  mentor: User;
  mentorProfile: MentorProfile;
  messages: Message[];
  lastMessage: string;
  isActive: boolean;
  unreadBy: string[];
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  loadingChats: boolean;
  loadingChat: boolean;
  sendingMessage: boolean;
  error: string | null;
  unreadCount: number;

  // Actions
  fetchChats: () => Promise<void>;
  fetchChatById: (chatId: string) => Promise<void>;
  initializeChat: (mentorId: string) => Promise<Chat | null>;
  sendMessage: (chatId: string, content: string) => Promise<boolean>;
  markChatAsRead: (chatId: string) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  archiveChat: (chatId: string) => Promise<boolean>;

  // State setters
  clearCurrentChat: () => void;
  setCurrentChat: (chat: Chat | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  currentChat: null,
  loadingChats: false,
  loadingChat: false,
  sendingMessage: false,
  error: null,
  unreadCount: 0,

  // Fetch all chats for the current user
  fetchChats: async () => {
    try {
      set({ loadingChats: true, error: null });

      const response = await axios.get(`${API_URL}/chat`, {
        withCredentials: true,
      });

      if (response.data.chats) {
        set({
          chats: response.data.chats,
          loadingChats: false,
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch chats:", error);
      set({
        loadingChats: false,
        error: error.response?.data?.message || "Failed to load chats",
      });
    }
  },

  // Fetch a specific chat by ID
  fetchChatById: async (chatId: string) => {
    try {
      set({ loadingChat: true, error: null });

      const response = await axios.get(`${API_URL}/chat/${chatId}`, {
        withCredentials: true,
      });

      if (response.data.chat) {
        set({
          currentChat: response.data.chat,
          loadingChat: false,
        });
      }
    } catch (error: any) {
      console.error(`Failed to fetch chat ${chatId}:`, error);
      set({
        loadingChat: false,
        error: error.response?.data?.message || "Failed to load chat",
      });
    }
  },

  // Initialize or get a chat with a mentor
  initializeChat: async (mentorId: string) => {
    try {
      set({ loadingChat: true, error: null });

      const response = await axios.post(
        `${API_URL}/chat/mentor/${mentorId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.chat) {
        const newChat = response.data.chat;

        // Update the chats list if this is a new chat
        const { chats } = get();
        if (!chats.some((chat) => chat._id === newChat._id)) {
          set({
            chats: [newChat, ...chats],
          });
        }

        set({
          currentChat: newChat,
          loadingChat: false,
        });

        return newChat;
      }

      set({ loadingChat: false });
      return null;
    } catch (error: any) {
      console.error("Failed to initialize chat:", error);
      set({
        loadingChat: false,
        error: error.response?.data?.message || "Failed to start chat",
      });
      return null;
    }
  },

  // Send a message in a chat
  sendMessage: async (chatId: string, content: string) => {
    try {
      set({ sendingMessage: true, error: null });

      const response = await axios.post(
        `${API_URL}/chat/${chatId}/messages`,
        { content },
        { withCredentials: true }
      );

      if (response.data.chat && response.data.chatMessage) {
        // Update both the current chat and the chat in the list
        const updatedChat = response.data.chat;
        const { chats } = get();

        set({
          currentChat: updatedChat,
          chats: chats.map((chat) =>
            chat._id === chatId ? updatedChat : chat
          ),
          sendingMessage: false,
        });

        return true;
      }

      set({ sendingMessage: false });
      return false;
    } catch (error: any) {
      console.error("Failed to send message:", error);
      set({
        sendingMessage: false,
        error: error.response?.data?.message || "Failed to send message",
      });
      return false;
    }
  },

  // Mark a chat as read
  markChatAsRead: async (chatId: string) => {
    try {
      const response = await axios.patch(
        `${API_URL}/chat/${chatId}/read`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Update unread status in local state
        const { chats, currentChat } = get();

        // Update the unreadBy array in both current chat and chat list
        if (currentChat && currentChat._id === chatId) {
          set({
            currentChat: { ...currentChat, unreadBy: [] },
          });
        }

        set({
          chats: chats.map((chat) =>
            chat._id === chatId ? { ...chat, unreadBy: [] } : chat
          ),
        });

        // Update unread count
        get().fetchUnreadCount();
      }
    } catch (error: any) {
      console.error("Failed to mark chat as read:", error);
    }
  },

  // Get count of unread chats
  fetchUnreadCount: async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/unread`, {
        withCredentials: true,
      });

      if (response.data.unreadCount !== undefined) {
        set({ unreadCount: response.data.unreadCount });
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  },

  // Archive a chat (soft delete)
  archiveChat: async (chatId: string) => {
    try {
      set({ loadingChat: true, error: null });

      const response = await axios.patch(
        `${API_URL}/chat/${chatId}/archive`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Remove chat from list and clear current chat if it's the archived one
        const { chats, currentChat } = get();

        set({
          chats: chats.filter((chat) => chat._id !== chatId),
          currentChat: currentChat?._id === chatId ? null : currentChat,
          loadingChat: false,
        });

        toast.success("Chat archived");
        return true;
      }

      set({ loadingChat: false });
      return false;
    } catch (error: any) {
      console.error("Failed to archive chat:", error);
      set({
        loadingChat: false,
        error: error.response?.data?.message || "Failed to archive chat",
      });
      return false;
    }
  },

  // Clear the current chat
  clearCurrentChat: () => {
    set({ currentChat: null });
  },

  // Set the current chat
  setCurrentChat: (chat) => {
    set({ currentChat: chat });
  },
}));

export default useChatStore;
