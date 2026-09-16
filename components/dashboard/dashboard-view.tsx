'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Edit3,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Heart,
  Home,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Wallet,
} from 'lucide-react'

import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { listings, formatPrice } from '@/lib/properties'
import { cn, resolveImageUrl } from '@/lib/utils'

import { OwnerKycPanel } from '@/components/dashboard/owner-kyc-panel'
import { EditPropertyModal } from './edit-property-modal'
import { useDashboardSummary } from '@/mutations/useDashboardMutations'
import { useAuthStore } from '@/stores/useAuthStore'
import { propertyService } from '@/services/property.service'
import { Property } from '@/types/property.types'

export type UserRole = 'agent' | 'proprietaire' | 'acheteur'

type RoleConfig = {
  id: UserRole
  label: string
  subtitle: string
  badge: string
  avatar: string
  name: string
  metrics: {
    title: string
    value: string
    change: string
    trend: 'up' | 'down' | 'neutral'
    icon: any
  }[]
  chartData: { label: string; value: number; secondary: number }[]
  activities: {
    id: string
    title: string
    time: string
    type: 'view' | 'offer' | 'message' | 'verification'
    details: string
    status?: string
    amount?: string
  }[]
}

const roleData: Record<UserRole, RoleConfig> = {
  agent: {
    id: 'agent',
    label: 'Agent Immo MBIYO',
    subtitle: 'Horizon Kivu — Licence Certifiée #4802',
    badge: 'Agent Certifié',
    avatar: '/images/agent-portrait.png',
    name: 'Sarah Mukendi',
    metrics: [
      {
        title: 'Vues Totales',
        value: '24,850',
        change: '+18.4% ce mois',
        trend: 'up',
        icon: Eye,
      },
      {
        title: 'Biens en Mandat',
        value: '14 Biens',
        change: '3 Exclusivités',
        trend: 'neutral',
        icon: Building2,
      },
      {
        title: 'Demandes & Prospect',
        value: '42 Contacts',
        change: '+8 cette semaine',
        trend: 'up',
        icon: MessageSquare,
      },
      {
        title: 'Commissions Est.',
        value: '$14,200',
        change: '+12.5% vs Q1',
        trend: 'up',
        icon: Wallet,
      },
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
    activities: [
      {
        id: '1',
        title: 'Offre reçue sur Villa Katindo',
        time: 'Il y a 12 min',
        type: 'offer',
        details: 'M. Jean-Paul K. propose une offre d\'achat à $370,000.',
        status: 'En négociation',
        amount: '$370,000',
      },
      {
        id: '2',
        title: 'Visite confirmée — Appartement Himbi',
        time: 'Il y a 1 h',
        type: 'message',
        details: 'Visite programmée demain à 14:30 avec la famille Kaboré.',
        status: 'Confirmée',
      },
      {
        id: '3',
        title: 'Titre Foncier Validé par Cadastre',
        time: 'Il y a 3 h',
        type: 'verification',
        details: 'Certificat de propriété N° 4092-NK délivré sans restriction.',
        status: 'Certifié MBIYO',
      },
    ],
  },
  proprietaire: {
    id: 'proprietaire',
    label: 'Propriétaire Bailleur',
    subtitle: 'Gestionnaire de Patrimoine Privé',
    badge: 'Propriétaire Vérifié',
    avatar: '/images/placeholder-user.jpg',
    name: 'Dieudonné Kasereka',
    metrics: [
      {
        title: 'Biens en Ligne',
        value: '3 Propriétés',
        change: '100% Titrés',
        trend: 'neutral',
        icon: Home,
      },
      {
        title: 'Consultations',
        value: '5,420 Vues',
        change: '+34% ce mois',
        trend: 'up',
        icon: Eye,
      },
      {
        title: 'Demandes de Visite',
        value: '9 Visites',
        change: '3 en attente',
        trend: 'up',
        icon: Calendar,
      },
      {
        title: 'Valeur Estimée',
        value: '$650,000',
        change: 'Patrimoine MBIYO',
        trend: 'neutral',
        icon: ShieldCheck,
      },
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
    activities: [
      {
        id: '1',
        title: 'Demande de visite pour Duplex Kinshasa',
        time: 'Il y a 30 min',
        type: 'message',
        details: 'Client potentiel intéressé par un bail de 24 mois.',
        status: 'Nouveau',
      },
      {
        id: '2',
        title: 'Rapport mensuel de consultation généré',
        time: 'Hier à 18:00',
        type: 'view',
        details: 'Votre bien a été enregistré 14 fois dans les favoris cette semaine.',
        status: 'Disponible',
      },
    ],
  },
  acheteur: {
    id: 'acheteur',
    label: 'Acheteur / Investisseur',
    subtitle: 'Membre MBIYO Club Diaspora',
    badge: 'Investisseur VIP',
    avatar: '/images/placeholder-user.jpg',
    name: 'Marc-Aurèle Nzuzi',
    metrics: [
      {
        title: 'Biens Sauvegardés',
        value: '7 Favoris',
        change: '2 Baisses de prix',
        trend: 'up',
        icon: Heart,
      },
      {
        title: 'Offres Soumises',
        value: '1 Offre',
        change: 'En cours d\'étude',
        trend: 'neutral',
        icon: FileText,
      },
      {
        title: 'Alertes Recherche',
        value: '4 Critères',
        change: 'Goma & Kinshasa',
        trend: 'neutral',
        icon: Filter,
      },
      {
        title: 'Budget Envisagé',
        value: '$300,000',
        change: 'Capacité certifiée',
        trend: 'neutral',
        icon: Wallet,
      },
    ],
    chartData: [
      { label: 'Jan', value: 1200, secondary: 1100 },
      { label: 'Fév', value: 1250, secondary: 1150 },
      { label: 'Mar', value: 1280, secondary: 1180 },
      { label: 'Avr', value: 1320, secondary: 1210 },
      { label: 'Mai', value: 1390, secondary: 1240 },
      { label: 'Juin', value: 1450, secondary: 1280 },
    ],
    activities: [
      {
        id: '1',
        title: 'Offre transmise à l\'agent',
        time: 'Hier',
        type: 'offer',
        details: 'Offre de $370,000 soumise pour la Villa Katindo à Goma.',
        status: 'En attente',
        amount: '$370,000',
      },
      {
        id: '2',
        title: 'Visite 3D effectuée',
        time: 'Il y a 2 jours',
        type: 'view',
        details: 'Appartement Himbi — Consultation de la galerie et des plans.',
        status: 'Complété',
      },
    ],
  },
}

export function DashboardView() {
  const { user, initializeAuth } = useAuthStore()
  const [activeRole, setActiveRole] = useState<UserRole>('agent')
  const [selectedTab, setSelectedTab] = useState<'apercu' | 'biens' | 'kyc' | 'activites'>('apercu')
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [payoutRequested, setPayoutRequested] = useState<boolean>(false)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (user?.role) {
      const r = user.role.toLowerCase()
      if (r.includes('owner') || r.includes('proprio') || r.includes('bailleur')) {
        setActiveRole('proprietaire')
      } else if (r.includes('agency') || r.includes('agent')) {
        setActiveRole('agent')
      } else if (r.includes('client') || r.includes('buyer') || r.includes('acheteur')) {
        setActiveRole('acheteur')
      }
    }
  }, [user?.role])

  const [userProperties, setUserProperties] = useState<Property[]>([])
  const [loadingProperties, setLoadingProperties] = useState<boolean>(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  const loadUserProperties = () => {
    setLoadingProperties(true)
    propertyService
      .getProperties({ my_properties: true })
      .then((res) => {
        if (res.data?.data) {
          setUserProperties(res.data.data)
        }
      })
      .catch((err) => {
        console.warn('Failed to load user properties:', err)
      })
      .finally(() => {
        setLoadingProperties(false)
      })
  }

  useEffect(() => {
    if (selectedTab === 'biens') {
      loadUserProperties()
    }
  }, [selectedTab, user?.id])

  const { data: apiSummary, loading: summaryLoading } = useDashboardSummary(activeRole)
  const current = roleData[activeRole]

  // User Header Bindings
  const userName = user?.name || current.name
  const userAvatar = user?.avatar || current.avatar
  const userSubtitle = user?.email
    ? `${user.email}${user.phone ? ` • ${user.phone}` : ''}`
    : current.subtitle
  const userBadge = user
    ? user.role === 'owner' || user.role === 'proprietaire'
      ? 'Propriétaire Vérifié'
      : user.role === 'agency' || user.role === 'agent'
        ? 'Agent Certifié'
        : 'Membre MBIYO'
    : current.badge

  const tabs = [
    { id: 'apercu', label: 'Vue d\'ensemble' },
    { id: 'biens', label: activeRole === 'acheteur' ? 'Biens enregistrés' : 'Portefeuille de Biens' },
    ...(activeRole === 'proprietaire' ? [{ id: 'kyc', label: 'Espace KYC & Demandes' }] : []),
    { id: 'activites', label: 'Journal d\'activité' },
  ]

  const rawMetrics = apiSummary?.metrics || current.metrics
  const displayMetrics = rawMetrics.map((m) => {
    let IconComponent = Eye
    const titleLower = m.title.toLowerCase()
    if (titleLower.includes('vue') || titleLower.includes('consultation')) IconComponent = Eye
    else if (titleLower.includes('bien') || titleLower.includes('mandat') || titleLower.includes('sauvegard')) IconComponent = Building2
    else if (titleLower.includes('demande') || titleLower.includes('contact') || titleLower.includes('offre') || titleLower.includes('alerte')) IconComponent = MessageSquare
    else if (titleLower.includes('commission') || titleLower.includes('valeur') || titleLower.includes('budget') || titleLower.includes('solde')) IconComponent = Wallet
    else if ('icon' in m && (m as any).icon) IconComponent = (m as any).icon

    return {
      title: m.title,
      value: m.value,
      change: m.change,
      icon: IconComponent,
    }
  })

  const chartPoints = apiSummary?.chartData || current.chartData
  const chartMaxValue = Math.max(...chartPoints.map((d) => d.value), 1)
  const activitiesList = apiSummary?.recentActivities || current.activities

  return (
    <div className="flex min-h-dvh flex-col bg-[#f8faf7]">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 md:px-6 md:py-10">
        {/* Top Minimalist Header & Role Selector */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative size-14 overflow-hidden rounded-2xl border-2 border-[#16381e]/20 bg-white p-0.5 shadow-sm">
              <Image
                src={userAvatar}
                alt={userName}
                width={80}
                height={80}
                className="size-full rounded-[14px] object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#16381e]">
                  {userName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#16381e]/10 px-2.5 py-0.5 text-xs font-bold text-[#16381e] border border-[#16381e]/20">
                  <BadgeCheck className="size-3.5 fill-[#c5a059] text-white" />
                  {userBadge}
                </span>
                {summaryLoading ? (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground ml-2">
                    <RefreshCw className="size-3 animate-spin text-[#c5a059]" /> Chargement API...
                  </span>
                ) : apiSummary ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-500/20 ml-2">
                    <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" /> Live API
                  </span>
                ) : null}
              </div>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">{userSubtitle}</p>
            </div>
          </div>

          {/* Mutable User Role Switcher */}
          <div className="flex items-center gap-1 rounded-2xl border border-border bg-white p-1.5 shadow-xs">
            <span className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:inline">
              Mode :
            </span>
            {(['agent', 'proprietaire', 'acheteur'] as UserRole[]).map((r) => {
              const active = activeRole === r
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setActiveRole(r)
                    if (r === 'proprietaire') {
                      setSelectedTab('kyc')
                    } else if (selectedTab === 'kyc') {
                      setSelectedTab('apercu')
                    }
                  }}
                  className={cn(
                    'rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 capitalize',
                    active
                      ? 'bg-[#16381e] text-white shadow-md shadow-[#16381e]/20'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                >
                  {r === 'agent' ? 'Agent' : r === 'proprietaire' ? 'Propriétaire' : 'Acheteur'}
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex border-b border-border/80">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const active = selectedTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={cn(
                    'relative px-4 py-3 text-sm font-semibold transition-colors',
                    active ? 'text-[#16381e]' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 rounded-full bg-[#16381e]" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <Button
              nativeButton={false}
              render={<Link href="/publier" />}
              size="sm"
              className="gap-1.5 rounded-full bg-[#16381e] text-white hover:bg-[#16381e]/90 text-xs font-semibold"
            >
              <Plus className="size-3.5" />
              Nouveau Bien
            </Button>
          </div>
        </div>

        {/* TAB 1: APERÇU (SUMMARY + QUICK ACTIONS + FINANCIAL OVERVIEW + URGENT TASKS + GRAPH + RECENT ACTIVITIES) */}
        {selectedTab === 'apercu' && (
          <div className="mt-8 flex flex-col gap-8">
            {/* Quick Actions Ribbon Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#16381e]/15 bg-white p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#16381e]">
                <Sparkles className="size-4 text-[#c5a059]" />
                <span>Actions Rapides Dashboard :</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  nativeButton={false}
                  render={<Link href="/publier" />}
                  size="sm"
                  className="gap-1.5 rounded-xl bg-[#16381e] text-white hover:bg-[#16381e]/90 text-xs font-bold"
                >
                  <Plus className="size-3.5" />
                  Publier un Bien
                </Button>

                {activeRole === 'proprietaire' && (
                  <>
                    <Button
                      type="button"
                      onClick={() => setSelectedTab('kyc')}
                      size="sm"
                      variant="outline"
                      className="gap-1.5 rounded-xl border-[#16381e]/30 text-[#16381e] hover:bg-[#16381e]/5 text-xs font-bold"
                    >
                      <ShieldCheck className="size-3.5 text-[#c5a059]" />
                      Espace KYC & RIB
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setSelectedTab('kyc')}
                      size="sm"
                      variant="outline"
                      className="gap-1.5 rounded-xl border-[#16381e]/30 text-[#16381e] hover:bg-[#16381e]/5 text-xs font-bold"
                    >
                      <FileText className="size-3.5" />
                      Demander un Mandat
                    </Button>
                  </>
                )}

                <Button
                  type="button"
                  onClick={() => alert('Téléchargement du rapport de synthèse PDF en cours...')}
                  size="sm"
                  variant="ghost"
                  className="gap-1.5 rounded-xl text-muted-foreground hover:text-foreground text-xs font-semibold"
                >
                  <Download className="size-3.5" />
                  Exporter Synthèse PDF
                </Button>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {displayMetrics.map((m) => {
                const Icon = m.icon
                return (
                  <div
                    key={m.title}
                    className="group relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-white p-5 shadow-xs transition-all duration-200 hover:border-[#16381e]/30 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {m.title}
                      </span>
                      <span className="flex size-9 items-center justify-center rounded-xl bg-[#16381e]/5 text-[#16381e] transition-colors group-hover:bg-[#16381e] group-hover:text-white">
                        <Icon className="size-4" />
                      </span>
                    </div>
                    <div>
                      <span className="font-display text-2xl font-extrabold tracking-tight text-[#16381e]">
                        {m.value}
                      </span>
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#c5a059]">
                        <TrendingUp className="size-3" />
                        {m.change}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Financial Overview & Urgent Tasks Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Card 1: Financial & Payout Summary */}
              <div className="flex flex-col justify-between rounded-3xl border border-[#16381e]/15 bg-gradient-to-br from-white via-[#16381e]/5 to-white p-6 shadow-xs lg:col-span-2">
                <div>
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-10 items-center justify-center rounded-2xl bg-[#16381e] text-white">
                        <Wallet className="size-5" />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-bold text-[#16381e]">Synthèse Financière & Versements</h3>
                        <p className="text-xs text-muted-foreground">Suivi des loyers, commissions et avoirs vérifiés MBIYO</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#16381e]/10 px-3 py-1 text-xs font-bold text-[#16381e]">
                      {activeRole === 'proprietaire' ? 'Compte Bailleur' : activeRole === 'agent' ? 'Compte Agent' : 'Compte Acheteur'}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border/60 bg-white p-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        {activeRole === 'acheteur' ? 'Budget Pré-approuvé' : 'Solde Disponible'}
                      </span>
                      <p className="mt-1 font-display text-xl font-extrabold text-[#16381e]">
                        {apiSummary?.financialOverview?.available_balance || apiSummary?.financialOverview?.preapproved_budget || '$12,450.00'}
                      </p>
                      <span className="mt-1 block text-[10px] text-emerald-700 font-semibold">Prêt pour retrait instantané</span>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-white p-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        {activeRole === 'acheteur' ? 'Acomptes Engagés' : 'Versements en Attente'}
                      </span>
                      <p className="mt-1 font-display text-xl font-extrabold text-[#c5a059]">
                        {apiSummary?.financialOverview?.pending_payouts || apiSummary?.financialOverview?.committed_deposits || '$3,200.00'}
                      </p>
                      <span className="mt-1 block text-[10px] text-muted-foreground">Validation sous 48h</span>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-white p-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Prochain Virement
                      </span>
                      <p className="mt-1 text-sm font-bold text-[#16381e]">
                        {apiSummary?.financialOverview?.next_payout_date || '25 Septembre 2026'}
                      </p>
                      <span className="mt-1 block text-[10px] text-muted-foreground">RIB Certifié MBIYO</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                  <span className="text-xs text-muted-foreground">
                    Garantie bancaire & séquestre notarié intégrés
                  </span>
                  <Button
                    type="button"
                    onClick={() => {
                      setPayoutRequested(true)
                      setTimeout(() => setPayoutRequested(false), 3000)
                    }}
                    disabled={payoutRequested}
                    className="gap-2 rounded-xl bg-[#16381e] text-white hover:bg-[#16381e]/90 text-xs font-bold"
                  >
                    <CreditCard className="size-4 text-[#c5a059]" />
                    {payoutRequested ? 'Demande envoyée !' : 'Demander un Virement Instantané'}
                  </Button>
                </div>
              </div>

              {/* Card 2: Pending Urgent Tasks */}
              <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-white p-6 shadow-xs">
                <div>
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h3 className="font-display text-base font-bold text-[#16381e]">Actions Urgent</h3>
                    <span className="flex size-6 items-center justify-center rounded-full bg-[#c5a059]/20 text-xs font-bold text-[#16381e]">
                      {apiSummary?.pendingTasks?.length || 2}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    {(apiSummary?.pendingTasks || [
                      { id: 't1', title: 'Vérification Titre Foncier N° 4092', type: 'kyc', priority: 'high', dueDate: '18 Sept 2026' },
                      { id: 't2', title: 'Confirmation RIB pour virement', type: 'bank', priority: 'medium', dueDate: '20 Sept 2026' },
                    ]).map((task) => (
                      <div key={task.id} className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-[#f8faf7] p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#16381e]">{task.title}</span>
                          <span className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-bold',
                            task.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          )}>
                            {task.priority === 'high' ? 'Priorité Haute' : 'Moyenne'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 text-[#c5a059]" /> Échéance : {task.dueDate}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedTab('kyc')}
                            className="font-bold text-[#16381e] hover:underline"
                          >
                            Traiter →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-border/60 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTab('kyc')}
                    className="w-full text-center text-xs font-bold text-[#16381e] hover:underline"
                  >
                    Voir toutes les démarches KYC & Mandats →
                  </button>
                </div>
              </div>
            </div>

            {/* Minimalist Interactive Area Chart */}
            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-xs md:p-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold tracking-tight text-[#16381e]">
                    {activeRole === 'agent'
                      ? 'Performance des Consultations & Demandes'
                      : activeRole === 'proprietaire'
                        ? 'Fréquentation des Annonces & Engagement'
                        : 'Évolution du Marché Immobiler'}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Activité mesurée en temps réel sur la plateforme MBIYO.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#16381e]">
                  <span className="size-2.5 rounded-full bg-[#16381e]" />
                  <span>Vues / Intérêt</span>
                  <span className="ml-3 size-2.5 rounded-full bg-[#c5a059]" />
                  <span>Leads & Contacts</span>
                </div>
              </div>

              {/* Vector SVG Sparkline / Area Chart */}
              <div className="relative mt-8 h-48 w-full">
                <svg className="size-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="mbiyo-area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16381e" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#16381e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0, 45, 90, 135, 180].map((y) => (
                    <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#e5e7eb" strokeDasharray="4 4" strokeWidth="1" />
                  ))}

                  {/* Area Fill */}
                  <path
                    d={`M 0 180 ${chartPoints
                      .map((d, i) => {
                        const x = (i / (chartPoints.length - 1)) * 700
                        const y = 160 - (d.value / chartMaxValue) * 130
                        return `L ${x} ${y}`
                      })
                      .join(' ')} L 700 180 Z`}
                    fill="url(#mbiyo-area-grad)"
                  />

                  {/* Primary Line */}
                  <path
                    d={`M ${chartPoints
                      .map((d, i) => {
                        const x = (i / (chartPoints.length - 1)) * 700
                        const y = 160 - (d.value / chartMaxValue) * 130
                        return `${x} ${y}`
                      })
                      .join(' L ')}`}
                    fill="none"
                    stroke="#16381e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Secondary Line (Gold) */}
                  <path
                    d={`M ${chartPoints
                      .map((d, i) => {
                        const x = (i / (chartPoints.length - 1)) * 700
                        const y = 170 - (d.secondary / chartMaxValue) * 350
                        return `${x} ${y}`
                      })
                      .join(' L ')}`}
                    fill="none"
                    stroke="#c5a059"
                    strokeWidth="2.5"
                    strokeDasharray="5 5"
                    strokeLinecap="round"
                  />

                  {/* Interactive Points */}
                  {chartPoints.map((d, i) => {
                    const x = (i / (chartPoints.length - 1)) * 700
                    const y = 160 - (d.value / chartMaxValue) * 130
                    const hovered = hoveredPoint === i
                    return (
                      <g key={d.label} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
                        <circle
                          cx={x}
                          cy={y}
                          r={hovered ? '6' : '4'}
                          fill="#16381e"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          className="cursor-pointer transition-all duration-200"
                        />
                      </g>
                    )
                  })}
                </svg>

                {/* X Axis Labels */}
                <div className="mt-3 flex justify-between text-xs font-semibold text-muted-foreground">
                  {chartPoints.map((d) => (
                    <span key={d.label}>{d.label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity List */}
            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-[#16381e]">Activité Récente en Temps Réel</h3>
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Direct MBIYO
                </span>
              </div>

              <div className="mt-4 flex flex-col divide-y divide-border/60">
                {activitiesList.map((act) => (
                  <div key={act.id} className="flex items-start justify-between gap-4 py-4 first:pt-2 last:pb-2">
                    <div className="flex items-start gap-3.5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#16381e]/10 text-[#16381e]">
                        {act.type === 'offer' ? (
                          <Wallet className="size-4 text-[#c5a059]" />
                        ) : act.type === 'verification' ? (
                          <ShieldCheck className="size-4 text-[#16381e]" />
                        ) : (
                          <MessageSquare className="size-4 text-[#16381e]" />
                        )}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-[#16381e]">{act.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{act.details}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[11px] font-semibold text-muted-foreground">{act.time}</span>
                      {act.status && (
                        <span className="rounded-full bg-[#16381e]/10 px-2 py-0.5 text-[10px] font-bold text-[#16381e]">
                          {act.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PORTEFEUILLE DE BIENS */}
        {selectedTab === 'biens' && (
          <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[#16381e]">
                  {activeRole === 'agent' ? 'Biens gérés par mon agence / compte' : activeRole === 'proprietaire' ? 'Mes Biens Immobiliers' : 'Biens Enregistrés'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {user ? `Biens rattachés à ${user.name}` : 'Vos propriétés publiées et vérifiées MBIYO'}
                </p>
              </div>
              <Button
                nativeButton={false}
                render={<Link href="/publier" />}
                size="sm"
                className="gap-1.5 rounded-full bg-[#16381e] text-white hover:bg-[#16381e]/90 text-xs font-semibold self-start sm:self-auto"
              >
                <Plus className="size-3.5" />
                Publier un Nouveau Bien
              </Button>
            </div>

            {loadingProperties ? (
              <div className="flex items-center justify-center py-12 text-xs text-muted-foreground gap-2">
                <RefreshCw className="size-4 animate-spin text-[#c5a059]" /> Chargement des biens du compte...
              </div>
            ) : userProperties.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {userProperties.map((item) => {
                  const rawImage = item.images?.find((img) => img.is_cover)?.url || item.images?.[0]?.url
                  const coverImage = resolveImageUrl(rawImage)
                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-white shadow-xs transition-transform hover:-translate-y-1"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={coverImage}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3 rounded-full bg-[#16381e] px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                          {item.is_verified ? 'Certifié MBIYO' : item.status === 'published' ? 'En ligne' : 'En révision'}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 p-5">
                        <h3 className="truncate font-semibold text-[#16381e] text-base">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.neighborhood || item.district || ''} {item.city || ''}</p>
                        <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-3">
                          <span className="font-display text-lg font-bold text-[#16381e]">
                            ${item.price?.toLocaleString()} {item.transaction_type === 'rent' ? '/mois' : ''}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingProperty(item)}
                              className="inline-flex items-center gap-1 rounded-xl bg-[#16381e] px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-xs"
                            >
                              <Edit3 className="size-3.5" /> Gérer
                            </button>
                            <Link
                              href={`/biens/${item.slug || item.id}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#16381e] hover:underline"
                            >
                              Voir <ArrowUpRight className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.slice(0, 4).map((item) => (
                  <div
                    key={item.slug}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-white shadow-xs transition-transform hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 rounded-full bg-[#16381e] px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                        {item.verified ? 'Certifié MBIYO' : 'En révision'}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 p-5">
                      <h3 className="truncate font-semibold text-[#16381e] text-base">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.district}, {item.city}</p>
                      <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-3">
                        <span className="font-display text-lg font-bold text-[#16381e]">
                          {formatPrice(item)}
                        </span>
                        <Link
                          href={`/biens/${item.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#16381e] hover:underline"
                        >
                          Détails <ArrowUpRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ESPACE KYC & SERVICES PROPRIÉTAIRE */}
        {selectedTab === 'kyc' && (
          <div className="mt-8">
            <OwnerKycPanel />
          </div>
        )}

        {/* TAB 4: JOURNAL D'ACTIVITÉ */}
        {selectedTab === 'activites' && (
          <div className="mt-8 rounded-3xl border border-border/80 bg-white p-6">
            <h3 className="font-display text-lg font-bold text-[#16381e]">Historique Complet des Actions</h3>
            <p className="text-xs text-muted-foreground mt-1">Tracé sécurisé des visites, offres et vérifications de titres.</p>
            <div className="mt-6 flex flex-col gap-3">
              {[
                { time: 'Aujourd\'hui 14:20', text: 'Mise à jour des coordonnées cadastrales pour la Villa Katindo.' },
                { time: 'Hier 11:05', text: 'Validation du titre foncier N° 8902-SK par l\'équipe juridique MBIYO.' },
                { time: '08 Août 09:30', text: 'Visite guidée virtuelle enregistrée par 3 acheteurs internationaux.' },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-border/60 p-4 bg-[#f8faf7]">
                  <CheckCircle2 className="size-5 shrink-0 text-[#c5a059]" />
                  <div className="flex-1 text-xs">
                    <span className="font-bold text-[#16381e]">{log.time}</span> — {log.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <EditPropertyModal
        property={editingProperty}
        isOpen={!!editingProperty}
        onClose={() => setEditingProperty(null)}
        onSaved={loadUserProperties}
      />

      <SiteFooter />
    </div>
  )
}
