import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

import type { Listing } from '@/lib/properties'

/** Carte compacte « reprendre votre recherche » : vignette + méta courte. */
export function CompactCard({ listing }: { listing: Listing }) {
  return (
    <article className="group flex items-center gap-4 rounded-xl bg-secondary p-3 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-card hover:shadow-lg hover:shadow-foreground/5">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-card sm:size-28">
        <Image
          src={listing.image || '/placeholder.svg'}
          alt={`${listing.title}, ${listing.district}`}
          fill
          sizes="112px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
        />
      </div>

      <div className="min-w-0">
        <h3 className="truncate font-display text-[17px] leading-tight font-bold tracking-tight text-foreground">
          {listing.title}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>{listing.district}</span>
          <span aria-hidden="true">·</span>
          {listing.reviews > 10 ? (
            <>
              <span className="flex items-center gap-1 font-medium text-foreground">
                {listing.rating.toFixed(1)}
                <Star className="size-3.5 fill-accent text-accent" aria-hidden="true" />
              </span>
              <span>({listing.reviews})</span>
            </>
          ) : (
            <span>Nouvelle annonce</span>
          )}
        </p>

        <Link
          href={`/biens/${listing.slug}`}
          className="mt-2 inline-block text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent"
        >
          Voir le détail
        </Link>
      </div>
    </article>
  )
}
