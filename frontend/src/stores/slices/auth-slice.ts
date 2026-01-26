import type { StateCreator } from "zustand";
import type { User, AuthTokens } from "../types";

// Auth slice state
export interface AuthSlice {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setTokens: (tokens: AuthTokens) => void;
  setLoading: (isLoading: boolean) => void;
}

// Create the slice
// StateCreator<T, Mps, Mcs, T> where:
// T = This slice's type
// Mps = Middlewares applied to this slice (persist, devtools, etc.)
// Mcs = Middlewares from child slices
// The last T = Return type (what this slice contributes)
export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (
  set,
) => ({
  // Initial state
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,

  // Login action
  login: (user, tokens) =>
    set({
      user,
      tokens,
      isAuthenticated: true,
      isLoading: false,
    }),

  // Logout action
  logout: () =>
    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
    }),

  // Update user profile
  updateUser: (userData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    })),

  // Update tokens (for refresh)
  setTokens: (tokens) => set({ tokens }),

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),
});
