import { apiClient } from './api.service';
import { Agency, AgencyResponse, CreateAgencyInput } from '../types/agency.types';

export const agencyService = {
  /**
   * Créer une nouvelle agence immobilière
   */
  async createAgency(data: CreateAgencyInput): Promise<AgencyResponse> {
    const response = await apiClient.post<AgencyResponse>('/agencies', data);
    return response.data;
  },

  /**
   * Récupérer la liste des agences
   */
  async getAgencies(): Promise<{ data: Agency[] }> {
    const response = await apiClient.get('/agencies');
    return response.data;
  },

  /**
   * Récupérer les détails d'une agence
   */
  async getAgency(id: string): Promise<AgencyResponse> {
    const response = await apiClient.get<AgencyResponse>(`/agencies/${id}`);
    return response.data;
  },
};
