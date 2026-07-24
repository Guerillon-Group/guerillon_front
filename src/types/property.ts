export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'sale' | 'rent';
  category: 'apartment' | 'house' | 'villa' | 'office' | 'land' | 'building';
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  images: string[];
  isFeatured?: boolean;
  createdAt: string;
}
