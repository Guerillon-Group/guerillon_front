'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  BadgeCheck,
  Bath,
  BedDouble,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Heart,
  LayoutList,
  Maximize,
  Star,
  Wifi,
  X,
} from 'lucide-react'

import { AdvancedFilters } from '@/components/filters/advanced-filters'
import { MapCanvas } from '@/components/map/map-canvas'
import { ShareModal } from '@/components/share-modal'
import { Button } from '@/components/ui/button'
import {
  applyFilters,
  defaultFilters,
  filterChips,
  priceBounds,
  transactions,
  type Filters,
  type Transaction,
} from '@/lib/filters'
import { apiPropertyToListing, formatPrice, type Listing } from '@/lib/properties'
import { cn } from '@/lib/utils'
import { propertyService } from '@/services/property.service'

const types = ['Tout', 'Appartement', 'Villa', 'Maison', 'Terrain', 'Bureau'] as const
const ITEMS_PER_PAGE = 6

export function MapExplorer() {
  const searchParams = useSearchParams()
  const searchLabel = searchParams.get('q')?.trim() || ''
  const searchQuery = searchLabel.toLocaleLowerCase('fr-FR')
  const initialTransaction: Transaction =
    searchParams.get('transaction') === 'À louer'
      ? 'À louer'
      : searchParams.get('transaction') === 'À vendre'
        ? 'À vendre'
        : 'Tout'

  const [properties, setProperties] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>(() => defaultFilters(initialTransaction, []))
  const [active, setActive] = useState<string | null>(null)
  const [showMapMobile, setShowMapMobile] = useState(false)
  const [sortMode, setSortMode] = useState<'date' | 'price'>('date')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [savedSearch, setSavedSearch] = useState(false)
  const [page, setPage] = useState(1)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    propertyService
      .getProperties({ per_page: 50 })
      .then((res) => {
        if (cancelled) return
        const raw = res.data?.data || []
        const converted = raw.map(apiPropertyToListing)
        setProperties(converted)
      })
      .catch((err) => {
        console.warn('Failed to load map properties from API:', err)
        if (!cancelled) setProperties([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    let result = applyFilters(properties, filters)
    if (searchQuery) {
      result = result.filter((listing) =>
        [listing.title, listing.city, listing.district, listing.address].some((value) =>
          value?.toLocaleLowerCase('fr-FR').includes(searchQuery),
        ),
      )
    }

    if (sortMode === 'price') {
      result = [...result].sort((a, b) => a.price - b.price)
    }

    return result
  }, [properties, filters, searchQuery, sortMode])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1
  const paginatedListings = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, page])

  const activeListing = useMemo(
    () => filtered.find((l) => l.slug === active) || properties.find((l) => l.slug === active),
    [filtered, properties, active],
  )
  const chips = filterChips(filters)

  const setTransaction = (t: Transaction) =>
    setFilters((f) => {
      const b = priceBounds(t, properties)
      return { ...f, transaction: t, priceMin: b.min, priceMax: b.max }
    })

  const setType = (t: (typeof types)[number]) =>
    setFilters((f) => ({
      ...f,
      types: t === 'Tout' ? [] : f.types.includes(t) ? f.types.filter((x) => x !== t) : [...f.types, t],
    }))

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) => ({ ...prev, [slug]: !prev[slug] }))
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      {/* Top Search & Filter Bar */}
      <div className="border-b border-border bg-card shadow-xs">
        <div className="mx-auto flex w-full max-w-[1700px] flex-wrap items-center gap-3 px-4 py-3 md:px-6">
          <div className="flex items-center gap-1 rounded-full bg-secondary p-1" role="group" aria-label="Transaction">
            {transactions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setTransaction(s)
                  setPage(1)
                }}
                aria-pressed={filters.transaction === s}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200',
                  filters.transaction === s
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {searchLabel && (
            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground">
              <span className="text-foreground font-medium">Lieu :</span>
              <span className="max-w-40 truncate font-semibold text-foreground">{searchLabel}</span>
            </div>
          )}

          <div className="hide-scrollbar flex flex-1 items-center gap-2 overflow-x-auto">
            {types.map((t) => {
              const on = t === 'Tout' ? filters.types.length === 0 : filters.types.includes(t)
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t)
                    setPage(1)
                  }}
                  aria-pressed={on}
                  className={cn(
                    'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                    on
                      ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                      : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                  )}
                >
                  {t}
                </button>
              )
            })}
          </div>

          <AdvancedFilters
            value={filters}
            onChange={(f) => {
              setFilters(f)
              setPage(1)
            }}
            className="ml-auto"
          />
        </div>

        {chips.length > 0 && (
          <div className="mx-auto w-full max-w-[1700px] px-4 pb-3 md:px-6">
            <ul className="hide-scrollbar flex items-center gap-2 overflow-x-auto">
              {chips.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    onClick={() => {
                      setFilters(chip.next)
                      setPage(1)
                    }}
                    className="flex shrink-0 items-center gap-1.5 rounded-full bg-secondary py-1 pr-2.5 pl-3 text-xs font-medium text-foreground transition-colors duration-200 hover:bg-secondary/80"
                  >
                    {chip.label}
                    <X className="size-3 text-muted-foreground" aria-hidden="true" />
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setFilters(defaultFilters(filters.transaction))
                    setPage(1)
                  }}
                  className="shrink-0 px-2 text-xs font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  Tout effacer
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Split Layout: Left Panel = Cards Stream, Right Panel = Sticky Map */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* LEFT COLUMN: List & Cards Stream */}
        <aside
          className={cn(
            'flex flex-1 flex-col overflow-y-auto border-r border-border bg-background transition-all duration-300',
            showMapMobile ? 'hidden lg:flex' : 'flex',
            'w-full lg:w-[54%] xl:w-[58%]',
          )}
          aria-label="Liste des hébergements et biens"
        >
          {/* Header Summary & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 px-4 py-4 md:px-6">
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
                {filtered.length} bien{filtered.length > 1 ? 's' : ''} {searchLabel ? `à ${searchLabel}` : 'disponibles'}
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">
                Réservez votre séjour ou trouvez votre prochain bien d&apos;exception.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeListing && <ShareModal listing={activeListing} />}
              <Button
                variant={savedSearch ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSavedSearch((v) => !v)}
                className="rounded-full border-border text-xs gap-1.5"
              >
                {savedSearch ? (
                  <>
                    <BookmarkCheck className="size-3.5 fill-current" />
                    Enregistrée
                  </>
                ) : (
                  <>
                    <Bookmark className="size-3.5" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sub Header: Sort Options & View Layout Switcher */}
          <div className="flex items-center justify-between border-b border-border/60 bg-card/40 px-4 py-2.5 text-xs text-muted-foreground md:px-6">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Trier par :</span>
              <button
                type="button"
                onClick={() => setSortMode('date')}
                className={cn(
                  'rounded-full px-3 py-1 font-semibold transition-colors',
                  sortMode === 'date'
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Date
              </button>
              <button
                type="button"
                onClick={() => setSortMode('price')}
                className={cn(
                  'rounded-full px-3 py-1 font-semibold transition-colors',
                  sortMode === 'price'
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Prix
              </button>
            </div>

            {/* View Mode Toggle (Horizontal List vs 2-Column Grid) */}
            <div className="hidden sm:flex items-center gap-1 rounded-lg bg-secondary p-1">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="Affichage en liste"
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  viewMode === 'list' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <LayoutList className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Affichage en grille"
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  viewMode === 'grid' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Grid2X2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Listings List / Grid */}
          <div className="flex-1 px-4 py-4 md:px-6">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <p className="animate-pulse text-sm text-muted-foreground">Chargement des biens...</p>
              </div>
            ) : paginatedListings.length > 0 ? (
              <div
                className={cn(
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2'
                    : 'flex flex-col gap-4',
                )}
              >
                {paginatedListings.map((listing) => (
                  <HorizontalPropertyCard
                    key={listing.slug}
                    listing={listing}
                    isActive={active === listing.slug}
                    isFavorite={!!favorites[listing.slug]}
                    onToggleFavorite={() => toggleFavorite(listing.slug)}
                    onMouseEnter={() => setActive(listing.slug)}
                    onFocus={() => setActive(listing.slug)}
                  />
                ))}
              </div>
            ) : (
              <div className="my-12 p-10 text-center rounded-2xl border border-dashed border-border bg-card/30">
                <p className="text-base font-semibold text-foreground">Aucun bien ne correspond à vos filtres</p>
                <p className="mt-1 text-xs text-muted-foreground">Essayez de modifier votre recherche ou vos critères de prix.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters(defaultFilters('Tout'))
                    setPage(1)
                  }}
                  className="mt-4 rounded-full border-border"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-auto border-t border-border bg-card/20 px-4 py-4 md:px-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-full gap-1 border-border"
                >
                  <ChevronLeft className="size-4" />
                  Précédent
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={cn(
                        'size-8 rounded-full text-xs font-semibold transition-colors',
                        page === p
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-full gap-1 border-border"
                >
                  Suivant
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT COLUMN: Interactive Full-Height Map */}
        <main
          className={cn(
            'relative h-full flex-1 bg-secondary/30 transition-all duration-300',
            showMapMobile ? 'block' : 'hidden lg:block',
          )}
        >
          <MapCanvas
            listings={filtered}
            activeSlug={active}
            fitOnChange
            onSelect={setActive}
            className="absolute inset-0 size-full"
          />

          {/* Active Hover Floating Card on Map */}
          {activeListing && (
            <div className="absolute inset-x-4 bottom-6 z-[500] md:left-6 md:right-auto md:w-[360px]">
              <ActiveCard listing={activeListing} onClose={() => setActive(null)} />
            </div>
          )}
        </main>

        {/* Mobile Floating Toggle Button */}
        <div className="fixed bottom-6 left-1/2 z-[600] -translate-x-1/2 lg:hidden">
          <Button
            onClick={() => setShowMapMobile((v) => !v)}
            className="rounded-full bg-foreground px-6 py-3 text-xs font-bold text-background shadow-2xl transition-transform hover:scale-105 active:scale-95"
          >
            {showMapMobile ? '📋 Voir la liste' : `🗺️ Voir la carte (${filtered.length})`}
          </Button>
        </div>
      </div>
    </div>
  )
}

