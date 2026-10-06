'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Layers, Loader2, Locate, MapPin, Minus, Navigation, Plus, Search, X } from 'lucide-react'

import { shortPrice, type Listing } from '@/lib/properties'
import { osmService, type OsmSearchResult } from '@/services/osm.service'

type Props = {
  listings: Listing[]
  activeSlug?: string | null
  center?: [number, number]
  zoom?: number
  interactive?: boolean
  fitOnChange?: boolean
  onSelect?: (slug: string) => void
  className?: string
}

type MapTileStyle = 'osm' | 'light' | 'satellite' | 'dark'

const TILE_LAYERS: Record<MapTileStyle, { label: string; url: string; attribution: string }> = {
  osm: {
    label: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
  },
  light: {
    label: 'Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; OpenStreetMap',
  },
  dark: {
    label: 'Sombre',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
}

function spread(listings: Listing[]) {
  const seen = new Map<string, number>()
  return listings.map((listing) => {
    const rawLat = listing.lat ?? listing.latitude ?? -1.6712
    const rawLng = listing.lng ?? listing.longitude ?? 29.2201
    const lat = typeof rawLat === 'number' && !isNaN(rawLat) ? rawLat : parseFloat(String(rawLat)) || -1.6712
    const lng = typeof rawLng === 'number' && !isNaN(rawLng) ? rawLng : parseFloat(String(rawLng)) || 29.2201

    const key = `${lat.toFixed(3)}:${lng.toFixed(3)}`
    const n = seen.get(key) ?? 0
    seen.set(key, n + 1)
    if (n === 0) return { listing, lat, lng }
    const angle = (n * 2 * Math.PI) / 6
    return {
      listing,
      lat: lat + Math.sin(angle) * 0.0025,
      lng: lng + Math.cos(angle) * 0.0025,
    }
  })
}

function markerIcon(listing: Listing, active: boolean) {
  const bg = active ? '#16381e' : '#ffffff'
  const color = active ? '#ffffff' : '#0f172a'
  const border = active ? '#c5a059' : 'rgba(15, 23, 42, 0.15)'
  const scale = active ? 'scale(1.15)' : 'scale(1)'
  const zIndex = active ? 999 : 10

  return L.divIcon({
    className: 'price-marker',
    html: `<div style="
      display:inline-flex;align-items:center;white-space:nowrap;
      padding:6px 14px;border-radius:9999px;
      font-family:var(--font-sans), system-ui, sans-serif;font-size:13px;font-weight:700;letter-spacing:-0.01em;
      background:${bg};
      color:${color};
      border:1.5px solid ${border};
      box-shadow:${active ? '0 10px 25px -5px rgba(22, 56, 30, 0.45)' : '0 4px 14px rgba(0,0,0,0.14)'};
      transform:translate(-50%,-50%) ${scale};
      z-index:${zIndex};
      cursor:pointer;
      transition:all 200ms cubic-bezier(0.16, 1, 0.3, 1);
    ">${shortPrice(listing.price)}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

export default function PropertyMap({
  listings,
  activeSlug = null,
  center,
  zoom = 12,
  interactive = true,
  fitOnChange = false,
  onSelect,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const positionsRef = useRef<Map<string, [number, number]>>(new Map())
  const userMarkerRef = useRef<L.Marker | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  const [tileStyle, setTileStyle] = useState<MapTileStyle>('osm')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<OsmSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [geolocating, setGeolocating] = useState(false)

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const fallback: [number, number] = center ?? [listings[0]?.lat ?? -1.6712, listings[0]?.lng ?? 29.2201]

    const map = L.map(containerRef.current, {
      center: fallback,
      zoom,
      zoomControl: false,
      dragging: interactive,
      scrollWheelZoom: true,
      doubleClickZoom: interactive,
      touchZoom: interactive,
      keyboard: interactive,
      attributionControl: true,
    })

    const initialLayer = TILE_LAYERS[tileStyle]
    const tileLayer = L.tileLayer(initialLayer.url, {
      attribution: initialLayer.attribution,
      maxZoom: 19,
    }).addTo(map)

    tileLayerRef.current = tileLayer
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      tileLayerRef.current = null
      markersRef.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Switch tile layer
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (tileLayerRef.current) {
      tileLayerRef.current.remove()
    }

    const currentLayer = TILE_LAYERS[tileStyle]
    tileLayerRef.current = L.tileLayer(currentLayer.url, {
      attribution: currentLayer.attribution,
      maxZoom: 19,
    }).addTo(map)
  }, [tileStyle])

  // Sync markers with the listings.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current.clear()
    positionsRef.current.clear()

    const placed = spread(listings)

    placed.forEach(({ listing, lat, lng }) => {
      positionsRef.current.set(listing.slug, [lat, lng])

      const marker = L.marker([lat, lng], {
        icon: markerIcon(listing, listing.slug === activeSlug),
        keyboard: true,
        title: listing.title,
        riseOnHover: true,
      })
        .addTo(map)
        .on('click', () => onSelectRef.current?.(listing.slug))

      markersRef.current.set(listing.slug, marker)
    })

    if (fitOnChange && placed.length > 0) {
      map.fitBounds(
        L.latLngBounds(placed.map(({ lat, lng }) => [lat, lng] as [number, number])),
        { padding: [60, 60], maxZoom: 14 },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings])

  // Restyle markers on active change and pan to the selection.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    listings.forEach((listing) => {
      markersRef.current.get(listing.slug)?.setIcon(markerIcon(listing, listing.slug === activeSlug))
    })

    if (activeSlug) {
      const position = positionsRef.current.get(activeSlug)
      if (position) map.panTo(position, { animate: true, duration: 0.5 })
    }
  }, [activeSlug, listings])

  // OpenStreetMap Nominatim search handler
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    setShowResults(true)
    const results = await osmService.searchAddress(searchQuery)
    setSearchResults(results)
    setSearching(false)

    if (results.length > 0) {
      const first = results[0]
      const lat = parseFloat(first.lat)
      const lon = parseFloat(first.lon)
      mapRef.current?.flyTo([lat, lon], 14, { duration: 1.2 })
    }
  }

  const handleSelectLocation = (result: OsmSearchResult) => {
    const lat = parseFloat(result.lat)
    const lon = parseFloat(result.lon)
    mapRef.current?.flyTo([lat, lon], 15, { duration: 1.2 })
    setShowResults(false)
  }

  // Geolocation trigger
  const handleUserGeolocate = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n’est pas supportée par votre navigateur.')
      return
    }
    setGeolocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeolocating(false)
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const map = mapRef.current
        if (!map) return

        if (userMarkerRef.current) userMarkerRef.current.remove()

        const icon = L.divIcon({
          className: 'user-location-marker',
          html: `<div style="width:16px;height:16px;background:#3b82f6;border:3px solid #ffffff;border-radius:50%;box-shadow:0 0 12px rgba(59,130,246,0.8);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })

        userMarkerRef.current = L.marker([lat, lng], { icon, title: 'Votre position' }).addTo(map)
        map.flyTo([lat, lng], 15, { duration: 1.2 })
      },
      (err) => {
        setGeolocating(false)
        console.warn('Geolocation failed:', err)
        alert('Impossible d’accéder à votre position actuelle.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const handleZoomIn = () => mapRef.current?.zoomIn()
  const handleZoomOut = () => mapRef.current?.zoomOut()
  const handleRecenter = () => {
    const map = mapRef.current
    if (!map || listings.length === 0) return
    const placed = spread(listings)
    map.fitBounds(
      L.latLngBounds(placed.map(({ lat, lng }) => [lat, lng] as [number, number])),
      { padding: [60, 60], maxZoom: 14 },
    )
  }

  return (
    <div className="relative size-full overflow-hidden">
      <div ref={containerRef} className={className} role="application" aria-label="Carte des biens OpenStreetMap" />

      {/* Barre de Recherche OpenStreetMap Nominatim (Top Left/Center) */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto z-[400] max-w-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            placeholder="Rechercher une adresse sur OpenStreetMap…"
            className="w-full rounded-2xl border border-border/80 bg-background/95 py-2.5 pl-10 pr-9 text-xs font-medium text-foreground shadow-lg backdrop-blur-md transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Search className="absolute left-3.5 size-4 text-muted-foreground" />
          {searching ? (
            <Loader2 className="absolute right-3 size-4 animate-spin text-primary" />
          ) : searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSearchResults([])
                setShowResults(false)
              }}
              className="absolute right-3 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </form>

        {/* Résultats OpenStreetMap Nominatim */}
        {showResults && searchResults.length > 0 && (
          <ul className="mt-2 max-h-60 overflow-y-auto rounded-2xl border border-border/80 bg-background/95 p-1.5 shadow-xl backdrop-blur-md text-xs">
            {searchResults.map((res) => (
              <li key={res.place_id}>
                <button
                  type="button"
                  onClick={() => handleSelectLocation(res)}
                  className="flex w-full items-start gap-2 rounded-xl p-2.5 text-left transition-colors hover:bg-secondary"
                >
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  <span className="line-clamp-2 font-medium text-foreground">{res.display_name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selecteur de Couche OpenStreetMap (Top Right) */}
      <div className="absolute top-4 right-4 z-[400] hidden sm:flex items-center gap-1 rounded-full border border-border/80 bg-background/95 p-1 shadow-md backdrop-blur-md">
        {(Object.keys(TILE_LAYERS) as MapTileStyle[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setTileStyle(mode)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all duration-200 ${
              tileStyle === mode
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {TILE_LAYERS[mode].label}
          </button>
        ))}
      </div>

      {/* Floating Map Controls & Geolocation (Bottom Right) */}
      <div className="absolute bottom-6 right-4 z-[400] flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleUserGeolocate}
          disabled={geolocating}
          title="Ma position (GPS OpenStreetMap)"
          aria-label="Localiser ma position"
          className="flex size-9 items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-md backdrop-blur-md transition-all hover:bg-card hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {geolocating ? <Loader2 className="size-4 animate-spin text-primary" /> : <Navigation className="size-4 text-primary" />}
        </button>
        <button
          type="button"
          onClick={handleZoomIn}
          title="Agrandir"
          aria-label="Agrandir la carte"
          className="flex size-9 items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-md backdrop-blur-md transition-all hover:bg-card hover:scale-105 active:scale-95"
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Dézoomer"
          aria-label="Dézoomer la carte"
          className="flex size-9 items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-md backdrop-blur-md transition-all hover:bg-card hover:scale-105 active:scale-95"
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          onClick={handleRecenter}
          title="Recentrer sur les biens"
          aria-label="Recentrer la carte"
          className="flex size-9 items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-md backdrop-blur-md transition-all hover:bg-card hover:scale-105 active:scale-95"
        >
          <Locate className="size-4" />
        </button>
      </div>
    </div>
  )
}
