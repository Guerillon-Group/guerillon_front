'use client'

import { useEffect, useState } from 'react'
import { Briefcase, Building2, Home, LayoutGrid, MapPin, Sprout, Trees } from 'lucide-react'

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

const citySubgroups = [
  { id: 'tout', label: 'Toutes les villes' },
  { id: 'Goma', label: 'Goma' },
  { id: 'Kinshasa', label: 'Kinshasa' },
  { id: 'Bukavu', label: 'Bukavu' },
  { id: 'Lubumbashi', label: 'Lubumbashi' },
] as const

interface BrowseTabsProps {
  selectedCity?: string
  onCityChange?: (city: string) => void
}

export function BrowseTabs({ selectedCity = 'tout', onCityChange }: BrowseTabsProps) {
  const [activeType, setActiveType] = useState<string>('tout')
  const [activeCity, setActiveCity] = useState<string>(selectedCity)
  const [properties, setProperties] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (selectedCity && selectedCity !== activeCity) {
      setActiveCity(selectedCity)
    }
  }, [selectedCity])

  const currentType = tabs.find((t) => t.id === activeType) ?? tabs[0]

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    propertyService
      .getProperties({ per_page: 30 })
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

  const handleCitySelect = (cityId: string) => {
    setActiveCity(cityId)
    if (onCityChange) onCityChange(cityId)
  }

  const items = properties.filter((l) => {
    if (activeType !== 'tout' && l.type !== activeType) return false
    if (activeCity !== 'tout') {
      const propertyCity = (l.city || '').toLocaleLowerCase('fr-FR')
      const targetCity = activeCity.toLocaleLowerCase('fr-FR')
      if (!propertyCity.includes(targetCity)) return false
    }
    return true
  })

  const typeTitle = activeType === 'tout' ? 'Biens' : currentType.label
  const cityTitle = activeCity === 'tout' ? '' : `à ${activeCity}`
  const displayTitle = `${typeTitle} disponibles ${cityTitle}`.trim()

  return (
    <>
      <div className="mx-auto w-full max-w-[1280px] overflow-hidden px-4 pt-8 md:px-6">
        {/* Barre 1 : Sélection par Type de Bien */}
        <div
          role="tablist"
          aria-label="Filtrer par type de bien"
          className="hide-scrollbar flex items-center gap-1.5 overflow-x-auto pb-2 md:justify-center"
        >
          {tabs.map((tab) => {
            const selected = tab.id === activeType
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveType(tab.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[15px] transition-all duration-300 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                  selected
                    ? 'scale-[1.03] bg-[#16381e] font-semibold text-white shadow-lg shadow-[#16381e]/20'
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

        {/* Barre 2 : Sous-groupes par Ville */}
        <div className="mt-3 flex items-center justify-center gap-2 border-t border-border/40 pt-3">
          <span className="flex items-center gap-1 text-xs font-bold text-[#16381e] uppercase tracking-wider hidden sm:flex">
            <MapPin className="size-3.5 text-[#c5a059]" />
            Ville :
          </span>
          <div className="hide-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5">
            {citySubgroups.map((city) => {
              const selected = city.id === activeCity
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleCitySelect(city.id)}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 shrink-0',
                    selected
                      ? 'bg-[#16381e] text-white shadow-xs'
                      : 'bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                >
                  {city.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <ListingRail
        title={displayTitle}
        subtitle={currentType.subtitle}
        items={items}
        loading={loading}
        priority
      />
    </>
  )
}
