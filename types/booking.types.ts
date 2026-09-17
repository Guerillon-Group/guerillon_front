export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'expired'

export interface CheckAvailabilityPayload {
  property_id: string
  check_in_date: string
  check_out_date: string
}

export interface CheckAvailabilityResponse {
  success: boolean
  is_available: boolean
  message: string
}

export interface DailyPriceItem {
  date: string
  price: number
  is_custom: boolean
}

export interface PriceBreakdown {
  night_count: number
  base_price_per_night: number
  daily_breakdown: DailyPriceItem[]
  nights_total: number
  cleaning_fee: number
  security_deposit: number
  extra_guest_fee: number
  subtotal: number
  service_fee: number
  total_price: number
  currency_id: string | null
}

export interface CalculatePricePayload {
  property_id: string
  check_in_date: string
  check_out_date: string
  guest_count: number
}

export interface CalculatePriceResponse {
  success: boolean
  data: PriceBreakdown
}

export interface CreateBookingPayload {
  booking_reference?: string
  property_id: string
  client_id: string
  owner_id: string
  check_in_date: string
  check_out_date: string
  guest_count: number
  total_price: number
}

export interface BookingData {
  id: string
  booking_reference: string
  status: BookingStatus
  expires_at?: string | null
  check_in_date: string
  check_out_date: string
  total_price: number | string
  paid_at?: string | null
  checked_in_at?: string | null
  checked_out_at?: string | null
  cancelled_at?: string | null
  cancellation_reason?: string | null
  property?: any
  client?: any
  owner?: any
}

export interface CreateBookingResponse {
  success: boolean
  message: string
  data: BookingData
}

export interface BookingActionResponse {
  success: boolean
  message: string
  data: BookingData
}

export interface CancelBookingPayload {
  cancellation_reason?: string
}
