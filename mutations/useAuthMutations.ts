import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/useAuthStore';
import { parseApiError } from '../utils/error.utils';
import {
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterCredentials,
  ResendOtpPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
  AuthResponse,
} from '../types/auth.types';
import { ApiErrorResponse } from '../types/api.types';

function persistAuthentication(response: AuthResponse, setAuth: (user: AuthResponse['user'], token?: string) => void) {
  const token = response.token || response.accessToken || response.access_token;
  if (!token || !response.user?.id) {
    throw new Error('Connexion impossible : le serveur n’a pas retourné de session valide.');
  }
  setAuth(response.user, token);
}

export function useAuthMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorResponse | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logoutStore = useAuthStore((state) => state.logout);

  const loginMutation = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      persistAuthentication(response, setAuth);
      return response;
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  const registerMutation = async (data: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      persistAuthentication(response, setAuth);
      return response;
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpMutation = async (payload: VerifyOtpPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.verifyOtp(payload);
      persistAuthentication(response, setAuth);
      return response;
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  const resendOtpMutation = async (payload: ResendOtpPayload) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.resendOtp(payload);
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  const forgotPasswordMutation = async (payload: ForgotPasswordPayload) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.forgotPassword(payload);
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordMutation = async (payload: ResetPasswordPayload) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.resetPassword(payload);
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  const googleLoginMutation = async (googleToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.googleLogin(googleToken);
      persistAuthentication(response, setAuth);
      return response;
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  const logoutMutation = async () => {
    setLoading(true);
    try {
      await logoutStore();
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    loginMutation,
    registerMutation,
    verifyOtpMutation,
    resendOtpMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    googleLoginMutation,
    logoutMutation,
  };
}
