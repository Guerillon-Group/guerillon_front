'use client'

import { Check } from 'lucide-react'

import { featureOptions, isLand, type Draft } from '@/components/publish/draft'
import { Field, StepHeading, Stepper, TextArea, TextInput } from '@/components/publish/fields'
import { cn } from '@/lib/utils'

export function StepDetails({
  draft,
  update,
}: {
  draft: Draft
  update: (patch: Partial<Draft>) => void
}) {
  const land = isLand(draft)

  return (
    <div className="flex flex-col gap-8">
      <StepHeading
        title="Décrivez le bien"
        description="Un titre précis et une description honnête réduisent de moitié les visites inutiles."
      />

      <Field label="Titre de l’annonce" hint={`${draft.title.length}/80 caractères`}>
        {(id) => (
          <TextInput
            id={id}
            value={draft.title}
            maxLength={80}
            onChange={(event) => update({ title: event.target.value })}
            placeholder="Appartement moderne, vue sur le lac"
          />
        )}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={draft.status === 'À louer' ? 'Loyer mensuel' : 'Prix de vente'}
          hint={draft.status === 'À louer' ? 'Montant en dollars, charges comprises.' : 'Montant en dollars, hors frais de notaire.'}
        >
          {(id) => (
            <TextInput
              id={id}
              type="number"
              min={0}
              inputMode="numeric"
              value={draft.price}
              onChange={(event) => update({ price: event.target.value })}
              placeholder={draft.status === 'À louer' ? '1450' : '268000'}
              suffix={draft.status === 'À louer' ? '$/mois' : 'USD'}
            />
          )}
        </Field>

        <Field label={land ? 'Superficie du terrain' : 'Surface habitable'}>
          {(id) => (
            <TextInput
              id={id}
              type="number"
              min={0}
              inputMode="numeric"
              value={draft.surface}
              onChange={(event) => update({ surface: event.target.value })}
              placeholder="128"
              suffix="m²"
            />
          )}
        </Field>
      </div>

      {!land && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Stepper label="Chambres" value={draft.beds} onChange={(beds) => update({ beds })} />
          <Stepper label="Salles de bain" value={draft.baths} onChange={(baths) => update({ baths })} max={8} />
        </div>
      )}

      <Field label="Description" hint={`${draft.description.trim().length} caractères — 40 minimum`}>
        {(id) => (
          <TextArea
            id={id}
            rows={6}
            value={draft.description}
            onChange={(event) => update({ description: event.target.value })}
            placeholder="Volumes, orientation, état, équipements techniques, environnement immédiat…"
          />
        )}
      </Field>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">Équipements et atouts</p>
        <div className="flex flex-wrap gap-2">
          {featureOptions.map((feature) => {
            const selected = draft.features.includes(feature)
            return (
              <button
                key={feature}
                type="button"
                onClick={() =>
                  update({
                    features: selected
                      ? draft.features.filter((f) => f !== feature)
                      : [...draft.features, feature],
                  })
                }
                aria-pressed={selected}
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors duration-200',
                  selected
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                )}
              >
                {selected && <Check className="size-3.5" aria-hidden="true" />}
                {feature}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
