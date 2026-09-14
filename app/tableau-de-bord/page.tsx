import type { Metadata } from 'next'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardView } from '@/components/dashboard/dashboard-view'

export const metadata: Metadata = {
  title: 'Tableau de bord — MBIYO REAL-ESTATE',
  description:
    'Espace de gestion minimaliste et intelligent pour agents, propriétaires et investisseurs MBIYO REAL-ESTATE.',
}

export default function DashboardPage() {
  return (
    <ProtectedRoute
      title="Tableau de bord"
      description="Connectez-vous pour accéder à votre espace de gestion, vos statistiques, vos mandats et vos favoris."
    >
      <DashboardView />
    </ProtectedRoute>
  )
}
