'use client'

import { Bath, BedDouble, Check, MapPin, Maximize } from 'lucide-react'

import { isLand, type Draft } from '@/components/publish/draft'
import { Field, StepHeading, TextInput } from '@/components/publish/fields'

export function StepReview({
  draft,
  update,
  errors,
}: {
  draft: Draft
  update: (patch: Partial<Draft>) => void
  errors: string[]
}) {
  const price = Number(draft.price) || 0
  const formatted = new Intl.NumberFormat('fr-FR').format(price)

  return (
    <div className="flex flex-col gap-8">
      <StepHeading
        title="Vérifiez puis publiez"
        description="Notre équipe contrôle le titre de propriété sous 48 h. L’annonce reste visible pendant la vérification."
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative aspect-16/9 w-full bg-secondary">
          {draft.photos[0] ? (
            // Local object URL preview — next/image is unnecessary.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.photos[0].url} alt={draft.title || 'Aperçu du bien'} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              Aucune photo
            </div>
          )}
          <span className="absolute top-3 left-3 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
            {draft.status}
          </span>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold tracking-[-0.01em] text-foreground text-pretty">
                {draft.title || 'Titre de l’annonce'}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden="true" />
                {draft.district || 'Quartier'}, {draft.city}
              </p>
            </div>
            <p className="font-display text-xl font-semibold text-foreground">
              {formatted} ${draft.status === 'À louer' ? ' /mois' : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground">{draft.type}</span>
            {!isLand(draft) && (
              <>
                <span className="flex items-center gap-1.5">
                  <BedDouble className="size-4" aria-hidden="true" />
                  {draft.beds} ch.
                </span>
                <span className="flex items-center gap-1.5">
                  <Bath className="size-4" aria-hidden="true" />
                  {draft.baths} sdb
                </span>
              </>
            )}
            <span className="flex items-center gap-1.5">
              <Maximize className="size-4" aria-hidden="true" />
              {draft.surface || 0} m²
            </span>
            <span className="ml-auto text-xs">{draft.photos.length} photo(s)</span>
          </div>

          {draft.features.length > 0 && (
            <ul className="flex flex-wrap gap-2 border-t border-border pt-4">
              {draft.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-foreground"
                >
                  <Check className="size-3" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom du contact">
          {(id) => (
            <TextInput
              id={id}
              value={draft.contactName}
              onChange={(event) => update({ contactName: event.target.value })}
              placeholder="Sarah Mukendi"
            />
          )}
        </Field>

        <Field label="Téléphone / WhatsApp">
          {(id) => (
            <TextInput
              id={id}
              type="tel"
              value={draft.contactPhone}
              onChange={(event) => update({ contactPhone: event.target.value })}
              placeholder="+243 970 000 000"
            />
          )}
        </Field>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card p-4">
        <input
          type="checkbox"
          checked={draft.agree}
          onChange={(event) => update({ agree: event.target.checked })}
          className="mt-0.5 size-4 accent-foreground"
        />
        <span className="text-sm leading-relaxed text-muted-foreground">
          Je certifie être propriétaire ou mandaté pour la mise en ligne de ce bien et j’accepte la vérification du
          titre par Real Estate.
        </span>
      </label>

      {errors.length > 0 && (
        <ul className="flex flex-col gap-1.5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
          {errors.map((error) => (
            <li key={error} className="text-sm text-destructive">
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
