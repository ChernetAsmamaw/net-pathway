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

// Mock data for when API endpoints aren't available yet
const mockChat = (mentorId: string): Chat => {
  const uniqueId = `mock-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  return {
    _id: uniqueId,
    initiator: {
      _id: "current-user-id",
      username: "You",
      profilePicture: undefined,
    },
    mentor: {
      _id: `mentor-${mentorId}`,
      username: "Mentor",
      profilePicture: undefined,
    },
    mentorProfile: {
      _id: mentorId,
      title: "Software Engineer",
      company: "Tech Company",
      expertise: ["Programming", "Career Advice"],
    },
    messages: [],
    lastMessage: new Date().toISOString(),
    isActive: true,
    unreadBy: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

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

      try {
        const response = await axios.get(`${API_URL}/chats`, {
          withCredentials: true,
        });

        if (response.data) {
          set({
            chats: response.data.chats,
            unreadCount: Object.values(response.data.unreadCounts || {}).reduce(
              (sum: number, count: number) => sum + count,
              0
            ),
          });
        }
      } catch (error) {
        // If API fails, use mock data for development
        if (process.env.NODE_ENV === "development") {
          console.log("Using mock chats data - endpoint not available");
          // Don't set any mock data to avoid confusion
          set({ chats: [] });
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch chats:", error);
      set({
        error: error.response?.data?.message || "Failed to load chats",
      });
      // Only show toast if not a 404 (which likely means the endpoint isn't set up yet)
      if (error.response?.status !== 404) {
        toast.error("Failed to load chats");
      }
    } finally {
      set({ loadingChats: false });
    }
  },

  // Fetch a specific chat by ID
  fetchChatById: async (chatId: string) => {
    try {
      set({ loadingChat: true, error: null });

      try {
        const response = await axios.get(`${API_URL}/chats/${chatId}`, {
          withCredentials: true,
        });

        if (response.data.chat) {
          set({ currentChat: response.data.chat });

          // Update the chat in the list if it exists
          const { chats } = get();
          const updatedChats = chats.map((chat) =>
            chat._id === chatId ? response.data.chat : chat
          );

          set({ chats: updatedChats });
        }
      } catch (error) {
        // If API fails, use mock data for development
        if (
          process.env.NODE_ENV === "development" &&
          chatId.startsWith("mock-")
        ) {
          console.log("Using mock chat data - endpoint not available");
          // If this is a mock chat ID, find it in the store
          const { chats } = get();
          const mockChat = chats.find((chat) => chat._id === chatId);
          if (mockChat) {
            set({ currentChat: mockChat });
          }
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error(`Failed to fetch chat with ID ${chatId}:`, error);
      set({
        error: error.response?.data?.message || "Failed to load chat",
      });
      // Only show toast if not a 404
      if (error.response?.status !== 404) {
        toast.error("Failed to load chat");
      }
    } finally {
      set({ loadingChat: false });
    }
  },

  // Initialize or get a chat with a mentor
  initializeChat: async (mentorId: string) => {
    try {
      set({ loadingChat: true, error: null });

      try {
        const response = await axios.post(
          `${API_URL}/chats/mentor/${mentorId}`,
          {},
          { withCredentials: true }
        );

        if (response.data.chat) {
          const newChat = response.data.chat;

          // Update the chats list
          const { chats } = get();
          const chatExists = chats.some((chat) => chat._id === newChat._id);

          if (!chatExists) {
            set({ chats: [newChat, ...chats] });
          }

          set({ currentChat: newChat });
          return newChat;
        }
      } catch (error) {
        // If API fails, use mock data for development
        if (process.env.NODE_ENV === "development") {
          console.log("Using mock chat data - endpoint not available");
          const newMockChat = mockChat(mentorId);

          // Add to chats list
          const { chats } = get();
          set({
            chats: [newMockChat, ...chats],
            currentChat: newMockChat,
          });

          // Return mock chat for routing
          return newMockChat;
        } else {
          throw error;
        }
      }

      return null;
    } catch (error: any) {
      console.error("Failed to initialize chat:", error);
      set({
        error: error.response?.data?.message || "Failed to start chat",
      });
      // Only show toast if not a 404
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || "Failed to start chat");
      }
      return null;
    } finally {
      set({ loadingChat: false });
    }
  },

  // Send a message in a chat
  sendMessage: async (chatId: string, content: string) => {
    try {
      set({ sendingMessage: true, error: null });

      try {
        const response = await axios.post(
          `${API_URL}/chats/${chatId}/messages`,
          { content },
          { withCredentials: true }
        );

        if (response.data.chat) {
          // Update the current chat with the new message
          set({ currentChat: response.data.chat });

          // Update the chat in the list
          const { chats } = get();
          const updatedChats = chats.map((chat) =>
            chat._id === chatId ? response.data.chat : chat
          );

          set({ chats: updatedChats });
          return true;
        }
      } catch (error) {
        // If API fails, use mock data for development
        if (
          process.env.NODE_ENV === "development" &&
          chatId.startsWith("mock-")
        ) {
          console.log("Using mock message data - endpoint not available");

          // Create a mock message
          const mockMessage = {
            _id: `msg-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 9)}`,
            content,
            sender: {
              _id: "current-user-id",
              username: "You",
              profilePicture: undefined,
            },
            read: false,
            createdAt: new Date().toISOString(),
          };

          // Update the current chat
          const { currentChat, chats } = get();
          if (currentChat && currentChat._id === chatId) {
            const updatedChat = {
              ...currentChat,
              messages: [...currentChat.messages, mockMessage],
              lastMessage: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            // Update state
            set({
              currentChat: updatedChat,
              chats: chats.map((chat) =>
                chat._id === chatId ? updatedChat : chat
              ),
            });

            return true;
          }
        } else {
          throw error;
        }
      }

      return false;
    } catch (error: any) {
      console.error("Failed to send message:", error);
      set({
        error: error.response?.data?.message || "Failed to send message",
      });
      // Only show toast if not a 404
      if (error.response?.status !== 404) {
        toast.error("Failed to send message");
      }
      return false;
    } finally {
      set({ sendingMessage: false });
    }
  },

  // Mark a chat as read
  markChatAsRead: async (chatId: string) => {
    try {
      try {
        const response = await axios.patch(
          `${API_URL}/chats/${chatId}/read`,
          {},
          { withCredentials: true }
        );

        if (response.data) {
          // Update unread count
          await get().fetchUnreadCount();

          // Update current chat's unreadBy field if it's the active chat
          const { currentChat } = get();
          if (currentChat && currentChat._id === chatId) {
            // Remove current user from unreadBy
            set({
              currentChat: {
                ...currentChat,
                unreadBy: [],
              },
            });
          }
        }
      } catch (error) {
        // If API fails, simulate for development
        if (
          process.env.NODE_ENV === "development" &&
          chatId.startsWith("mock-")
        ) {
          console.log("Using mock read status - endpoint not available");

          // Update current chat's unreadBy field if it's the active chat
          const { currentChat, chats } = get();
          if (currentChat && currentChat._id === chatId) {
            // Mock reading messages by emptying unreadBy array
            const updatedChat = {
              ...currentChat,
              unreadBy: [],
            };

            set({
              currentChat: updatedChat,
              chats: chats.map((chat) =>
                chat._id === chatId ? updatedChat : chat
              ),
              unreadCount: Math.max(0, get().unreadCount - 1),
            });
          }
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error("Failed to mark chat as read:", error);
      // Don't set error state for this operation as it's not critical
    }
  },

  // Get count of unread chats
  fetchUnreadCount: async () => {
    try {
      try {
        const response = await axios.get(`${API_URL}/chats/unread`, {
          withCredentials: true,
        });

        if (response.data) {
          set({ unreadCount: response.data.unreadCount || 0 });
        }
      } catch (error) {
        // If API fails, just use the unread counts from the store
        // We don't want to throw an error or show a toast for this
        console.log(
          "Could not fetch unread counts - endpoint might not be available yet"
        );
      }
    } catch (error: any) {
      // This catch should never be reached due to the inner try/catch
      console.error("Failed to fetch unread count:", error);
    }
  },

  // Archive a chat (soft delete)
  archiveChat: async (chatId: string) => {
    try {
      set({ loadingChat: true, error: null });

      try {
        const response = await axios.patch(
          `${API_URL}/chats/${chatId}/archive`,
          {},
          { withCredentials: true }
        );

        if (response.data) {
          // Remove chat from list
          const { chats } = get();
          const updatedChats = chats.filter((chat) => chat._id !== chatId);

          // Clear current chat if it's the archived one
          if (get().currentChat?._id === chatId) {
            set({ currentChat: null });
          }

          set({ chats: updatedChats });
          toast.success("Chat archived successfully");
          return true;
        }
      } catch (error) {
        // If API fails, simulate for development
        if (
          process.env.NODE_ENV === "development" &&
          chatId.startsWith("mock-")
        ) {
          console.log("Using mock archive - endpoint not available");

          // Remove chat from list
          const { chats } = get();
          const updatedChats = chats.filter((chat) => chat._id !== chatId);

          // Clear current chat if it's the archived one
          if (get().currentChat?._id === chatId) {
            set({ currentChat: null });
          }

          set({ chats: updatedChats });
          toast.success("Chat archived successfully");
          return true;
        } else {
          throw error;
        }
      }

      return false;
    } catch (error: any) {
      console.error("Failed to archive chat:", error);
      set({
        error: error.response?.data?.message || "Failed to archive chat",
      });
      // Only show toast if not a 404
      if (error.response?.status !== 404) {
        toast.error("Failed to archive chat");
      }
      return false;
    } finally {
      set({ loadingChat: false });
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
