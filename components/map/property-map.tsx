'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { shortPrice, type Listing } from '@/lib/properties'

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

/**
 * Two listings in the same street would render one marker on top of the other.
 * Nudge duplicates by a few dozen metres so every price stays clickable.
 */
function spread(listings: Listing[]) {
  const seen = new Map<string, number>()
  return listings.map((listing) => {
    const key = `${listing.lat.toFixed(3)}:${listing.lng.toFixed(3)}`
    const n = seen.get(key) ?? 0
    seen.set(key, n + 1)
    if (n === 0) return { listing, lat: listing.lat, lng: listing.lng }
    const angle = (n * 2 * Math.PI) / 6
    return {
      listing,
      lat: listing.lat + Math.sin(angle) * 0.0025,
      lng: listing.lng + Math.cos(angle) * 0.0025,
    }
  })
}

function markerIcon(listing: Listing, active: boolean) {
  return L.divIcon({
    className: 'price-marker',
    html: `<div style="
      display:inline-flex;align-items:center;white-space:nowrap;
      padding:6px 12px;border-radius:9999px;
      font-family:var(--font-sans);font-size:13px;font-weight:600;letter-spacing:-0.01em;
      background:${active ? '#111827' : 'rgba(255,255,255,0.94)'};
      color:${active ? '#ffffff' : '#111827'};
      border:1px solid ${active ? '#111827' : 'rgba(17,24,39,0.1)'};
      box-shadow:0 6px 20px rgba(0,0,0,0.14);
      transform:translate(-50%,-50%);
      transition:all 180ms ease;
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
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const positionsRef = useRef<Map<string, [number, number]>>(new Map())
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const fallback: [number, number] = center ?? [listings[0]?.lat ?? -1.67, listings[0]?.lng ?? 29.22]

    const map = L.map(containerRef.current, {
      center: fallback,
      zoom,
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: false,
      doubleClickZoom: interactive,
      touchZoom: interactive,
      keyboard: interactive,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

    if (fitOnChange && placed.length > 1) {
      map.fitBounds(
        L.latLngBounds(placed.map(({ lat, lng }) => [lat, lng] as [number, number])),
        { padding: [80, 80], maxZoom: 13 },
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

  return <div ref={containerRef} className={className} role="application" aria-label="Carte des biens" />
}
