'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Star, Trash2, Upload } from 'lucide-react'

import type { Draft, PhotoDraft } from '@/components/publish/draft'
import { StepHeading } from '@/components/publish/fields'
import { cn } from '@/lib/utils'

export function StepPhotos({
  draft,
  update,
}: {
  draft: Draft
  update: (patch: Partial<Draft>) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const next: PhotoDraft[] = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, 12 - draft.photos.length)
      .map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
        url: URL.createObjectURL(file),
        name: file.name,
      }))
    if (next.length > 0) update({ photos: [...draft.photos, ...next] })
  }

  function remove(id: string) {
    const photo = draft.photos.find((p) => p.id === id)
    if (photo) URL.revokeObjectURL(photo.url)
    update({ photos: draft.photos.filter((p) => p.id !== id) })
  }

  function makeCover(id: string) {
    const photo = draft.photos.find((p) => p.id === id)
    if (!photo) return
    update({ photos: [photo, ...draft.photos.filter((p) => p.id !== id)] })
  }

  return (
    <div className="flex flex-col gap-8">
      <StepHeading
        title="Ajoutez des photos"
        description="Douze photos maximum. La première sert de couverture dans les résultats et sur la carte."
      />

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          addFiles(event.dataTransfer.files)
        }}
        className={cn(
          'flex flex-col items-center gap-3 rounded-2xl border border-dashed p-10 text-center transition-colors duration-200',
          dragging ? 'border-foreground bg-secondary' : 'border-input bg-card',
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-foreground">
          <Upload className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">Glissez vos photos ici</p>
          <p className="mt-1 text-xs text-muted-foreground">JPG ou PNG — 10 Mo par fichier</p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-1 inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <ImagePlus className="size-4" aria-hidden="true" />
          Parcourir mes fichiers
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </div>

      {draft.photos.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            {draft.photos.length} photo{draft.photos.length > 1 ? 's' : ''} ajoutée
            {draft.photos.length > 1 ? 's' : ''}
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {draft.photos.map((photo, index) => (
              <li
                key={photo.id}
                className="group relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-secondary"
              >
                {/* Blob previews are local object URLs, so next/image is unnecessary here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.name} className="size-full object-cover" />

                {index === 0 && (
                  <span className="absolute top-2 left-2 rounded-full bg-foreground px-2 py-1 text-[11px] font-medium text-background">
                    Couverture
                  </span>
                )}

                <div className="absolute inset-x-2 bottom-2 flex justify-end gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeCover(photo.id)}
                      aria-label={`Définir ${photo.name} comme couverture`}
                      className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-transform hover:scale-105"
                    >
                      <Star className="size-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(photo.id)}
                    aria-label={`Supprimer ${photo.name}`}
                    className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-destructive transition-transform hover:scale-105"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
