import { apiClient } from './api.service'
import { WorldCity, WorldCountry, WorldCurrency, WorldState } from '../types/world.types'

export interface WorldApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export const worldService = {
  async getCountries(): Promise<WorldCountry[]> {
    try {
      const res = await apiClient.get<WorldApiResponse<WorldCountry[]>>('/countries')
      return res.data?.data || []
    } catch {
      return []
    }
  },

  async getStates(countryId?: number): Promise<WorldState[]> {
    try {
      const url = countryId ? `/states?filters[country_id]=${countryId}` : '/states'
      const res = await apiClient.get<WorldApiResponse<WorldState[]>>(url)
      return res.data?.data || []
    } catch {
      return []
    }
  },

  async getCities(params?: { countryId?: number; stateId?: number }): Promise<WorldCity[]> {
    try {
      const query = new URLSearchParams()
      if (params?.countryId) query.set('filters[country_id]', params.countryId.toString())
      if (params?.stateId) query.set('filters[state_id]', params.stateId.toString())

      const url = query.toString() ? `/cities?${query.toString()}` : '/cities'
      const res = await apiClient.get<WorldApiResponse<WorldCity[]>>(url)
      return res.data?.data || []
    } catch {
      return []
    }
  },

  async getCurrencies(): Promise<WorldCurrency[]> {
    try {
      const res = await apiClient.get<WorldApiResponse<WorldCurrency[]>>('/currencies')
      return res.data?.data || []
    } catch {
      return []
    }
  },
}
