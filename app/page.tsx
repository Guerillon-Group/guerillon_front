import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, FileCheck2, Handshake, MapPinned } from 'lucide-react'

import { ListingCard } from '@/components/listing-card'
import { SearchBar } from '@/components/search-bar'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { listings } from '@/lib/properties'

const collections = [
  { name: 'Bord du lac Kivu', count: 42, image: '/images/maison-lac-kivu.png' },
  { name: 'Villas d’architecte', count: 18, image: '/images/villa-piscine.png' },
  { name: 'Terrains titrés', count: 76, image: '/images/terrain-bukavu.png' },
  { name: 'Bureaux Gombe', count: 24, image: '/images/bureau-gombe.png' },
]

const trust = [
  {
    icon: FileCheck2,
    title: 'Titres contrôlés',
    body: 'Chaque parcelle est confrontée au cadastre avant publication. Vous voyez le statut du titre, pas une promesse.',
  },
  {
    icon: BadgeCheck,
    title: 'Agents certifiés',
    body: 'Un agent référencé a signé notre charte, justifié son identité et accepté un suivi des litiges.',
  },
  {
    icon: Handshake,
    title: 'Accompagnement complet',
    body: 'De la première visite à la signature chez le notaire, un interlocuteur unique suit votre dossier.',
  },
]

export default function HomePage() {
  const featured = listings.slice(0, 3)
  const rest = listings.slice(3)

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader floating />

      <main>
        {/* Hero */}
        <section className="mx-auto w-full max-w-[1280px] px-4 pt-10 pb-6 md:px-6 md:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">
                Goma · Bukavu · Kinshasa
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[1.08] font-bold tracking-tight text-balance text-foreground md:text-5xl lg:text-[56px]">
                L&apos;immobilier congolais, enfin lisible.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Des annonces vérifiées une par une, des titres confrontés au cadastre et des agents que vous pouvez
                appeler. Trouvez le bien qui vous convient sans zone d&apos;ombre.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  nativeButton={false}
                  render={<Link href="/carte" />}
                  className="h-12 gap-2 rounded-full px-6"
                >
                  Explorer la carte
                  <MapPinned className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/publier" />}
                  className="h-12 gap-2 rounded-full border-border px-6"
                >
                  Publier une annonce
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[4/3] lg:aspect-[4/4.4]">
              <Image
                src="/images/villa-piscine.png"
                alt="Villa contemporaine avec piscine à débordement surplombant un paysage verdoyant"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="glass-panel absolute inset-x-4 bottom-4 rounded-xl p-4">
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-[0.05em] text-muted-foreground uppercase">
                      Exclusivité Katindo
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-foreground">
                      Villa d&apos;architecte avec piscine
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-lg font-semibold tracking-tight text-foreground">385 k$</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 md:mt-12">
            <SearchBar />
          </div>
        </section>

        {/* Collections */}
        <section className="mx-auto w-full max-w-[1280px] px-4 pt-16 md:px-6 md:pt-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl leading-tight font-semibold tracking-tight text-foreground md:text-[32px]">
                Immenses collections
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Des sélections construites par nos agents, pas par un algorithme.
              </p>
            </div>
            <Link
              href="/carte"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent sm:flex"
            >
              Tout voir
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <ul className="hide-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
            {collections.map((collection) => (
              <li key={collection.name} className="w-[240px] shrink-0 snap-start md:w-auto">
                <Link
                  href="/carte"
                  className="group block overflow-hidden rounded-xl border border-border bg-card transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <Image
                      src={collection.image || '/placeholder.svg'}
                      alt={collection.name}
                      fill
                      sizes="(max-width: 768px) 60vw, 22vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <span className="truncate text-sm font-medium text-foreground">{collection.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{collection.count}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Featured listings */}
        <section className="mx-auto w-full max-w-[1280px] px-4 pt-16 md:px-6 md:pt-24">
          <div>
            <h2 className="font-display text-2xl leading-tight font-semibold tracking-tight text-foreground md:text-[32px]">
              Sélection de la semaine
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Six biens visités et documentés par nos équipes.</p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing, i) => (
              <ListingCard key={listing.slug} listing={listing} priority={i === 0} />
            ))}
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((listing) => (
              <ListingCard key={listing.slug} listing={listing} />
            ))}
          </div>
        </section>

        {/* Trust */}
        <section className="mx-auto w-full max-w-[1280px] px-4 pt-16 md:px-6 md:pt-24">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="grid lg:grid-cols-[1fr_1.1fr]">
              <div className="relative min-h-[240px]">
                <Image
                  src="/images/kinshasa-skyline.png"
                  alt="Vue aérienne de Kinshasa au crépuscule avec le fleuve Congo"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6 md:p-10">
                <h2 className="font-display text-2xl leading-tight font-semibold tracking-tight text-balance text-foreground md:text-[32px]">
                  Acheter sans mauvaise surprise
                </h2>
                <ul className="mt-8 flex flex-col gap-7">
                  {trust.map((item) => (
                    <li key={item.title} className="flex gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-foreground">
                        <item.icon className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-[1280px] px-4 pt-16 md:px-6 md:pt-24">
          <div className="flex flex-col items-start gap-6 rounded-2xl bg-primary p-8 text-primary-foreground md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl leading-tight font-semibold tracking-tight text-balance md:text-[32px]">
                Vous avez un bien à vendre ou à louer ?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
                Publiez en dix minutes, recevez vos premières demandes sous 48 h. Vérification du titre incluse.
              </p>
            </div>
            <Button
              variant="secondary"
              nativeButton={false}
              render={<Link href="/publier" />}
              className="h-12 shrink-0 gap-2 rounded-full px-6"
            >
              Commencer
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
