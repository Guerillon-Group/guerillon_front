import { apiClient } from './api.service'
import { DashboardSummaryData } from '@/types/dashboard.types'

class DashboardService {
  private basePath = '/dashboard'

  async getSummary(role: 'agent' | 'proprietaire' | 'acheteur' = 'agent'): Promise<DashboardSummaryData> {
    try {
      const response = await apiClient.get<{ success: boolean; data: DashboardSummaryData }>(
        `${this.basePath}/summary`,
        { params: { role } }
      )
      if (response.data && response.data.success && response.data.data) {
        return response.data.data
      }
      throw new Error('Reponse API invalide pour le résumé dashboard.')
    } catch (error) {
      console.warn('Dashboard service API call failed, fallbacking to local data:', error)
      return this.getFallbackSummary(role)
    }
  }

  private getFallbackSummary(role: 'agent' | 'proprietaire' | 'acheteur'): DashboardSummaryData {
    if (role === 'proprietaire') {
      return {
        role: 'proprietaire',
        profile_status: 'pending',
        metrics: [
          { key: 'properties', title: 'Biens en Ligne', value: '0 Propriété', change: '0% Titrés & Vérifiés', trend: 'neutral' },
          { key: 'views', title: 'Consultations Totales', value: '0 Vue', change: '0% ce mois', trend: 'neutral' },
          { key: 'bookings', title: 'Demandes de Visite', value: '0 Visite', change: '0 en attente', trend: 'neutral' },
          { key: 'value', title: 'Valeur Estimée Patrimoine', value: '$0', change: 'Certifié MBIYO', trend: 'neutral' },
        ],
        chartData: [
          { label: 'Lun', value: 0, secondary: 0 },
          { label: 'Mar', value: 0, secondary: 0 },
          { label: 'Mer', value: 0, secondary: 0 },
          { label: 'Jeu', value: 0, secondary: 0 },
          { label: 'Ven', value: 0, secondary: 0 },
          { label: 'Sam', value: 0, secondary: 0 },
          { label: 'Dim', value: 0, secondary: 0 },
        ],
        quickStats: {
          occupancy_rate: '0%',
          active_mandates: 0,
          pending_documents: 0,
          pending_requests: 0,
        },
        financialOverview: {
          available_balance: '$0.00',
          pending_payouts: '$0.00',
          next_payout_date: '—',
          total_collected_year: '$0.00',
        },
        pendingTasks: [],
        recentActivities: [],
      }
    }

    if (role === 'acheteur') {
      return {
        role: 'acheteur',
        metrics: [
          { key: 'saved', title: 'Biens Sauvegardés', value: '0 Favori', change: '0 Baisse de prix', trend: 'neutral' },
          { key: 'offers', title: 'Offres Soumises', value: '0 Offre', change: 'Aucune offre', trend: 'neutral' },
          { key: 'alerts', title: 'Alertes Recherche', value: '0 Critère', change: '—', trend: 'neutral' },
          { key: 'budget', title: 'Budget Envisagé', value: '$0', change: 'Non défini', trend: 'neutral' },
        ],
        chartData: [
          { label: 'Jan', value: 0, secondary: 0 },
          { label: 'Fév', value: 0, secondary: 0 },
          { label: 'Mar', value: 0, secondary: 0 },
          { label: 'Avr', value: 0, secondary: 0 },
          { label: 'Mai', value: 0, secondary: 0 },
          { label: 'Juin', value: 0, secondary: 0 },
        ],
        quickStats: {
          saved_searches: 0,
          active_offers: 0,
          scheduled_visits: 0,
        },
        financialOverview: {
          preapproved_budget: '$0.00',
          committed_deposits: '$0.00',
          payout_guarantee: 'Non configuré',
        },
        pendingTasks: [],
        recentActivities: [],
      }
    }

    return {
      role: 'agent',
      metrics: [
        { key: 'total_views', title: 'Vues Totales', value: '0', change: '0% ce mois', trend: 'neutral' },
        { key: 'mandates', title: 'Biens en Mandat', value: '0 Bien', change: '0 Exclusivité', trend: 'neutral' },
        { key: 'leads', title: 'Demandes & Prospect', value: '0 Contact', change: '0 cette semaine', trend: 'neutral' },
        { key: 'commissions', title: 'Commissions Est.', value: '$0', change: '0% vs Q1', trend: 'neutral' },
      ],
      chartData: [
        { label: 'Lun', value: 0, secondary: 0 },
        { label: 'Mar', value: 0, secondary: 0 },
        { label: 'Mer', value: 0, secondary: 0 },
        { label: 'Jeu', value: 0, secondary: 0 },
        { label: 'Ven', value: 0, secondary: 0 },
        { label: 'Sam', value: 0, secondary: 0 },
        { label: 'Dim', value: 0, secondary: 0 },
      ],
      quickStats: {
        conversion_rate: '0%',
        avg_response_time: '—',
        active_leads: 0,
        properties_certified: 0,
      },
      financialOverview: {
        estimated_commissions: '$0.00',
        paid_commissions_month: '$0.00',
        pending_commissions: '$0.00',
      },
      pendingTasks: [],
      recentActivities: [],
    }
  }
}

export const dashboardService = new DashboardService()
