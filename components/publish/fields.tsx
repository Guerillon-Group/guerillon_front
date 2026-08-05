'use client'

import { useId } from 'react'

import { cn } from '@/lib/utils'

const control =
  'w-full rounded-xl border border-input bg-card px-3.5 text-sm text-foreground transition-colors duration-200 outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25'

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: (id: string) => React.ReactNode
  className?: string
}) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function TextInput({
  className,
  suffix,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { suffix?: string }) {
  if (suffix) {
    return (
      <div className="relative">
        <input {...props} className={cn(control, 'h-11 pr-14', className)} />
        <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-muted-foreground">
          {suffix}
        </span>
      </div>
    )
  }
  return <input {...props} className={cn(control, 'h-11', className)} />
}

export function TextArea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(control, 'resize-y py-3 leading-relaxed', className)} />
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(control, 'h-11 appearance-none pr-9', className)}>
      {children}
    </select>
  )
}

export function Stepper({
  label,
  value,
  onChange,
  max = 12,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  max?: number
}) {
  const n = Number(value) || 0
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(String(Math.max(0, n - 1)))}
          aria-label={`Diminuer : ${label}`}
          className="flex size-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
          disabled={n <= 0}
        >
          −
        </button>
        <span className="w-6 text-center font-display text-sm font-semibold tabular-nums">{n}</span>
        <button
          type="button"
          onClick={() => onChange(String(Math.min(max, n + 1)))}
          aria-label={`Augmenter : ${label}`}
          className="flex size-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
          disabled={n >= max}
        >
          +
        </button>
      </div>
    </div>
  )
}

export function StepHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="max-w-xl">
      <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-foreground text-balance">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
