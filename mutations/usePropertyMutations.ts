import { useState } from 'react'
import { compressImages } from '../lib/image-compressor'
import { propertyService } from '../services/property.service'
import { CreatePropertyPayload, Property } from '../types/property.types'

export function usePropertyMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProperty = async (payload: CreatePropertyPayload): Promise<Property | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await propertyService.createProperty(payload)
      setLoading(false)
      return response.data
    } catch (err: any) {
      setLoading(false)
      const msg = err.response?.data?.message || err.message || 'Échec de la création du bien'
      setError(msg)
      throw new Error(msg)
    }
  }

  const uploadImages = async (propertyId: string, files: File[]): Promise<void> => {
    setLoading(true)
    try {
      // Compression côté client (1920x1080, JPEG 80%) avant envoi multipart/form-data
      const compressedFiles = await compressImages(files, { maxWidth: 1920, maxHeight: 1080, quality: 0.8 })
      for (let i = 0; i < compressedFiles.length; i++) {
        await propertyService.uploadPropertyImage(propertyId, compressedFiles[i], i === 0)
      }
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      throw err
    }
  }

  const uploadDocuments = async (propertyId: string, files: { file: File; name: string }[]): Promise<void> => {
    setLoading(true)
    try {
      for (const doc of files) {
        await propertyService.uploadPropertyDocument(propertyId, doc.file, doc.name)
      }
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      throw err
    }
  }

  return {
    createProperty,
    uploadImages,
    uploadDocuments,
    loading,
    error,
  }
}
