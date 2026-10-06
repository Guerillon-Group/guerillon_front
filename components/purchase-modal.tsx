'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Key,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react'

import { AuthModal } from '@/components/auth/auth-modal'
import { BookingLottieIcon } from '@/components/booking-lottie-icon'
import { Button } from '@/components/ui/button'
import { formatPrice, type Listing } from '@/lib/properties'
import { cn } from '@/lib/utils'
import { bookingService } from '@/services/booking.service'
import { useAuthStore } from '@/stores/useAuthStore'
import type { BookingData, PriceBreakdown } from '@/types/booking.types'

interface PurchaseModalProps {
  listing: Listing
  variant?: 'modal' | 'page'
  isOpen?: boolean
  onClose?: () => void
}

type ModalStep = 'dates' | 'price' | 'pending' | 'confirmed' | 'completed' | 'cancelled'

const purchaseSteps = [
  { id: 'dates', label: "Offre d'achat", hint: 'Acquéreur & Montant' },
  { id: 'price', label: 'Dossier & Devis', hint: 'Récapitulatif des frais' },
  { id: 'pending', label: "Option d'achat", hint: 'Acompte de réservation' },
  { id: 'confirmed', label: 'Vente validée', hint: 'Transmission notariée' },
] as const

function getStepIndex(step: ModalStep) {
  if (step === 'dates') return 0
  if (step === 'price') return 1
  if (step === 'pending') return 2
  return 3
}

function isUuid(value?: string) {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value))
}

function getApiErrorMessage(error: any, fallback: string) {
  const data = error?.response?.data
  const fieldErrors = data?.errors
    ? Object.values(data.errors).flat().filter((message): message is string => typeof message === 'string')
    : []

  return fieldErrors[0] || data?.message || error?.message || fallback
}

