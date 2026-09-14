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
        profile_status: 'verified',
        metrics: [
          { key: 'properties', title: 'Biens en Ligne', value: '3 Propriétés', change: '100% Titrés & Vérifiés', trend: 'neutral' },
          { key: 'views', title: 'Consultations Totales', value: '5,420 Vues', change: '+34% ce mois', trend: 'up' },
          { key: 'bookings', title: 'Demandes de Visite', value: '9 Visites', change: '3 en attente', trend: 'up' },
          { key: 'value', title: 'Valeur Estimée Patrimoine', value: '$650,000', change: 'Certifié MBIYO', trend: 'neutral' },
        ],
        chartData: [
          { label: 'Lun', value: 80, secondary: 2 },
          { label: 'Mar', value: 110, secondary: 3 },
          { label: 'Mer', value: 240, secondary: 6 },
          { label: 'Jeu', value: 190, secondary: 4 },
          { label: 'Ven', value: 310, secondary: 8 },
          { label: 'Sam', value: 450, secondary: 12 },
          { label: 'Dim', value: 380, secondary: 9 },
        ],
        quickStats: {
          occupancy_rate: '94%',
          active_mandates: 2,
          pending_documents: 1,
          pending_requests: 2,
        },
        financialOverview: {
          available_balance: '$12,450.00',
          pending_payouts: '$3,200.00',
          next_payout_date: '25 Sept. 2026',
          total_collected_year: '$48,900.00',
        },
        pendingTasks: [
          { id: 't1', title: 'Vérification Titre Foncier N° 4092', type: 'kyc', priority: 'high', dueDate: '18 Sept 2026' },
          { id: 't2', title: 'Confirmation RIB pour virement automatique', type: 'bank', priority: 'medium', dueDate: '20 Sept 2026' },
        ],
        recentActivities: [
          { id: 'act-1', title: 'Demande de visite pour Duplex Kinshasa', time: 'Il y a 30 min', type: 'message', details: 'Client potentiel intéressé par un bail de 24 mois.', status: 'Nouveau' },
          { id: 'act-2', title: 'Document Titre de propriété téléversé', time: 'Hier à 14:00', type: 'verification', details: 'Reçu par l\'équipe MBIYO pour contrôle juridique.', status: 'En cours' },
          { id: 'act-3', title: 'Rapport mensuel de consultation généré', time: 'Hier à 18:00', type: 'view', details: 'Votre bien a été enregistré 14 fois dans les favoris cette semaine.', status: 'Disponible' },
        ],
      }
    }

    if (role === 'acheteur') {
      return {
        role: 'acheteur',
        metrics: [
          { key: 'saved', title: 'Biens Sauvegardés', value: '7 Favoris', change: '2 Baisses de prix', trend: 'up' },
          { key: 'offers', title: 'Offres Soumises', value: '1 Offre', change: 'En cours d\'étude', trend: 'neutral' },
          { key: 'alerts', title: 'Alertes Recherche', value: '4 Critères', change: 'Goma & Kinshasa', trend: 'neutral' },
          { key: 'budget', title: 'Budget Envisagé', value: '$300,000', change: 'Capacité certifiée', trend: 'neutral' },
        ],
        chartData: [
          { label: 'Jan', value: 1200, secondary: 1100 },
          { label: 'Fév', value: 1250, secondary: 1150 },
          { label: 'Mar', value: 1280, secondary: 1180 },
          { label: 'Avr', value: 1320, secondary: 1210 },
          { label: 'Mai', value: 1390, secondary: 1240 },
          { label: 'Juin', value: 1450, secondary: 1280 },
        ],
        quickStats: {
          saved_searches: 4,
          active_offers: 1,
          scheduled_visits: 2,
        },
        financialOverview: {
          preapproved_budget: '$300,000.00',
          committed_deposits: '$15,000.00',
          payout_guarantee: 'Vérifié par Banque Partner',
        },
        pendingTasks: [
          { id: 'ta1', title: 'Finaliser la promesse d\'achat pour Villa Katindo', type: 'contract', priority: 'high', dueDate: '16 Sept 2026' },
        ],
        recentActivities: [
          { id: 'act-b1', title: 'Offre transmise à l\'agent', time: 'Hier', type: 'offer', details: 'Offre de $370,000 soumise pour la Villa Katindo à Goma.', status: 'En attente' },
          { id: 'act-b2', title: 'Visite 3D effectuée', time: 'Il y a 2 jours', type: 'view', details: 'Appartement Himbi — Consultation de la galerie et des plans.', status: 'Complété' },
        ],
      }
    }

    return {
      role: 'agent',
      metrics: [
        { key: 'total_views', title: 'Vues Totales', value: '24,850', change: '+18.4% ce mois', trend: 'up' },
        { key: 'mandates', title: 'Biens en Mandat', value: '14 Biens', change: '3 Exclusivités', trend: 'neutral' },
        { key: 'leads', title: 'Demandes & Prospect', value: '42 Contacts', change: '+8 cette semaine', trend: 'up' },
        { key: 'commissions', title: 'Commissions Est.', value: '$14,200', change: '+12.5% vs Q1', trend: 'up' },
      ],
      chartData: [
        { label: 'Lun', value: 340, secondary: 12 },
        { label: 'Mar', value: 420, secondary: 18 },
        { label: 'Mer', value: 680, secondary: 25 },
        { label: 'Jeu', value: 590, secondary: 22 },
        { label: 'Ven', value: 890, secondary: 34 },
        { label: 'Sam', value: 1120, secondary: 48 },
        { label: 'Dim', value: 950, secondary: 41 },
      ],
      quickStats: {
        conversion_rate: '14.2%',
        avg_response_time: '18 mins',
        active_leads: 42,
        properties_certified: 12,
      },
      financialOverview: {
        estimated_commissions: '$14,200.00',
        paid_commissions_month: '$6,800.00',
        pending_commissions: '$7,400.00',
      },
      pendingTasks: [
        { id: 'tag1', title: 'Planifier visite avec M. Jean-Paul K.', type: 'visit', priority: 'high', dueDate: '15 Sept 2026' },
        { id: 'tag2', title: 'Vérifier cadastre parcelle N° 1029 Himbi', type: 'legal', priority: 'medium', dueDate: '17 Sept 2026' },
      ],
      recentActivities: [
        { id: 'act-a1', title: 'Offre reçue sur Villa Katindo', time: 'Il y a 12 min', type: 'offer', details: 'M. Jean-Paul K. propose une offre d\'achat à $370,000.', status: 'En négociation' },
        { id: 'act-a2', title: 'Visite confirmée — Appartement Himbi', time: 'Il y a 1 h', type: 'message', details: 'Visite programmée demain à 14:30 avec la famille Kaboré.', status: 'Confirmée' },
        { id: 'act-a3', title: 'Titre Foncier Validé par Cadastre', time: 'Il y a 3 h', type: 'verification', details: 'Certificat de propriété N° 4092-NK délivré sans restriction.', status: 'Certifié MBIYO' },
      ],
    }
  }
}

export const dashboardService = new DashboardService()
