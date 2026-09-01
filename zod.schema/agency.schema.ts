import { z } from 'zod';

export const createAgencySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Le nom de l'agence doit contenir au moins 3 caractères" })
    .max(255, { message: "Le nom de l'agence ne peut pas dépasser 255 caractères" }),
  email: z
    .string()
    .email({ message: 'Adresse email d\'agence invalide' })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  website: z
    .string()
    .url({ message: 'URL de site web invalide (ex: https://monagence.com)' })
    .optional()
    .or(z.literal('')),
  registration_number: z.string().optional().or(z.literal('')),
  tax_number: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
});

export type CreateAgencyInputSchema = z.infer<typeof createAgencySchema>;