export function PurchaseModal({ listing, variant = 'modal', isOpen = true, onClose }: PurchaseModalProps) {
  const { user, isAuthenticated } = useAuthStore()
  const [authError, setAuthError] = useState(false)

  // Dates & Offre
  const todayStr = new Date().toISOString().split('T')[0]
  const defaultOptionDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  const defaultClosingDate = new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]

  const [optionDate, setOptionDate] = useState(defaultOptionDate)
  const [offerPrice, setOfferPrice] = useState<number>(listing.price || 0)
  const [notes, setNotes] = useState('')

  // Steps & Async states
  const [step, setStep] = useState<ModalStep>('dates')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [booking, setBooking] = useState<BookingData | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setStep('dates')
      setLoading(false)
      setErrorMessage(null)
      setSuccessMessage(null)
      setBooking(null)
    }
  }, [isOpen])

  if (variant === 'modal' && !isOpen) return null

  // 1. Soumettre l'offre d'achat
  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    const bookingRef = `ACH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    const resolvedOwnerId = listing.ownerId || listing.agentId || user?.id

    try {
      const res = await bookingService.createBooking({
        booking_reference: bookingRef,
        property_id: listing.id as string,
        client_id: user?.id as string,
        owner_id: resolvedOwnerId as string,
        check_in_date: optionDate,
        check_out_date: defaultClosingDate,
        guest_count: 1,
        total_price: offerPrice || listing.price,
      })

      if (!res.data || !isUuid(res.data.id)) {
        throw new Error('Le dossier d’achat créé ne contient pas un identifiant valide.')
      }

      setBooking(res.data)
      setStep('price')
      setSuccessMessage('Offre d’achat et option de réservation enregistrées avec succès !')
    } catch (err: any) {
      if (err.response?.status === 401) {
        setAuthError(true)
        setErrorMessage('Connexion requise : veuillez vous connecter pour soumettre votre offre d’achat.')
      } else {
        setErrorMessage(getApiErrorMessage(err, 'L’offre d’achat n’a pas pu être soumise.'))
      }
    } finally {
      setLoading(false)
    }
  }

  // 2. Valider le devis & passer à l'acompte
  const handleProceedToDeposit = () => {
    setStep('pending')
  }

  // 3. Confirmer l'acompte d'option
  const handleConfirmDeposit = async () => {
    if (!booking || !isUuid(booking.id)) {
      setErrorMessage('Dossier d’achat introuvable.')
      return
    }
    setLoading(true)
    setErrorMessage(null)

    try {
      const res = await bookingService.confirmPayment(booking.id)
      if (!res.data) throw new Error('Aucun retour de confirmation d’option.')
      setBooking(res.data)
      setStep('confirmed')
      setSuccessMessage('Option d’achat confirmée ! Le bien a été retenu et passe en procédure notariée.')
    } catch (err: any) {
      if (err.response?.status === 401) {
        setAuthError(true)
        setErrorMessage('Authentification requise : Veuillez vous connecter pour valider le paiement.')
      } else {
        setErrorMessage(getApiErrorMessage(err, 'L’option d’achat n’a pas pu être validée.'))
      }
    } finally {
      setLoading(false)
    }
  }

  const currentStepIndex = getStepIndex(step)
  const notaryFees = Math.round((offerPrice || listing.price) * 0.05) // 5% frais notariés estimés
  const totalPriceWithFees = (offerPrice || listing.price) + notaryFees

  return (
    <div
      className={cn(
        'flex w-full justify-center',
        variant === 'modal'
          ? 'fixed inset-0 z-50 items-center bg-background/80 p-4 backdrop-blur-md transition-all'
          : 'min-h-[calc(100dvh-5rem)] items-start bg-[#f6f8f3] px-4 py-8 sm:px-6 md:py-12',
      )}
    >
      <div
        className={cn(
          'relative w-full max-w-3xl overflow-hidden border border-[#16381e]/10 bg-card transition-all',
          variant === 'modal' ? 'rounded-[28px] shadow-2xl' : 'rounded-[32px] shadow-[0_24px_70px_rgba(22,56,30,0.12)]',
        )}
      >
        {/* En-tête du parcours de Vente */}
        <div className="relative overflow-hidden bg-[#16381e] px-5 py-6 text-white sm:px-8 sm:py-7">
          <div className="pointer-events-none absolute -right-7 -top-9 size-40 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-16 right-24 size-40 rounded-full bg-[#c5a059]/15 blur-2xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <BookingLottieIcon tone="gold" className="absolute size-11 opacity-70" />
                <FileText className="relative size-5 text-[#f6d79b]" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-[#f6d79b] uppercase">
                  Acquisition Immobilière — Vente
                </p>
                <h3 className="mt-1 font-display text-xl font-bold tracking-tight">
                  Formuler votre offre d&apos;achat
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/65">
                  <MapPin className="size-3.5" /> {listing.district}, {listing.city}
                </p>
              </div>
            </div>
            {variant === 'page' ? (
              <Link
                href={`/biens/${listing.slug}`}
                className="shrink-0 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
              >
                Retour
              </Link>
            ) : (
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer le module d'achat"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progression du parcours (Stepper Achat) */}
        <div className="border-b border-[#16381e]/10 bg-white px-5 pt-5 pb-4 sm:px-8">
          <ol className="grid grid-cols-4 gap-2" aria-label="Étapes d'achat">
            {purchaseSteps.map((item, index) => {
              const isCurrent = index === currentStepIndex
              const isComplete = index < currentStepIndex
              return (
                <li key={item.id} className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-xs transition-colors',
                        isCurrent
                          ? 'font-extrabold text-[#16381e]'
                          : isComplete
                            ? 'font-bold text-[#16381e]/80'
                            : 'font-medium text-muted-foreground/60',
                      )}
                    >
                      {index + 1}.
                    </span>
                    <span
                      className={cn(
                        'truncate text-xs transition-colors',
                        isCurrent
                          ? 'font-bold text-[#16381e]'
                          : isComplete
                            ? 'font-semibold text-[#16381e]/80'
                            : 'font-medium text-muted-foreground/60',
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                  <p className="hidden truncate text-[11px] text-muted-foreground/60 sm:block pl-3.5 mt-0.5">
                    {item.hint}
                  </p>
                </li>
              )
            })}
          </ol>

          <div className="relative mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-[#eef2ec]">
            <div
              className="h-full rounded-full bg-[#16381e] transition-all duration-300 ease-in-out"
              style={{
                width: `${((currentStepIndex + 1) / purchaseSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Contenu principal */}
        <div className={cn('p-5 sm:p-8', variant === 'modal' && 'max-h-[80vh] overflow-y-auto')}>
          {(authError || !isAuthenticated) && (
            <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-amber-500/10 p-4 text-xs border border-amber-500/20 text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-3">
                <Lock className="size-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold text-xs uppercase tracking-wider">Connexion requise</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Vous devez être connecté pour déposer une offre d&apos;achat officielle.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="shrink-0 rounded-xl bg-amber-600 px-4 py-2 font-bold text-white hover:bg-amber-700 transition-colors"
              >
                Se connecter →
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl bg-destructive/10 p-3.5 text-xs text-destructive border border-destructive/20">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl bg-emerald-500/10 p-3.5 text-xs text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ÉTAPE 1 : OFFRE D'ACHAT */}
          {step === 'dates' && (
            <form onSubmit={handleCreateOffer} className="flex flex-col gap-6">
              <div className="rounded-2xl border border-border/80 bg-secondary/30 p-5">
                <h4 className="font-display text-base font-bold text-foreground">{listing.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Réf : MB-{listing.id?.slice(0, 6).toUpperCase() || '84920'} · Prix affiché :{' '}
                  <span className="font-bold text-foreground">{formatPrice(listing)}</span>
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-foreground">Montant de votre offre d&apos;achat ($)</label>
                  <input
                    type="number"
                    min={1000}
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-bold text-foreground shadow-sm focus:border-primary focus:outline-none"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Vous pouvez proposer le prix affiché ou soumettre une contre-proposition.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground">Date limite de réponse du vendeur</label>
                  <input
                    type="date"
                    min={todayStr}
                    value={optionDate}
                    onChange={(e) => setOptionDate(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-sm focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Conditions particulières ou remarques (Optionnel)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Exemple : Offre sous condition d'obtention de prêt ou de vérification du titre foncier..."
                  className="mt-2 w-full rounded-2xl border border-border bg-background p-3 text-xs text-foreground shadow-sm focus:border-primary focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-2xl font-bold text-xs uppercase tracking-wider bg-primary text-primary-foreground shadow-md hover:scale-[1.01]"
              >
                {loading ? 'Envoi de l’offre...' : 'Soumettre mon offre d’achat →'}
              </Button>
            </form>
          )}

          {/* ÉTAPE 2 : DOSSIER & DEVIS */}
          {step === 'price' && (
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
                <h4 className="font-display text-lg font-bold text-foreground">Décompte estimatif de la transaction</h4>
                <div className="mt-4 flex flex-col gap-3 text-xs">
                  <div className="flex justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground">Montant de l&apos;offre de cession</span>
                    <span className="font-bold text-foreground">{offerPrice} $</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground">Frais notariés & enregistrement foncier (est. 5%)</span>
                    <span className="font-bold text-foreground">+{notaryFees} $</span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-extrabold text-foreground">
                    <span>Total estimé de l&apos;acquisition</span>
                    <span className="text-primary">{totalPriceWithFees} $</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleProceedToDeposit}
                className="h-12 w-full rounded-2xl font-bold text-xs uppercase tracking-wider bg-primary text-primary-foreground shadow-md"
              >
                Bloquer l&apos;option de réservation ($) →
              </Button>
            </div>
          )}

          {/* ÉTAPE 3 : OPTION D'ACHAT (PAYMENT / RESERVATION) */}
          {step === 'pending' && (
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-border/80 bg-card p-6 text-center">
                <ShieldCheck className="mx-auto size-10 text-primary" />
                <h4 className="font-display text-lg font-bold text-foreground mt-3">Option d&apos;achat & Séquestre</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                  En confirmant l&apos;acompte d&apos;option, le logement est temporairement réservé et retiré des visites publiques.
                </p>
              </div>

              <Button
                onClick={handleConfirmDeposit}
                disabled={loading}
                className="h-12 w-full rounded-2xl font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              >
                {loading ? 'Validation en cours...' : 'Valider l’option d’achat ($)'}
              </Button>
            </div>
          )}

          {/* ÉTAPE 4 : VENTE VALIDÉE */}
          {(step === 'confirmed' || step === 'completed') && (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="size-10" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">Offre & Option d&apos;achat confirmées !</h3>
              <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
                Votre option a été verrouillée avec succès. Notre cabinet notarial partenaire contactera l&apos;acheteur et le vendeur pour la signature finale du Titre Foncier.
              </p>
              <div className="mt-2 rounded-2xl bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                Statut du bien : Réservé pour Vente (Passe au statut `sold` après notaire).
              </div>
              <Link
                href={`/biens/${listing.slug}`}
                className="mt-4 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-md"
              >
                Retour à la fiche du bien
              </Link>
            </div>
          )}
        </div>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  )
}
