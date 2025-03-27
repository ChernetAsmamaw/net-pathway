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
  usingMockData: boolean;

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

// Helper to create mock chats
const createMockChat = (mentorId: string, mentorName: string): Chat => {
  const uniqueId = `mock-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  return {
    _id: uniqueId,
    initiator: {
      _id: "current-user-id",
      username: "You", // Changed from "Current User" to "You"
      profilePicture: undefined,
    },
    mentor: {
      _id: `mentor-${mentorId}`,
      username: mentorName || "Mentor",
      profilePicture: undefined,
    },
    mentorProfile: {
      _id: mentorId,
      title: "Senior Developer",
      company: "Tech Solutions Inc.",
      expertise: ["Programming", "Career Advice", "Mentoring"],
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
  usingMockData: true, // Always use mock data since API is 404ing

  // Fetch all chats for the current user
  fetchChats: async () => {
    try {
      set({ loadingChats: true, error: null });

      // For now using mock data
      console.log("Using mock chat data since API is not available");

      // Create mock chats with a few sample mentors
      const mockChats = [
        createMockChat("mentor1", "John Mentor"),
        createMockChat("mentor2", "Alice Advisor"),
        createMockChat("mentor3", "Robert Coach"),
      ];

      // Add some sample messages to make the chats more realistic
      mockChats[0].messages = [
        {
          _id: `msg-1`,
          content:
            "Hello, I'm interested in learning more about your mentorship program.",
          sender: mockChats[0].initiator,
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
          _id: `msg-2`,
          content:
            "Hi there! I'd be happy to tell you more about it. What specific areas are you looking to improve?",
          sender: mockChats[0].mentor,
          read: true,
          createdAt: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
        },
      ];

      mockChats[1].messages = [
        {
          _id: `msg-3`,
          content:
            "I'm looking for guidance on advancing my career in software development.",
          sender: mockChats[1].initiator,
          read: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        },
        {
          _id: `msg-4`,
          content:
            "That's great! I specialize in software career advancement. What's your current role?",
          sender: mockChats[1].mentor,
          read: true,
          createdAt: new Date(Date.now() - 169200000).toISOString(), // 47 hours ago
        },
        {
          _id: `msg-5`,
          content:
            "I'm currently a junior developer looking to move into a mid-level position.",
          sender: mockChats[1].initiator,
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
      ];

      set({
        chats: mockChats,
        usingMockData: true,
      });
    } catch (error: any) {
      console.error("Failed to fetch chats:", error);
      set({
        error: "Failed to load chats",
      });
    } finally {
      set({ loadingChats: false });
    }
  },

  // Fetch a specific chat by ID
  fetchChatById: async (chatId: string) => {
    try {
      set({ loadingChat: true, error: null });

      // Just use mock data since the API is 404ing
      const { chats } = get();
      const mockChat = chats.find((chat) => chat._id === chatId);

      if (mockChat) {
        set({ currentChat: mockChat });
        console.log("Using existing mock chat");
      } else {
        // Create a new mock chat
        console.log("Creating new mock chat");
        const newMockChat = createMockChat(
          chatId.replace("mock-", ""),
          "Demo Mentor"
        );

        // Add welcome message from the mentor
        newMockChat.messages = [
          {
            _id: `msg-welcome-${Date.now()}`,
            content: "Hello! I'm your new mentor. How can I help you today?",
            sender: newMockChat.mentor,
            read: false,
            createdAt: new Date().toISOString(),
          },
        ];

        set({
          currentChat: newMockChat,
          chats: [...chats, newMockChat],
          usingMockData: true,
        });
      }
    } catch (error: any) {
      console.error(`Failed to fetch chat ${chatId}:`, error);

      // Create a mock chat for testing
      const mockChat = createMockChat(
        chatId.replace("mock-", ""),
        "Fallback Mentor"
      );
      set({
        currentChat: mockChat,
        usingMockData: true,
      });

      // Add to chat list if not exists
      const { chats } = get();
      if (!chats.some((chat) => chat._id === mockChat._id)) {
        set({ chats: [mockChat, ...chats] });
      }
    } finally {
      set({ loadingChat: false });
    }
  },

  // Initialize or get a chat with a mentor
  initializeChat: async (mentorId: string) => {
    try {
      set({ loadingChat: true, error: null });

      // Create a mock chat since the API is 404ing
      console.log("Creating mock chat for mentor:", mentorId);

      // Determine a more realistic mentor name based on ID
      let mentorName = "Unknown Mentor";
      if (mentorId.includes("1")) mentorName = "John Mentor";
      else if (mentorId.includes("2")) mentorName = "Alice Advisor";
      else if (mentorId.includes("3")) mentorName = "Robert Coach";
      else if (mentorId.includes("4")) mentorName = "Sarah Guide";
      else mentorName = `Mentor ${mentorId.slice(-2)}`;

      const newMockChat = createMockChat(mentorId, mentorName);

      // Add an automatic welcome message from the mentor
      newMockChat.messages = [
        {
          _id: `msg-welcome-${Date.now()}`,
          content: `Hello! I'm ${mentorName}. I'm happy to connect with you. How can I help with your career development today?`,
          sender: newMockChat.mentor,
          read: false,
          createdAt: new Date().toISOString(),
        },
      ];

      // Add to chats list
      const { chats } = get();
      set({
        chats: [newMockChat, ...chats],
        currentChat: newMockChat,
        usingMockData: true,
      });

      return newMockChat;
    } catch (error: any) {
      console.error("Failed to initialize chat:", error);
      set({
        error: "Failed to start chat",
      });
      return null;
    } finally {
      set({ loadingChat: false });
    }
  },

  // Send a message in a chat
  sendMessage: async (chatId: string, content: string) => {
    try {
      set({ sendingMessage: true, error: null });

      // Handle locally since we're using mock data
      // Create a mock message
      const mockMessage = {
        _id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        content,
        sender: {
          _id: "current-user-id",
          username: "You", // Changed from "Current User" to "You"
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
          messages: [...(currentChat.messages || []), mockMessage],
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

        // Add automatic mentor response after a short delay
        setTimeout(() => {
          // Only respond if still on the same chat
          const currentState = get();
          if (currentState.currentChat?._id === chatId) {
            const responseMessage = {
              _id: `msg-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)}`,
              content: generateMentorResponse(
                content,
                currentState.currentChat.mentor.username
              ),
              sender: currentState.currentChat.mentor,
              read: false,
              createdAt: new Date().toISOString(),
            };

            const updatedChat = {
              ...currentState.currentChat,
              messages: [...currentState.currentChat.messages, responseMessage],
              lastMessage: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            set({
              currentChat: updatedChat,
              chats: currentState.chats.map((chat) =>
                chat._id === chatId ? updatedChat : chat
              ),
            });
          }
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds

        return true;
      }

      return false;
    } catch (error: any) {
      console.error("Failed to send message:", error);
      set({
        error: "Failed to send message",
      });
      return false;
    } finally {
      set({ sendingMessage: false });
    }
  },

  // Mark a chat as read
  markChatAsRead: async (chatId: string) => {
    try {
      // Update locally since we're using mock data
      const { currentChat, chats } = get();
      if (currentChat && currentChat._id === chatId) {
        // Update the chat to mark as read
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
    } catch (error: any) {
      console.error("Failed to mark chat as read:", error);
    }
  },

  // Get count of unread chats - just use local data
  fetchUnreadCount: async () => {
    // Just calculate from local data
    try {
      const { chats } = get();
      const unreadCount = chats.filter((chat) => {
        // Safely check if the current user is in the unreadBy array
        return (chat.unreadBy || []).some(
          (id) => String(id) === "current-user-id"
        );
      }).length;

      set({ unreadCount });
    } catch (error) {
      console.error("Error calculating unread count:", error);
    }
  },

  // Archive a chat (soft delete)
  archiveChat: async (chatId: string) => {
    try {
      set({ loadingChat: true, error: null });

      // Handle locally since we're using mock data
      // Remove chat from list
      const { chats } = get();
      const updatedChats = chats.filter((chat) => chat._id !== chatId);

      // Clear current chat if it's the archived one
      if (get().currentChat?._id === chatId) {
        set({ currentChat: null });
      }

      set({ chats: updatedChats });
      toast.success("Chat archived");
      return true;
    } catch (error: any) {
      console.error("Failed to archive chat:", error);
      set({
        error: "Failed to archive chat",
      });
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

// Helper function to generate realistic mentor responses
function generateMentorResponse(
  userMessage: string,
  mentorName: string
): string {
  const userMessageLower = userMessage.toLowerCase();

  // Check for common questions/patterns and provide relevant responses
  if (
    userMessageLower.includes("hello") ||
    userMessageLower.includes("hi") ||
    userMessageLower.includes("hey")
  ) {
    return `Hello there! How can I help you today?`;
  }

  if (
    userMessageLower.includes("experience") ||
    userMessageLower.includes("background")
  ) {
    return `I have over 8 years of experience in tech and career development. I've worked with companies like TechCorp and InnoSystems before becoming a mentor.`;
  }

  if (userMessageLower.includes("resume") || userMessageLower.includes("cv")) {
    return `I'd be happy to review your resume! You can share it here or we can schedule a call to go through it together.`;
  }

  if (
    userMessageLower.includes("interview") ||
    userMessageLower.includes("interviews")
  ) {
    return `Interview preparation is crucial. Let's focus on common questions in your field and practice with mock interviews. Would you like to start with technical or behavioral questions?`;
  }

  if (userMessageLower.includes("thank")) {
    return `You're welcome! I'm here to help. Let me know if you have any other questions.`;
  }

  if (
    userMessageLower.includes("advice") ||
    userMessageLower.includes("suggestion")
  ) {
    return `My advice would be to focus on building a portfolio of projects that demonstrate your skills. Also, networking is incredibly important in this industry. Have you been attending any industry events or meetups?`;
  }

  // Default responses for when no specific pattern is matched
  const defaultResponses = [
    `That's an interesting point. Could you tell me more about your goals in this area?`,
    `I understand where you're coming from. Based on my experience, I would suggest focusing on developing your skills in that direction.`,
    `Great question! This is something many of my mentees ask about. Let's break this down step by step.`,
    `I think we should explore this topic further. It's an important aspect of your career development.`,
    `Let me share some insights from my experience that might help you with this.`,
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export default useChatStore;
