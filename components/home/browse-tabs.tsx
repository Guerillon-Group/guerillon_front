'use client'

import { useEffect, useState } from 'react'
import { Briefcase, Building2, Home, LayoutGrid, Sprout, Trees } from 'lucide-react'

import { ListingRail } from '@/components/home/listing-rail'
import { apiPropertyToListing, type Listing } from '@/lib/properties'
import { cn } from '@/lib/utils'
import { propertyService } from '@/services/property.service'

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
  const [properties, setProperties] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  const current = tabs.find((t) => t.id === active) ?? tabs[0]

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    propertyService
      .getProperties({ per_page: 20 })
      .then((res) => {
        if (cancelled) return
        const raw = res.data?.data || []
        const converted = raw.map(apiPropertyToListing)
        setProperties(converted)
      })
      .catch((err) => {
        console.warn('Failed to load browse tabs properties from API:', err)
        if (!cancelled) setProperties([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const items = active === 'tout' ? properties : properties.filter((l) => l.type === active)

  const select = (id: string) => {
    if (id === active) return
    setActive(id)
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1280px] overflow-hidden px-4 pt-8 md:px-6">
        <div
          role="tablist"
          aria-label="Filtrer par type de bien"
          className="hide-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1 md:justify-center"
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
