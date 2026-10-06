export type PropertySaleStatus =
  | 'pending'
  | 'accepted'
  | 'option_reserved'
  | 'notary_pending'
  | 'completed'
  | 'rejected'
  | 'cancelled'

export interface CreatePropertySalePayload {
  sale_reference?: string
  property_id: string
  buyer_id?: string
  client_id?: string
  seller_id?: string
  owner_id?: string
  offer_price: number
  total_price?: number
  deposit_amount?: number
  notary_fees?: number
  option_expiration_date?: string
  closing_date?: string
  conditions?: string
}

export interface PropertySaleData {
  id: string
  sale_reference: string
  property_id: string
  buyer_id: string
  seller_id: string
  offer_price: number
  agreed_price?: number | null
  deposit_amount?: number | null
  notary_fees?: number | null
  status: PropertySaleStatus
  option_expiration_date?: string | null
  closing_date?: string | null
  conditions?: string | null
  created_at?: string
  updated_at?: string
  property?: any
  buyer?: any
  seller?: any
}

export interface PropertySaleResponse {
  success: boolean
  message?: string
  data: PropertySaleData
}
