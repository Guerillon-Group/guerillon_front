'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Loader2, PartyPopper } from 'lucide-react'

import { emptyDraft, stepErrors, steps, type Draft } from '@/components/publish/draft'
import { StepAddress } from '@/components/publish/step-address'
import { StepDetails } from '@/components/publish/step-details'
import { StepPhotos } from '@/components/publish/step-photos'
import { StepReview } from '@/components/publish/step-review'
import { StepType } from '@/components/publish/step-type'
import { usePropertyMutations } from '@/mutations/usePropertyMutations'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function PublishWizard() {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [showErrors, setShowErrors] = useState(false)
  const [state, setState] = useState<'editing' | 'sending' | 'sent'>('editing')

  const update = useCallback((patch: Partial<Draft>) => {
    setDraft((previous) => ({ ...previous, ...patch }))
  }, [])

  const errors = useMemo(() => stepErrors(draft, step), [draft, step])
  const last = step === steps.length - 1

  const { createProperty, uploadImages, loading: isSubmitting, error: apiSubmitError } = usePropertyMutations()

  async function next() {
    if (errors.length > 0) {
      setShowErrors(true)
      return
    }
    setShowErrors(false)
    if (last) {
      setState('sending')
      try {
        const createdProperty = await createProperty({
          title: draft.title || `Propriété à ${draft.city}`,
          description: draft.description,
          transaction_type: draft.intent === 'Acheter' ? 'sale' : 'rent',
          price: Number(draft.price) || 0,
          currency: draft.currency || 'USD',
          surface_area: Number(draft.surface) || undefined,
          bedrooms: Number(draft.bedrooms) || undefined,
          bathrooms: Number(draft.bathrooms) || undefined,
          address: draft.address || draft.neighborhood || draft.city,
          city: draft.city,
          neighborhood: draft.neighborhood,
          status: 'available',
        })

        if (createdProperty?.id && draft.photos && draft.photos.length > 0) {
          await uploadImages(createdProperty.id, draft.photos)
        }

        setState('sent')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (err) {
        setState('editing')
      }
      return
    }
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function back() {
    setShowErrors(false)
    setStep((s) => Math.max(0, s - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (state === 'sent') {
    return <Sent draft={draft} onRestart={() => {
      setDraft(emptyDraft)
      setStep(0)
      setState('editing')
    }} />
  }

  return (
    <div className="flex flex-col">
      <ProgressHeader step={step} onGoTo={(target) => target < step && setStep(target)} />

      <div className="mx-auto w-full max-w-[880px] px-4 py-10 md:px-6 md:py-14">
        {step === 0 && <StepType draft={draft} update={update} />}
        {step === 1 && <StepAddress draft={draft} update={update} />}
        {step === 2 && <StepDetails draft={draft} update={update} />}
        {step === 3 && <StepPhotos draft={draft} update={update} />}
        {step === 4 && <StepReview draft={draft} update={update} errors={showErrors ? errors : []} />}

        {apiSubmitError && (
          <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive font-semibold">
            {apiSubmitError}
          </div>
        )}

        {showErrors && errors.length > 0 && step !== 4 && (
          <ul className="mt-8 flex flex-col gap-1.5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
            {errors.map((error) => (
              <li key={error} className="text-sm text-destructive">
                {error}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sticky bottom-0 z-40 border-t border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[880px] items-center gap-3 px-4 py-4 md:px-6">
          {step > 0 ? (
            <Button variant="outline" onClick={back} className="h-11 gap-1.5 rounded-full px-5">
              <ArrowLeft className="size-4" />
              Retour
            </Button>
          ) : (
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link href="/" />}
              className="h-11 gap-1.5 rounded-full px-5 text-muted-foreground"
            >
              <ArrowLeft className="size-4" />
              Annuler
            </Button>
          )}

          <p className="ml-auto hidden text-sm text-muted-foreground sm:block">
            Étape {step + 1} sur {steps.length} — {steps[step]}
          </p>

          <Button
            onClick={next}
            disabled={state === 'sending'}
            className={cn('h-11 gap-1.5 rounded-full px-6', step === 0 && 'ml-auto sm:ml-0')}
          >
            {state === 'sending' ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Publication…
              </>
            ) : last ? (
              <>
                <Check className="size-4" />
                Publier l’annonce
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProgressHeader({ step, onGoTo }: { step: number; onGoTo: (target: number) => void }) {
  const progress = ((step + 1) / steps.length) * 100

  return (
    <div className="sticky top-16 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto w-full max-w-[880px] px-4 pt-8 pb-4 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
            Publier une annonce
          </h1>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground tabular-nums">
            {step + 1} / {steps.length}
          </span>
        </div>

        <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-foreground transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-label="Progression du formulaire"
          />
        </div>

        <ol className="hide-scrollbar mt-3 flex items-center gap-5 overflow-x-auto pb-1">
          {steps.map((label, index) => (
            <li key={label} className="shrink-0">
              <button
                type="button"
                onClick={() => onGoTo(index)}
                disabled={index >= step}
                aria-current={index === step ? 'step' : undefined}
                className={cn(
                  'text-xs transition-colors duration-200 md:text-sm',
                  index === step
                    ? 'font-semibold text-foreground'
                    : index < step
                      ? 'text-muted-foreground hover:text-foreground'
                      : 'text-muted-foreground/50',
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function Sent({ draft, onRestart }: { draft: Draft; onRestart: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-center px-4 py-24 text-center md:px-6">
      <span className="flex size-14 items-center justify-center rounded-full bg-foreground text-background">
        <PartyPopper className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-[-0.02em] text-foreground text-balance">
        Votre annonce est en ligne
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">{draft.title}</span> à {draft.district || draft.city} est
        désormais visible. La vérification du titre foncier est lancée : vous recevrez le badge « Vérifié » sous 48 h.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button nativeButton={false} render={<Link href="/carte" />} className="h-11 rounded-full px-6">
          Voir sur la carte
        </Button>
        <Button variant="outline" onClick={onRestart} className="h-11 rounded-full px-6">
          Publier un autre bien
        </Button>
      </div>
    </div>
  )
}
