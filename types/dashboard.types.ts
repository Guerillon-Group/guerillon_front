export type DashboardMetric = {
  key: string
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
}

export type DashboardChartPoint = {
  label: string
  value: number
  secondary: number
}

export type DashboardQuickStats = {
  occupancy_rate?: string
  conversion_rate?: string
  avg_response_time?: string
  active_mandates?: number
  active_leads?: number
  pending_documents?: number
  pending_requests?: number
  properties_certified?: number
  saved_searches?: number
  active_offers?: number
  scheduled_visits?: number
}

export type FinancialOverview = {
  available_balance?: string
  pending_payouts?: string
  next_payout_date?: string
  total_collected_year?: string
  estimated_commissions?: string
  paid_commissions_month?: string
  pending_commissions?: string
  preapproved_budget?: string
  committed_deposits?: string
  payout_guarantee?: string
}

export type PendingTask = {
  id: string
  title: string
  type: 'kyc' | 'bank' | 'visit' | 'legal' | 'contract'
  priority: 'high' | 'medium' | 'low'
  dueDate: string
}

export type RecentActivity = {
  id: string
  title: string
  time: string
  type: 'view' | 'offer' | 'message' | 'verification'
  details: string
  status?: string
}

export type DashboardSummaryData = {
  role: 'agent' | 'proprietaire' | 'acheteur'
  profile_status?: string
  metrics: DashboardMetric[]
  chartData: DashboardChartPoint[]
  quickStats: DashboardQuickStats
  financialOverview: FinancialOverview
  pendingTasks: PendingTask[]
  recentActivities: RecentActivity[]
}
