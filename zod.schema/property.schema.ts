import { z } from 'zod'

export const createPropertySchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  property_type_id: z.string().optional(),
  property_category_id: z.string().optional(),
  transaction_type: z.string().min(1, 'Veuillez choisir un type de transaction'),
  price: z.coerce.number().min(0, 'Le prix doit être positif'),
  currency: z.string().default('USD'),
  surface_area: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  rooms: z.coerce.number().optional(),
  address: z.string().min(2, 'Veuillez saisir une adresse valide'),
  city: z.string().min(2, 'La ville est requise'),
  neighborhood: z.string().optional(),
  district: z.string().optional(),
  status: z.string().default('published'),
})

export type CreatePropertyFormValues = z.infer<typeof createPropertySchema>
