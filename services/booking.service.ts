import { apiClient } from './api.service'
import type {
  BookingActionResponse,
  BookingData,
  CalculatePricePayload,
  CalculatePriceResponse,
  CancelBookingPayload,
  CheckAvailabilityPayload,
  CheckAvailabilityResponse,
  CreateBookingPayload,
  CreateBookingResponse,
} from '../types/booking.types'

export const bookingService = {
  /**
   * 1. Vérifier la disponibilité des dates pour une propriété
   */
  async checkAvailability(payload: CheckAvailabilityPayload): Promise<CheckAvailabilityResponse> {
    const response = await apiClient.post<CheckAvailabilityResponse>('/bookings/check-availability', payload)
    return response.data
  },

  /**
   * 2. Calculer le prix TTC et le détail tarifaire
   */
  async calculatePrice(payload: CalculatePricePayload): Promise<CalculatePriceResponse> {
    const response = await apiClient.post<CalculatePriceResponse>('/bookings/calculate-price', payload)
    return response.data
  },

  /**
   * 3. Créer une réservation temporaire (Status: pending, expires_at = now + 15 min)
   */
  async createBooking(payload: CreateBookingPayload): Promise<CreateBookingResponse> {
    const response = await apiClient.post<CreateBookingResponse>('/bookings', payload)
    return response.data
  },

  /**
   * 4. Confirmer le paiement (pending -> confirmed)
   */
  async confirmPayment(bookingId: string): Promise<BookingActionResponse> {
    const response = await apiClient.post<BookingActionResponse>(`/bookings/${bookingId}/confirm-payment`, {})
    return response.data
  },

  /**
   * 5. Effectuer le Check-in (confirmed -> checked_in)
   */
  async checkIn(bookingId: string): Promise<BookingActionResponse> {
    const response = await apiClient.post<BookingActionResponse>(`/bookings/${bookingId}/check-in`, {})
    return response.data
  },

  /**
   * 6. Effectuer le Check-out (checked_in -> completed)
   */
  async checkOut(bookingId: string): Promise<BookingActionResponse> {
    const response = await apiClient.post<BookingActionResponse>(`/bookings/${bookingId}/check-out`, {})
    return response.data
  },

  /**
   * 7. Annuler la réservation (pending/confirmed -> cancelled)
   */
  async cancelBooking(bookingId: string, cancellationReason?: string): Promise<BookingActionResponse> {
    const payload: CancelBookingPayload = cancellationReason ? { cancellation_reason: cancellationReason } : {}
    const response = await apiClient.post<BookingActionResponse>(`/bookings/${bookingId}/cancel`, payload)
    return response.data
  },

  /**
   * 8a. Lister toutes les réservations
   */
  async getBookings(page = 1): Promise<{ success: boolean; data: BookingData[]; meta?: any }> {
    const response = await apiClient.get(`/bookings?page=${page}`)
    return response.data
  },

  /**
   * 8b. Détails d'une réservation
   */
  async getBooking(bookingId: string): Promise<{ success: boolean; data: BookingData }> {
    const response = await apiClient.get(`/bookings/${bookingId}`)
    return response.data
  },
}
