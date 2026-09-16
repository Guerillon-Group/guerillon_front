import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, FileCheck2, Handshake, ShieldCheck } from 'lucide-react'

import { BrowseTabs } from '@/components/home/browse-tabs'
import { CompactCard } from '@/components/home/compact-card'
import { HeroSearch } from '@/components/home/hero-search'
import { Reveal } from '@/components/reveal'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { propertyService } from '@/services/property.service'

const stats = [
  { value: '1 240+', label: 'Annonces vérifiées' },
  { value: '86', label: 'Agents certifiés' },
  { value: '3 villes', label: 'Goma · Bukavu · Kinshasa' },
  { value: '48 h', label: 'Délai moyen de réponse' },
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

export default async function HomePage() {
  const featuredResponse = await propertyService.getProperties({ per_page: 6, featured: true })
  const featured = featuredResponse.data?.data || []

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="border-b border-emerald-900/10 bg-[#16381e] text-white">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-center gap-2 px-3 py-1.5 text-center md:px-6">
          <span className="live-dot size-1.5 shrink-0 rounded-full bg-[#c5a059]" aria-hidden="true" />
          <Link
            href="/publier"
            className="text-xs font-semibold text-emerald-50 hover:text-[#c5a059] transition-colors truncate max-w-full"
          >
            <span className="md:hidden">MBIYO REAL-ESTATE — Immobilier d&apos;exception.</span>
            <span className="hidden md:inline">MBIYO REAL-ESTATE — Publiez votre bien ou projet d&apos;exception et touchez des investisseurs qualifiés.</span>
          </Link>
        </div>
      </div>

      <SiteHeader />

      <main>
        {/* Hero : recherche centrée */}
        <section className="mx-auto w-full max-w-[1280px] px-4 pt-6 md:px-6 md:pt-12">
          <div className="mx-auto max-w-[980px] text-center">
            <p className="animate-in fill-mode-backwards inline-flex items-center justify-center gap-1.5 rounded-full border border-[#16381e]/20 bg-[#16381e]/5 px-3 py-1 text-[11px] sm:text-xs font-semibold text-[#16381e] max-w-full text-center duration-500 fade-in slide-in-from-bottom-2">
              <ShieldCheck className="size-3.5 shrink-0 text-[#c5a059]" aria-hidden="true" />
              <span>Titres fonciers vérifiés & accompagnement certifié</span>
            </p>
            <h1
              style={{ animationDelay: '90ms' }}
              className="animate-in fill-mode-backwards mt-5 font-display text-2xl sm:text-3xl leading-[1.1] font-extrabold tracking-tight text-balance text-[#16381e] duration-700 fade-in slide-in-from-bottom-4 md:text-[46px]"
            >
              L&apos;Immobilier d&apos;Exception en Afrique.
            </h1>
            <p
              style={{ animationDelay: '180ms' }}
              className="animate-in fill-mode-backwards mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground duration-700 fade-in slide-in-from-bottom-4"
            >
              Trouvez des résidences de prestige, villas, appartements et terrains sécurisés avec titre foncier garanti par MBIYO REAL-ESTATE.
            </p>
          </div>

          <div
            style={{ animationDelay: '280ms' }}
            className="animate-in fill-mode-backwards mx-auto mt-7 max-w-[1060px] duration-700 fade-in slide-in-from-bottom-6"
          >
            <HeroSearch />
          </div>

          <dl
            style={{ animationDelay: '400ms' }}
            className="animate-in fill-mode-backwards mx-auto mt-8 flex max-w-[860px] flex-wrap items-center justify-center gap-x-10 gap-y-4 duration-700 fade-in"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-2xl font-bold tracking-tight text-foreground">{stat.value}</dd>
                <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </dl>
        </section>

        {/* Onglets + rail principal */}
        <BrowseTabs />

        {/* Biens vedettes */}
        {featured.length > 0 && (
          <section className="mx-auto w-full max-w-[1280px] px-4 pt-14 md:px-6 md:pt-20">
            <Reveal>
              <h2 className="font-display text-2xl leading-tight font-bold tracking-tight text-foreground md:text-[30px]">
                Sélection du moment
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
                  src="/images/kinshasa-skyline.png"
                  alt="Vue aérienne de Kinshasa au crépuscule avec le fleuve Congo"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </div>

              <div className="p-6 md:p-10">
                <h2 className="font-display text-2xl leading-tight font-semibold tracking-tight text-balance text-foreground md:text-[32px]">
                  Acheter sans mauvaise surprise
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
                Vous avez un bien à vendre ou à louer ?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
                Publiez en dix minutes, recevez vos premières demandes sous 48 h. Vérification du titre incluse.
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