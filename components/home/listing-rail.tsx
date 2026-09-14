'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { RailCard } from '@/components/home/rail-card'
import { RailSkeleton } from '@/components/home/listing-skeleton'
import type { Listing } from '@/lib/properties'
import { cn } from '@/lib/utils'

export function ListingRail({
  title,
  subtitle,
  items,
  loading = false,
  priority = false,
}: {
  title: string
  subtitle: string
  items: Listing[]
  loading?: boolean
  priority?: boolean
}) {
  const scroller = useRef<HTMLUListElement>(null)
  const [edge, setEdge] = useState<{ start: boolean; end: boolean }>({ start: true, end: true })

  const sync = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 })
  }, [])

  useEffect(() => {
    sync()
    const el = scroller.current
    if (!el) return
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => observer.disconnect()
  }, [sync])

  const nudge = (direction: -1 | 1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: direction * Math.max(el.clientWidth * 0.8, 280), behavior: 'smooth' })
  }

  return (
    <section className="mx-auto w-full max-w-[1280px] overflow-hidden px-4 pt-12 md:px-6 md:pt-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-2xl leading-tight font-bold tracking-tight text-foreground md:text-[30px]">
            {title}
          </h2>
          <p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-foreground/20 border-t-accent" />
                Mise à jour de la sélection…
              </span>
            ) : (
              <>
                <span className="live-dot size-1.5 rounded-full bg-accent" aria-hidden="true" />
                <span>
                  {items.length} {items.length > 1 ? 'biens' : 'bien'} · {subtitle}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <RailButton label="Précédent" disabled={edge.start || loading} onClick={() => nudge(-1)}>
            <ChevronLeft className="size-5" aria-hidden="true" />
          </RailButton>
          <RailButton label="Suivant" disabled={edge.end || loading} onClick={() => nudge(1)}>
            <ChevronRight className="size-5" aria-hidden="true" />
          </RailButton>
        </div>
      </div>

      <div aria-busy={loading} aria-live="polite" className="w-full overflow-hidden">
        {loading ? (
          <RailSkeleton count={4} />
        ) : items.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
            Aucun bien dans cette catégorie pour le moment.
          </p>
        ) : (
          <ul
            ref={scroller}
            onScroll={sync}
            className="hide-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
          >
            {items.map((listing, i) => (
              <li
                key={listing.slug}
                style={{ animationDelay: `${Math.min(i, 5) * 70}ms` }}
                className={cn(
                  'w-[80vw] max-w-[320px] shrink-0 snap-start sm:w-[44vw] sm:max-w-none lg:w-[calc((100%-3.75rem)/4)]',
                  'animate-in fill-mode-backwards duration-500 fade-in slide-in-from-bottom-4',
                )}
              >
                <RailCard listing={listing} priority={priority && i === 0} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-full border border-input text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  )
}
