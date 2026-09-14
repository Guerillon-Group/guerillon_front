import { useCallback, useState } from 'react'
import { ownerService } from '../services/owner.service'
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
import { parseApiError } from '../utils/error.utils'
import { ApiErrorResponse } from '../types/api.types'

export function useOwnerMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiErrorResponse | null>(null)

  const [profile, setProfile] = useState<OwnerProfile | null>(null)
  const [documents, setDocuments] = useState<OwnerDocument[]>([])
  const [bankAccounts, setBankAccounts] = useState<OwnerBankAccount[]>([])
  const [requests, setRequests] = useState<OwnerRequest[]>([])

  // --- Chargement des données ---
  const fetchOwnerOverview = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [profRes, docsRes, banksRes, reqsRes] = await Promise.allSettled([
        ownerService.getOwnerProfile(),
        ownerService.getOwnerDocuments(),
        ownerService.getOwnerBankAccounts(),
        ownerService.getOwnerRequests(),
      ])

      if (profRes.status === 'fulfilled' && profRes.value?.data) {
        const p = Array.isArray(profRes.value.data) ? profRes.value.data[0] : profRes.value.data
        setProfile(p || null)
      }
      if (docsRes.status === 'fulfilled' && docsRes.value?.data) {
        const docs = Array.isArray(docsRes.value.data)
          ? docsRes.value.data
          : (docsRes.value.data as any)?.data || []
        setDocuments(docs)
      }
      if (banksRes.status === 'fulfilled' && banksRes.value?.data) {
        const banks = Array.isArray(banksRes.value.data)
          ? banksRes.value.data
          : (banksRes.value.data as any)?.data || []
        setBankAccounts(banks)
      }
      if (reqsRes.status === 'fulfilled' && reqsRes.value?.data) {
        const reqs = Array.isArray(reqsRes.value.data)
          ? reqsRes.value.data
          : (reqsRes.value.data as any)?.data || []
        setRequests(reqs)
      }
    } catch (err) {
      setError(parseApiError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  // --- Sauvegarder / Mettre à jour le profil KYC ---
  const saveOwnerProfile = async (payload: CreateOwnerProfilePayload) => {
    setLoading(true)
    setError(null)
    try {
      let res
      if (profile?.id) {
        res = await ownerService.updateOwnerProfile(profile.id, payload)
      } else {
        res = await ownerService.createOwnerProfile(payload)
      }
      if (res.data) {
        setProfile(res.data)
      }
      return res
    } catch (err) {
      const parsed = parseApiError(err)
      setError(parsed)
      throw parsed
    } finally {
      setLoading(false)
    }
  }

  // --- Envoyer un document ---
  const uploadDocument = async (payload: CreateOwnerDocumentPayload) => {
    setLoading(true)
    setError(null)
    try {
      const res = await ownerService.uploadOwnerDocument(payload)
      if (res.data) {
        setDocuments((prev) => [res.data, ...prev])
      }
      return res
    } catch (err) {
      const parsed = parseApiError(err)
      setError(parsed)
      throw parsed
    } finally {
      setLoading(false)
    }
  }

  // --- Supprimer un document ---
  const deleteDocument = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await ownerService.deleteOwnerDocument(id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      const parsed = parseApiError(err)
      setError(parsed)
      throw parsed
    } finally {
      setLoading(false)
    }
  }

  // --- Ajouter un compte bancaire ---
  const addBankAccount = async (payload: CreateOwnerBankAccountPayload) => {
    setLoading(true)
    setError(null)
    try {
      const res = await ownerService.createOwnerBankAccount(payload)
      if (res.data) {
        setBankAccounts((prev) => [res.data, ...prev])
      }
      return res
    } catch (err) {
      const parsed = parseApiError(err)
      setError(parsed)
      throw parsed
    } finally {
      setLoading(false)
    }
  }

  // --- Supprimer un compte bancaire ---
  const deleteBankAccount = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await ownerService.deleteOwnerBankAccount(id)
      setBankAccounts((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      const parsed = parseApiError(err)
      setError(parsed)
      throw parsed
    } finally {
      setLoading(false)
    }
  }

  // --- Soumettre une demande de mandat / vérification ---
  const createRequest = async (payload: CreateOwnerRequestPayload) => {
    setLoading(true)
    setError(null)
    try {
      const res = await ownerService.createOwnerRequest(payload)
      if (res.data) {
        setRequests((prev) => [res.data, ...prev])
      }
      return res
    } catch (err) {
      const parsed = parseApiError(err)
      setError(parsed)
      throw parsed
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    profile,
    documents,
    bankAccounts,
    requests,
    fetchOwnerOverview,
    saveOwnerProfile,
    uploadDocument,
    deleteDocument,
    addBankAccount,
    deleteBankAccount,
    createRequest,
  }
}
