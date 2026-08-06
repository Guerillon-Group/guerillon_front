'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Heart, ShieldCheck, Star } from 'lucide-react'

import { priceParts, type Listing } from '@/lib/properties'
import { cn } from '@/lib/utils'

export function RailCard({ listing, priority = false }: { listing: Listing; priority?: boolean }) {
  const price = priceParts(listing)
  const [loaded, setLoaded] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <article className="group relative flex flex-col">
      <Link href={`/biens/${listing.slug}`} className="flex flex-col outline-none">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-foreground/10 group-focus-visible:ring-3 group-focus-visible:ring-ring/50">
          {!loaded && <span aria-hidden="true" className="skeleton absolute inset-0" />}
          <Image
            src={listing.image || '/placeholder.svg'}
            alt={`${listing.title} à ${listing.district}, ${listing.city}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 24vw"
            onLoad={() => setLoaded(true)}
            className={cn(
              'object-cover transition-all duration-700 ease-out group-hover:scale-[1.06]',
              loaded ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-0 blur-sm',
            )}
          />

          <span className="glass-panel absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 sm:translate-y-1 sm:group-hover:translate-y-0">
            <ShieldCheck className="size-3.5 text-accent" aria-hidden="true" />
            Titre vérifié
          </span>

          <span className="absolute right-3 bottom-3 flex size-9 translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>

        <h3 className="mt-4 font-display text-xl leading-tight font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent">
          {listing.title}
        </h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>{listing.district}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 font-medium text-foreground">
            {listing.rating.toFixed(1)}
            <Star className="size-3.5 fill-accent text-accent" aria-hidden="true" />
          </span>
          <span>({listing.reviews})</span>
        </p>

        <p className="mt-4 flex flex-wrap items-baseline gap-x-2 text-foreground">
          <span className="font-display text-lg font-bold tracking-tight">
            {price.main}
            {price.unit && <span className="text-sm font-medium text-muted-foreground">{price.unit}</span>}
          </span>
          {price.hint && <span className="text-sm text-muted-foreground">{price.hint}</span>}
        </p>
      </Link>

      <button
        type="button"
        aria-pressed={saved}
        onClick={() => setSaved((v) => !v)}
        className="glass-panel absolute top-3 right-3 flex size-9 items-center justify-center rounded-full text-foreground transition-transform duration-200 hover:scale-110 active:scale-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <Heart
          className={cn('size-4 transition-all duration-300', saved && 'scale-110 fill-destructive text-destructive')}
          aria-hidden="true"
        />
        <span className="sr-only">{saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
      </button>
    </article>
  )
}
