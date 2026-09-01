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

export const authService = {
  /**
   * Connexion avec email et mot de passe
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(data: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Connexion via Google OAuth
   */
  async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/google', { token: idToken });
    return response.data;
  },

  /**
   * Récupération du profil utilisateur connecté
   */
  async me(): Promise<User> {
    const response = await apiClient.get<User | { data: User }>('/auth/me');
    return (response.data as { data: User }).data || (response.data as User);
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
    return response.data;
  },

  /**
   * Renvoi d'un nouveau code OTP
   */
  async resendOtp(payload: ResendOtpPayload): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/resend-otp', payload);
    return response.data;
  },
};
