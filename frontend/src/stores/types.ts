// User type
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// Auth token
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Notification type
export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number; // milliseconds
}

// Theme
export type Theme = "light" | "dark" | "system";

// Modal state
export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
}
