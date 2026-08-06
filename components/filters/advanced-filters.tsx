'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import {
  ArrowUpDown,
  BadgeCheck,
  Building2,
  ChevronDown,
  Home,
  Landmark,
  Minus,
  Plus,
  Ruler,
  Sparkles,
  TreePalm,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  accessCatalog,
  activeFilterCount,
  allCities,
  amenityCatalog,
  applyFilters,
  defaultFilters,
  formatBudget,
  labelCatalog,
  priceBounds,
  priceHistogram,
  surfaceSteps,
  transactions,
  type Filters,
  type Transaction,
} from '@/lib/filters'
import { listings, type Listing } from '@/lib/properties'
import { cn } from '@/lib/utils'

const typeIcons: Record<Listing['type'], typeof Home> = {
  Appartement: Building2,
  Villa: Sparkles,
  Maison: Home,
  Terrain: TreePalm,
  Bureau: Landmark,
}

const sections = [
  { id: 'transaction', label: 'Transaction' },
  { id: 'budget', label: 'Budget' },
  { id: 'type', label: 'Type de bien' },
  { id: 'pieces', label: 'Pièces & surface' },
  { id: 'lieu', label: 'Villes' },
  { id: 'equipements', label: 'Équipements' },
  { id: 'garanties', label: 'Garanties' },
  { id: 'accessibilite', label: 'Accessibilité' },
]

export function AdvancedFilters({
  value,
  onChange,
  className,
}: {
  value: Filters
  onChange: (next: Filters) => void
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const count = activeFilterCount(value)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'relative flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-foreground/25',
          count > 0 && 'border-foreground/30 shadow-sm',
          className,
        )}
        aria-haspopup="dialog"
      >
        <ArrowUpDown className="size-4 rotate-90" aria-hidden="true" />
        Filtres
        {count > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">
            {count}
          </span>
        )}
      </button>

      {open && (
        <FilterPanel
          value={value}
          onClose={() => setOpen(false)}
          onApply={(next) => {
            onChange(next)
            setOpen(false)
          }}
        />
      )}
    </>
  )
}

