'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cities, propertyTypes } from '@/lib/properties'

const budgets = ['Tous budgets', "< 100 000 $", '100 – 250 000 $', '250 – 500 000 $', '> 500 000 $']

export function SearchBar() {
  const router = useRouter()
  const [city, setCity] = useState<string>('Goma')
  const [type, setType] = useState<string>('Appartement')
  const [budget, setBudget] = useState<string>(budgets[0])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        router.push('/carte')
      }}
      className="glass-panel flex w-full flex-col gap-2 rounded-2xl border border-border p-2 md:flex-row md:items-center md:rounded-full md:p-2"
      aria-label="Rechercher un bien"
    >
      <Field label="Localisation">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Divider />

      <Field label="Type de bien">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
        >
          {propertyTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Divider />

      <Field label="Budget">
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
        >
          {budgets.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </Field>

      <Button type="submit" className="h-12 shrink-0 gap-2 rounded-full px-6 md:ml-1">
        <Search className="size-4" />
        Rechercher
      </Button>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 flex-1 cursor-pointer flex-col gap-0.5 rounded-xl px-4 py-2 transition-colors hover:bg-foreground/[0.03] md:rounded-full">
      <span className="text-[11px] font-semibold tracking-[0.05em] text-muted-foreground uppercase">{label}</span>
      {children}
    </label>
  )
}

function Divider() {
  return <span aria-hidden="true" className="hidden h-8 w-px shrink-0 bg-border md:block" />
}
