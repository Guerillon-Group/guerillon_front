'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Loader2, MapPin, Search } from 'lucide-react'

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
      className="relative flex w-full max-w-full overflow-hidden flex-col gap-2 rounded-2xl border border-border/80 bg-card p-3 shadow-xl shadow-black/5 transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-2xl md:flex-row md:items-stretch md:gap-px md:rounded-full md:p-1.5 md:border-2"
    >
      {pending && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-secondary rounded-t-2xl"
        >
          <span className="skeleton block h-full w-full bg-accent/60" />
        </span>
      )}

      <div className="flex min-w-0 flex-[1.4] flex-col justify-center rounded-xl bg-secondary/40 px-4 py-2.5 md:rounded-none md:bg-transparent md:py-2">
        <label htmlFor="hero-where" className="flex items-center gap-1.5 text-xs font-bold text-[#16381e]">
          <MapPin className="size-3.5 text-[#c5a059]" />
          Où
        </label>
        <input
          id="hero-where"
          list="hero-cities"
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          placeholder="Ville, quartier ou avenue..."
          className="mt-0.5 w-full truncate bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/70"
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

      <div className="flex items-center justify-end pt-1 md:pt-0 md:p-1">
        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#16381e] px-6 text-white font-bold transition-all duration-200 hover:bg-[#16381e]/90 active:scale-95 disabled:opacity-70 md:h-full md:w-auto md:rounded-full md:px-7"
        >
          {pending ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="size-4 text-[#c5a059]" aria-hidden="true" />
          )}
          <span className="text-sm font-bold md:hidden">Lancer la recherche</span>
          <span className="sr-only max-md:hidden">Recherche</span>
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
    <div className="flex min-w-0 flex-1 flex-col justify-center rounded-xl bg-secondary/40 px-4 py-2.5 md:rounded-none md:bg-transparent md:py-2">
      <span className="text-xs font-bold text-[#16381e]">{label}</span>
      <div className="relative mt-0.5 flex items-center">
        <select
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none truncate bg-transparent pr-5 text-sm font-medium text-foreground outline-none"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 size-4 text-[#c5a059]" aria-hidden="true" />
      </div>
    </div>
  )
}

function Rule() {
  return <span aria-hidden="true" className="hidden shrink-0 bg-border md:block md:my-2 md:w-px" />
}
