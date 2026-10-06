import { resolveImageUrl } from './utils'

export type PropertyType =
  | 'Appartement'
  | 'Maison'
  | 'Villa'
  | 'Studio'
  | 'Terrain'
  | 'Ferme'
  | 'Bureau'
  | 'Hôtel'
  | 'Entrepôt'
  | 'Local commercial'
  | 'Immeuble'
  | 'Résidence'

export type PropertyCategory = 'Résidentiel' | 'Commercial' | 'Agricole' | 'Industriel'

export type PropertyFeature =
  | 'Piscine'
  | 'Internet'
  | 'Ascenseur'
  | 'Jacuzzi'
  | 'Caméra'
  | 'Climatisation'
  | 'Générateur'
  | 'Panneaux solaires'
  | 'Cuisine équipée'
  | 'Meublé'
  | 'Vue sur mer'
  | 'Vue sur lac'
  | 'Terrasse'
  | 'Balcon'
  | 'Jardin'
  | 'Salle de sport'
  | 'Sécurité'

export type PropertyImage = {
  id: string
  propertyId: string
  url: string
  thumbnail?: string
  width?: number
  height?: number
  size?: number
  order?: number
  isCover?: boolean
}

export type Listing = {
  id?: string
  reference?: string
  ownerId?: string
  agentId?: string

  title: string
  slug: string
  description: string

  propertyTypeId?: PropertyType
  propertyCategoryId?: PropertyCategory
  transactionType?: 'À vendre' | 'À louer'
  status: string
  condition?: string
  constructionYear?: number

  price: number
  currencyId?: string
  currency?: string
  period?: string

  area?: number
  landArea?: number

  bedrooms?: number
  bathrooms?: number
  livingRooms?: number
  garages?: number
  parking?: number
  kitchens?: number
  balconies?: number
  offices?: number
  floors?: number
  floorNumber?: number

  latitude?: number
  longitude?: number
  lat?: number
  lng?: number

  countryId?: string
  provinceId?: string
  cityId?: string
  communeId?: string
  districtId?: string
  neighborhoodId?: string

  city: string
  district: string
  address?: string
  postalCode?: string

  featured?: boolean
  verified: boolean
  year?: number
  rating?: number
  reviews?: number

  publishedAt?: string
  expiresAt?: string

  image: string
  gallery: string[]
  images?: PropertyImage[]
  badges: string[]
  features: (PropertyFeature | string)[]
  amenities: string[]
  access?: string[]
  beds: number
  baths: number
  surface: number
  type: PropertyType

  agent: {
    name: string
    role: string
    avatar: string
    agency: string
    responseTime: string
  }
}

export function getListing(slug: string): Listing | undefined {
  return undefined
}

