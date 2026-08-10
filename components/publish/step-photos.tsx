'use client'

import { useRef, useState } from 'react'
import {
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Plus,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

import type { Draft, PhotoDraft } from '@/components/publish/draft'
import { StepHeading } from '@/components/publish/fields'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function StepPhotos({
  draft,
  update,
}: {
  draft: Draft
  update: (patch: Partial<Draft>) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalInputRef = useRef<HTMLInputElement>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, 'loading' | 'done'>>({})

  // Ajout de fichiers avec simulation d'upload élégante comme sur Airbnb
  function handleFilesAdded(files: FileList | File[] | null) {
    if (!files || files.length === 0) return
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'))
    if (fileArray.length === 0) return

    const newPhotos: PhotoDraft[] = fileArray
      .slice(0, 12 - draft.photos.length)
      .map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
        url: URL.createObjectURL(file),
        name: file.name,
      }))

    if (newPhotos.length === 0) return

    // Ouvrir le modal d'upload
    setModalOpen(true)
    setUploading(true)

    // Initialiser les états de chargement pour les nouvelles photos
    const initialProgress: Record<string, 'loading' | 'done'> = {}
    newPhotos.forEach((p) => {
      initialProgress[p.id] = 'loading'
    })
    setUploadProgress((prev) => ({ ...prev, ...initialProgress }))

    // Mettre à jour le draft
    const updatedPhotos = [...draft.photos, ...newPhotos]
    update({ photos: updatedPhotos })

    // Simuler le processus d'upload fluide d'Airbnb avec spinner puis Check
    newPhotos.forEach((p, idx) => {
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [p.id]: 'done' }))
        if (idx === newPhotos.length - 1) {
          setTimeout(() => setUploading(false), 600)
        }
      }, (idx + 1) * 700)
    })
  }

  function removePhoto(id: string) {
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
        title="Ajoutez des photos de votre logement"
        description="Vous avez besoin d'au moins 5 photos pour commencer. Vous pourrez en ajouter d'autres ou les modifier plus tard."
      />

      {/* Inputs masqués */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          handleFilesAdded(e.target.files)
          e.target.value = ''
        }}
      />
      <input
        ref={modalInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          handleFilesAdded(e.target.files)
          e.target.value = ''
        }}
      />

      {draft.photos.length === 0 ? (
        /* Écran d'accueil d'upload principal style Airbnb (avec illustration appareil photo) */
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            handleFilesAdded(e.dataTransfer.files)
          }}
          className={cn(
            'flex flex-col items-center justify-center min-h-[380px] rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-200 bg-secondary/20',
            dragging ? 'border-foreground bg-secondary/50' : 'border-border hover:border-foreground/40',
          )}
        >
          {/* Illustration Caméra style 3D Airbnb */}
          <div className="relative flex size-28 items-center justify-center rounded-3xl bg-secondary/80 shadow-inner">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-background border border-border shadow-md">
              <Camera className="size-10 text-foreground/80 stroke-[1.5]" />
            </div>
            <span className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              <Plus className="size-5" />
            </span>
          </div>

          <p className="mt-6 font-display text-xl font-bold text-foreground">Déposez vos photos ici</p>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Format JPG ou PNG · La première photo servira de couverture principale.
          </p>

          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 h-12 rounded-full px-8 font-semibold text-sm shadow-sm"
          >
            Ajouter des photos
          </Button>
        </div>
      ) : (
        /* Grille des photos téléversées */
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Vos photos sélectionnées</h3>
              <p className="text-xs text-muted-foreground">
                {draft.photos.length} photo{draft.photos.length > 1 ? 's' : ''} ajoutée{draft.photos.length > 1 ? 's' : ''} sur 12 au total.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(true)}
              className="rounded-full border-border font-semibold gap-2"
            >
              <Plus className="size-4" />
              Ajouter plus
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {draft.photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative aspect-4/3 overflow-hidden rounded-2xl border border-border bg-muted shadow-sm transition-all hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.name} className="size-full object-cover" />

                {index === 0 && (
                  <span className="absolute top-3 left-3 rounded-full bg-foreground/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-background shadow-md">
                    Couverture
                  </span>
                )}

                {/* Overlays d'actions au survol (icône corbeille Airbnb style) */}
                <div className="absolute inset-0 flex items-center justify-between p-3 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {index !== 0 ? (
                    <button
                      type="button"
                      onClick={() => makeCover(photo.id)}
                      title="Définir comme couverture"
                      className="flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground transition-transform hover:scale-110 shadow-md"
                    >
                      <Star className="size-4" />
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    title="Supprimer la photo"
                    className="flex size-9 items-center justify-center rounded-full bg-background/90 text-destructive transition-transform hover:scale-110 shadow-md"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Carte additionnelle pour ajouter de nouvelles photos */}
            {draft.photos.length < 12 && (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex aspect-4/3 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/20 text-muted-foreground transition-colors hover:border-foreground/50 hover:bg-secondary/40 hover:text-foreground"
              >
                <Plus className="size-8" />
                <span className="mt-1 text-xs font-semibold">Ajouter</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal d'Upload de photos inspiré d'Airbnb */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[540px] rounded-3xl p-6 border border-border shadow-2xl bg-card">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
            <div>
              <DialogTitle className="font-display text-lg font-bold text-foreground">
                Importer des photos
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {uploading
                  ? `${Object.values(uploadProgress).filter((s) => s === 'done').length} sur ${Object.keys(uploadProgress).length} éléments téléversés`
                  : `${draft.photos.length} photos sélectionnées`}
              </p>
            </div>
          </DialogHeader>

          {uploading ? (
            /* Écran d'état de chargement des photos (Grille d'images floutées avec spinner puis Check marqueur) */
            <div className="py-4">
              <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {draft.photos.slice(-Object.keys(uploadProgress).length).map((photo) => {
                  const status = uploadProgress[photo.id] || 'loading'
                  return (
                    <div
                      key={photo.id}
                      className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt=""
                        className={cn('size-full object-cover transition-all duration-300', status === 'loading' && 'brightness-50 blur-[2px]')}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {status === 'loading' ? (
                          <div className="flex size-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-md">
                            <Loader2 className="size-5 animate-spin text-foreground" />
                          </div>
                        ) : (
                          <div className="flex size-10 items-center justify-center rounded-full bg-foreground text-background shadow-lg animate-in zoom-in-75 duration-200">
                            <Check className="size-6 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setUploading(false)}
                  className="rounded-full text-xs font-semibold"
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  disabled={Object.values(uploadProgress).includes('loading')}
                  onClick={() => setModalOpen(false)}
                  className="rounded-full px-6 font-semibold text-xs"
                >
                  Terminé
                </Button>
              </div>
            </div>
          ) : (
            /* Modal Dropzone principale pour parcourir les photos */
            <div className="py-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragging(false)
                  handleFilesAdded(e.dataTransfer.files)
                }}
                className={cn(
                  'flex flex-col items-center justify-center min-h-[260px] rounded-2xl border-2 border-dashed p-8 text-center transition-all bg-secondary/20',
                  dragging ? 'border-foreground bg-secondary/50' : 'border-border hover:border-foreground/30',
                )}
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-foreground">
                  <ImagePlus className="size-8 stroke-[1.5]" />
                </div>

                <p className="mt-4 font-display text-base font-bold text-foreground">Glissez-déposez vos images</p>
                <p className="mt-1 text-xs text-muted-foreground">ou parcourez depuis votre ordinateur</p>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => modalInputRef.current?.click()}
                  className="mt-5 rounded-xl font-semibold text-xs border border-border"
                >
                  Parcourir
                </Button>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Fermer
                </button>
                <Button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full px-6 text-xs font-semibold"
                >
                  Valider
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

