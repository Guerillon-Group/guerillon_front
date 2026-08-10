'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, MapPin, DollarSign, Search, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cities, propertyTypes } from '@/lib/properties'
import { cn } from '@/lib/utils'

const budgets = ['Tous budgets', '< 100 000 $', '100 – 250 000 $', '250 – 500 000 $', '> 500 000 $']

export function SearchBar() {
  const router = useRouter()
  const [city, setCity] = useState<string>('Goma')
  const [type, setType] = useState<string>('Appartement')
  const [budget, setBudget] = useState<string>(budgets[0])
  const [activeField, setActiveField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setTimeout(() => {
          router.push('/carte')
        }, 300)
      }}
      className={cn(
        'relative flex w-full flex-col gap-2 rounded-3xl border border-border/80 bg-background/95 p-2 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-foreground/30 hover:shadow-xl md:flex-row md:items-center md:rounded-full md:p-2',
        activeField && 'ring-2 ring-primary/20 border-primary/40',
      )}
      aria-label="Rechercher un bien"
    >
      <Field
        label="Localisation"
        icon={MapPin}
        isActive={activeField === 'city'}
        onFocus={() => setActiveField('city')}
        onBlur={() => setActiveField(null)}
      >
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent text-sm font-bold text-foreground outline-none transition-colors"
        >
          {cities.map((c) => (
            <option key={c} value={c} className="bg-popover text-popover-foreground">
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Divider />

      <Field
        label="Type de bien"
        icon={Building2}
        isActive={activeField === 'type'}
        onFocus={() => setActiveField('type')}
        onBlur={() => setActiveField(null)}
      >
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent text-sm font-bold text-foreground outline-none transition-colors"
        >
          {propertyTypes.map((t) => (
            <option key={t} value={t} className="bg-popover text-popover-foreground">
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Divider />

      <Field
        label="Budget"
        icon={DollarSign}
        isActive={activeField === 'budget'}
        onFocus={() => setActiveField('budget')}
        onBlur={() => setActiveField(null)}
      >
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent text-sm font-bold text-foreground outline-none transition-colors"
        >
          {budgets.map((b) => (
            <option key={b} value={b} className="bg-popover text-popover-foreground">
              {b}
            </option>
          ))}
        </select>
      </Field>

      {/* Bouton de recherche animé */}
      <Button
        type="submit"
        className={cn(
          'group relative h-12 shrink-0 overflow-hidden gap-2.5 rounded-full px-7 font-bold text-sm shadow-md transition-all duration-300 active:scale-95 md:ml-1',
          isSubmitting ? 'scale-95 opacity-90' : 'hover:scale-[1.03] hover:shadow-lg',
        )}
      >
        <Search className="size-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
        <span>Rechercher</span>
        <Sparkles className="size-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Button>
    </form>
  )
}

function Field({
  label,
  icon: Icon,
  isActive,
  onFocus,
  onBlur,
  children,
}: {
  label: string
  icon: React.ElementType
  isActive: boolean
  onFocus: () => void
  onBlur: () => void
  children: React.ReactNode
}) {
  return (
    <label
      onFocus={onFocus}
      onBlur={onBlur}
      className={cn(
        'group flex min-w-0 flex-1 cursor-pointer flex-col gap-0.5 rounded-2xl px-5 py-2.5 transition-all duration-200 md:rounded-full',
        isActive ? 'bg-secondary/90 shadow-inner' : 'hover:bg-secondary/50',
      )}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-primary">
        <Icon className="size-3 transition-transform duration-200 group-hover:scale-110" />
        <span>{label}</span>
      </div>
      {children}
    </label>
  )
}

function Divider() {
  return <span aria-hidden="true" className="hidden h-8 w-px shrink-0 bg-border/60 md:block" />
}