export function apiPropertyToListing(p: any): Listing {
  if (!p) {
    return {
      title: 'Propriété Immobilière',
      slug: 'propriete',
      description: '',
      city: 'Goma',
      district: 'Centre-Ville',
      price: 0,
      image: '/placeholder.svg',
      gallery: ['/placeholder.svg'],
      badges: [],
      features: [],
      amenities: [],
      beds: 0,
      baths: 0,
      surface: 0,
      status: 'À louer',
      type: 'Appartement',
      verified: false,
      agent: {
        name: 'Agent MBIYO',
        role: 'Agent certifié',
        avatar: '/images/agent-portrait.png',
        agency: 'MBIYO Real Estate',
        responseTime: 'Répond en ~1 h',
      },
    }
  }

  const extractString = (val: any, fallback: string = ''): string => {
    if (typeof val === 'string') return val
    if (val && typeof val === 'object') {
      if (typeof val.name === 'string') return val.name
      if (typeof val.title === 'string') return val.title
      if (typeof val.code === 'string') return val.code
    }
    return fallback
  }

  const rawCover = p.images?.find((img: any) => img.is_cover)?.url || p.images?.[0]?.url || '/placeholder.svg'
  const coverImage = resolveImageUrl(rawCover)
  const rawGallery = p.images?.map((img: any) => img.url) || [rawCover]
  const gallery = rawGallery.map((imgUrl: string) => resolveImageUrl(imgUrl))

  const transactionType = p.transaction_type === 'rent' || p.transaction_type === 'Louer' ? 'rent' : 'sale'
  const status = transactionType === 'rent' ? 'À louer' : 'À vendre'
  const period = transactionType === 'rent' ? 'mois' : undefined

  const typeName = extractString(p.type || p.property_type, 'Appartement')
  const cityName = extractString(p.city_rel || p.city, 'Goma') || 'Goma'
  const districtName = extractString(p.district || p.neighborhood, 'Centre-Ville') || 'Centre-Ville'
  const currencyName = extractString(p.currency_rel || p.currency, 'USD') || 'USD'

  return {
    id: String(p.id || ''),
    ownerId: p.owner_id || p.owner?.id || p.user_id || p.agent_id || p.agent?.id || p.created_by,
    agentId: p.agent_id || p.agent?.id || p.owner_id || p.owner?.id,
    slug: String(p.slug || p.id || ''),
    title: extractString(p.title, 'Propriété Immobilière'),
    city: cityName,
    district: districtName,
    price: Number(p.price) || 0,
    currency: currencyName,
    currencyId: p.currency_id ? String(p.currency_id) : undefined,
    countryId: p.country_id ? String(p.country_id) : undefined,
    provinceId: p.province_id ? String(p.province_id) : undefined,
    cityId: p.city_id ? String(p.city_id) : undefined,
    period,
    status,
    type: typeName as PropertyType,
    beds: Number(p.bedrooms) || 0,
    baths: Number(p.bathrooms) || 0,
    surface: Number(p.surface_area || p.area) || 0,
    image: coverImage,
    gallery: gallery.length > 0 ? gallery : [coverImage],
    badges: p.is_featured ? ['Vedette'] : [],
    verified: Boolean(p.is_verified),
    rating: p.rating != null && !isNaN(Number(p.rating)) ? Number(p.rating) : undefined,
    reviews: p.reviews_count ?? p.reviews ?? 0,
    description: extractString(p.description, 'Spacieuse propriété disponible sur MBIYO Real Estate.'),
    features: p.features?.map((f: any) => extractString(f, f)) || [],
    amenities: p.amenities?.map((a: any) => extractString(a, a)) || [],
    lat: p.latitude ? Number(p.latitude) : (p.lat ? Number(p.lat) : undefined),
    lng: p.longitude ? Number(p.longitude) : (p.lng ? Number(p.lng) : undefined),
    agent: {
      name: extractString(p.agent?.name || p.owner?.name, 'Agent MBIYO'),
      role: extractString(p.agent?.role, 'Agent certifié'),
      avatar: resolveImageUrl(p.agent?.avatar || p.owner?.avatar || '/images/agent-portrait.png'),
      agency: extractString(p.agency?.name, 'MBIYO Real Estate'),
      responseTime: extractString(p.agent?.response_time, 'Répond en ~1 h'),
    },
  }
}

export async function getListingAsync(slug: string): Promise<Listing | undefined> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://backr.test/api/v1'
  const candidates = Array.from(new Set([
    apiUrl,
    'http://127.0.0.1:8000/api/v1',
    'http://localhost:8000/api/v1',
  ]))

  for (const url of candidates) {
    try {
      const res = await fetch(`${url}/properties/${slug}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          return apiPropertyToListing(json.data)
        }
      }
    } catch (e) {
      // try next candidate
    }
  }

  return undefined
}

export function formatPrice(listing: Pick<Listing, 'price' | 'period'>) {
  const value = new Intl.NumberFormat('fr-FR').format(listing.price)
  return listing.period ? `${value} $ /${listing.period}` : `${value} $`
}

/** Prix principal + repère secondaire, à la manière « $/jour · total » des plateformes de location. */
export function priceParts(listing: Pick<Listing, 'price' | 'period' | 'surface'>) {
  const nf = new Intl.NumberFormat('fr-FR')
  if (listing.period) {
    return {
      main: `${nf.format(listing.price)} $`,
      unit: '/mois',
      hint: `${nf.format(listing.price * 12)} $ par an`,
    }
  }
  const perSquare = listing.surface > 0 ? Math.round(listing.price / listing.surface) : 0
  return {
    main: `${nf.format(listing.price)} $`,
    unit: '',
    hint: perSquare > 0 ? `${nf.format(perSquare)} $ le m²` : '',
  }
}

export function shortPrice(price: number) {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1).replace('.0', '')} M$`
  if (price >= 10000) return `${Math.round(price / 1000)} k$`
  return `${new Intl.NumberFormat('fr-FR').format(price)} $`
}

export const cities: readonly string[] = []

export const propertyTypesList: PropertyType[] = [
  'Appartement',
  'Maison',
  'Villa',
  'Studio',
  'Terrain',
  'Ferme',
  'Bureau',
  'Hôtel',
  'Entrepôt',
  'Local commercial',
  'Immeuble',
  'Résidence',
]

export const propertyCategoriesList: PropertyCategory[] = [
  'Résidentiel',
  'Commercial',
  'Agricole',
  'Industriel',
]

export const propertyFeaturesList: PropertyFeature[] = [
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

export const propertyTypes = propertyTypesList
