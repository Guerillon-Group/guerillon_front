'use client'

import { useState, useEffect } from 'react'
import { X, Building2, Check, Loader2, AlertCircle } from 'lucide-react'
import { Property } from '@/types/property.types'
import { propertyService } from '@/services/property.service'

interface EditPropertyModalProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

export function EditPropertyModal({
  property,
  isOpen,
  onClose,
  onSaved,
}: EditPropertyModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    transaction_type: 'rent',
    status: 'published',
    city: '',
    neighborhood: '',
    bedrooms: 0,
    bathrooms: 0,
    surface_area: 0,
    description: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        price: property.price || 0,
        transaction_type: property.transaction_type === 'rent' || property.transaction_type === 'Louer' ? 'rent' : 'sale',
        status: property.status || 'published',
        city: property.city || '',
        neighborhood: property.neighborhood || property.district || '',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        surface_area: property.surface_area || 0,
        description: property.description || '',
      })
      setError(null)
      setSuccess(null)
    }
  }, [property])

  if (!isOpen || !property) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await propertyService.updateProperty(property.id, {
        title: formData.title,
        price: Number(formData.price),
        transaction_type: formData.transaction_type,
        status: formData.status,
        city: formData.city,
        neighborhood: formData.neighborhood,
        district: formData.neighborhood,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        surface_area: Number(formData.surface_area),
        description: formData.description,
      })

      if (res.success) {
        setSuccess('Le bien a été mis à jour avec succès !')
        setTimeout(() => {
          onSaved()
          onClose()
        }, 800)
      } else {
        setError(res.message || 'Échec de la mise à jour du bien.')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Une erreur est survenue lors de la mise à jour.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 bg-[#16381e] px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#c5a059]/20 text-[#c5a059]">
              <Building2 className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">Gérer & Modifier le Bien</h2>
              <p className="text-xs text-emerald-100/80">Mettre à jour les informations du bien</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="size-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 font-medium">
              <Check className="size-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* Titre */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Titre de l'annonce *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-border bg-gray-50/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none focus:border-[#16381e] focus:bg-white"
              placeholder="ex: Bel appartement meublé avec vue lac"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Prix */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Prix ($) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-gray-50/50 px-3.5 py-2.5 text-sm font-semibold text-foreground outline-none focus:border-[#16381e] focus:bg-white"
              />
            </div>

            {/* Type transaction */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Transaction *
              </label>
              <select
                value={formData.transaction_type}
                onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                className="w-full rounded-xl border border-border bg-gray-50/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none focus:border-[#16381e] focus:bg-white cursor-pointer"
              >
                <option value="rent">À Louer</option>
                <option value="sale">À Vendre</option>
              </select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Statut *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-xl border border-border bg-gray-50/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none focus:border-[#16381e] focus:bg-white cursor-pointer"
              >
                <option value="published">Publié (En ligne)</option>
                <option value="draft">Brouillon</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
          </div>

          {/* Localisation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Ville *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-xl border border-border bg-gray-50/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none focus:border-[#16381e] focus:bg-white"
                placeholder="ex: Goma, Kinshasa..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Quartier / Commune
              </label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full rounded-xl border border-border bg-gray-50/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none focus:border-[#16381e] focus:bg-white"
                placeholder="ex: Himbi, Gombe..."
              />
            </div>
          </div>

          {/* Chambres, Salles de bain, Surface */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Chambres
              </label>
              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-gray-50/50 px-3 py-2 text-sm font-medium text-foreground outline-none focus:border-[#16381e] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Sdb
              </label>
              <input
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-gray-50/50 px-3 py-2 text-sm font-medium text-foreground outline-none focus:border-[#16381e] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Surface (m²)
              </label>
              <input
                type="number"
                min="0"
                value={formData.surface_area}
                onChange={(e) => setFormData({ ...formData, surface_area: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-gray-50/50 px-3 py-2 text-sm font-medium text-foreground outline-none focus:border-[#16381e] focus:bg-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Description du bien
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-border bg-gray-50/50 p-3.5 text-sm font-medium text-foreground outline-none focus:border-[#16381e] focus:bg-white resize-none"
              placeholder="Décrivez les atouts, équipements et atouts du bien..."
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-gray-100 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#16381e] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin text-[#c5a059]" /> Enregistrement...
                </>
              ) : (
                'Enregistrer les modifications'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
