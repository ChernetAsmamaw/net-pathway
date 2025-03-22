// store/useNotificationStore.tsx
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export interface Notification {
  id: string;
  type: "verification" | "info" | "warning" | "success";
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => Promise<void>;
  };
  dismissible: boolean;
  createdAt: Date;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  // Actions
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt" | "read">
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  initializeSystemNotifications: () => void;
}

// Check if window is defined (browser) or not (server)
const isBrowser = typeof window !== "undefined";

export const useNotificationStore = create<NotificationState>((set, get) => {
  // Helper function to get notifications from localStorage
  const getStoredNotifications = (): Notification[] => {
    if (!isBrowser) return [];

    try {
      const stored = localStorage.getItem("netPathway_notifications");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }));
      }
    } catch (error) {
      console.error("Failed to parse stored notifications:", error);
      if (isBrowser) {
        localStorage.removeItem("netPathway_notifications");
      }
    }
    return [];
  };

  // Helper function to save notifications to localStorage
  const saveNotificationsToStorage = (notifications: Notification[]) => {
    if (!isBrowser) return;

    localStorage.setItem(
      "netPathway_notifications",
      JSON.stringify(notifications)
    );
  };

  // Helper to calculate unread count
  const calculateUnreadCount = (notifications: Notification[]) => {
    return notifications.filter((n) => !n.read).length;
  };

  return {
    notifications: getStoredNotifications(),
    unreadCount: calculateUnreadCount(getStoredNotifications()),

    // Add a new notification
    addNotification: (notification) => {
      const id = `notification-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const newNotification: Notification = {
        ...notification,
        id,
        createdAt: new Date(),
        read: false,
      };

      set((state) => {
        // Check if notification with same ID already exists
        const exists = state.notifications.some((n) => n.id === id);
        if (exists) return state;

        const updatedNotifications = [newNotification, ...state.notifications];
        saveNotificationsToStorage(updatedNotifications);

        return {
          notifications: updatedNotifications,
          unreadCount: calculateUnreadCount(updatedNotifications),
        };
      });
    },

    // Remove a specific notification
    removeNotification: (id) => {
      set((state) => {
        const updatedNotifications = state.notifications.filter(
          (n) => n.id !== id
        );
        saveNotificationsToStorage(updatedNotifications);

        return {
          notifications: updatedNotifications,
          unreadCount: calculateUnreadCount(updatedNotifications),
        };
      });
    },

    // Mark a specific notification as read
    markAsRead: (id) => {
      set((state) => {
        const updatedNotifications = state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        saveNotificationsToStorage(updatedNotifications);

        return {
          notifications: updatedNotifications,
          unreadCount: calculateUnreadCount(updatedNotifications),
        };
      });
    },

    // Mark all notifications as read
    markAllAsRead: () => {
      set((state) => {
        const updatedNotifications = state.notifications.map((n) => ({
          ...n,
          read: true,
        }));
        saveNotificationsToStorage(updatedNotifications);

        return {
          notifications: updatedNotifications,
          unreadCount: 0,
        };
      });
    },

    // Clear all notifications
    clearAll: () => {
      if (isBrowser) {
        localStorage.removeItem("netPathway_notifications");
      }
      set({ notifications: [], unreadCount: 0 });
    },

    // Initialize system notifications (email verification, etc.)
    initializeSystemNotifications: () => {
      if (!isBrowser) return;

      const { user } = useAuthStore.getState();

      if (user && !user.isEmailVerified) {
        const existingVerification = get().notifications.find(
          (n) => n.id === "email-verification"
        );

        if (!existingVerification) {
          // Add email verification notification
          const emailVerificationNotification: Omit<
            Notification,
            "id" | "createdAt" | "read"
          > = {
            type: "verification",
            title: "Verify Your Email",
            message: "Please verify your email address to access all features.",
            action: {
              label: "Send verification email",
              onClick: async () => {
                try {
                  const response = await fetch(
                    `${
                      process.env.NEXT_PUBLIC_API_URL ||
                      "http://localhost:5000/api"
                    }/verification/send`,
                    {
                      method: "POST",
                      credentials: "include",
                    }
                  );
                  if (!response.ok)
                    throw new Error("Failed to send verification email");
                } catch (error) {
                  console.error("Failed to send verification email:", error);
                  throw error;
                }
              },
            },
            dismissible: true,
          };

          get().addNotification(emailVerificationNotification);
        }
      }
    },
  };
});

// Only subscribe to auth store changes in the browser
if (isBrowser) {
  useAuthStore.subscribe(
    (state) => state.user,
    (user) => {
      if (user) {
        useNotificationStore.getState().initializeSystemNotifications();
      }
    }
  );
}

export default useNotificationStore;
