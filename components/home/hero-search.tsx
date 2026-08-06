'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Loader2, Search } from 'lucide-react'

import { cities } from '@/lib/properties'

const intents = ['Acheter', 'Louer'] as const
const budgets = ['Indifférent', 'Jusqu’à 1 000 $', 'Jusqu’à 2 500 $', 'Jusqu’à 100 000 $', 'Jusqu’à 400 000 $']
const moments = ['Dès que possible', 'Sous 1 mois', 'Sous 3 mois', 'Cette année']

export function HeroSearch() {
  const router = useRouter()
  const [where, setWhere] = useState('')
  const [intent, setIntent] = useState<string>(intents[0])
  const [budget, setBudget] = useState(budgets[0])
  const [moment, setMoment] = useState(moments[0])
  const [pending, startTransition] = useTransition()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const query = new URLSearchParams()
        if (where.trim()) query.set('q', where.trim())
        startTransition(() => router.push(query.size ? `/carte?${query}` : '/carte'))
      }}
      aria-label="Rechercher un bien"
      aria-busy={pending}
      className="relative flex w-full flex-col gap-px overflow-hidden rounded-xl border-2 border-foreground/12 bg-card transition-all duration-300 focus-within:border-accent/60 focus-within:shadow-xl focus-within:shadow-accent/10 md:flex-row md:items-stretch"
    >
      {pending && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-secondary"
        >
          <span className="skeleton block h-full w-full bg-accent/40" />
        </span>
      )}

      <div className="flex min-w-0 flex-[1.4] flex-col justify-center px-4 py-3">
        <label htmlFor="hero-where" className="text-[13px] font-semibold text-foreground">
          Où
        </label>
        <input
          id="hero-where"
          list="hero-cities"
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          placeholder="Ville, quartier ou avenue"
          className="mt-0.5 w-full truncate bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
        />
        <datalist id="hero-cities">
          {cities.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <Rule />

      <SelectField label="Projet" value={intent} onChange={setIntent} options={[...intents]} />

      <Rule />

      <SelectField label="Budget" value={budget} onChange={setBudget} options={budgets} />

      <Rule />

      <SelectField label="Échéance" value={moment} onChange={setMoment} options={moments} />

      <div className="flex items-center justify-end p-2">
        <button
          type="submit"
          disabled={pending}
          className="flex size-11 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground transition-transform duration-200 hover:scale-105 hover:opacity-90 active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-70 max-md:w-full"
        >
          {pending ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="size-5" aria-hidden="true" />
          )}
          <span className="sr-only">{pending ? 'Recherche en cours' : 'Lancer la recherche'}</span>
        </button>
      </div>
    </form>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
      <span className="text-[13px] font-semibold text-foreground">{label}</span>
      <div className="relative mt-0.5 flex items-center">
        <select
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none truncate bg-transparent pr-5 text-[15px] text-muted-foreground outline-none"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 size-4 text-muted-foreground" aria-hidden="true" />
      </div>
    </div>
  )
}

function Rule() {
  return <span aria-hidden="true" className="shrink-0 bg-border max-md:h-px max-md:w-full md:my-2 md:w-px" />
}
