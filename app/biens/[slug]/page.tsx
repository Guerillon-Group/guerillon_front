import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  ArrowLeft,
  BadgeCheck,
  Bath,
  BedDouble,
  Calendar,
  Check,
  ChevronRight,
  Flame,
  KeyRound,
  MapPin,
  Maximize,
  MessageSquare,
  Phone,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Tv,
  Wifi,
  Wind,
} from 'lucide-react'

import { ListingCard } from '@/components/listing-card'
import { ListingGallery } from '@/components/listing-gallery'
import { MapCanvas } from '@/components/map/map-canvas'
import { PropertyReservationWidget } from '@/components/property-reservation-widget'
import { ShareModal } from '@/components/share-modal'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { apiPropertyToListing, formatPrice, getListingAsync } from '@/lib/properties'
import { propertyService } from '@/services/property.service'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingAsync(slug)
  if (!listing) return { title: 'Bien introuvable — MBIYO Real Estate' }
  return {
    title: `${listing.title} — ${listing.city} | MBIYO Real Estate`,
    description: listing.description.slice(0, 155),
  }
}

const ratingBreakdowns = [
  { label: 'Propreté', score: '5.0', icon: Sparkles },
  { label: 'Exactitude', score: '5.0', icon: ShieldCheck },
  { label: 'Arrivée / Visite', score: '5.0', icon: KeyRound },
  { label: 'Communication', score: '5.0', icon: MessageSquare },
  { label: 'Emplacement', score: '5.0', icon: MapPin },
  { label: 'Rapport qualité/prix', score: '5.0', icon: Flame },
]

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const listing = await getListingAsync(slug)
  if (!listing) notFound()

  let suggestions: any[] = []
  try {
    const similarRes = await propertyService.getProperties({ city: listing.city, per_page: 4 })
    const raw = similarRes.data?.data || []
    suggestions = raw
      .map(apiPropertyToListing)
      .filter((l) => l.slug !== listing.slug && l.id !== listing.id)
      .slice(0, 3)
  } catch (e) {
    suggestions = []
  }

  const specs = [
    { icon: BedDouble, label: 'Chambres', value: listing.beds > 0 ? String(listing.beds) : '—' },
    { icon: Bath, label: 'Salles de bain', value: listing.baths > 0 ? String(listing.baths) : '—' },
    { icon: Maximize, label: 'Surface habitable', value: `${listing.surface} m²` },
    ...(listing.landArea ? [{ icon: Maximize, label: 'Terrain', value: `${listing.landArea} m²` }] : []),
    ...(listing.year || listing.constructionYear
      ? [{ icon: Calendar, label: 'Année', value: String(listing.year || listing.constructionYear) }]
      : []),
    { icon: MapPin, label: 'Quartier', value: listing.district },
  ]

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />

      {/* Mini-Subheader Sticky de Navigation rapide inspiré d'Airbnb */}
      <div className="sticky top-0 z-30 hidden border-b border-border/80 bg-background/95 backdrop-blur-md md:block">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3">
          <nav className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#photos" className="transition-colors hover:text-foreground">
              Photos
            </a>
            <a href="#equipements" className="transition-colors hover:text-foreground">
              Équipements
            </a>
            <a href="#avis" className="transition-colors hover:text-foreground">
              Avis ({listing.reviews})
            </a>
            <a href="#emplacement" className="transition-colors hover:text-foreground">
              Emplacement
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-sm font-bold text-foreground">{formatPrice(listing)}</span>
              <span className="text-xs text-muted-foreground"> {listing.period ? `/ ${listing.period}` : ''}</span>
            </div>
            <a
              href="#reserver"
              className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-transform hover:opacity-90 active:scale-95"
            >
              {listing.status === 'À louer' ? 'Réserver la visite' : 'Contacter l\'agent'}
            </a>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1280px] px-4 pt-6 md:px-6 md:pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Retour aux annonces
        </Link>

        {/* Titre et actions */}
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold tracking-wider text-foreground uppercase">
                {listing.status}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold tracking-wider text-foreground uppercase">
                {listing.type}
              </span>
              {listing.verified && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  Titre vérifié
                </span>
              )}
            </div>

            <h1 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight text-foreground md:text-4xl">
              {listing.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {typeof listing.rating === 'number' ? listing.rating.toFixed(1) : (listing.rating ?? '—')}
              </span>
              <span>·</span>
              <a href="#avis" className="font-semibold text-foreground underline underline-offset-4">
                {listing.reviews} avis
              </a>
              <span>·</span>
              <p className="flex items-center gap-1">
                <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                {listing.district}, {listing.city}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
            <div className="text-right">
              <p className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {formatPrice(listing)}
              </p>
              {listing.period && <p className="text-xs text-muted-foreground">Par {listing.period}</p>}
            </div>
            <ShareModal listing={listing} />
          </div>
        </div>

        {/* Galerie photos */}
        <section id="photos" className="mt-6 scroll-mt-24">
          <ListingGallery images={listing.gallery} title={listing.title} />
        </section>

        {/* Layout Principal : Détails + Sidebar Sticky */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            {/* Grille des caractéristiques clé (Bed/Bath/Surface) */}
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col gap-1.5 rounded-2xl border border-border/80 bg-card/60 p-4 transition-all hover:border-border hover:shadow-sm"
                >
                  <spec.icon className="size-5 text-primary" aria-hidden="true" />
                  <dt className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    {spec.label}
                  </dt>
                  <dd className="text-base font-bold text-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>

            {/* Description */}
            <section className="mt-10 border-t border-border pt-8">
              <h2 className="font-display text-xl font-bold tracking-tight text-foreground">À propos du logement</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground/90">{listing.description}</p>
            </section>

            {/* Équipements ("What this place offers") inspiré Airbnb */}
            <section id="equipements" className="mt-10 scroll-mt-24 border-t border-border pt-8">
              <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                Ce que propose ce logement
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {listing.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3.5 text-sm font-medium text-foreground">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary/80 text-foreground">
                      <Check className="size-4 text-primary" aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="mt-6 rounded-xl border-border font-medium">
                Afficher tous les équipements
              </Button>
            </section>

            {/* Emplacement inspiré d'Airbnb ("Where you'll be") */}
            <section id="emplacement" className="mt-10 scroll-mt-24 border-t border-border pt-8">
              <h2 className="font-display text-xl font-bold tracking-tight text-foreground">Où vous serez</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {listing.district}, {listing.city} — Localisation précise transmise lors de la confirmation de rendez-vous.
              </p>
              <div className="relative mt-5 h-[360px] overflow-hidden rounded-2xl border border-border shadow-sm">
                <MapCanvas
                  listings={[listing]}
                  activeSlug={listing.slug}
                  center={
                    listing.lat !== undefined && listing.lng !== undefined
                      ? [listing.lat, listing.lng]
                      : undefined
                  }
                  zoom={14}
                  className="size-full"
                />
              </div>
            </section>
          </div>

          {/* Sidebar Sticky de réservation / contact */}
          <PropertyReservationWidget listing={listing} />
        </div>

        {/* Section Avis "Guest Favorite" inspiré Airbnb */}
        <section id="avis" className="mt-16 scroll-mt-24 border-t border-border pt-12">
          <div className="flex flex-col items-center text-center">
            <div className="relative inline-flex items-center justify-center">
              <span className="font-display text-6xl font-extrabold tracking-tight text-foreground md:text-7xl">
                {typeof listing.rating === 'number' ? listing.rating.toFixed(1) : (listing.rating ?? '—')}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-5 fill-amber-400" />
              ))}
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold text-foreground">Favori des visiteurs</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Ce bien fait partie des logements les mieux notés sur Real Estate pour sa propreté et son emplacement.
            </p>
          </div>

          {/* Sous-scores des critères */}
          <div className="mt-10 grid grid-cols-2 gap-6 border-y border-border py-8 sm:grid-cols-3 lg:grid-cols-6">
            {ratingBreakdowns.map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center">
                <span className="text-xs font-semibold text-muted-foreground">{item.label}</span>
                <span className="mt-1 text-base font-bold text-foreground">{item.score}</span>
                <item.icon className="mt-2 size-5 text-muted-foreground/70" />
              </div>
            ))}
          </div>

          {/* Grille d'Avis des clients */}
          <div className="mt-8 text-center p-8 rounded-2xl border border-dashed border-border">
            <p className="text-sm text-muted-foreground">Aucun avis publié pour le moment pour ce bien.</p>
          </div>
        </section>

        {/* Section des Biens comparables */}
        <section className="py-16 md:py-24 border-t border-border mt-16">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl leading-tight font-bold tracking-tight text-foreground md:text-3xl">
              Biens comparables à proximité
            </h2>
            <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Tout voir <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((item) => (
              <ListingCard key={item.slug} listing={item} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

