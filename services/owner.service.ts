import { apiClient } from './api.service'
import {
  CreateOwnerBankAccountPayload,
  CreateOwnerDocumentPayload,
  CreateOwnerProfilePayload,
  CreateOwnerRequestPayload,
  OwnerBankAccount,
  OwnerDocument,
  OwnerProfile,
  OwnerRequest,
} from '../types/owner.types'

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export const ownerService = {
  // --- Profil Propriétaire / KYC ---
  async getOwnerProfile(): Promise<ApiResponse<OwnerProfile | null>> {
    const response = await apiClient.get<ApiResponse<OwnerProfile | null>>('/owner-profiles')
    return response.data
  },

  async createOwnerProfile(payload: CreateOwnerProfilePayload): Promise<ApiResponse<OwnerProfile>> {
    const response = await apiClient.post<ApiResponse<OwnerProfile>>('/owner-profiles', payload)
    return response.data
  },

  async updateOwnerProfile(id: string, payload: Partial<CreateOwnerProfilePayload>): Promise<ApiResponse<OwnerProfile>> {
    const response = await apiClient.put<ApiResponse<OwnerProfile>>(`/owner-profiles/${id}`, payload)
    return response.data
  },

  // --- Documents Propriétaire (Pièce d'identité, Titre foncier) ---
  async getOwnerDocuments(): Promise<ApiResponse<OwnerDocument[]>> {
    const response = await apiClient.get<ApiResponse<OwnerDocument[]>>('/owner-documents')
    return response.data
  },

  async uploadOwnerDocument(payload: CreateOwnerDocumentPayload): Promise<ApiResponse<OwnerDocument>> {
    const formData = new FormData()
    formData.append('document_type', payload.document_type)
    formData.append('name', payload.name)
    formData.append('file', payload.file)

    const response = await apiClient.post<ApiResponse<OwnerDocument>>('/owner-documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async deleteOwnerDocument(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/owner-documents/${id}`)
    return response.data
  },

  // --- Comptes Bancaires / RIB Propriétaire ---
  async getOwnerBankAccounts(): Promise<ApiResponse<OwnerBankAccount[]>> {
    const response = await apiClient.get<ApiResponse<OwnerBankAccount[]>>('/owner-bank-accounts')
    return response.data
  },

  async createOwnerBankAccount(payload: CreateOwnerBankAccountPayload): Promise<ApiResponse<OwnerBankAccount>> {
    const response = await apiClient.post<ApiResponse<OwnerBankAccount>>('/owner-bank-accounts', payload)
    return response.data
  },

  async deleteOwnerBankAccount(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/owner-bank-accounts/${id}`)
    return response.data
  },

  // --- Demandes de Mandats / Requêtes Propriétaire ---
  async getOwnerRequests(): Promise<ApiResponse<OwnerRequest[]>> {
    const response = await apiClient.get<ApiResponse<OwnerRequest[]>>('/owner-requests')
    return response.data
  },

  async createOwnerRequest(payload: CreateOwnerRequestPayload): Promise<ApiResponse<OwnerRequest>> {
    const response = await apiClient.post<ApiResponse<OwnerRequest>>('/owner-requests', payload)
    return response.data
  },
}
