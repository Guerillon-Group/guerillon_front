'use client'

import dynamic from 'next/dynamic'

const LocationMap = dynamic(() => import('@/components/map/location-map'), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center bg-secondary">
      <span className="text-sm text-muted-foreground">Chargement de la carte…</span>
    </div>
  ),
})

export function LocationCanvas({
  className,
  ...props
}: {
  lat: number
  lng: number
  zoom?: number
  onChange: (lat: number, lng: number) => void
  className?: string
}) {
  return (
    <div className={className}>
      <LocationMap {...props} className="size-full" />
    </div>
  )
}
