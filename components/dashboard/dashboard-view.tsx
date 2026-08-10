'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Filter,
  Heart,
  Home,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  Wallet,
} from 'lucide-react'

import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { listings, formatPrice } from '@/lib/properties'
import { cn } from '@/lib/utils'

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
  const [activeRole, setActiveRole] = useState<UserRole>('agent')
  const [selectedTab, setSelectedTab] = useState<'apercu' | 'biens' | 'activites'>('apercu')
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  const current = roleData[activeRole]
  const maxValue = Math.max(...current.chartData.map((d) => d.value))

  return (
    <div className="flex min-h-dvh flex-col bg-[#f8faf7]">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 md:px-6 md:py-10">
        {/* Top Minimalist Header & Role Selector */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative size-14 overflow-hidden rounded-2xl border-2 border-[#16381e]/20 bg-white p-0.5 shadow-sm">
              <Image
                src={current.avatar}
                alt={current.name}
                width={80}
                height={80}
                className="size-full rounded-[14px] object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#16381e]">
                  {current.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#16381e]/10 px-2.5 py-0.5 text-xs font-bold text-[#16381e] border border-[#16381e]/20">
                  <BadgeCheck className="size-3.5 fill-[#c5a059] text-white" />
                  {current.badge}
                </span>
              </div>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">{current.subtitle}</p>
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
                  onClick={() => setActiveRole(r)}
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
            {[
              { id: 'apercu', label: 'Vue d\'ensemble' },
              { id: 'biens', label: activeRole === 'acheteur' ? 'Biens enregistrés' : 'Portefeuille de Biens' },
              { id: 'activites', label: 'Journal d\'activité' },
            ].map((tab) => {
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

        {/* TAB 1: APERÇU (METRICS + MINIMALIST GRAPH + RECENT ACTIVITIES) */}
        {selectedTab === 'apercu' && (
          <div className="mt-8 flex flex-col gap-8">
            {/* Key Metrics Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {current.metrics.map((m) => {
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

            {/* Minimalist Interactive Area Chart */}
            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-xs md:p-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold tracking-tight text-[#16381e]">
                    {activeRole === 'agent'
                      ? 'Performance des Consultations & Demandes'
                      : activeRole === 'proprietaire'
                        ? 'Fréquentation des Annonces'
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
                    d={`M 0 180 ${current.chartData
                      .map((d, i) => {
                        const x = (i / (current.chartData.length - 1)) * 700
                        const y = 160 - (d.value / maxValue) * 130
                        return `L ${x} ${y}`
                      })
                      .join(' ')} L 700 180 Z`}
                    fill="url(#mbiyo-area-grad)"
                  />

                  {/* Primary Line */}
                  <path
                    d={`M ${current.chartData
                      .map((d, i) => {
                        const x = (i / (current.chartData.length - 1)) * 700
                        const y = 160 - (d.value / maxValue) * 130
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
                    d={`M ${current.chartData
                      .map((d, i) => {
                        const x = (i / (current.chartData.length - 1)) * 700
                        const y = 170 - (d.secondary / maxValue) * 350
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
                  {current.chartData.map((d, i) => {
                    const x = (i / (current.chartData.length - 1)) * 700
                    const y = 160 - (d.value / maxValue) * 130
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
                  {current.chartData.map((d) => (
                    <span key={d.label}>{d.label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity List */}
            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-[#16381e]">Activité Récente</h3>
                <span className="text-xs font-semibold text-muted-foreground">Temps Réel</span>
              </div>

              <div className="mt-4 flex flex-col divide-y divide-border/60">
                {current.activities.map((act) => (
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
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* TAB 3: JOURNAL D'ACTIVITÉ */}
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

      <SiteFooter />
    </div>
  )
}
