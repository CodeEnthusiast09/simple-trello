import type { StateCreator } from "zustand";
import type { Notification, NotificationType } from "../types";

// Notification slice state
export interface NotificationSlice {
  // State
  notifications: Notification[];

  // Actions
  addNotification: (
    type: NotificationType,
    message: string,
    duration?: number,
  ) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Create the slice
export const createNotificationSlice: StateCreator<
  NotificationSlice,
  [],
  [],
  NotificationSlice
> = (set, get) => ({
  // Initial state
  notifications: [],

  // Add notification
  addNotification: (type, message, duration = 5000) => {
    const id = `${Date.now()}-${Math.random()}`;

    const notification: Notification = {
      id,
      type,
      message,
      duration,
    };

    // Add to array
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }

    return id;
  },

  // Remove notification by ID
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  // Clear all notifications
  clearNotifications: () => set({ notifications: [] }),
});
