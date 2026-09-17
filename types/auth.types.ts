export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: string | null;
  status?: 'active' | 'inactive' | 'suspended' | string;
  avatar?: string | null;
  emailVerifiedAt?: string | null;
  phoneVerifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  role?: 'client' | 'owner' | 'agency' | string;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token?: string;
  code?: string;
  password?: string;
  password_confirmation?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  accessToken?: string;
  access_token?: string;
  message?: string;
  requiresOtp?: boolean;
}
