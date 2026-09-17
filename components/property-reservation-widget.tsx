'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BadgeCheck, Phone, Sparkles, Star } from 'lucide-react'

import { BookingModal } from '@/components/booking-modal'
import { Button } from '@/components/ui/button'
import { formatPrice, type Listing } from '@/lib/properties'

export function PropertyReservationWidget({ listing }: { listing: Listing }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isRental = listing.status === 'À louer' || listing.period === 'mois' || Boolean(listing.period)

  return (
    <>
      <aside id="reserver" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5 transition-all">
          {/* Badge rare find / coup de coeur */}
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
              <span>{typeof listing.rating === 'number' ? listing.rating.toFixed(1) : (listing.rating ?? '—')}</span>
              <span className="text-muted-foreground">({listing.reviews})</span>
            </div>
          </div>

          {/* Action principale Réserver */}
          <div className="mt-5 flex flex-col gap-3">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-12 w-full rounded-2xl font-bold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] bg-primary text-primary-foreground"
            >
              {isRental ? '⚡ Lancer le Cursus de Réservation' : 'Demander un dossier d\'achat'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              {isRental
                ? 'Vérification dispo, calcul TTC, timer 15 min & paiement en ligne.'
                : 'Aucun paiement n\'est exigé pour planifier une visite.'}
            </p>
          </div>

          {/* Profil Agent */}
          <div className="mt-6 border-t border-border pt-6">
            <div className="flex items-center gap-3.5">
              <Image
                src={listing.agent?.avatar || '/placeholder.svg'}
                alt={`Portrait de ${listing.agent?.name}`}
                width={96}
                height={96}
                className="size-12 rounded-full object-cover ring-2 ring-border"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{listing.agent?.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <BadgeCheck className="size-3.5 text-primary" aria-hidden="true" />
                  {listing.agent?.role} · {listing.agent?.agency}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="h-10 flex-1 rounded-xl text-xs font-semibold border-border">
                <Phone className="mr-1.5 size-3.5" />
                Appeler
              </Button>
              <Button variant="secondary" className="h-10 flex-1 rounded-xl text-xs font-semibold">
                Message
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Modal de Cursus de Réservation Complexe */}
      <BookingModal listing={listing} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
