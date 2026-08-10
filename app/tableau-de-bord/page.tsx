import type { Metadata } from 'next'
import { DashboardView } from '@/components/dashboard/dashboard-view'

export const metadata: Metadata = {
  title: 'Tableau de bord — MBIYO REAL-ESTATE',
  description:
    'Espace de gestion minimaliste et intelligent pour agents, propriétaires et investisseurs MBIYO REAL-ESTATE.',
}

export default function DashboardPage() {
  return <DashboardView />
}
