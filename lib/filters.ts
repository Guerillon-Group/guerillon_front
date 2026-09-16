import type { Listing } from '@/lib/properties'

export type Transaction = 'Tout' | 'À vendre' | 'À louer'

export type Filters = {
  transaction: Transaction
  types: Listing['type'][]
  cities: string[]
  priceMin: number
  priceMax: number
  /** 0 = indifférent */
  beds: number
  baths: number
  surfaceMin: number
  amenities: string[]
  access: string[]
  labels: string[]
}

export const transactions: Transaction[] = ['Tout', 'À vendre', 'À louer']

export const amenityCatalog = [
  { id: 'piscine', label: 'Piscine' },
  { id: 'internet', label: 'Internet' },
  { id: 'ascenseur', label: 'Ascenseur' },
  { id: 'jacuzzi', label: 'Jacuzzi' },
  { id: 'camera', label: 'Caméra de sécurité' },
  { id: 'clim', label: 'Climatisation' },
  { id: 'generateur', label: 'Générateur' },
  { id: 'solaire', label: 'Panneaux solaires' },
  { id: 'cuisine-equipee', label: 'Cuisine équipée' },
  { id: 'meuble', label: 'Meublé' },
  { id: 'vue-mer', label: 'Vue sur mer' },
  { id: 'vue-lac', label: 'Vue sur lac' },
  { id: 'terrasse', label: 'Terrasse' },
  { id: 'balcon', label: 'Balcon' },
  { id: 'jardin', label: 'Jardin' },
  { id: 'salle-de-sport', label: 'Salle de sport' },
  { id: 'securite', label: 'Sécurité 24/7' },
] as const

export const accessCatalog = [
  { id: 'plain-pied', label: 'Accès de plain-pied', group: 'Entrée et circulation' },
  { id: 'portes-larges', label: 'Portes de plus de 80 cm', group: 'Entrée et circulation' },
  { id: 'ascenseur-acces', label: 'Ascenseur accessible', group: 'Entrée et circulation' },
  { id: 'parking-adapte', label: 'Place de parking adaptée', group: 'Stationnement' },
  { id: 'douche-plain-pied', label: 'Douche de plain-pied', group: 'Salle de bain' },
] as const

export const labelCatalog = [
  {
    id: 'verifie',
    title: 'Dossier vérifié',
    blurb: 'Titre confronté au cadastre et visite réalisée par nos équipes.',
  },
  {
    id: 'exclusivite',
    title: 'Exclusivité',
    blurb: 'Mandat confié à MBIYO, introuvable ailleurs.',
  },
] as const

export function getAvailableCities(pool: Listing[]): string[] {
  return Array.from(new Set(pool.map((l) => l.city).filter(Boolean)))
}

export function getAvailableTypes(pool: Listing[]): Listing['type'][] {
  return Array.from(new Set(pool.map((l) => l.type).filter(Boolean)))
}

export const allCities: string[] = []
export const allTypes: Listing['type'][] = []

/** Le budget porte sur le loyer mensuel en location, sur le prix de vente sinon. */
export function priceBounds(transaction: Transaction, pool: Listing[] = []) {
  const rent = transaction === 'À louer'
  const filteredPool = pool.filter((l) => (rent ? l.status === 'À louer' : l.status === 'À vendre'))
  const step = rent ? 50 : 5000
  const maxPrice = filteredPool.length > 0 ? Math.max(...filteredPool.map((l) => l.price)) : (rent ? 5000 : 500000)
  const max = Math.ceil((maxPrice || (rent ? 5000 : 500000)) / step) * step
  return { min: 0, max, step, rent }
}

export function priceHistogram(transaction: Transaction, pool: Listing[] = [], buckets = 26) {
  const { min, max, rent } = priceBounds(transaction, pool)
  const filteredPool = pool.filter((l) => (rent ? l.status === 'À louer' : l.status === 'À vendre'))
  const width = Math.max(1, (max - min) / buckets)
  const counts = Array.from({ length: buckets }, () => 0)

  for (const l of filteredPool) {
    const i = Math.min(buckets - 1, Math.floor((l.price - min) / width))
    if (i >= 0 && i < buckets) {
      for (let d = -3; d <= 3; d += 1) {
        const j = i + d
        if (j >= 0 && j < buckets) counts[j] += 1 / (1 + Math.abs(d) * 1.6)
      }
    }
  }

  return counts.map((c, i) => ({ from: min + i * width, to: min + (i + 1) * width, count: c }))
}

