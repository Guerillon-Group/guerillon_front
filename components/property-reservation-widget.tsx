'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BadgeCheck, Calculator, HelpCircle, Mail, MessageCircle, Phone, ShieldCheck, Sparkles, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatPrice, type Listing } from '@/lib/properties'

export function PropertyReservationWidget({ listing }: { listing: Listing }) {
  const router = useRouter()
  const [calcOpen, setCalcOpen] = useState(false)
  const [deposit, setDeposit] = useState(20)
  const [years, setYears] = useState(15)
  const rate = 8.5 // 8.5% annual rate

  const isRental = listing.status === 'À louer' || listing.period === 'mois' || Boolean(listing.period)
  const price = listing.price || 0
  const loanAmount = price * (1 - deposit / 100)
  const monthlyRate = rate / 100 / 12
  const totalMonths = years * 12
  const monthlyPayment =
    loanAmount > 0
      ? Math.round((loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths)))
      : 0

  return (
    <aside id="reserver" className="flex flex-col gap-6 scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
      {/* Top Box: Price & Main Action */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-xl shadow-black/5">
        {/* Top Tag Badge */}
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
            <ShieldCheck className="size-3.5" />
            Titre vérifié MBIYO
          </span>
          {listing.verified && (
            <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Coup de cœur
            </span>
          )}
        </div>

        {/* Title / Reference */}
        <p className="text-xs font-medium text-muted-foreground">
          Réf : <span className="font-semibold text-foreground">MB-{listing.id?.slice(0, 6).toUpperCase() || '84920'}</span>
        </p>

        {/* Price Display Box */}
        <div className="mt-3 rounded-2xl bg-secondary/50 p-4 border border-border/60">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl font-extrabold text-foreground tracking-tight">
              {formatPrice(listing)}
            </span>
            {listing.period && <span className="text-xs font-semibold text-muted-foreground">/{listing.period}</span>}
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-2">
            <span>Prix hors frais de notaire</span>
            <span className="flex items-center gap-1 font-semibold text-foreground">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {typeof listing.rating === 'number' ? listing.rating.toFixed(1) : (listing.rating ?? '4.9')} ({listing.reviews || 24} avis)
            </span>
          </div>
        </div>

        {/* Primary & Secondary Action Stack */}
        <div className="mt-5 flex flex-col gap-2.5">
          <Button
            onClick={() => router.push(`/biens/${listing.slug}/reservation`)}
            className="h-12 w-full rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] bg-primary text-primary-foreground"
          >
            {isRental ? 'Odeslat poptávku / Réserver' : 'Demander le dossier complet'}
          </Button>

          {/* Calculator Modal Trigger */}
          <Dialog open={calcOpen} onOpenChange={setCalcOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-2xl text-xs font-bold uppercase tracking-wider border-border/80 text-foreground hover:bg-secondary"
                >
                  <Calculator className="mr-2 size-4 text-primary" />
                  Calculateur de crédit
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[440px] rounded-3xl p-6">
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-bold text-foreground">
                  Simulateur de financement
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 flex flex-col gap-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Apport personnel ({deposit}%)</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full mt-2 accent-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Durée de l&apos;emprunt ({years} ans)</label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full mt-2 accent-primary"
                  />
                </div>

                <div className="mt-2 rounded-2xl bg-secondary/80 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Mensualité estimée</p>
                  <p className="font-display text-2xl font-bold text-primary mt-1">{monthlyPayment} $/mois</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Taux d&apos;intérêt estimé : 8,5% / an</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <p className="text-center text-[11px] text-muted-foreground">
            Aucun engagement ni frais requis avant la signature officielle.
          </p>
        </div>
      </div>

      {/* Bottom Box: Agent Contact Card ("Máte dotaz?" / "Une question ?") */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-lg shadow-black/5">
        <div className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <HelpCircle className="size-5 text-primary" />
          Une question ?
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Notre agent spécialisé est à votre disposition pour cette propriété.
        </p>

        {/* Agent Info */}
        <div className="mt-5 flex items-center gap-3.5 border-t border-border/60 pt-4">
          <Image
            src={listing.agent?.avatar || '/placeholder.svg'}
            alt={`Portrait de ${listing.agent?.name}`}
            width={96}
            height={96}
            className="size-14 rounded-2xl object-cover ring-2 ring-border/80 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-bold text-foreground">{listing.agent?.name}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <BadgeCheck className="size-3.5 text-primary shrink-0" aria-hidden="true" />
              {listing.agent?.role || 'Agent Immobilier Certifié'}
            </p>
            <p className="text-[11px] text-muted-foreground">{listing.agent?.agency || 'MBIYO Real Estate'}</p>
          </div>
        </div>

        {/* Contact Links Stack */}
        <div className="mt-4 flex flex-col gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <a
            href="tel:+243810000000"
            className="flex items-center gap-2.5 font-medium hover:text-foreground transition-colors"
          >
            <Phone className="size-4 text-primary shrink-0" />
            +243 810 000 000
          </a>
          <a
            href={`mailto:${listing.agent?.name.toLowerCase().replace(/\s+/g, '.')}@mbiyo.com`}
            className="flex items-center gap-2.5 font-medium hover:text-foreground transition-colors truncate"
          >
            <Mail className="size-4 text-primary shrink-0" />
            contact@mbiyo-realestate.com
          </a>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-2">
          <Button
            nativeButton={false}
            render={
              <a href="tel:+243810000000" />
            }
            variant="outline"
            className="h-10 flex-1 rounded-xl text-xs font-semibold border-border"
          >
            <Phone className="mr-1.5 size-3.5 text-primary" />
            Appeler
          </Button>
          <Button
            nativeButton={false}
            render={
              <a href="https://wa.me/243810000000" target="_blank" rel="noopener noreferrer" />
            }
            className="h-10 flex-1 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <MessageCircle className="mr-1.5 size-3.5" />
            WhatsApp
          </Button>
        </div>
      </div>
    </aside>
  )
}

