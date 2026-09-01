export interface PropertyType {
  id: string
  name: string
  slug: string
  description?: string
}

export interface PropertyCategory {
  id: string
  name: string
  slug: string
  description?: string
}

export interface PropertyFeature {
  id: string
  property_id?: string
  name: string
  code?: string
  value?: string
}

export interface PropertyImage {
  id: string
  property_id: string
  url: string
  thumbnail?: string
  caption?: string
  is_cover?: boolean
  order?: number
}

export interface PropertyDocument {
  id: string
  property_id: string
  name: string
  url: string
  type?: string
  size?: number
}

export interface PropertyPricing {
  id: string
  property_id: string
  price: number
  currency: string
  period?: string
  deposit_amount?: number
}

export interface PropertyAvailability {
  id: string
  property_id: string
  available_from?: string
  available_to?: string
  is_available: boolean
}

export interface Property {
  id: string
  title: string
  slug: string
  description?: string
  property_type_id?: string
  property_category_id?: string
  agency_id?: string
  owner_id?: string
  agent_id?: string
  transaction_type: 'sale' | 'rent' | 'Acheter' | 'Louer'
  price: number
  currency?: string
  surface_area?: number
  bedrooms?: number
  bathrooms?: number
  rooms?: number
  address?: string
  city: string
  district?: string
  neighborhood?: string
  latitude?: number
  longitude?: number
  status: 'draft' | 'published' | 'pending' | 'archived'
  is_featured?: boolean
  is_verified?: boolean
  type?: PropertyType
  category?: PropertyCategory
  images?: PropertyImage[]
  features?: PropertyFeature[]
  documents?: PropertyDocument[]
  pricing?: PropertyPricing
  availabilities?: PropertyAvailability[]
  created_at?: string
  updated_at?: string
}

export interface CreatePropertyPayload {
  title: string
  description?: string
  property_type_id?: string
  property_category_id?: string
  transaction_type: string
  price: number
  currency?: string
  surface_area?: number
  bedrooms?: number
  bathrooms?: number
  rooms?: number
  address?: string
  city: string
  neighborhood?: string
  district?: string
  status?: string
}

export interface PropertyFilters {
  q?: string
  city?: string
  intent?: string
  type?: string
  category?: string
  min_price?: number
  max_price?: number
  page?: number
  per_page?: number
}
