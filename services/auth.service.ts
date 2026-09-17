import { apiClient } from './api.service';
import {
  AuthResponse,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterCredentials,
  ResendOtpPayload,
  ResetPasswordPayload,
  User,
  VerifyOtpPayload,
} from '../types/auth.types';

/** Normalise les formats de réponse courants de Laravel/Sanctum.
 * L'API peut répondre directement, ou encapsuler `user` et le token dans `data`.
 */
function normalizeAuthResponse(payload: unknown): AuthResponse {
  const root = payload as Record<string, any>;
  const data = root?.data && typeof root.data === 'object' ? root.data : root;
  const rawUser = root?.user || data?.user || (data?.id ? data : undefined);
  const token = root?.token || root?.access_token || root?.accessToken
    || data?.token || data?.access_token || data?.accessToken;

  if (!rawUser?.id || !token) {
    throw new Error('La réponse de connexion est incomplète : utilisateur ou jeton absent.');
  }

  return {
    user: rawUser as User,
    token,
    accessToken: token,
    message: root?.message || data?.message,
    requiresOtp: root?.requiresOtp || data?.requiresOtp,
  };
}

function normalizeUser(payload: unknown): User {
  const root = payload as Record<string, any>;
  const data = root?.data && typeof root.data === 'object' ? root.data : root;
  const user = data?.user || root?.user || data;

  if (!user?.id) {
    throw new Error('Le profil utilisateur retourné par le serveur est invalide.');
  }

  return user as User;
}

export const authService = {
  /**
   * Connexion avec email et mot de passe
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return normalizeAuthResponse(response.data);
  },

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(data: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return normalizeAuthResponse(response.data);
  },

  /**
   * Connexion via Google OAuth
   */
  async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/google', { token: idToken });
    return normalizeAuthResponse(response.data);
  },

  /**
   * Récupération du profil utilisateur connecté
   */
  async me(): Promise<User> {
    const response = await apiClient.get<User | { data: User }>('/auth/me');
    return normalizeUser(response.data);
  },

  /**
   * Déconnexion de l'utilisateur
   */
  async logout(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/logout');
    return response.data;
  },

  /**
   * Demande de réinitialisation de mot de passe (Mot de passe oublié)
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', payload);
    return response.data;
  },

  /**
   * Réinitialisation effective du mot de passe
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/reset-password', payload);
    return response.data;
  },

  /**
   * Vérification du code OTP
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/verify-otp', payload);
    return normalizeAuthResponse(response.data);
  },

  /**
   * Renvoi d'un nouveau code OTP
   */
  async resendOtp(payload: ResendOtpPayload): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/resend-otp', payload);
    return response.data;
  },
};
