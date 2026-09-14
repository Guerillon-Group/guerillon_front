import { useState, useEffect, useCallback } from 'react'
import { dashboardService } from '@/services/dashboard.service'
import { DashboardSummaryData } from '@/types/dashboard.types'

export function useDashboardSummary(role: 'agent' | 'proprietaire' | 'acheteur' = 'agent') {
  const [data, setData] = useState<DashboardSummaryData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const summary = await dashboardService.getSummary(role)
      setData(summary)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de la synthèse.')
    } finally {
      setLoading(false)
    }
  }, [role])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return {
    data,
    loading,
    error,
    refresh: fetchSummary,
  }
}
