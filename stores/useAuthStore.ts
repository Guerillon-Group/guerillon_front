import { create } from 'zustand';
import { User } from '../types/auth.types';
import { getToken, removeToken, setToken } from '../utils/token.utils';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
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
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
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
      isInitialized: true,
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
      isInitialized: true,
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
    const { isAuthenticated, user, token, isInitialized } = get();
    const currentToken = getToken();

    // 1. Si aucun token n'existe en localStorage
    if (!currentToken) {
      set({ isLoading: false, isAuthenticated: false, user: null, isInitialized: true });
      return;
    }

    // 2. Si l'authentification est déjà initialisée et valide pour ce même token
    if (isInitialized && isAuthenticated && user && token === currentToken) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const userData = await authService.me();
      set({
        user: userData,
        token: currentToken,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    } catch (err: any) {
      removeToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
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
