'use client'

import { Building2, Home, Landmark, Mountain, Trees } from 'lucide-react'

import { StepHeading } from '@/components/publish/fields'
import type { Draft } from '@/components/publish/draft'
import { cn } from '@/lib/utils'
import type { Listing } from '@/lib/properties'

const options: { type: Listing['type']; icon: typeof Home; blurb: string }[] = [
  { type: 'Appartement', icon: Building2, blurb: 'Étage dans une résidence' },
  { type: 'Villa', icon: Trees, blurb: 'Maison avec jardin ou piscine' },
  { type: 'Maison', icon: Home, blurb: 'Habitation individuelle' },
  { type: 'Terrain', icon: Mountain, blurb: 'Parcelle nue ou viabilisée' },
  { type: 'Bureau', icon: Landmark, blurb: 'Local professionnel' },
]

export function StepType({
  draft,
  update,
}: {
  draft: Draft
  update: (patch: Partial<Draft>) => void
}) {
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
              onClick={() => update({ type })}
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