function FilterPanel({
  value,
  onApply,
  onClose,
}: {
  value: Filters
  onApply: (next: Filters) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<Filters>(value)
  const [activeSection, setActiveSection] = useState('transaction')
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [openAccess, setOpenAccess] = useState(draft.access.length > 0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => applyFilters(listings, draft).length, [draft])
  const bounds = priceBounds(draft.transaction)
  const histogram = useMemo(() => priceHistogram(draft.transaction), [draft.transaction])
  const peak = Math.max(...histogram.map((b) => b.count), 1)

  const set = <K extends keyof Filters>(key: K, next: Filters[K]) =>
    setDraft((d) => ({ ...d, [key]: next }))

  const toggle = (key: 'types' | 'cities' | 'amenities' | 'access' | 'labels', id: string) =>
    setDraft((d) => {
      const list = d[key] as string[]
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
      return { ...d, [key]: next } as Filters
    })

  const setTransaction = (t: Transaction) =>
    setDraft((d) => {
      const b = priceBounds(t)
      return { ...d, transaction: t, priceMin: b.min, priceMax: b.max }
    })

  // suit la section visible pour l'index latéral
  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { root, rootMargin: '-8px 0px -70% 0px', threshold: 0 },
    )
    for (const s of sections) {
      const el = root.querySelector(`#${s.id}`)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const amenities = showAllAmenities ? amenityCatalog : amenityCatalog.slice(0, 6)
  const accessGroups = Array.from(new Set(accessCatalog.map((a) => a.group)))

  return (
    <div className="fixed inset-0 z-[1200] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Fermer les filtres"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filtres avancés"
        className="relative flex max-h-[92dvh] w-full max-w-[920px] flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-[0_24px_80px_rgba(17,24,39,0.18)] sm:max-h-[86dvh] sm:rounded-2xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 md:px-6">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">Filtres avancés</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Affinez sur le budget, l&apos;équipement technique et les garanties du dossier.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex min-h-0 flex-1">
          <nav
            aria-label="Sections"
            className="hidden w-[196px] shrink-0 flex-col gap-0.5 border-r border-border p-3 md:flex"
          >
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  const el = scrollRef.current?.querySelector(`#${s.id}`)
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                aria-current={activeSection === s.id}
                className={cn(
                  'rounded-lg px-3 py-2 text-left text-[13px] transition-colors duration-200',
                  activeSection === s.id
                    ? 'bg-secondary font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-8">
            {/* Transaction */}
            <Section id="transaction" title="Transaction">
              <div className="flex w-full max-w-md items-center gap-1 rounded-full bg-secondary p-1">
                {transactions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTransaction(t)}
                    aria-pressed={draft.transaction === t}
                    className={cn(
                      'flex-1 rounded-full px-3 py-2 text-sm transition-colors duration-200',
                      draft.transaction === t
                        ? 'bg-card font-medium text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Section>

            {/* Budget */}
            <Section
              id="budget"
              title="Budget"
              hint={
                bounds.rent
                  ? 'Loyer mensuel, charges comprises quand elles sont connues.'
                  : draft.transaction === 'Tout'
                    ? 'Prix de vente. En mode « Tout », les locations ne sont pas filtrées par ce curseur.'
                    : 'Prix de vente affiché, hors frais de notaire.'
              }
            >
              <div className="flex h-24 items-end gap-[3px]" aria-hidden="true">
                {histogram.map((b, i) => {
                  const inside = b.to > draft.priceMin && b.from < draft.priceMax
                  return (
                    <span
                      key={i}
                      className={cn(
                        'flex-1 rounded-t-[3px] transition-colors duration-200',
                        inside ? 'bg-accent' : 'bg-secondary',
                      )}
                      style={{ height: `${Math.max(6, (b.count / peak) * 100)}%` }}
                    />
                  )
                })}
              </div>

              <SliderPrimitive.Root
                value={[draft.priceMin, draft.priceMax]}
                min={bounds.min}
                max={bounds.max}
                step={bounds.step}
                thumbAlignment="edge"
                onValueChange={(v) => {
                  const [lo, hi] = v as number[]
                  setDraft((d) => ({ ...d, priceMin: lo, priceMax: hi }))
                }}
                className="mt-1 w-full"
              >
                <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none py-3">
                  <SliderPrimitive.Track className="relative h-[3px] w-full grow overflow-hidden rounded-full bg-secondary">
                    <SliderPrimitive.Indicator className="h-full bg-foreground" />
                  </SliderPrimitive.Track>
                  {[0, 1].map((i) => (
                    <SliderPrimitive.Thumb
                      key={i}
                      className="size-5 rounded-full border border-border bg-card shadow-[0_2px_8px_rgba(17,24,39,0.18)] outline-none transition-transform focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-110"
                    />
                  ))}
                </SliderPrimitive.Control>
              </SliderPrimitive.Root>

              <div className="mt-2 flex items-center gap-3">
                <BudgetField
                  label="Minimum"
                  value={draft.priceMin}
                  rent={bounds.rent}
                  onChange={(v) => set('priceMin', Math.min(v, draft.priceMax - bounds.step))}
                />
                <span className="mt-5 h-px w-4 shrink-0 bg-border" />
                <BudgetField
                  label="Maximum"
                  value={draft.priceMax}
                  rent={bounds.rent}
                  onChange={(v) => set('priceMax', Math.max(v, draft.priceMin + bounds.step))}
                />
              </div>
            </Section>

            {/* Type */}
            <Section id="type" title="Type de bien" hint="Plusieurs choix possibles.">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(typeIcons) as Listing['type'][]).map((t) => {
                  const Icon = typeIcons[t]
                  return (
                    <Chip key={t} active={draft.types.includes(t)} onClick={() => toggle('types', t)}>
                      <Icon className="size-4" aria-hidden="true" />
                      {t}
                    </Chip>
                  )
                })}
              </div>
            </Section>

            {/* Pièces & surface */}
            <Section id="pieces" title="Pièces & surface">
              <div className="flex flex-col divide-y divide-border">
                <Stepper
                  label="Chambres"
                  value={draft.beds}
                  onChange={(v) => set('beds', v)}
                />
                <Stepper
                  label="Salles de bain"
                  value={draft.baths}
                  onChange={(v) => set('baths', v)}
                />
              </div>

              <div className="mt-5">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Ruler className="size-4 text-muted-foreground" aria-hidden="true" />
                  Surface minimale
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {surfaceSteps.map((s) => (
                    <Chip key={s} active={draft.surfaceMin === s} onClick={() => set('surfaceMin', s)}>
                      {s === 0 ? 'Indifférent' : `${s} m² +`}
                    </Chip>
                  ))}
                </div>
              </div>
            </Section>

            {/* Villes */}
            <Section id="lieu" title="Villes">
              <div className="flex flex-wrap gap-2">
                {allCities.map((c) => (
                  <Chip key={c} active={draft.cities.includes(c)} onClick={() => toggle('cities', c)}>
                    {c}
                  </Chip>
                ))}
              </div>
            </Section>

            {/* Équipements */}
            <Section
              id="equipements"
              title="Équipements"
              hint="Ce qui compte vraiment au quotidien : énergie, eau, réseau, sécurité."
            >
              <div className="flex flex-wrap gap-2">
                {amenities.map((a) => (
                  <Chip key={a.id} active={draft.amenities.includes(a.id)} onClick={() => toggle('amenities', a.id)}>
                    {a.label}
                  </Chip>
                ))}
              </div>
              {amenityCatalog.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowAllAmenities((v) => !v)}
                  className="mt-3 text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent"
                >
                  {showAllAmenities ? 'Réduire' : `Afficher les ${amenityCatalog.length - 6} autres`}
                </button>
              )}
            </Section>

            {/* Garanties */}
            <Section id="garanties" title="Garanties">
              <div className="grid gap-3 sm:grid-cols-2">
                {labelCatalog.map((l) => {
                  const active = draft.labels.includes(l.id)
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => toggle('labels', l.id)}
                      aria-pressed={active}
                      className={cn(
                        'flex flex-col gap-2 rounded-xl border p-4 text-left transition-colors duration-200',
                        active
                          ? 'border-foreground bg-secondary'
                          : 'border-border hover:border-foreground/25',
                      )}
                    >
                      <BadgeCheck className={cn('size-5', active ? 'text-accent' : 'text-muted-foreground')} />
                      <span className="text-sm font-semibold text-foreground">{l.title}</span>
                      <span className="text-xs leading-relaxed text-muted-foreground">{l.blurb}</span>
                    </button>
                  )
                })}
              </div>
            </Section>

            {/* Accessibilité */}
            <Section id="accessibilite" title="" bare>
              <button
                type="button"
                onClick={() => setOpenAccess((v) => !v)}
                aria-expanded={openAccess}
                className="flex w-full items-center justify-between gap-4 py-1 text-left"
              >
                <span className="font-display text-base font-semibold tracking-tight text-foreground">
                  Accessibilité
                </span>
                <ChevronDown className={cn('size-5 text-muted-foreground transition-transform duration-200', openAccess && 'rotate-180')} />
              </button>

              {openAccess && (
                <div className="mt-4 flex flex-col gap-5">
                  {accessGroups.map((group) => (
                    <fieldset key={group}>
                      <legend className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">
                        {group}
                      </legend>
                      <div className="mt-3 flex flex-col gap-3">
                        {accessCatalog
                          .filter((a) => a.group === group)
                          .map((a) => (
                            <label key={a.id} className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
                              <Checkbox
                                checked={draft.access.includes(a.id)}
                                onCheckedChange={() => toggle('access', a.id)}
                              />
                              {a.label}
                            </label>
                          ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
              )}
            </Section>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-border bg-card px-5 py-4 md:px-6">
          <button
            type="button"
            onClick={() => setDraft(defaultFilters('Tout'))}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent"
          >
            Tout effacer
          </button>
          <Button onClick={() => onApply(draft)} className="h-11 rounded-full px-6">
            {results === 0 ? 'Aucun bien' : `Afficher ${results} bien${results > 1 ? 's' : ''}`}
          </Button>
        </footer>
      </div>
    </div>
  )
}

function Section({
  id,
  title,
  hint,
  bare,
  children,
}: {
  id: string
  title: string
  hint?: string
  bare?: boolean
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-4 border-b border-border py-6 first:pt-0 last:border-b-0 last:pb-0">
      {!bare && (
        <>
          <h3 className="font-display text-base font-semibold tracking-tight text-foreground">{title}</h3>
          {hint && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</p>}
        </>
      )}
      <div className={cn(!bare && 'mt-4')}>{children}</div>
    </section>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors duration-200',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <StepButton
          label={`Réduire ${label.toLowerCase()}`}
          disabled={value === 0}
          onClick={() => onChange(Math.max(0, value - 1))}
        >
          <Minus className="size-4" />
        </StepButton>
        <span className="w-16 text-center text-sm font-medium text-foreground">
          {value === 0 ? 'Indifférent' : `${value} +`}
        </span>
        <StepButton
          label={`Augmenter ${label.toLowerCase()}`}
          disabled={value === 6}
          onClick={() => onChange(Math.min(6, value + 1))}
        >
          <Plus className="size-4" />
        </StepButton>
      </div>
    </div>
  )
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-200 hover:border-foreground/40 disabled:opacity-35"
    >
      {children}
    </button>
  )
}

function BudgetField({
  label,
  value,
  rent,
  onChange,
}: {
  label: string
  value: number
  rent: boolean
  onChange: (v: number) => void
}) {
  return (
    <label className="flex-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="mt-1.5 flex items-center rounded-xl border border-border px-3 py-2 focus-within:border-foreground/40">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          aria-label={`${label} du budget`}
        />
        <span className="shrink-0 text-xs text-muted-foreground">{rent ? '$/mois' : '$'}</span>
      </span>
      <span className="sr-only">{formatBudget(value, rent)}</span>
    </label>
  )
}
