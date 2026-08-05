export type Listing = {
  slug: string
  title: string
  city: string
  district: string
  price: number
  currency: 'USD'
  period?: 'mois'
  status: 'À vendre' | 'À louer'
  type: 'Appartement' | 'Villa' | 'Maison' | 'Terrain' | 'Bureau'
  beds: number
  baths: number
  surface: number
  image: string
  gallery: string[]
  badges: string[]
  lat: number
  lng: number
  verified: boolean
  description: string
  features: string[]
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
    description:
      "Accès direct au lac Kivu depuis une large terrasse en bois. La maison, rénovée en 2023, mêle murs enduits à la chaux et bardage bois pour un intérieur clair et frais toute l'année.",
    features: ['Ponton privé', 'Terrasse 60 m²', 'Citerne 10 000 L', 'Cuisine d’été', 'Panneaux solaires'],
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
    description:
      "Dans une rue calme de la Gombe, ce duplex meublé conviendra aux familles d'expatriés : quatre chambres, un bureau fermé et un petit jardin clos à l'arrière.",
    features: ['Entièrement meublé', 'Bureau fermé', 'Générateur automatique', 'Jardin clos', 'Climatisation'],
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
    description:
      "Parcelle de 900 m² en légère pente, orientée sud-ouest, avec une vue dégagée sur la baie. Titre foncier disponible et bornage effectué.",
    features: ['Titre foncier vérifié', 'Bornage réalisé', 'Eau et électricité en limite', 'Accès goudronné'],
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
    description:
      "Plateau libre de 320 m² au quatrième étage, livré aménagé : faux plafonds acoustiques, câblage réseau et deux blocs sanitaires. Ascenseur et parking en sous-sol.",
    features: ['Ascenseur', 'Parking sous-sol', 'Fibre dédiée', 'Groupe électrogène immeuble', 'Réception partagée'],
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

export function shortPrice(price: number) {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1).replace('.0', '')} M$`
  if (price >= 10000) return `${Math.round(price / 1000)} k$`
  return `${new Intl.NumberFormat('fr-FR').format(price)} $`
}

export const cities = ['Goma', 'Bukavu', 'Kinshasa', 'Lubumbashi', 'Uvira'] as const
export const propertyTypes = ['Appartement', 'Villa', 'Maison', 'Terrain', 'Bureau'] as const
