import { apiClient } from './api.service'
import {
  CreatePropertyPayload,
  Property,
  PropertyCategory,
  PropertyDocument,
  PropertyFeature,
  PropertyFilters,
  PropertyImage,
  PropertyType,
} from '../types/property.types'

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedApiResponse<T> {
  success: boolean
  data: {
    data: T[]
    current_page: number
    last_page: number
    total: number
    per_page: number
  }
}

export const propertyService = {
  async getProperties(filters: PropertyFilters = {}): Promise<PaginatedApiResponse<Property>> {
    const params = new URLSearchParams()
    if (filters.q) params.set('q', filters.q)
    if (filters.city) params.set('city', filters.city)
    if (filters.intent) params.set('intent', filters.intent)
    if (filters.page) params.set('page', filters.page.toString())
    if (filters.per_page) params.set('per_page', filters.per_page.toString())

    const query = params.toString() ? `?${params.toString()}` : ''
    const response = await apiClient.get<PaginatedApiResponse<Property>>(`/properties${query}`)
    return response.data
  },

  async getProperty(idOrSlug: string): Promise<ApiResponse<Property>> {
    const response = await apiClient.get<ApiResponse<Property>>(`/properties/${idOrSlug}`)
    return response.data
  },

  async createProperty(payload: CreatePropertyPayload): Promise<ApiResponse<Property>> {
    const response = await apiClient.post<ApiResponse<Property>>('/properties', payload)
    return response.data
  },

  async updateProperty(id: string, payload: Partial<CreatePropertyPayload>): Promise<ApiResponse<Property>> {
    const response = await apiClient.put<ApiResponse<Property>>(`/properties/${id}`, payload)
    return response.data
  },

  async deleteProperty(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/properties/${id}`)
    return response.data
  },

  async uploadPropertyImage(propertyId: string, file: File, isCover: boolean = false): Promise<ApiResponse<PropertyImage>> {
    const formData = new FormData()
    formData.append('property_id', propertyId)
    formData.append('file', file)
    if (isCover) formData.append('is_cover', '1')

    const response = await apiClient.post<ApiResponse<PropertyImage>>('/property-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async uploadPropertyDocument(propertyId: string, file: File, name: string): Promise<ApiResponse<PropertyDocument>> {
    const formData = new FormData()
    formData.append('property_id', propertyId)
    formData.append('file', file)
    formData.append('name', name)

    const response = await apiClient.post<ApiResponse<PropertyDocument>>('/property-documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async addPropertyFeature(propertyId: string, name: string, value?: string): Promise<ApiResponse<PropertyFeature>> {
    const response = await apiClient.post<ApiResponse<PropertyFeature>>('/property-features', {
      property_id: propertyId,
      name,
      value,
    })
    return response.data
  },

  async getTypes(): Promise<ApiResponse<PropertyType[]>> {
    const response = await apiClient.get<ApiResponse<PropertyType[]>>('/property-types?all=true')
    return response.data
  },

  async getCategories(): Promise<ApiResponse<PropertyCategory[]>> {
    const response = await apiClient.get<ApiResponse<PropertyCategory[]>>('/property-categories?all=true')
    return response.data
  },
}
