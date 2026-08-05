import type { Metadata } from 'next'

import { MapExplorer } from '@/components/map-explorer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Explorer par carte — Real Estate',
  description:
    'Parcourez les biens disponibles à Goma, Bukavu et Kinshasa directement sur la carte, avec prix et détails en un coup d’œil.',
}

export default function MapPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader />
      <MapExplorer />
    </div>
  )
}
