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
import { ShareModal } from '@/components/share-modal'
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

// Données fictives d'avis structurés inspirés d'Airbnb
const mockReviews = [
  {
    id: '1',
    name: 'Kathy',
    location: 'Lynnwood, Washington',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    date: 'Avril 2025',
    tenure: '4 ans sur la plateforme',
    rating: 5,
    comment:
      'Séjour absolument formidable ! L\'emplacement à Goma est parfait, la vue est imprenable et les équipements sont exactement conformes aux photos. L\'agent a été d\'une réactivité remarquable.',
  },
  {
    id: '2',
    name: 'Arline',
    location: 'Bruxelles, Belgique',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    date: 'Mars 2025',
    tenure: '2 ans sur la plateforme',
    rating: 5,
    comment:
      'Emplacement calme, endroit propre et hôte très accueillant. Le système d\'eau et le groupe électrogène fonctionnent sans interruption, ce qui est un vrai plus !',
  },
  {
    id: '3',
    name: 'Octavie',
    location: 'Kinshasa, RDC',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    date: 'Février 2025',
    tenure: '5 ans sur la plateforme',
    rating: 5,
    comment:
      'Nous avons adoré notre séjour. Les espaces sont lumineux, bien agencés et très confortables. Fortement recommandé pour un séjour professionnel ou de détente !',
  },
  {
    id: '4',
    name: 'Nathan',
    location: 'Paris, France',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    date: 'Février 2025',
    tenure: '3 ans sur la plateforme',
    rating: 5,
    comment:
      'Très bon accueil par l\'agent immobilier. Conseils précieux sur le quartier et grande flexibilité pour les horaires de visite et remise des clés.',
  },
]

const ratingBreakdowns = [
  { label: 'Propreté', score: '4.9', icon: Sparkles },
  { label: 'Exactitude', score: '4.9', icon: ShieldCheck },
  { label: 'Arrivée / Visite', score: '4.9', icon: KeyRound },
  { label: 'Communication', score: '5.0', icon: MessageSquare },
  { label: 'Emplacement', score: '4.8', icon: MapPin },
  { label: 'Rapport qualité/prix', score: '4.9', icon: Flame },
]

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
                {listing.rating}
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
                  center={[listing.lat, listing.lng]}
                  zoom={14}
                  className="size-full"
                />
              </div>
            </section>
          </div>

          {/* Sidebar Sticky de réservation / contact */}
          <aside id="reserver" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5 transition-all">
              {/* Badge rare find / coup de coeur inspiré Airbnb */}
              <div className="mb-5 flex items-center justify-between rounded-2xl bg-amber-500/10 px-4 py-3 text-xs font-semibold text-amber-700 dark:text-amber-400">
                <span className="flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-500" />
                  Bien très demandé sur {listing.city}
                </span>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold">
                  Pro-Vérifié
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-display text-3xl font-bold text-foreground">{formatPrice(listing)}</span>
                  {listing.period && <span className="text-sm text-muted-foreground"> / {listing.period}</span>}
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span>{listing.rating}</span>
                  <span className="text-muted-foreground">({listing.reviews})</span>
                </div>
              </div>

              {/* Formulaire de réservation compact inspiré Airbnb */}
              <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
                <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
                  <div className="p-3">
                    <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Date souhaitée
                    </label>
                    <input
                      type="date"
                      className="mt-1 w-full bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer"
                    />
                  </div>
                  <div className="p-3">
                    <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Heure de visite
                    </label>
                    <select className="mt-1 w-full bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer">
                      <option>10:00 AM</option>
                      <option>02:00 PM</option>
                      <option>04:30 PM</option>
                    </select>
                  </div>
                </div>
                <div className="p-3">
                  <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Type de demande
                  </label>
                  <select className="mt-1 w-full bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer">
                    <option>Visite guidée sur place</option>
                    <option>Visite vidéo en direct</option>
                    <option>Renseignements complémentaires</option>
                  </select>
                </div>
              </div>

              <Button className="mt-5 h-12 w-full rounded-2xl font-bold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]">
                {listing.status === 'À louer' ? 'Réserver la visite' : 'Demander un dossier d\'achat'}
              </Button>
              <p className="mt-2.5 text-center text-xs text-muted-foreground">
                Aucun paiement n&apos;est exigé pour planifier une visite.
              </p>

              {/* Profil Agent */}
              <div className="mt-6 border-t border-border pt-6">
                <div className="flex items-center gap-3.5">
                  <Image
                    src={listing.agent.avatar || '/placeholder.svg'}
                    alt={`Portrait de ${listing.agent.name}`}
                    width={96}
                    height={96}
                    className="size-12 rounded-full object-cover ring-2 ring-border"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{listing.agent.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BadgeCheck className="size-3.5 text-primary" aria-hidden="true" />
                      {listing.agent.role} · {listing.agent.agency}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="h-10 flex-1 rounded-xl text-xs font-semibold border-border">
                    <Phone className="mr-1.5 size-3.5" />
                    Appeler
                  </Button>
                  <Button variant="secondary" className="h-10 flex-1 rounded-xl text-xs font-semibold">
                    <MessageSquare className="mr-1.5 size-3.5" />
                    Message
                  </Button>
                </div>
              </div>
            </div>

            <p className="mt-3 px-2 text-center text-xs leading-relaxed text-muted-foreground/80">
              Real Estate garantit la vérification des titres de propriété. Ne versez aucun acompte avant visite physique.
            </p>
          </aside>
        </div>

        {/* Section Avis "Guest Favorite" inspiré Airbnb */}
        <section id="avis" className="mt-16 scroll-mt-24 border-t border-border pt-12">
          <div className="flex flex-col items-center text-center">
            <div className="relative inline-flex items-center justify-center">
              <span className="font-display text-6xl font-extrabold tracking-tight text-foreground md:text-7xl">
                {listing.rating}
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
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {mockReviews.map((review) => (
              <div key={review.id} className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/40 p-6">
                <div>
                  <div className="flex items-center gap-3">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      width={48}
                      height={48}
                      className="size-11 rounded-full object-cover ring-1 ring-border"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{review.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {review.location} · {review.tenure}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="size-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span>· {review.date}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" className="rounded-xl border-border px-6 font-semibold">
              Afficher les {listing.reviews} avis
            </Button>
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

