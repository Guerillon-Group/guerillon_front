export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  type: 'sale' | 'rent';
  category: 'apartment' | 'house' | 'villa' | 'office' | 'land' | 'building';
  address: string;
  city: string;
  lat: number;
  lng: number;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  images: string[];
  features: string[];
  amenities: string[];
  isFeatured?: boolean;
  agency?: {
    name: string;
    logo: string;
    phone: string;
    email: string;
  };
  agent?: {
    name: string;
    avatar: string;
    phone: string;
  };
  createdAt: string;
}

export interface SearchFilters {
  query?: string;
  type?: 'all' | 'sale' | 'rent';
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}
