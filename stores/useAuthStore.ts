import { create } from 'zustand';
import { User } from '../types/auth.types';
import { getToken, removeToken, setToken } from '../utils/token.utils';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAuth: (user: User, token?: string) => void;
  clearAuth: () => void;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: getToken(),
  isAuthenticated: !!getToken(),
  isLoading: true,
  error: null,

  setAuth: (user: User, token?: string) => {
    if (token) {
      setToken(token);
    }
    set({
      user,
      token: token || getToken(),
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  clearAuth: () => {
    removeToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  setUser: (user: User | null) => {
    set({ user });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  initializeAuth: async () => {
    const currentToken = getToken();
    if (!currentToken) {
      set({ isLoading: false, isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authService.me();
      set({
        user,
        token: currentToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      removeToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Ignorer l'erreur d'API si le token est déjà expiré
    } finally {
      get().clearAuth();
    }
  },
}));
