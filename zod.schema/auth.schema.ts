import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "L'adresse email est requise" })
    .email({ message: 'Adresse email invalide' }),
  password: z
    .string()
    .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
    email: z
      .string()
      .min(1, { message: "L'adresse email est requise" })
      .email({ message: 'Adresse email invalide' }),
    phone: z.string().optional(),
    role: z.enum(['client', 'owner', 'agency']).default('client'),
    password: z
      .string()
      .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
    password_confirmation: z
      .string()
      .min(1, { message: 'La confirmation du mot de passe est requise' }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['password_confirmation'],
  });

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "L'adresse email est requise" })
    .email({ message: 'Adresse email invalide' }),
  code: z
    .string()
    .length(6, { message: 'Le code OTP doit contenir exactement 6 chiffres' }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "L'adresse email est requise" })
    .email({ message: 'Adresse email invalide' }),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "L'adresse email est requise" })
      .email({ message: 'Adresse email invalide' }),
    token: z.string().optional(),
    code: z.string().optional(),
    password: z
      .string()
      .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
    password_confirmation: z
      .string()
      .min(1, { message: 'La confirmation du mot de passe est requise' }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['password_confirmation'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