export function defaultFilters(transaction: Transaction = 'Tout', pool: Listing[] = []): Filters {
  const { min, max } = priceBounds(transaction, pool)
  return {
    transaction,
    types: [],
    cities: [],
    priceMin: min,
    priceMax: max,
    beds: 0,
    baths: 0,
    surfaceMin: 0,
    amenities: [],
    access: [],
    labels: [],
  }
}

export function applyFilters(pool: Listing[], f: Filters) {
  const bounds = priceBounds(f.transaction)
  const priceTouched = f.priceMin > bounds.min || f.priceMax < bounds.max

  return pool.filter((l) => {
    if (f.transaction !== 'Tout' && l.status !== f.transaction) return false
    if (f.types.length > 0 && !f.types.includes(l.type)) return false
    if (f.cities.length > 0 && !f.cities.includes(l.city)) return false

    if (priceTouched) {
      // en mode « Tout », le curseur ne s'applique qu'aux biens à vendre
      const concerned = f.transaction !== 'Tout' || l.status === 'À vendre'
      if (concerned && (l.price < f.priceMin || l.price > f.priceMax)) return false
    }

    if (f.beds > 0 && l.beds < f.beds) return false
    if (f.baths > 0 && l.baths < f.baths) return false
    if (l.surface < f.surfaceMin) return false
    if (f.amenities.some((a) => !l.amenities.includes(a))) return false
    if (f.access.some((a) => !l.access?.includes(a))) return false
    if (f.labels.includes('verifie') && !l.verified) return false
    if (f.labels.includes('exclusivite') && !l.badges.includes('Exclusivité')) return false

    return true
  })
}

export function activeFilterCount(f: Filters) {
  const bounds = priceBounds(f.transaction)
  let n = 0
  if (f.transaction !== 'Tout') n += 1
  n += f.types.length
  n += f.cities.length
  if (f.priceMin > bounds.min || f.priceMax < bounds.max) n += 1
  if (f.beds > 0) n += 1
  if (f.baths > 0) n += 1
  if (f.surfaceMin > 0) n += 1
  n += f.amenities.length
  n += f.access.length
  n += f.labels.length
  return n
}

/** Résumé retirable des filtres actifs, affiché sous la barre de recherche. */
export function filterChips(f: Filters): { key: string; label: string; next: Filters }[] {
  const chips: { key: string; label: string; next: Filters }[] = []
  const bounds = priceBounds(f.transaction)

  if (f.priceMin > bounds.min || f.priceMax < bounds.max) {
    chips.push({
      key: 'price',
      label: `${formatBudget(f.priceMin, bounds.rent)} – ${formatBudget(f.priceMax, bounds.rent)}`,
      next: { ...f, priceMin: bounds.min, priceMax: bounds.max },
    })
  }
  if (f.beds > 0) chips.push({ key: 'beds', label: `${f.beds}+ chambres`, next: { ...f, beds: 0 } })
  if (f.baths > 0) chips.push({ key: 'baths', label: `${f.baths}+ SDB`, next: { ...f, baths: 0 } })
  if (f.surfaceMin > 0)
    chips.push({ key: 'surface', label: `${f.surfaceMin} m² +`, next: { ...f, surfaceMin: 0 } })

  for (const city of f.cities) {
    chips.push({ key: `city-${city}`, label: city, next: { ...f, cities: f.cities.filter((c) => c !== city) } })
  }
  for (const id of f.amenities) {
    const label = amenityCatalog.find((a) => a.id === id)?.label ?? id
    chips.push({ key: `am-${id}`, label, next: { ...f, amenities: f.amenities.filter((a) => a !== id) } })
  }
  for (const id of f.access) {
    const label = accessCatalog.find((a) => a.id === id)?.label ?? id
    chips.push({ key: `ac-${id}`, label, next: { ...f, access: f.access.filter((a) => a !== id) } })
  }
  for (const id of f.labels) {
    const label = labelCatalog.find((l) => l.id === id)?.title ?? id
    chips.push({ key: `lb-${id}`, label, next: { ...f, labels: f.labels.filter((l) => l !== id) } })
  }

  return chips
}

export function formatBudget(value: number, rent: boolean) {
  const formatted = new Intl.NumberFormat('fr-FR').format(value)
  return rent ? `${formatted} $/mois` : `${formatted} $`
}

export const surfaceSteps = [0, 60, 100, 150, 250, 400] as const
