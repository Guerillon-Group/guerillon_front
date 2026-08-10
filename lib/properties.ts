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

  area?: number // m² (living/built area)
  landArea?: number // m²

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

  // Visuals & Features
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

export const listings: Listing[] = [
  {
    slug: 'appartement-moderne-goma',
    title: 'Appartement moderne, vue sur le lac',
    city: 'Goma',
    district: 'Himbi',
    price: 1450,
    currency: 'USD',
    period: 'mois',
    status: 'À louer',
    type: 'Appartement',
    beds: 3,
    baths: 2,
    surface: 128,
    image: '/images/appartement-goma.png',
    gallery: [
      '/images/appartement-goma.png',
      '/images/salon-interieur.png',
      '/images/cuisine-moderne.png',
      '/images/maison-lac-kivu.png',
    ],
    badges: ['Premium', 'Nouveau'],
    lat: -1.6712,
    lng: 29.2201,
    verified: true,
    year: 2024,
    rating: 4.9,
    reviews: 47,
    description:
      "Au troisième étage d'une résidence récente de Himbi, cet appartement traversant capte la lumière du matin sur le lac Kivu et la silhouette du Nyiragongo au coucher du soleil. Les volumes ont été redessinés en 2024 : cuisine ouverte sur un séjour de 42 m², parquet en chêne clair, menuiseries aluminium noir et une terrasse abritée de 14 m² orientée ouest.",
    features: [
      'Groupe électrogène et onduleur',
      'Réservoir 5 000 L + forage',
      'Fibre optique installée',
      'Parking privé 2 véhicules',
      'Gardiennage 24/7',
      'Cuisine équipée',
    ],
    amenities: ['generateur', 'eau', 'fibre', 'parking', 'gardiennage', 'clim', 'terrasse'],
    access: ['portes-larges'],
    agent: {
      name: 'Sarah Mukendi',
      role: 'Agent certifié',
      avatar: '/images/agent-portrait.png',
      agency: 'Horizon Kivu',
      responseTime: 'Répond en ~1 h',
    },
  },
  {
    slug: 'villa-piscine-goma',
    title: "Villa d'architecte avec piscine",
    city: 'Goma',
    district: 'Katindo',
    price: 385000,
    currency: 'USD',
    status: 'À vendre',
    type: 'Villa',
    beds: 5,
    baths: 4,
    surface: 410,
    image: '/images/villa-piscine.png',
    gallery: ['/images/villa-piscine.png', '/images/salon-interieur.png', '/images/cuisine-moderne.png'],
    badges: ['Exclusivité'],
    lat: -1.6598,
    lng: 29.2359,
    verified: true,
    year: 2021,
    rating: 5.0,
    reviews: 19,
    description:
      "Une villa contemporaine posée sur un terrain arboré de 1 200 m², dessinée autour d'un patio central et d'une piscine à débordement. Les pièces de vie s'ouvrent entièrement sur le jardin par des baies coulissantes toute hauteur.",
    features: [
      'Piscine à débordement',
      'Jardin paysager 1 200 m²',
      'Solaire 8 kWc + batteries',
      'Dépendance pour personnel',
      'Garage double',
      'Système de sécurité intégré',
    ],
    amenities: ['piscine', 'solaire', 'jardin', 'parking', 'gardiennage', 'eau', 'clim', 'terrasse'],
    access: ['plain-pied', 'parking-adapte', 'portes-larges', 'douche-plain-pied'],
    agent: {
      name: 'Sarah Mukendi',
      role: 'Agent certifié',
      avatar: '/images/agent-portrait.png',
      agency: 'Horizon Kivu',
      responseTime: 'Répond en ~1 h',
    },
  },
  {
    slug: 'maison-lac-kivu',
    title: 'Maison de bord de lac, terrasse sur l’eau',
    city: 'Goma',
    district: 'Kyeshero',
    price: 268000,
    currency: 'USD',
    status: 'À vendre',
    type: 'Maison',
    beds: 4,
    baths: 3,
    surface: 240,
    image: '/images/maison-lac-kivu.png',
    gallery: ['/images/maison-lac-kivu.png', '/images/salon-interieur.png'],
    badges: ['Pieds dans l’eau'],
    lat: -1.6835,
    lng: 29.2093,
    verified: true,
    year: 2023,
    rating: 4.8,
    reviews: 31,
    description:
      "Accès direct au lac Kivu depuis une large terrasse en bois. La maison, rénovée en 2023, mêle murs enduits à la chaux et bardage bois pour un intérieur clair et frais toute l'année.",
    features: ['Ponton privé', 'Terrasse 60 m²', 'Citerne 10 000 L', 'Cuisine d’été', 'Panneaux solaires'],
    amenities: ['eau', 'solaire', 'terrasse', 'jardin', 'parking'],
    access: ['plain-pied', 'portes-larges'],
    agent: {
      name: 'Sarah Mukendi',
      role: 'Agent certifié',
      avatar: '/images/agent-portrait.png',
      agency: 'Horizon Kivu',
      responseTime: 'Répond en ~1 h',
    },
  },
  {
    slug: 'duplex-gombe-kinshasa',
    title: 'Duplex élégant au cœur de la Gombe',
    city: 'Kinshasa',
    district: 'Gombe',
    price: 2300,
    currency: 'USD',
    period: 'mois',
    status: 'À louer',
    type: 'Maison',
    beds: 4,
    baths: 3,
    surface: 195,
    image: '/images/duplex-kinshasa.png',
    gallery: ['/images/duplex-kinshasa.png', '/images/cuisine-moderne.png', '/images/salon-interieur.png'],
    badges: ['Meublé'],
    lat: -4.3082,
    lng: 15.2988,
    verified: true,
    year: 2022,
    rating: 4.7,
    reviews: 58,
    description:
      "Dans une rue calme de la Gombe, ce duplex meublé conviendra aux familles d'expatriés : quatre chambres, un bureau fermé et un petit jardin clos à l'arrière.",
    features: ['Entièrement meublé', 'Bureau fermé', 'Générateur automatique', 'Jardin clos', 'Climatisation'],
    amenities: ['meuble', 'generateur', 'jardin', 'clim', 'parking', 'gardiennage'],
    access: ['parking-adapte'],
    agent: {
      name: 'Sarah Mukendi',
      role: 'Agent certifié',
      avatar: '/images/agent-portrait.png',
      agency: 'Horizon Kivu',
      responseTime: 'Répond en ~1 h',
    },
  },
  {
    slug: 'terrain-bukavu-hauteurs',
    title: 'Terrain viabilisé sur les hauteurs',
    city: 'Bukavu',
    district: 'Muhumba',
    price: 74000,
    currency: 'USD',
    status: 'À vendre',
    type: 'Terrain',
    beds: 0,
    baths: 0,
    surface: 900,
    image: '/images/terrain-bukavu.png',
    gallery: ['/images/terrain-bukavu.png'],
    badges: ['Titre foncier'],
    lat: -2.5031,
    lng: 28.8512,
    verified: true,
    year: 2025,
    rating: 4.6,
    reviews: 8,
    description:
      "Parcelle de 900 m² en légère pente, orientée sud-ouest, avec une vue dégagée sur la baie. Titre foncier disponible et bornage effectué.",
    features: ['Titre foncier vérifié', 'Bornage réalisé', 'Eau et électricité en limite', 'Accès goudronné'],
    amenities: ['eau'],
    access: ['plain-pied'],
    agent: {
      name: 'Sarah Mukendi',
      role: 'Agent certifié',
      avatar: '/images/agent-portrait.png',
      agency: 'Horizon Kivu',
      responseTime: 'Répond en ~1 h',
    },
  },
  {
    slug: 'bureau-gombe',
    title: 'Plateau de bureaux, immeuble récent',
    city: 'Kinshasa',
    district: 'Gombe',
    price: 3600,
    currency: 'USD',
    period: 'mois',
    status: 'À louer',
    type: 'Bureau',
    beds: 0,
    baths: 2,
    surface: 320,
    image: '/images/bureau-gombe.png',
    gallery: ['/images/bureau-gombe.png'],
    badges: ['Pro'],
    lat: -4.3201,
    lng: 15.3105,
    verified: false,
    year: 2023,
    rating: 4.5,
    reviews: 12,
    description:
      "Plateau libre de 320 m² au quatrième étage, livré aménagé : faux plafonds acoustiques, câblage réseau et deux blocs sanitaires. Ascenseur et parking en sous-sol.",
    features: ['Ascenseur', 'Parking sous-sol', 'Fibre dédiée', 'Groupe électrogène immeuble', 'Réception partagée'],
    amenities: ['ascenseur', 'parking', 'fibre', 'generateur', 'clim'],
    access: ['ascenseur-acces', 'plain-pied', 'parking-adapte', 'portes-larges'],
    agent: {
      name: 'Sarah Mukendi',
      role: 'Agent certifié',
      avatar: '/images/agent-portrait.png',
      agency: 'Horizon Kivu',
      responseTime: 'Répond en ~1 h',
    },
  },
]

export function getListing(slug: string) {
  return listings.find((l) => l.slug === slug)
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

export const cities = ['Goma', 'Bukavu', 'Kinshasa', 'Lubumbashi', 'Bujumbura', 'Uvira', 'Kigali', 'Abidjan', 'Dakar'] as const

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
