import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // Required for devtools typing
import { useShallow } from "zustand/react/shallow"; // CORRECT PATH!
import { logger } from "./middleware/logger";
import {
  createAuthSlice,
  createNotificationSlice,
  createUiSlice,
  type AuthSlice,
  type NotificationSlice,
  type UiSlice,
} from "./slices";

// Combined store type
export type Store = AuthSlice & UiSlice & NotificationSlice;

// Create the store with middleware
export const useStore = create<Store>()(
  devtools(
    persist(
      logger(
        (...a) => ({
          ...createAuthSlice(...a),
          ...createUiSlice(...a),
          ...createNotificationSlice(...a),
        }),
        "store",
      ),
      {
        name: "app-storage", // localStorage key
        storage: createJSONStorage(() => localStorage), // Explicit storage
        partialize: (state) => ({
          // Only persist these fields
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
          user: state.user,
          tokens: state.tokens,
          // Don't persist: notifications, modal, isLoading
        }),
      },
    ),
    { name: "AppStore" }, // DevTools name
  ),
);

// Selector hooks for better performance (v5 compatible with useShallow)
export const useAuth = () =>
  useStore(
    useShallow((state) => ({
      user: state.user,
      tokens: state.tokens,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      login: state.login,
      logout: state.logout,
      updateUser: state.updateUser,
      setTokens: state.setTokens,
      setLoading: state.setLoading,
    })),
  );

export const useUI = () =>
  useStore(
    useShallow((state) => ({
      theme: state.theme,
      sidebarOpen: state.sidebarOpen,
      modal: state.modal,
      setTheme: state.setTheme,
      toggleTheme: state.toggleTheme,
      toggleSidebar: state.toggleSidebar,
      setSidebarOpen: state.setSidebarOpen,
      openModal: state.openModal,
      closeModal: state.closeModal,
    })),
  );

export const useNotifications = () =>
  useStore(
    useShallow((state) => ({
      notifications: state.notifications,
      addNotification: state.addNotification,
      removeNotification: state.removeNotification,
      clearNotifications: state.clearNotifications,
    })),
  );
