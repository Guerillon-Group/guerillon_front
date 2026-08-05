'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, Bath, BedDouble, Maximize, SlidersHorizontal, X } from 'lucide-react'

import { MapCanvas } from '@/components/map/map-canvas'
import { Button } from '@/components/ui/button'
import { formatPrice, listings, type Listing } from '@/lib/properties'
import { cn } from '@/lib/utils'

const statuses = ['Tout', 'À vendre', 'À louer'] as const
const types = ['Tout', 'Appartement', 'Villa', 'Maison', 'Terrain', 'Bureau'] as const

export function MapExplorer() {
  const [status, setStatus] = useState<(typeof statuses)[number]>('Tout')
  const [type, setType] = useState<(typeof types)[number]>('Tout')
  const [active, setActive] = useState<string | null>(null)
  const [showList, setShowList] = useState(false)

  const filtered = useMemo(
    () =>
      listings.filter(
        (l) => (status === 'Tout' || l.status === status) && (type === 'Tout' || l.type === type),
      ),
    [status, type],
  )

  return (
    <div className="flex flex-1 flex-col">
      {/* Filter bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-3 px-4 py-4 md:px-6">
          <div className="flex items-center gap-1 rounded-full bg-secondary p-1" role="group" aria-label="Transaction">
            {statuses.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                aria-pressed={status === s}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200',
                  status === s ? 'bg-card font-medium text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="hide-scrollbar flex flex-1 items-center gap-2 overflow-x-auto">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className={cn(
                  'shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-200',
                  type === t
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <p className="ml-auto hidden shrink-0 text-sm text-muted-foreground lg:block">
            {filtered.length} bien{filtered.length > 1 ? 's' : ''} sur la carte
          </p>

          <Button
            variant="outline"
            onClick={() => setShowList((v) => !v)}
            className="shrink-0 gap-1.5 rounded-full border-border lg:hidden"
          >
            {showList ? <X className="size-4" /> : <SlidersHorizontal className="size-4" />}
            {showList ? 'Voir la carte' : `Liste (${filtered.length})`}
          </Button>
        </div>
      </div>

      {/* Split view */}
      <div className="relative flex flex-1 flex-col lg:flex-row">
        <div
          className={cn(
            'relative min-h-[420px] flex-1 lg:min-h-0',
            showList ? 'hidden lg:block' : 'block',
          )}
        >
          <MapCanvas
            listings={filtered}
            activeSlug={active}
            fitOnChange
            onSelect={setActive}
            className="absolute inset-0 size-full"
          />

          {active && (
            <ActiveCard
              listing={filtered.find((l) => l.slug === active)!}
              onClose={() => setActive(null)}
            />
          )}
        </div>

        <aside
          className={cn(
            'w-full shrink-0 overflow-y-auto border-border bg-background lg:w-[420px] lg:border-l',
            showList ? 'block' : 'hidden lg:block',
          )}
          aria-label="Liste des biens"
        >
          <ul className="flex flex-col divide-y divide-border">
            {filtered.map((listing) => (
              <li key={listing.slug}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(listing.slug)}
                  onFocus={() => setActive(listing.slug)}
                  onClick={() => setActive(listing.slug)}
                  className={cn(
                    'flex w-full gap-4 p-4 text-left transition-colors duration-200',
                    active === listing.slug ? 'bg-card' : 'hover:bg-card',
                  )}
                >
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={listing.image || '/placeholder.svg'}
                      alt={listing.title}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{listing.title}</p>
                      {listing.verified && (
                        <BadgeCheck className="size-4 shrink-0 text-accent" aria-label="Vérifié" />
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {listing.district}, {listing.city}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {listing.beds > 0 && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="size-3.5" aria-hidden="true" />
                          {listing.beds}
                        </span>
                      )}
                      {listing.baths > 0 && (
                        <span className="flex items-center gap-1">
                          <Bath className="size-3.5" aria-hidden="true" />
                          {listing.baths}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Maximize className="size-3.5" aria-hidden="true" />
                        {listing.surface} m²
                      </span>
                    </div>
                    <p className="mt-auto font-display text-[15px] font-semibold text-foreground">
                      {formatPrice(listing)}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-sm text-muted-foreground">Aucun bien ne correspond à ces filtres.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('Tout')
                  setType('Tout')
                }}
                className="mt-4 rounded-full border-border"
              >
                Réinitialiser
              </Button>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function ActiveCard({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  return (
    <div className="glass-panel absolute inset-x-4 bottom-4 z-[500] flex gap-4 rounded-xl border border-border p-3 md:left-4 md:right-auto md:w-[380px]">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={listing.image || '/placeholder.svg'}
          alt={listing.title}
          fill
          sizes="100px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{listing.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {listing.district}, {listing.city}
          </p>
        </div>
        <div className="flex items-end justify-between gap-2">
          <p className="font-display text-[15px] font-semibold text-foreground">{formatPrice(listing)}</p>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href={`/biens/${listing.slug}`} />}
            className="rounded-full"
          >
            Voir
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer l'aperçu"
        className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full border border-border bg-card text-foreground transition-transform hover:scale-105"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
