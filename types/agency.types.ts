export interface Agency {
  id: string;
  name: string;
  slug: string;
  ownerId?: string;
  owner_id?: string;
  registrationNumber?: string;
  registration_number?: string;
  taxNumber?: string;
  tax_number?: string;
  email?: string;
  phone?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  cover_image?: string;
  description?: string;
  countryId?: number;
  country_id?: number;
  provinceId?: number;
  province_id?: number;
  cityId?: number;
  city_id?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  status: 'pending' | 'active' | 'suspended' | 'inactive' | string;
  verified?: boolean;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAgencyInput {
  name: string;
  email?: string;
  phone?: string;
  registration_number?: string;
  tax_number?: string;
  website?: string;
  address?: string;
  description?: string;
}

export interface AgencyResponse {
  success?: boolean;
  message?: string;
  data: Agency;
}
