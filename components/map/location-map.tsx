'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Props = {
  lat: number
  lng: number
  zoom?: number
  onChange: (lat: number, lng: number) => void
  className?: string
}

function pinIcon() {
  return L.divIcon({
    className: 'price-marker',
    html: `<div style="
      position:relative;transform:translate(-50%,-100%);
      display:flex;flex-direction:column;align-items:center;
    ">
      <div style="
        display:flex;align-items:center;justify-content:center;
        width:34px;height:34px;border-radius:9999px;
        background:#111827;border:3px solid #ffffff;
        box-shadow:0 8px 24px rgba(0,0,0,0.28);
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" />
        </svg>
      </div>
      <div style="width:2px;height:10px;background:#111827;"></div>
    </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

export default function LocationMap({ lat, lng, zoom = 14, onChange, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
    }).addTo(map)

    const marker = L.marker([lat, lng], { icon: pinIcon(), draggable: true, keyboard: true }).addTo(map)

    marker.on('dragend', () => {
      const p = marker.getLatLng()
      onChangeRef.current(p.lat, p.lng)
    })

    map.on('click', (event: L.LeafletMouseEvent) => {
      marker.setLatLng(event.latlng)
      onChangeRef.current(event.latlng.lat, event.latlng.lng)
    })

    mapRef.current = map
    markerRef.current = marker

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Follow external updates (e.g. the user picks another city).
  useEffect(() => {
    const map = mapRef.current
    const marker = markerRef.current
    if (!map || !marker) return

    const current = marker.getLatLng()
    if (Math.abs(current.lat - lat) < 1e-6 && Math.abs(current.lng - lng) < 1e-6) return

    marker.setLatLng([lat, lng])
    map.setView([lat, lng], zoom, { animate: true })
  }, [lat, lng, zoom])

  return (
    <div
      ref={containerRef}
      className={className}
      role="application"
      aria-label="Carte de localisation du bien — cliquez ou faites glisser le repère"
    />
  )
}
