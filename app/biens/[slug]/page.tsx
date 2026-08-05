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
  MapPin,
  Maximize,
  Phone,
  Share2,
} from 'lucide-react'

import { ListingCard } from '@/components/listing-card'
import { ListingGallery } from '@/components/listing-gallery'
import { MapCanvas } from '@/components/map/map-canvas'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { formatPrice, getListing, listings } from '@/lib/properties'

export function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const listing = getListing(slug)
  if (!listing) return { title: 'Bien introuvable — Real Estate' }
  return {
    title: `${listing.title} — ${listing.city} | Real Estate`,
    description: listing.description.slice(0, 155),
  }
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const listing = getListing(slug)
  if (!listing) notFound()

  const similar = listings.filter((l) => l.slug !== listing.slug && l.city === listing.city).slice(0, 3)
  const fallbackSimilar = listings.filter((l) => l.slug !== listing.slug).slice(0, 3)
  const suggestions = similar.length >= 2 ? similar : fallbackSimilar

  const specs = [
    { icon: BedDouble, label: 'Chambres', value: listing.beds > 0 ? String(listing.beds) : '—' },
    { icon: Bath, label: 'Salles de bain', value: listing.baths > 0 ? String(listing.baths) : '—' },
    { icon: Maximize, label: 'Surface', value: `${listing.surface} m²` },
    { icon: MapPin, label: 'Quartier', value: listing.district },
  ]

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1280px] px-4 pt-6 md:px-6 md:pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Retour aux annonces
        </Link>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold tracking-[0.05em] text-foreground uppercase">
                {listing.status}
              </span>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold tracking-[0.05em] text-foreground uppercase">
                {listing.type}
              </span>
              {listing.verified && (
                <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold tracking-[0.05em] text-accent uppercase">
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  Titre vérifié
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-foreground md:text-[40px]">
              {listing.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {listing.district}, {listing.city} — RDC
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
            <p className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {formatPrice(listing)}
            </p>
            <Button variant="outline" size="icon-lg" className="rounded-full" aria-label="Partager cette annonce">
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
          <div>
            <ListingGallery images={listing.gallery} title={listing.title} />

            {/* Specs */}
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
              {specs.map((spec) => (
                <div key={spec.label} className="flex flex-col gap-1.5 bg-card p-5">
                  <spec.icon className="size-4 text-muted-foreground" aria-hidden="true" />
                  <dt className="text-[11px] font-semibold tracking-[0.05em] text-muted-foreground uppercase">
                    {spec.label}
                  </dt>
                  <dd className="text-[15px] font-semibold text-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>

            {/* Description */}
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">À propos du bien</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{listing.description}</p>
            </section>

            {/* Features */}
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
                Équipements et prestations
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {listing.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <Check className="size-3 text-foreground" aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            {/* Location */}
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Emplacement</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Localisation approximative pour préserver la confidentialité du vendeur.
              </p>
              <div className="mt-5 h-[320px] overflow-hidden rounded-2xl border border-border">
                <MapCanvas
                  listings={[listing]}
                  activeSlug={listing.slug}
                  center={[listing.lat, listing.lng]}
                  zoom={14}
                  className="size-full"
                />
              </div>
            </section>
          </div>

          {/* Sticky agent panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <Image
                  src={listing.agent.avatar || '/placeholder.svg'}
                  alt={`Portrait de ${listing.agent.name}`}
                  width={112}
                  height={112}
                  className="size-14 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-foreground">{listing.agent.name}</p>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <BadgeCheck className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
                    {listing.agent.role}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {listing.agent.agency} · {listing.agent.responseTime}
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <Button className="h-12 gap-2 rounded-full">
                  <Calendar className="size-4" />
                  Planifier une visite
                </Button>
                <Button variant="outline" className="h-12 gap-2 rounded-full border-border">
                  <Phone className="size-4" />
                  Appeler l&apos;agent
                </Button>
              </div>

              <form className="mt-6 border-t border-border pt-6">
                <label htmlFor="message" className="text-[11px] font-semibold tracking-[0.05em] text-muted-foreground uppercase">
                  Envoyer un message
                </label>
                <textarea
                  id="message"
                  rows={3}
                  defaultValue={`Bonjour, je suis intéressé par « ${listing.title} ». Est-il toujours disponible ?`}
                  className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground transition-all outline-none placeholder:text-muted-foreground focus:border-foreground focus:ring-3 focus:ring-ring/20"
                />
                <Button type="submit" variant="secondary" className="mt-3 h-11 w-full rounded-full">
                  Envoyer la demande
                </Button>
              </form>
            </div>

            <p className="mt-4 px-1 text-xs leading-relaxed text-muted-foreground">
              Real Estate ne perçoit aucune commission sur cette mise en relation. Ne versez jamais d&apos;acompte avant
              la visite.
            </p>
          </aside>
        </div>

        {/* Similar */}
        <section className="pt-16 md:pt-24">
          <h2 className="font-display text-2xl leading-tight font-semibold tracking-tight text-foreground md:text-[32px]">
            Biens comparables
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
