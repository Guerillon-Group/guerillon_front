'use client'

import dynamic from 'next/dynamic'

import type { Listing } from '@/lib/properties'

const PropertyMap = dynamic(() => import('@/components/map/property-map'), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center bg-secondary">
      <span className="text-sm text-muted-foreground">Chargement de la carte…</span>
    </div>
  ),
})

export function MapCanvas(props: {
  listings: Listing[]
  activeSlug?: string | null
  center?: [number, number]
  zoom?: number
  interactive?: boolean
  fitOnChange?: boolean
  onSelect?: (slug: string) => void
  className?: string
}) {
  return <PropertyMap {...props} />
}