function safeText(val: any, fallback: string = ''): string {
  if (typeof val === 'string') return val
  if (val && typeof val === 'object') {
    if (typeof val.name === 'string') return val.name
    if (typeof val.title === 'string') return val.title
  }
  return fallback
}

/**
 * Horizontal Property Card styled exactly like modern Airbnb/Booking listings (Reference design)
 */
function HorizontalPropertyCard({
  listing,
  isActive,
  isFavorite,
  onToggleFavorite,
  onMouseEnter,
  onFocus,
}: {
  listing: Listing
  isActive: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
  onMouseEnter: () => void
  onFocus: () => void
}) {
  return (
    <article
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      className={cn(
        'group relative flex flex-col sm:flex-row gap-4 rounded-2xl border bg-card p-3.5 transition-all duration-300 hover:shadow-lg',
        isActive ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-border/80 hover:border-border',
      )}
    >
      {/* Property Image Container */}
      <div className="relative aspect-[4/3] w-full sm:w-56 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image
          src={listing.image || '/placeholder.svg'}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 100vw, 240px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges on top-left */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1">
          <span className="rounded-full bg-background/90 px-2.5 py-0.5 text-[11px] font-bold text-foreground backdrop-blur-xs shadow-xs">
            {listing.status}
          </span>
          {listing.verified && (
            <span className="flex items-center gap-1 rounded-full bg-[#16381e] px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-xs">
              <BadgeCheck className="size-3 text-[#c5a059]" />
              Vérifié
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className="absolute top-2.5 right-2.5 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 shadow-xs"
        >
          <Heart className={cn('size-4 transition-colors', isFavorite ? 'fill-accent text-accent' : 'text-foreground')} />
        </button>
      </div>

      {/* Details Container */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          {/* Top Row: Subtitle & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="truncate font-medium">
              {safeText(listing.type, 'Appartement')} à {safeText(listing.district, 'Centre-Ville')}, {safeText(listing.city, 'Goma')}
            </span>
            <div className="flex items-center gap-1 shrink-0 font-semibold text-foreground">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span>{listing.rating ? listing.rating.toFixed(1) : '4.9'}</span>
              <span className="text-muted-foreground">({listing.reviews || 24})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-1 font-display text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {safeText(listing.title, 'Bien Immobilier')}
          </h3>

          {/* Features Specs Bar */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {listing.beds > 0 && (
              <span className="flex items-center gap-1">
                <BedDouble className="size-3.5 text-foreground/70" />
                {listing.beds} chambre{listing.beds > 1 ? 's' : ''}
              </span>
            )}
            {listing.baths > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="size-3.5 text-foreground/70" />
                {listing.baths} sdb
              </span>
            )}
            <span className="flex items-center gap-1">
              <Maximize className="size-3.5 text-foreground/70" />
              {listing.surface} m²
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <Wifi className="size-3.5" />
              Wi-Fi inclus
            </span>
          </div>
        </div>

        {/* Bottom Row: Price & Action */}
        <div className="mt-4 flex items-end justify-between gap-2 border-t border-border/40 pt-2.5">
          <div>
            <span className="text-[11px] font-medium text-muted-foreground">Prix total</span>
            <p className="font-display text-lg font-bold tracking-tight text-foreground">
              {formatPrice(listing)}
            </p>
          </div>

          <Button
            size="sm"
            nativeButton={false}
            render={<Link href={`/biens/${listing.slug}`} />}
            className="rounded-full px-4 text-xs font-semibold"
          >
            Découvrir
          </Button>
        </div>
      </div>
    </article>
  )
}

/**
 * Floating Card Overlay on the Map when a Marker is active
 */
function ActiveCard({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  return (
    <div className="relative flex gap-3.5 rounded-2xl border border-border bg-card/95 p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
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
          <p className="truncate text-xs font-bold text-foreground">{safeText(listing.title, 'Bien Immobilier')}</p>
          <p className="truncate text-[11px] text-muted-foreground mt-0.5">
            {safeText(listing.district, 'Centre-Ville')}, {safeText(listing.city, 'Goma')}
          </p>
        </div>
        <div className="flex items-end justify-between gap-2 mt-2">
          <p className="font-display text-sm font-bold text-foreground">{formatPrice(listing)}</p>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href={`/biens/${listing.slug}`} />}
            className="rounded-full h-7 text-xs px-3"
          >
            Voir
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer l'aperçu"
        className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-transform hover:scale-110 active:scale-95"
      >
        <X className="size-3" />
      </button>
    </div>
  )
}
