export type OwnerKycStatus = 'pending' | 'verified' | 'rejected' | 'unverified'

export interface OwnerProfile {
  id: string
  user_id: string
  company_name?: string
  tax_number?: string
  id_card_number?: string
  address?: string
  country_id?: number
  province_id?: number
  city_id?: number
  status: OwnerKycStatus
  created_at?: string
  updated_at?: string
}

export interface CreateOwnerProfilePayload {
  company_name?: string
  tax_number?: string
  id_card_number?: string
  address?: string
}

export type DocumentStatus = 'pending' | 'approved' | 'rejected'

export interface OwnerDocument {
  id: string
  owner_id: string
  document_type: 'id_card' | 'passport' | 'title_deed' | 'tax_certificate' | string
  name: string
  url: string
  status: DocumentStatus
  expires_at?: string
  created_at?: string
}

export interface CreateOwnerDocumentPayload {
  document_type: string
  name: string
  file: File
}

export interface OwnerBankAccount {
  id: string
  owner_id: string
  bank_name: string
  account_name: string
  account_number: string
  swift_code?: string
  is_primary?: boolean
  created_at?: string
}

export interface CreateOwnerBankAccountPayload {
  bank_name: string
  account_name: string
  account_number: string
  swift_code?: string
  is_primary?: boolean
}

export type OwnerRequestStatus = 'pending' | 'in_progress' | 'resolved' | 'closed'

export interface OwnerRequest {
  id: string
  owner_id: string
  type: 'mandate' | 'verification' | 'support' | 'withdrawal' | string
  subject: string
  message: string
  status: OwnerRequestStatus
  created_at?: string
}

export interface CreateOwnerRequestPayload {
  type: string
  subject: string
  message: string
}
