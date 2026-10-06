'use client'

import { useEffect, useState } from 'react'
import { Building2, Home, Landmark, Mountain, Trees } from 'lucide-react'

import { StepHeading } from '@/components/publish/fields'
import type { Draft } from '@/components/publish/draft'
import { cn } from '@/lib/utils'
import type { Listing } from '@/lib/properties'
import { propertyService } from '@/services/property.service'
import type { PropertyCategory, PropertyType as ApiPropertyType } from '@/types/property.types'

const options: { type: Listing['type']; icon: typeof Home; blurb: string }[] = [
  { type: 'Appartement', icon: Building2, blurb: 'Étage dans une résidence' },
  { type: 'Maison', icon: Home, blurb: 'Habitation individuelle' },
  { type: 'Villa', icon: Trees, blurb: 'Maison haut de gamme avec jardin' },
  { type: 'Studio', icon: Home, blurb: 'Logement une pièce optimisé' },
  { type: 'Terrain', icon: Mountain, blurb: 'Parcelle nue ou à bâtir' },
  { type: 'Ferme', icon: Trees, blurb: 'Exploitation ou domaine agricole' },
  { type: 'Bureau', icon: Landmark, blurb: 'Espace professionnel / plateau' },
  { type: 'Hôtel', icon: Building2, blurb: 'Établissement hôtelier ou lodge' },
  { type: 'Entrepôt', icon: Landmark, blurb: 'Espace de stockage / logistique' },
  { type: 'Local commercial', icon: Building2, blurb: 'Boutique ou espace de vente' },
  { type: 'Immeuble', icon: Building2, blurb: 'Bâtiment complet R+N' },
  { type: 'Résidence', icon: Building2, blurb: 'Ensemble de logements sécurisés' },
]

export function StepType({
  draft,
  update,
}: {
  draft: Draft
  update: (patch: Partial<Draft>) => void
}) {
  const [apiTypes, setApiTypes] = useState<ApiPropertyType[]>([])
  const [apiCategories, setApiCategories] = useState<PropertyCategory[]>([])

  useEffect(() => {
    async function loadMetadata() {
      try {
        const [typesRes, catRes] = await Promise.all([
          propertyService.getTypes(),
          propertyService.getCategories(),
        ])
        const loadedTypes = typesRes?.data || []
        const loadedCategories = catRes?.data || []
        setApiTypes(loadedTypes)
        setApiCategories(loadedCategories)

        // Set default type ID if not already set
        if (loadedTypes.length > 0 && !draft.property_type_id) {
          const match = loadedTypes.find((t) => t.name.toLowerCase() === draft.type.toLowerCase() || t.slug === draft.type.toLowerCase())
          if (match) {
            update({ property_type_id: match.id })
          } else {
            update({ property_type_id: loadedTypes[0].id })
          }
        }
        if (loadedCategories.length > 0 && !draft.property_category_id) {
          update({ property_category_id: loadedCategories[0].id })
        }
      } catch (err) {
        console.warn('Failed to load API property types/categories:', err)
      }
    }
    loadMetadata()
  }, [])

  const handleSelectType = (selectedType: Listing['type']) => {
    const match = apiTypes.find(
      (t) => t.name.toLowerCase() === selectedType.toLowerCase() || t.slug.toLowerCase() === selectedType.toLowerCase(),
    )
    update({
      type: selectedType,
      property_type_id: match ? match.id : draft.property_type_id,
    })
  }
  return (
    <div className="flex flex-col gap-8">
      <StepHeading
        title="Quel type de bien proposez-vous ?"
        description="Ce choix détermine les informations que nous vous demanderons ensuite."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map(({ type, icon: Icon, blurb }) => {
          const selected = draft.type === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => handleSelectType(type)}
              aria-pressed={selected}
              className={cn(
                'group flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all duration-200',
                selected
                  ? 'border-foreground bg-card shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
                  : 'border-border bg-card hover:border-foreground/25',
              )}
            >
              <span
                className={cn(
                  'flex size-10 items-center justify-center rounded-xl transition-colors duration-200',
                  selected ? 'bg-foreground text-background' : 'bg-secondary text-foreground',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground">{type}</span>
                <span className="text-xs text-muted-foreground">{blurb}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-display text-lg font-semibold tracking-[-0.01em] text-foreground">
          Type de transaction
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {(['À vendre', 'À louer'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => update({ status })}
              aria-pressed={draft.status === status}
              className={cn(
                'flex flex-col gap-1 rounded-2xl border p-5 text-left transition-all duration-200',
                draft.status === status
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-foreground hover:border-foreground/25',
              )}
            >
              <span className="text-sm font-semibold">{status}</span>
              <span
                className={cn(
                  'text-xs',
                  draft.status === status ? 'text-background/70' : 'text-muted-foreground',
                )}
              >
                {status === 'À vendre' ? 'Prix de cession unique' : 'Loyer mensuel en dollars'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
