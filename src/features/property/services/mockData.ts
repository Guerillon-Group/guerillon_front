import { Property } from '../types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    slug: 'residence-luxueuse-almadies',
    title: 'Résidence Luxueuse aux Almadies',
    description: 'Somptueuse villa vue mer avec piscine privée, jardin paysager et finition haut de gamme dans le quartier prisé des Almadies.',
    price: 450000000,
    type: 'sale',
    category: 'villa',
    address: 'Route des Almadies',
    city: 'Dakar',
    lat: 14.7456,
    lng: -17.5186,
    bedrooms: 5,
    bathrooms: 6,
    areaSqFt: 650,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Piscine', 'Vue Mer', 'Garage 3 voitures', 'Jardin', 'Sécurité 24/7'],
    amenities: ['Climatisation', 'Générateur', 'Domotique', 'Cuisine équipée', 'Jacuzzi'],
    isFeatured: true,
    agency: {
      name: 'Prestige Immobilier',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
      phone: '+221 33 800 00 00',
      email: 'contact@prestige-immo.sn'
    },
    agent: {
      name: 'Amadou Diallo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '+221 77 000 00 00'
    },
    createdAt: '2026-07-20T10:00:00Z'
  },
  {
    id: '2',
    slug: 'appartement-moderne-plateau',
    title: 'Appartement Haut Standing au Plateau',
    description: 'Superbe appartement 3 pièces lumineux au cœur du centre des affaires avec balcons et parking sous-sol.',
    price: 850000,
    type: 'rent',
    category: 'apartment',
    address: 'Avenue Léopold Sédar Senghor',
    city: 'Dakar',
    lat: 14.6678,
    lng: -17.4358,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 120,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Ascenseur', 'Balcon', 'Gardiennage', 'Ascenseur'],
    amenities: ['Wifi', 'Cuisine américaine', 'Meublé'],
    isFeatured: true,
    agency: {
      name: 'City Real Estate',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&q=80',
      phone: '+221 33 822 11 00',
      email: 'info@cityrealestate.sn'
    },
    agent: {
      name: 'Fatou Sow',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      phone: '+221 78 111 22 33'
    },
    createdAt: '2026-07-22T14:30:00Z'
  }
];
