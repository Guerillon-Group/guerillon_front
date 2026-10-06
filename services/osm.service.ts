/**
 * Service d'intégration de l'API OpenStreetMap (Nominatim Geocoding & Reverse Geocoding)
 */

export interface OsmSearchResult {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  boundingbox: [string, string, string, string]
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
  address?: {
    house_number?: string
    road?: string
    neighbourhood?: string
    suburb?: string
    city_district?: string
    city?: string
    town?: string
    village?: string
    state?: string
    postcode?: string
    country?: string
    country_code?: string
  }
}

export const osmService = {
  /**
   * Recherche des coordonnées (latitude, longitude) à partir d'une adresse ou d'un nom de quartier/ville
   */
  async searchAddress(query: string, countryCode?: string): Promise<OsmSearchResult[]> {
    if (!query || !query.trim()) return []
    try {
      const params = new URLSearchParams({
        q: query.trim(),
        format: 'json',
        addressdetails: '1',
        limit: '5',
      })
      if (countryCode) {
        params.append('countrycodes', countryCode)
      }
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        headers: {
          'Accept-Language': 'fr-FR,fr;q=0.9',
          'User-Agent': 'MBIYO-RealEstate-App/1.0',
        },
      })
      if (!res.ok) throw new Error(`OSM Nominatim API error: ${res.status}`)
      const data: OsmSearchResult[] = await res.json()
      return data
    } catch (err) {
      console.error('Error fetching OpenStreetMap Nominatim search:', err)
      return []
    }
  },

  /**
   * Géocodage inverse : Obtient l'adresse et le quartier à partir de lat/lng
   */
  async reverseGeocode(lat: number, lng: number): Promise<OsmSearchResult | null> {
    try {
      const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lng),
        format: 'json',
        addressdetails: '1',
      })
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
        headers: {
          'Accept-Language': 'fr-FR,fr;q=0.9',
          'User-Agent': 'MBIYO-RealEstate-App/1.0',
        },
      })
      if (!res.ok) throw new Error(`OSM Reverse Geocode error: ${res.status}`)
      const data: OsmSearchResult = await res.json()
      return data
    } catch (err) {
      console.error('Error fetching OpenStreetMap reverse geocode:', err)
      return null
    }
  },
}
