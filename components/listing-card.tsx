'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, Bath, BedDouble, Heart, Maximize, MapPin } from 'lucide-react'

import { formatPrice, type Listing } from '@/lib/properties'
import { cn } from '@/lib/utils'

export function ListingCard({ listing, priority = false }: { listing: Listing; priority?: boolean }) {
  const [saved, setSaved] = useState(false)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-transform duration-300 ease-out hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.image || '/placeholder.svg'}
          alt={`${listing.title} à ${listing.district}, ${listing.city}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />

        <div className="absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="glass-panel rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.05em] text-foreground uppercase">
              {listing.status}
            </span>
            {listing.badges.slice(0, 1).map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold tracking-[0.05em] text-accent-foreground uppercase"
              >
                {badge}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            aria-pressed={saved}
            aria-label={saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className="glass-panel flex size-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
          >
            <Heart className={cn('size-4 transition-colors', saved ? 'fill-accent text-accent' : 'text-foreground')} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold text-foreground">{listing.title}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {listing.district}, {listing.city}
              </span>
            </p>
          </div>
            {listing.verified && (
              <span
                className="flex shrink-0 items-center gap-1 rounded-full bg-[#16381e]/10 px-2 py-0.5 text-xs font-semibold text-[#16381e] border border-[#16381e]/20"
                title="Titre de propriété vérifié par MBIYO REAL-ESTATE"
              >
                <BadgeCheck className="size-3.5 fill-[#c5a059] text-white" aria-hidden="true" />
                <span>Vérifié</span>
              </span>
            )}
        </div>

        <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {listing.beds > 0 && (
            <div className="flex items-center gap-1.5">
              <BedDouble className="size-4" aria-hidden="true" />
              <dt className="sr-only">Chambres</dt>
              <dd>{listing.beds}</dd>
            </div>
          )}
          {listing.baths > 0 && (
            <div className="flex items-center gap-1.5">
              <Bath className="size-4" aria-hidden="true" />
              <dt className="sr-only">Salles de bain</dt>
              <dd>{listing.baths}</dd>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Maximize className="size-4" aria-hidden="true" />
            <dt className="sr-only">Surface</dt>
            <dd>{listing.surface} m²</dd>
          </div>
        </dl>

        <p className="mt-auto pt-2 font-display text-xl font-semibold tracking-tight text-foreground">
          {formatPrice(listing)}
        </p>
      </div>

      <Link href={`/biens/${listing.slug}`} className="absolute inset-0 rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50">
        <span className="sr-only">Voir {listing.title}</span>
      </Link>
    </article>
  )
}
