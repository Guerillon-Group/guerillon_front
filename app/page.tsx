import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, FileCheck2, Handshake, MapPin, ShieldCheck } from 'lucide-react'

import { BrowseTabs } from '@/components/home/browse-tabs'
import { CompactCard } from '@/components/home/compact-card'
import { HeroSearch } from '@/components/home/hero-search'
import { Reveal } from '@/components/reveal'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { propertyService } from '@/services/property.service'

const locationPromises = [
  { icon: ShieldCheck, label: 'Annonces contrôlées' },
  { icon: MapPin, label: 'Quartiers vérifiés' },
  { icon: BadgeCheck, label: 'Agents identifiés' },
]

const trust = [
  {
    icon: FileCheck2,
    title: 'Logements vérifiés',
    body: 'Photos, disponibilité et informations essentielles sont contrôlées avant la mise en ligne.',
  },
  {
    icon: BadgeCheck,
    title: 'Réserver sereinement',
    body: 'Choisissez vos dates, consultez le montant et bloquez votre appartement depuis la plateforme.',
  },
  {
    icon: Handshake,
    title: 'Un interlocuteur disponible',
    body: 'Échangez avec un agent connu avant, pendant et après votre installation.',
  },
]

export default async function HomePage() {
  let featured: any[] = []
  try {
    const featuredResponse = await propertyService.getProperties({ per_page: 6, intent: 'rent' })
    featured = featuredResponse.data?.data || []
  } catch {
    // La recherche client reste disponible même si la sélection serveur est indisponible.
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main>
        <section className="mx-auto w-full max-w-[1360px] px-4 pb-5 pt-4 md:px-6 md:pb-10 md:pt-8">
          <div className="overflow-hidden rounded-[2rem] bg-[#16381e] shadow-[0_22px_60px_rgba(22,56,30,0.16)]">
            <div className="grid lg:grid-cols-[0.98fr_1.02fr]">
              <div className="flex min-h-[440px] flex-col justify-between p-7 text-white sm:p-10 md:min-h-[520px] md:p-14">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#e7d2a7]">
                    <span className="live-dot size-2 rounded-full bg-[#c5a059]" aria-hidden="true" />
                    Louer simplement, vivre pleinement
                  </div>
                  <h1 className="mt-8 max-w-xl font-display text-4xl font-bold leading-[0.98] tracking-[-0.045em] text-balance sm:text-5xl md:text-6xl">
                    L&apos;appartement qui vous attend est déjà ici.
                  </h1>
                  <p className="mt-6 max-w-md text-[15px] leading-relaxed text-emerald-50/76 sm:text-base">
                    Explorez des appartements vérifiés à Goma, Bukavu et Kinshasa. Choisissez votre quartier, vos dates et votre prochain chez-vous.
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-emerald-50/85 sm:text-sm">
                  {locationPromises.map((item) => (
                    <span key={item.label} className="flex items-center gap-2">
                      <item.icon className="size-4 text-[#c5a059]" aria-hidden="true" />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[320px] lg:min-h-[520px]">
                <Image
                  src="/images/appartement-goma.png"
                  alt="Appartement lumineux disponible à la location"
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-6 sm:p-8">
                  <p className="font-display text-xl font-semibold text-white">Des espaces prêts à vivre</p>
                  <p className="mt-1 text-sm text-white/75">Trouvez un lieu qui vous ressemble, sans détour.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto -mt-7 max-w-[1120px] px-2 sm:-mt-9 sm:px-5">
            <HeroSearch />
          </div>
        </section>

        {/* Onglets + rail principal */}
        <BrowseTabs />

        {/* Biens vedettes */}
        {featured.length > 0 && (
          <section className="mx-auto w-full max-w-[1280px] px-4 pt-14 md:px-6 md:pt-20">
            <Reveal>
              <h2 className="font-display text-2xl leading-tight font-bold tracking-tight text-foreground md:text-[30px]">
                Appartements à découvrir
              </h2>
            </Reveal>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((listing, i) => (
                <Reveal key={listing.slug || listing.id} as="li" delay={Math.min(i, 5) * 70}>
                  <CompactCard listing={listing} />
                </Reveal>
              ))}
            </ul>
          </section>
        )}

        {/* Trust */}
        <section className="mx-auto w-full max-w-[1280px] px-4 pt-14 md:px-6 md:pt-20">
          <Reveal className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="grid lg:grid-cols-[1fr_1.1fr]">
              <div className="group relative min-h-[240px] overflow-hidden">
                <Image
                src="/images/salon-interieur.png"
                alt="Salon lumineux d'un appartement à louer"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </div>

              <div className="p-6 md:p-10">
                <h2 className="font-display text-2xl leading-tight font-semibold tracking-tight text-balance text-foreground md:text-[32px]">
                  Louer en toute confiance
                </h2>
                <ul className="mt-8 flex flex-col gap-7">
                  {trust.map((item, i) => (
                    <Reveal as="li" key={item.title} delay={120 + i * 110} className="flex gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-foreground">
                        <item.icon className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-[1280px] px-4 pt-16 md:px-6 md:pt-24">
          <Reveal className="flex flex-col items-start gap-6 rounded-2xl bg-primary p-8 text-primary-foreground md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl leading-tight font-semibold tracking-tight text-balance md:text-[32px]">
                Vous avez un appartement à louer ?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
                Publiez votre annonce, définissez les disponibilités et échangez avec des locataires qualifiés depuis un seul espace.
              </p>
            </div>
            <Link
              href="/publier"
              className={cn(
                buttonVariants({ variant: 'secondary' }),
                'group h-12 shrink-0 gap-2 rounded-full px-6 font-semibold',
              )}
            >
              Commencer
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
