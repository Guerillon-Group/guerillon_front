'use client'

import { useEffect, useRef, useState } from 'react'
import { Briefcase, Building2, Home, LayoutGrid, Sprout, Trees } from 'lucide-react'

import { ListingRail } from '@/components/home/listing-rail'
import { listings } from '@/lib/properties'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'tout', label: 'Tout', icon: LayoutGrid, subtitle: 'Prix moyens constatés sur les 30 derniers jours' },
  { id: 'Appartement', label: 'Appartements', icon: Building2, subtitle: 'Résidences récentes, charges et énergie détaillées' },
  { id: 'Villa', label: 'Villas', icon: Home, subtitle: 'Grandes surfaces avec jardin ou piscine' },
  { id: 'Maison', label: 'Maisons', icon: Trees, subtitle: 'Maisons familiales, meublées ou nues' },
  { id: 'Terrain', label: 'Terrains', icon: Sprout, subtitle: 'Parcelles bornées, titre foncier vérifié' },
  { id: 'Bureau', label: 'Bureaux', icon: Briefcase, subtitle: 'Plateaux professionnels prêts à occuper' },
] as const

export function BrowseTabs() {
  const [active, setActive] = useState<string>('tout')
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const current = tabs.find((t) => t.id === active) ?? tabs[0]
  const items = active === 'tout' ? listings : listings.filter((l) => l.type === active)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const select = (id: string) => {
    if (id === active) return
    if (timer.current) clearTimeout(timer.current)
    setActive(id)
    setLoading(true)
    timer.current = setTimeout(() => setLoading(false), 520)
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-8 md:px-6">
        <div
          role="tablist"
          aria-label="Filtrer par type de bien"
          className="hide-scrollbar -mx-4 flex items-center gap-1 overflow-x-auto px-4 md:mx-0 md:justify-center md:px-0"
        >
          {tabs.map((tab) => {
            const selected = tab.id === active
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => select(tab.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[15px] transition-all duration-300 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                  selected
                    ? 'scale-[1.03] bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:-translate-y-0.5 hover:bg-secondary hover:text-foreground',
                )}
              >
                <tab.icon
                  className={cn('size-4 transition-transform duration-300', selected && 'scale-110')}
                  aria-hidden="true"
                />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <ListingRail
        title={active === 'tout' ? 'Biens disponibles maintenant' : `${current.label} disponibles`}
        subtitle={current.subtitle}
        items={items}
        loading={loading}
        priority
      />
    </>
  )
}
