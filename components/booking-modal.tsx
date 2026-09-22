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
  CreditCard,
  Key,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react'

import { formatPrice, type Listing } from '@/lib/properties'
import { cn } from '@/lib/utils'
import { bookingService } from '@/services/booking.service'
import { useAuthStore } from '@/stores/useAuthStore'
import type { BookingData, PriceBreakdown } from '@/types/booking.types'
import { Button } from '@/components/ui/button'
import { AuthModal } from '@/components/auth/auth-modal'
import { BookingLottieIcon } from '@/components/booking-lottie-icon'

interface BookingModalProps {
  listing: Listing
  /** `page` displays the flow in the dedicated reservation route. */
  variant?: 'modal' | 'page'
  isOpen?: boolean
  onClose?: () => void
}

type ModalStep = 'dates' | 'price' | 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'expired'

const bookingSteps = [
  { id: 'dates', label: 'Votre séjour', hint: 'Dates et voyageurs' },
  { id: 'price', label: 'Votre devis', hint: 'Montant détaillé' },
  { id: 'pending', label: 'Votre option', hint: 'Paiement sécurisé' },
  { id: 'confirmed', label: 'Votre arrivée', hint: 'Séjour confirmé' },
] as const

function getStepIndex(step: ModalStep) {
  if (step === 'dates') return 0
  if (step === 'price') return 1
  if (step === 'pending') return 2
  return 3
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isUuid(value?: string) {
  return Boolean(value && UUID_PATTERN.test(value))
}

function getApiErrorMessage(error: any, fallback: string) {
  const data = error?.response?.data
  const fieldErrors = data?.errors
    ? Object.values(data.errors).flat().filter((message): message is string => typeof message === 'string')
    : []

  return fieldErrors[0] || data?.message || error?.message || fallback
}

export function BookingModal({ listing, variant = 'modal', isOpen = true, onClose }: BookingModalProps) {
  const { user, isAuthenticated } = useAuthStore()
  const [authError, setAuthError] = useState(false)

  // Input states
  const todayStr = new Date().toISOString().split('T')[0]
  const defaultCheckIn = new Date(Date.now() + 86400000).toISOString().split('T')[0]
  const defaultCheckOut = new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0]

  const [checkInDate, setCheckInDate] = useState(defaultCheckIn)
  const [checkOutDate, setCheckOutDate] = useState(defaultCheckOut)
  const [guestCount, setGuestCount] = useState(2)

  // Status & Async states
  const [step, setStep] = useState<ModalStep>('dates')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // API Data
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null)
  const [booking, setBooking] = useState<BookingData | null>(null)

  // Timer 15 min state
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60) // 15 min en secondes
  const [cancellationReason, setCancellationReason] = useState('')
  const [showCancelInput, setShowCancelInput] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  // Reset state on open/close
  useEffect(() => {
    if (!isOpen) {
      setStep('dates')
      setLoading(false)
      setErrorMessage(null)
      setSuccessMessage(null)
      setPriceBreakdown(null)
      setBooking(null)
      setTimeLeft(15 * 60)
      setShowCancelInput(false)
    }
  }, [isOpen])

  // Timer countdown hook for Pending state
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (step === 'pending' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStep('expired')
            setErrorMessage('Le délai de 15 minutes est expiré. Les dates ont été libérées.')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [step, timeLeft])

  if (variant === 'modal' && !isOpen) return null

  // 1. Check Availability
  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const res = await bookingService.checkAvailability({
        property_id: listing.id as string,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      })

      if (res.is_available) {
        // Avancer au calcul de prix
        await handleCalculatePrice()
      } else {
        setErrorMessage(res.message || 'Le logement n\'est pas disponible pour ces dates.')
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setAuthError(true)
        setErrorMessage('Authentification requise (Erreur HTTP 401) : Veuillez vous connecter à votre compte pour réserver ce logement.')
      } else {
        console.warn('Check availability endpoint error:', err)
      }
      await handleCalculatePrice()
    } finally {
      setLoading(false)
    }
  }

  // 2. Calculate Price
  const handleCalculatePrice = async () => {
    setLoading(true)
    setErrorMessage(null)

    try {
      const res = await bookingService.calculatePrice({
        property_id: listing.id as string,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        guest_count: guestCount,
      })

      if (res.success && res.data) {
        setPriceBreakdown(res.data)
      } else {
        fallbackPriceBreakdown()
      }
      setStep('price')
    } catch (err: any) {
      if (err.response?.status === 401) {
        setAuthError(true)
        setErrorMessage('Authentification requise (Erreur HTTP 401) : Veuillez vous connecter à votre compte pour réserver ce logement.')
      } else {
        console.warn('Calculate price fallback:', err)
      }
      fallbackPriceBreakdown()
      setStep('price')
    } finally {
      setLoading(false)
    }
  }

  const fallbackPriceBreakdown = () => {
    const start = new Date(checkInDate)
    const end = new Date(checkOutDate)
    const nightCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)))
    const basePrice = listing.price || 100
    const nightsTotal = nightCount * basePrice
    const cleaningFee = 30
    const securityDeposit = 150
    const extraGuestFee = guestCount > 2 ? (guestCount - 2) * 20 : 0
    const subtotal = nightsTotal + cleaningFee + extraGuestFee
    const serviceFee = Math.round(subtotal * 0.05 * 100) / 100
    const totalPrice = subtotal + serviceFee

    setPriceBreakdown({
      night_count: nightCount,
      base_price_per_night: basePrice,
      daily_breakdown: Array.from({ length: nightCount }).map((_, i) => {
        const d = new Date(start)
        d.setDate(d.getDate() + i)
        return { date: d.toISOString().split('T')[0], price: basePrice, is_custom: false }
      }),
      nights_total: nightsTotal,
      cleaning_fee: cleaningFee,
      security_deposit: securityDeposit,
      extra_guest_fee: extraGuestFee,
      subtotal,
      service_fee: serviceFee,
      total_price: totalPrice,
      currency_id: listing.currency || 'USD',
    })
  }

  // 3. Create Pending Booking
  const handleCreateBooking = async () => {
    setLoading(true)
    setErrorMessage(null)

    if (!isAuthenticated || !isUuid(user?.id)) {
      setAuthError(true)
      setErrorMessage('Connexion requise : votre compte client doit disposer d’un identifiant valide pour réserver.')
      setLoading(false)
      return
    }

    // if (!isUuid(listing.id) || !isUuid(listing.ownerId)) {
    //   setErrorMessage('Impossible de réserver ce bien : les identifiants du bien ou du propriétaire sont absents ou invalides.')
    //   setLoading(false)
    //   return
    // }

    const bookingRef = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    const totalPrice = priceBreakdown ? priceBreakdown.total_price : listing.price

    try {
      const res = await bookingService.createBooking({
        booking_reference: bookingRef,
        property_id: listing.id as string,
        client_id: user?.id as string,
        owner_id: listing.ownerId as string,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        guest_count: guestCount,
        total_price: totalPrice,
      })

      if (!res.data || !isUuid(res.data.id)) {
        throw new Error('La réservation créée ne contient pas un identifiant UUID valide.')
      }

      setBooking(res.data)
      setTimeLeft(15 * 60)
      setStep('pending')
      setSuccessMessage('Réservation temporaire créée ! Bloquée pendant 15 minutes.')
    } catch (err: any) {
      if (err.response?.status === 401) {
        setAuthError(true)
        setErrorMessage('Authentification requise : veuillez vous connecter pour enregistrer la réservation.')
      } else {
        setErrorMessage(getApiErrorMessage(err, 'La réservation n’a pas pu être créée.'))
      }
    } finally {
      setLoading(false)
    }
  }

  // 4. Confirm Payment
  const handleConfirmPayment = async () => {
    if (!booking || !isUuid(booking.id)) {
      setErrorMessage('Identifiant de réservation invalide. Créez une nouvelle réservation avant de poursuivre.')
      return
    }
    setLoading(true)
    setErrorMessage(null)

    try {
      const res = await bookingService.confirmPayment(booking.id)
      if (!res.data) throw new Error('La confirmation de paiement ne contient aucune réservation.')
      setBooking(res.data)
      setStep('confirmed')
      setSuccessMessage('Paiement confirmé avec succès ! Votre séjour est validé.')
    } catch (err: any) {
      if (err.response?.status === 401) {
        setAuthError(true)
        setErrorMessage('Authentification requise (Erreur HTTP 401) : Veuillez vous connecter pour confirmer le paiement.')
      } else {
        setErrorMessage(getApiErrorMessage(err, 'Le paiement n’a pas pu être confirmé.'))
      }
    } finally {
      setLoading(false)
    }
  }

  // 5. Check-in
  const handleCheckIn = async () => {
    if (!booking || !isUuid(booking.id)) {
      setErrorMessage('Identifiant de réservation invalide.')
      return
    }
    setLoading(true)

    try {
      const res = await bookingService.checkIn(booking.id)
      if (!res.data) throw new Error('La réponse de check-in est incomplète.')
      setBooking(res.data)
      setStep('checked_in')
      setSuccessMessage('Check-in effectué avec succès ! Bon séjour dans le logement.')
    } catch (err: any) {
      setErrorMessage(getApiErrorMessage(err, 'Le check-in n’a pas pu être effectué.'))
    } finally {
      setLoading(false)
    }
  }

  // 6. Check-out
  const handleCheckOut = async () => {
    if (!booking || !isUuid(booking.id)) {
      setErrorMessage('Identifiant de réservation invalide.')
      return
    }
    setLoading(true)

    try {
      const res = await bookingService.checkOut(booking.id)
      if (!res.data) throw new Error('La réponse de check-out est incomplète.')
      setBooking(res.data)
      setStep('completed')
      setSuccessMessage('Check-out effectué. Séjour clôturé avec succès et avis débloqué !')
    } catch (err: any) {
      setErrorMessage(getApiErrorMessage(err, 'Le check-out n’a pas pu être effectué.'))
    } finally {
      setLoading(false)
    }
  }

  // 7. Cancel
  const handleCancelBooking = async () => {
    if (!booking || !isUuid(booking.id)) {
      setErrorMessage('Identifiant de réservation invalide.')
      return
    }
    setLoading(true)

    try {
      const res = await bookingService.cancelBooking(booking.id, cancellationReason)
      if (!res.data) throw new Error('La réponse d’annulation est incomplète.')
      setBooking(res.data)
      setStep('cancelled')
      setErrorMessage('La réservation a été annulée. Les dates ont été libérées.')
    } catch (err: any) {
      setErrorMessage(getApiErrorMessage(err, 'La réservation n’a pas pu être annulée.'))
    } finally {
      setLoading(false)
      setShowCancelInput(false)
    }
  }

  // Format timer seconds into mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentStepIndex = getStepIndex(step)

  return (
    <div
      className={cn(
        'flex w-full justify-center',
        variant === 'modal'
          ? 'fixed inset-0 z-50 items-center bg-background/80 p-4 backdrop-blur-md transition-all'
          : 'min-h-[calc(100dvh-5rem)] items-start bg-[#f6f8f3] px-4 py-8 sm:px-6 md:py-12',
      )}
    >
      <div className={cn(
        'relative w-full max-w-3xl overflow-hidden border border-[#16381e]/10 bg-card transition-all',
        variant === 'modal' ? 'rounded-[28px] shadow-2xl' : 'rounded-[32px] shadow-[0_24px_70px_rgba(22,56,30,0.12)]',
      )}>
        {/* En-tête du parcours */}
        <div className="relative overflow-hidden bg-[#16381e] px-5 py-6 text-white sm:px-8 sm:py-7">
          <div className="pointer-events-none absolute -right-7 -top-9 size-40 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-16 right-24 size-40 rounded-full bg-[#c5a059]/15 blur-2xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <BookingLottieIcon tone="gold" className="absolute size-11 opacity-70" />
                <Calendar className="relative size-5 text-[#f6d79b]" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-[#f6d79b] uppercase">Réservation à Goma</p>
                <h3 className="mt-1 font-display text-xl font-bold tracking-tight">Votre séjour, en toute clarté.</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/65"><MapPin className="size-3.5" /> {listing.district}, {listing.city}</p>
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
              aria-label="Fermer la réservation"
              className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        </div>

        {/* Progression du parcours */}
        <div className="border-b border-[#16381e]/10 bg-white px-5 py-4 sm:px-8">
          <ol className="grid grid-cols-4 gap-2" aria-label="Étapes de réservation">
            {bookingSteps.map((item, index) => {
              const isCurrent = index === currentStepIndex
              const isComplete = index < currentStepIndex
              return (
                <li key={item.id} className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                      isComplete ? 'bg-[#16381e] text-white' : isCurrent ? 'bg-[#c5a059] text-[#16381e]' : 'bg-[#eef2ec] text-[#7a857b]',
                    )}>
                      {isComplete ? <Check className="size-3.5" /> : index + 1}
                    </span>
                    {index < bookingSteps.length - 1 && <span className={cn('hidden h-px flex-1 sm:block', isComplete ? 'bg-[#16381e]' : 'bg-[#dce3da]')} />}
                  </div>
                  <p className={cn('mt-2 truncate text-[11px] font-bold sm:text-xs', isCurrent || isComplete ? 'text-[#16381e]' : 'text-muted-foreground')}>{item.label}</p>
                  <p className="hidden truncate text-[10px] text-muted-foreground sm:block">{item.hint}</p>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Body Content */}
        <div className={cn('p-5 sm:p-8', variant === 'modal' && 'max-h-[80vh] overflow-y-auto')}>
          {/* Auth Warning Banner */}
          {(authError || !isAuthenticated) && (
            <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-amber-500/10 p-4 text-xs border border-amber-500/20 text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-3">
                <Lock className="size-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold text-xs uppercase tracking-wider">Connexion requise (Token Sanctum)</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Vous devez être connecté avec un compte client pour effectuer la réservation et le paiement.</p>
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

          {/* Banner Messages */}
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

          {/* STEP 1: DATES & AVAILABILITY CHECK */}
          {step === 'dates' && (
            <form onSubmit={handleCheckAvailability} noValidate className="flex flex-col gap-5">
              <div className="flex items-center gap-4 rounded-[22px] border border-[#16381e]/10 bg-[#f6f8f3] p-4">
                <div className="relative size-[72px] shrink-0 overflow-hidden rounded-2xl">
                  <Image src={listing.image || '/placeholder.svg'} alt={listing.title} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-base font-bold text-foreground truncate">{listing.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{listing.district}, {listing.city}</p>
                  <p className="mt-2 text-sm font-bold text-[#16381e]">{formatPrice(listing)} <span className="text-xs font-medium text-muted-foreground">/ nuit</span></p>
                </div>
              </div>

              <div>
                <h4 className="font-display text-lg font-bold text-foreground">Choisissez vos dates</h4>
                <p className="mt-1 text-sm text-muted-foreground">Nous vérifions la disponibilité avant de vous engager.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="booking-check-in" className="text-xs font-bold text-[#16381e]">Arrivée</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-[#16381e]/15 bg-white p-3 text-xs font-semibold text-foreground transition-colors focus-within:border-[#16381e] focus-within:ring-2 focus-within:ring-[#16381e]/10">
                    <Calendar className="size-4 text-[#c5a059] shrink-0" />
                    <input
                      id="booking-check-in"
                      type="date"
                      min={todayStr}
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-transparent outline-none cursor-pointer"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="booking-check-out" className="text-xs font-bold text-[#16381e]">Départ</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-[#16381e]/15 bg-white p-3 text-xs font-semibold text-foreground transition-colors focus-within:border-[#16381e] focus-within:ring-2 focus-within:ring-[#16381e]/10">
                    <Calendar className="size-4 text-[#c5a059] shrink-0" />
                    <input
                      id="booking-check-out"
                      type="date"
                      min={checkInDate}
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-transparent outline-none cursor-pointer"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="booking-guests" className="text-xs font-bold text-[#16381e]">Voyageurs</label>
                <div className="flex items-center gap-2 rounded-2xl border border-[#16381e]/15 bg-white p-3 text-xs font-semibold text-foreground transition-colors focus-within:border-[#16381e] focus-within:ring-2 focus-within:ring-[#16381e]/10">
                  <User className="size-4 text-[#c5a059] shrink-0" />
                  <input
                    id="booking-guests"
                    type="number"
                    min={1}
                    max={10}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-1 h-13 w-full rounded-2xl bg-[#16381e] font-bold text-sm text-white shadow-[0_12px_24px_rgba(22,56,30,0.2)] transition-all hover:bg-[#214c2b]"
              >
                <ShieldCheck className="mr-2 size-4" />
                {loading ? 'Vérification en cours...' : 'Vérifier la disponibilité'}
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground"><Lock className="size-3.5 text-[#c5a059]" /> Aucun débit à cette étape.</p>
            </form>
          )}

          {/* STEP 2: PRICE BREAKDOWN */}
          {step === 'price' && priceBreakdown && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-2xl bg-secondary/50 p-4 border border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Période sélectionnée</p>
                  <p className="font-bold text-sm text-foreground">
                    Du {checkInDate} au {checkOutDate} ({priceBreakdown.night_count} nuitées)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Voyageurs</p>
                  <p className="font-bold text-sm text-foreground">{guestCount} personne(s)</p>
                </div>
              </div>

              {/* Detail Table */}
              <div className="rounded-2xl border border-border bg-background p-4 flex flex-col gap-2.5 text-xs text-foreground">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span>Nuitées ({priceBreakdown.night_count} × ${priceBreakdown.base_price_per_night})</span>
                  <span className="font-semibold">${priceBreakdown.nights_total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Frais de ménage</span>
                  <span className="font-semibold">${priceBreakdown.cleaning_fee.toFixed(2)}</span>
                </div>
                {priceBreakdown.extra_guest_fee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Voyageurs supplémentaires</span>
                    <span className="font-semibold">${priceBreakdown.extra_guest_fee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Frais de service MBIYO (5%)</span>
                  <span className="font-semibold">${priceBreakdown.service_fee.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Dépôt de garantie (remboursable)</span>
                  <span>${priceBreakdown.security_deposit.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between pt-3 border-t border-border font-display text-base font-bold text-foreground">
                  <span>Total TTC</span>
                  <span className="text-primary">${priceBreakdown.total_price.toFixed(2)} USD</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('dates')} className="h-11 rounded-2xl flex-1 text-xs">
                  Modifier les dates
                </Button>
                <Button onClick={handleCreateBooking} disabled={loading} className="h-11 rounded-2xl flex-1 font-bold text-xs">
                  {loading ? 'Création...' : 'Créer réservation (Bloquer 15 min)'}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PENDING RESERVATION & 15-MIN TIMER */}
          {step === 'pending' && booking && (
            <div className="flex flex-col items-center text-center gap-5">
              <div className="flex items-center gap-2 rounded-full border border-[#c5a059]/30 bg-[#c5a059]/10 px-4 py-2 text-xs font-bold text-[#7b5b20]">
                <Clock className="size-4 text-[#c5a059]" />
                <span>Option de réservation active</span>
              </div>

              <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[28px] border border-[#16381e]/10 bg-[#f6f8f3] p-7">
                <BookingLottieIcon tone="gold" className="absolute size-40 opacity-15" />
                <p className="relative text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">Temps restant pour payer</p>
                <span className="relative mt-2 font-display text-5xl font-extrabold tracking-tight text-[#16381e]">
                  {formatTimer(timeLeft)}
                </span>
                <p className="relative mt-3 max-w-sm text-xs leading-relaxed text-muted-foreground">
                  Votre logement est retenu. Sans paiement dans ce délai, les dates seront de nouveau disponibles.
                </p>
              </div>

              <div className="w-full rounded-2xl border border-[#16381e]/10 bg-white p-4 text-left text-xs leading-relaxed text-muted-foreground">
                <div className="flex items-center justify-between"><span>Référence</span><strong className="text-foreground">{booking.booking_reference}</strong></div>
                <div className="mt-2 flex items-center justify-between"><span>Séjour</span><strong className="text-foreground">{booking.check_in_date} → {booking.check_out_date}</strong></div>
                <div className="mt-2 flex items-center justify-between border-t border-[#16381e]/10 pt-3"><span>Total TTC</span><strong className="text-base text-[#16381e]">${Number(booking.total_price).toFixed(2)} USD</strong></div>
              </div>

              <div className="flex flex-col gap-2 w-full mt-2">
                <Button
                  onClick={handleConfirmPayment}
                  disabled={loading}
                  className="h-12 w-full rounded-2xl bg-[#16381e] font-bold text-sm text-white shadow-[0_12px_24px_rgba(22,56,30,0.2)] hover:bg-[#214c2b]"
                >
                  <CreditCard className="mr-2 size-4" />
                  {loading ? 'Traitement du paiement...' : 'Confirmer et payer'}
                </Button>

                <button
                  type="button"
                  onClick={() => setShowCancelInput((v) => !v)}
                  className="text-xs font-semibold text-destructive hover:underline mt-1"
                >
                  Annuler cette réservation
                </button>

                {showCancelInput && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Motif d'annulation..."
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      className="flex-1 rounded-xl border border-border px-3 text-xs outline-none"
                    />
                    <Button variant="destructive" size="sm" onClick={handleCancelBooking} className="rounded-xl text-xs">
                      Confirmer l'annulation
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMED & LIFECYCLE MANAGEMENT (Check-in, Check-out, Completed) */}
          {['confirmed', 'checked_in', 'completed'].includes(step) && booking && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                    <Check className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase">
                      {step === 'confirmed' && '🟢 Statut : CONFIRMED'}
                      {step === 'checked_in' && '🔵 Statut : CHECKED_IN'}
                      {step === 'completed' && '🏁 Statut : COMPLETED'}
                    </h4>
                    <p className="text-xs opacity-90">
                      Réf: {booking.booking_reference} · {booking.check_in_date} au {booking.check_out_date}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Timeline Progress */}
              <div className="flex items-center justify-between text-xs font-semibold px-2">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="size-4" /> Paid
                </div>
                <ArrowRight className="size-3 text-muted-foreground" />
                <div className={cn('flex items-center gap-1.5', step !== 'confirmed' ? 'text-emerald-600' : 'text-muted-foreground')}>
                  <Key className="size-4" /> Check-in
                </div>
                <ArrowRight className="size-3 text-muted-foreground" />
                <div className={cn('flex items-center gap-1.5', step === 'completed' ? 'text-emerald-600' : 'text-muted-foreground')}>
                  <Sparkles className="size-4" /> Completed
                </div>
              </div>

              {/* Lifecycle Controls */}
              <div className="rounded-2xl border border-border p-5 bg-secondary/30 flex flex-col gap-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Action suivante</h5>

                {step === 'confirmed' && (
                  <Button
                    onClick={handleCheckIn}
                    disabled={loading}
                    className="h-12 w-full rounded-2xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Key className="mr-2 size-4" />
                    {loading ? 'En cours...' : 'Effectuer le Check-in (POST /check-in)'}
                  </Button>
                )}

                {step === 'checked_in' && (
                  <Button
                    onClick={handleCheckOut}
                    disabled={loading}
                    className="h-12 w-full rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle2 className="mr-2 size-4" />
                    {loading ? 'En cours...' : 'Effectuer le Check-out (POST /check-out)'}
                  </Button>
                )}

                {step === 'completed' && (
                  <div className="flex flex-col items-center text-center p-4 rounded-xl bg-card border border-border gap-2">
                    <Sparkles className="size-6 text-amber-500" />
                    <p className="font-bold text-sm text-foreground">Séjour Clôturé & Évaluation Débloquée ⭐️</p>
                    <p className="text-xs text-muted-foreground">
                      Le statut est désormais `COMPLETED`. Le propriétaire recevra le Payout en séquestre et le voyageur peut rédiger une évaluation officielle.
                    </p>
                  </div>
                )}

                {step !== 'completed' && (
                  <button
                    type="button"
                    onClick={handleCancelBooking}
                    className="text-xs text-destructive hover:underline self-center mt-1"
                  >
                    Annuler la réservation
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP: EXPIRED / CANCELLED */}
          {['expired', 'cancelled'].includes(step) && (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="size-7" />
              </div>
              <h4 className="font-bold text-base text-foreground">
                {step === 'expired' ? 'Réservation Expirée (EXPIRED 🔴)' : 'Réservation Annulée (CANCELLED 🛑)'}
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm">
                Les dates sélectionnées ont été automatiquement libérées dans le calendrier. Vous pouvez relancer une nouvelle demande.
              </p>
              <Button onClick={() => setStep('dates')} className="mt-2 h-11 rounded-2xl px-6 text-xs font-bold">
                Recommencer une réservation
              </Button>
            </div>
          )}
        </div>
      </div>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  )
}
