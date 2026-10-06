import { apiClient } from './api.service'
import type {
  CreatePropertySalePayload,
  PropertySaleData,
  PropertySaleResponse,
} from '../types/property-sale.types'

export const propertySaleService = {
  /**
   * 1. Soumettre une offre d'achat (Status: pending)
   */
  async createSale(payload: CreatePropertySalePayload): Promise<PropertySaleResponse> {
    const response = await apiClient.post<PropertySaleResponse>('/property-sales', payload)
    return response.data
  },

  /**
   * 2. Confirmer l'acompte de réservation et passer au statut option_reserved
   */
  async confirmDeposit(saleId: string, depositAmount?: number): Promise<PropertySaleResponse> {
    const response = await apiClient.post<PropertySaleResponse>(
      `/property-sales/${saleId}/confirm-deposit`,
      depositAmount ? { deposit_amount: depositAmount } : {},
    )
    return response.data
  },

  /**
   * 3. Obtenir les détails d'un dossier de vente
   */
  async getSale(saleId: string): Promise<PropertySaleResponse> {
    const response = await apiClient.get<PropertySaleResponse>(`/property-sales/${saleId}`)
    return response.data
  },

  /**
   * 4. Lister les offres / ventes (pour l'acheteur ou le propriétaire)
   */
  async getSales(page = 1): Promise<{ success: boolean; data: PropertySaleData[]; meta?: any }> {
    const response = await apiClient.get(`/property-sales?page=${page}`)
    return response.data
  },

  /**
   * 5. Mettre à jour une offre ou étape de vente
   */
  async updateSale(saleId: string, payload: Partial<CreatePropertySalePayload>): Promise<PropertySaleResponse> {
    const response = await apiClient.put<PropertySaleResponse>(`/property-sales/${saleId}`, payload)
    return response.data
  },
}
