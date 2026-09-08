'use client'

import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'

import { LocationCanvas } from '@/components/map/location-canvas'
import { cityCoords, type Draft } from '@/components/publish/draft'
import { Field, Select, StepHeading, TextInput } from '@/components/publish/fields'
import { cities } from '@/lib/properties'
import { worldService } from '@/services/world.service'
import { WorldCity, WorldCountry, WorldState } from '@/types/world.types'

export function StepAddress({
  draft,
  update,
}: {
  draft: Draft
  update: (patch: Partial<Draft>) => void
}) {
  const [countriesList, setCountriesList] = useState<WorldCountry[]>([])
  const [statesList, setStatesList] = useState<WorldState[]>([])
  const [citiesList, setCitiesList] = useState<WorldCity[]>([])

  useEffect(() => {
    async function loadCountries() {
      const data = await worldService.getCountries()
      if (data && data.length > 0) {
        setCountriesList(data)
      }
    }
    loadCountries()
  }, [])

  useEffect(() => {
    async function loadStates() {
      if (draft.country_id) {
        const data = await worldService.getStates(draft.country_id)
        setStatesList(data)
      } else {
        setStatesList([])
      }
    }
    loadStates()
  }, [draft.country_id])

  useEffect(() => {
    async function loadCities() {
      if (draft.country_id || draft.province_id) {
        const data = await worldService.getCities({
          countryId: draft.country_id,
          stateId: draft.province_id,
        })
        setCitiesList(data)
      } else {
        setCitiesList([])
      }
    }
    loadCities()
  }, [draft.country_id, draft.province_id])

  return (
    <div className="flex flex-col gap-8">
      <StepHeading
        title="Où se situe le bien ?"
        description="Placez le repère à l’emplacement exact : les acheteurs filtrent d’abord par pays, province, ville et quartier, puis sur la carte."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {countriesList.length > 0 && (
          <Field label="Pays">
            {(id) => (
              <Select
                id={id}
                value={draft.country_id || ''}
                onChange={(event) => {
                  const val = event.target.value ? Number(event.target.value) : undefined
                  update({ country_id: val, province_id: undefined, city_id: undefined })
                }}
              >
                <option value="">Sélectionner un pays</option>
                {countriesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        )}

        {statesList.length > 0 && (
          <Field label="Province / État">
            {(id) => (
              <Select
                id={id}
                value={draft.province_id || ''}
                onChange={(event) => {
                  const val = event.target.value ? Number(event.target.value) : undefined
                  update({ province_id: val, city_id: undefined })
                }}
              >
                <option value="">Sélectionner une province</option>
                {statesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        )}

        <Field label="Ville">
          {(id) => (
            <Select
              id={id}
              value={draft.city_id ? String(draft.city_id) : draft.city}
              onChange={(event) => {
                const val = event.target.value
                const foundWorldCity = citiesList.find((c) => String(c.id) === val)
                if (foundWorldCity) {
                  const lat = foundWorldCity.latitude ? Number(foundWorldCity.latitude) : draft.lat
                  const lng = foundWorldCity.longitude ? Number(foundWorldCity.longitude) : draft.lng
                  update({
                    city_id: foundWorldCity.id,
                    city: foundWorldCity.name,
                    lat,
                    lng,
                  })
                } else {
                  const coords = cityCoords[val]
                  update(coords ? { city: val, city_id: undefined, lat: coords[0], lng: coords[1] } : { city: val, city_id: undefined })
                }
              }}
            >
              {citiesList.length > 0 ? (
                <>
                  <option value="">Sélectionner une ville</option>
                  {citiesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </>
              ) : (
                cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))
              )}
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
