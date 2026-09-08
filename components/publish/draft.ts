import type { Listing } from '@/lib/properties'

export type PhotoDraft = {
  id: string
  url: string
  name: string
  file?: File
}

export type Draft = {
  type: Listing['type']
  status: Listing['status']
  country_id?: number
  province_id?: number
  city_id?: number
  city: string
  district: string
  address: string
  currency_id?: number
  currency: string
  lat: number
  lng: number
  title: string
  price: string
  surface: string
  beds: string
  baths: string
  description: string
  features: string[]
  photos: PhotoDraft[]
  contactName: string
  contactPhone: string
  agree: boolean
}

export const cityCoords: Record<string, [number, number]> = {
  Goma: [-1.6771, 29.2286],
  Bukavu: [-2.5083, 28.8608],
  Kinshasa: [-4.3217, 15.3125],
  Lubumbashi: [-11.6647, 27.4794],
  Uvira: [-3.4056, 29.1386],
}

export const featureOptions = [
  'Piscine',
  'Internet',
  'Ascenseur',
  'Jacuzzi',
  'Caméra',
  'Climatisation',
  'Générateur',
  'Panneaux solaires',
  'Cuisine équipée',
  'Meublé',
  'Vue sur mer',
  'Vue sur lac',
  'Terrasse',
  'Balcon',
  'Jardin',
  'Salle de sport',
  'Sécurité',
]

export const emptyDraft: Draft = {
  type: 'Appartement',
  status: 'À louer',
  country_id: undefined,
  province_id: undefined,
  city_id: undefined,
  city: 'Goma',
  district: '',
  address: '',
  currency_id: undefined,
  currency: 'USD',
  lat: cityCoords.Goma[0],
  lng: cityCoords.Goma[1],
  title: '',
  price: '',
  surface: '',
  beds: '2',
  baths: '1',
  description: '',
  features: [],
  photos: [],
  contactName: '',
  contactPhone: '',
  agree: false,
}

export const steps = ['Type', 'Adresse', 'Caractéristiques', 'Photos', 'Publication'] as const

export function isLand(draft: Draft) {
  return draft.type === 'Terrain'
}

/** Fields that must be filled before the user can move on. */
export function stepErrors(draft: Draft, step: number): string[] {
  const errors: string[] = []

  if (step === 1) {
    if (!draft.district.trim()) errors.push('Indiquez le quartier.')
    if (!draft.address.trim()) errors.push('Indiquez une adresse ou un point de repère.')
  }

  if (step === 2) {
    if (draft.title.trim().length < 8) errors.push('Le titre doit faire au moins 8 caractères.')
    if (!draft.price || Number(draft.price) <= 0) errors.push('Renseignez un prix valide en dollars.')
    if (!draft.surface || Number(draft.surface) <= 0) errors.push('Renseignez la surface en m².')
    if (draft.description.trim().length < 40) errors.push('La description doit faire au moins 40 caractères.')
  }

  if (step === 3 && draft.photos.length < 1) {
    errors.push('Ajoutez au moins une photo du bien.')
  }

  if (step === 4) {
    if (!draft.contactName.trim()) errors.push('Indiquez le nom du contact.')
    if (draft.contactPhone.replace(/\D/g, '').length < 9) errors.push('Indiquez un numéro de téléphone valide.')
    if (!draft.agree) errors.push('Confirmez que vous êtes autorisé à publier ce bien.')
  }

  return errors
}
