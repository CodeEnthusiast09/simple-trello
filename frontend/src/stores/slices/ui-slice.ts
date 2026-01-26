import type { StateCreator } from "zustand";
import type { Theme, ModalState } from "../types";

// UI slice state
export interface UiSlice {
  // State
  theme: Theme;
  sidebarOpen: boolean;
  modal: ModalState;

  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (title: string, content?: React.ReactNode) => void;
  closeModal: () => void;
}

// Create the slice
export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set) => ({
  // Initial state
  theme: "system",
  sidebarOpen: true,
  modal: {
    isOpen: false,
  },

  // Set theme
  setTheme: (theme) => set({ theme }),

  // Toggle between light/dark (ignores system)
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),

  // Toggle sidebar
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  // Set sidebar state explicitly
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Open modal
  openModal: (title, content) =>
    set({
      modal: {
        isOpen: true,
        title,
        content,
      },
    }),

  // Close modal
  closeModal: () =>
    set({
      modal: {
        isOpen: false,
        title: undefined,
        content: undefined,
      },
    }),
});
