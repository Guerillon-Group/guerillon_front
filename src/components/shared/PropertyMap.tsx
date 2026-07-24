'use client';

import { useEffect, useRef } from 'react';

interface PropertyMapProps {
  lat: number;
  lng: number;
  title: string;
}

export default function PropertyMap({ lat, lng, title }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current) {
      const L = require('leaflet');
      require('leaflet/dist/leaflet.css');

      const map = L.map(mapRef.current).setView([lat, lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${title}</b>`)
        .openPopup();

      return () => {
        map.remove();
      };
    }
  }, [lat, lng, title]);

  return <div ref={mapRef} className="h-72 w-full z-0" />;
}
