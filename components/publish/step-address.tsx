'use client'

import { MapPin } from 'lucide-react'

import { LocationCanvas } from '@/components/map/location-canvas'
import { cityCoords, type Draft } from '@/components/publish/draft'
import { Field, Select, StepHeading, TextInput } from '@/components/publish/fields'
import { cities } from '@/lib/properties'

export function StepAddress({
  draft,
  update,
}: {
  draft: Draft
  update: (patch: Partial<Draft>) => void
}) {
  return (
    <div className="flex flex-col gap-8">
      <StepHeading
        title="Où se situe le bien ?"
        description="Placez le repère à l’emplacement exact : les acheteurs filtrent d’abord par quartier, puis sur la carte."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ville">
          {(id) => (
            <Select
              id={id}
              value={draft.city}
              onChange={(event) => {
                const city = event.target.value
                const coords = cityCoords[city]
                update(coords ? { city, lat: coords[0], lng: coords[1] } : { city })
              }}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Quartier">
          {(id) => (
            <TextInput
              id={id}
              value={draft.district}
              onChange={(event) => update({ district: event.target.value })}
              placeholder="Himbi, Katindo, Gombe…"
            />
          )}
        </Field>
      </div>

      <Field label="Adresse ou point de repère" hint="Visible uniquement par les acheteurs ayant demandé une visite.">
        {(id) => (
          <TextInput
            id={id}
            value={draft.address}
            onChange={(event) => update({ address: event.target.value })}
            placeholder="Av. du Lac, 200 m après l’hôtel Ihusi"
          />
        )}
      </Field>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground">Position sur la carte</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden="true" />
            <span className="tabular-nums">
              {draft.lat.toFixed(5)}, {draft.lng.toFixed(5)}
            </span>
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border">
          <LocationCanvas
            lat={draft.lat}
            lng={draft.lng}
            onChange={(lat, lng) => update({ lat, lng })}
            className="h-[380px] w-full"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Cliquez sur la carte ou faites glisser le repère pour ajuster la position.
        </p>
      </div>
    </div>
  )
}
