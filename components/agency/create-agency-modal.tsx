'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Mail,
  MapPin,
  Phone,
  FileText,
  ShieldCheck,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAgencyMutations } from '@/mutations/useAgencyMutations'
import { useAuthStore } from '@/stores/useAuthStore'
import { createAgencySchema } from '@/zod.schema/agency.schema'

export type CreateAgencyModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateAgencyModal({ open, onOpenChange, onSuccess }: CreateAgencyModalProps) {
  const { isAuthenticated, user } = useAuthStore()
  const { loading, error, createAgencyMutation } = useAgencyMutations()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSuccess, setIsSuccess] = useState(false)
  const [createdAgencyName, setCreatedAgencyName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})

    const formData = {
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      website: website.trim() || undefined,
      registration_number: registrationNumber.trim() || undefined,
      tax_number: taxNumber.trim() || undefined,
      address: address.trim() || undefined,
      description: description.trim() || undefined,
    }

    // Validation Zod
    const validation = createAgencySchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message
        }
      })
      setFormErrors(fieldErrors)
      return
    }

    try {
      const response = await createAgencyMutation(formData)
      setCreatedAgencyName(response.data?.name || name)
      setIsSuccess(true)
      if (onSuccess) onSuccess()

      setTimeout(() => {
        onOpenChange(false)
        setIsSuccess(false)
        resetForm()
      }, 2000)
    } catch (err) {
      // Les erreurs d'API sont gérées par useAgencyMutations
    }
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setPhone('')
    setWebsite('')
    setRegistrationNumber('')
    setTaxNumber('')
    setAddress('')
    setDescription('')
    setFormErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto rounded-3xl border-border/80 bg-white p-0 shadow-2xl">
        {/* En-tête Visuel avec Marque MBIYO */}
        <div className="bg-[#16381e] p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 size-48 rounded-full bg-[#c5a059]/10 blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-white p-2 shadow-sm">
              <Building2 className="size-6 text-[#16381e]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-extrabold tracking-tight text-white">
                Créer une Agence Immobilière
              </DialogTitle>
              <DialogDescription className="text-xs text-emerald-100/80">
                Enregistrez votre agence pour publier des biens et gérer des agents.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                <AlertCircle className="size-7" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Authentification Requise
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Vous devez être connecté à votre compte MBIYO pour pouvoir créer une agence.
                </p>
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="mt-2 h-10 rounded-2xl bg-[#16381e] text-white px-6 font-bold text-xs"
              >
                Fermer & Se connecter
              </Button>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-[#16381e]/10 text-[#16381e]">
                <CheckCircle2 className="size-10 text-[#c5a059]" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-[#16381e]">
                Agence créée avec succès !
              </h3>
              <p className="text-xs text-muted-foreground">
                L'agence <span className="font-bold text-foreground">{createdAgencyName}</span> a bien été enregistrée et est en attente de validation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Erreur API globale */}
              {error?.message && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-200">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error.message}</span>
                </div>
              )}

              {/* Champ Nom (Requis) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nom de l'agence <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Immo Excellence SARL"
                    className="w-full rounded-2xl border border-border/80 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-foreground outline-none transition-all focus:border-[#16381e] focus:ring-2 focus:ring-[#16381e]/15"
                  />
                </div>
                {formErrors.name && (
                  <span className="text-[11px] text-red-500 font-medium">{formErrors.name}</span>
                )}
              </div>

              {/* Email & Phone (Grid 2 col) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Email d'agence</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@immo-excellence.com"
                      className="w-full rounded-2xl border border-border/80 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-foreground outline-none transition-all focus:border-[#16381e] focus:ring-2 focus:ring-[#16381e]/15"
                    />
                  </div>
                  {formErrors.email && (
                    <span className="text-[11px] text-red-500 font-medium">{formErrors.email}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+243 81 234 5678"
                      className="w-full rounded-2xl border border-border/80 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-foreground outline-none transition-all focus:border-[#16381e] focus:ring-2 focus:ring-[#16381e]/15"
                    />
                  </div>
                </div>
              </div>

              {/* Site Web & RCCM / NIF (Grid 2 col) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Site Web (URL)</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://immo-excellence.com"
                      className="w-full rounded-2xl border border-border/80 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-foreground outline-none transition-all focus:border-[#16381e] focus:ring-2 focus:ring-[#16381e]/15"
                    />
                  </div>
                  {formErrors.website && (
                    <span className="text-[11px] text-red-500 font-medium">{formErrors.website}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Numéro RCCM / Registre</label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="CD/KIN/RCCM/22-B-01"
                      className="w-full rounded-2xl border border-border/80 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-foreground outline-none transition-all focus:border-[#16381e] focus:ring-2 focus:ring-[#16381e]/15"
                    />
                  </div>
                </div>
              </div>

              {/* Adresse siège */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Adresse du siège social</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Avenue Boulevard du 30 Juin, Gombe, Kinshasa"
                    className="w-full rounded-2xl border border-border/80 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-foreground outline-none transition-all focus:border-[#16381e] focus:ring-2 focus:ring-[#16381e]/15"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Description de l'agence</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Présentation de l'agence, vos spécialités immobilières (vente, location, gestion d'actifs)..."
                  className="w-full rounded-2xl border border-border/80 bg-white p-3 text-sm font-medium text-foreground outline-none transition-all focus:border-[#16381e] focus:ring-2 focus:ring-[#16381e]/15 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 w-full gap-2 rounded-2xl bg-[#16381e] text-white hover:bg-[#16381e]/90 font-bold text-sm shadow-md shadow-[#16381e]/20"
              >
                {loading ? (
                  <span>Création en cours...</span>
                ) : (
                  <span>Créer mon Agence Immobilière</span>
                )}
              </Button>

              <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                <ShieldCheck className="size-3.5 text-[#c5a059]" />
                En créant cette agence, vous devenez son Administrateur principal.
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
