'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Check,
  Code,
  Copy,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Share2,
} from 'lucide-react'
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Listing } from '@/lib/properties'

export function ShareModal({ listing }: { listing: Listing }) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (e) {
      console.error('Failed to copy', e)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: listing.description,
          url: shareUrl,
        })
      } catch (err) {
        // user cancelled share
      }
    } else {
      handleCopy()
    }
  }

  const shareOptions = [
    {
      id: 'copy',
      label: 'Copier le lien',
      icon: Copy,
      action: handleCopy,
    },
    {
      id: 'email',
      label: 'E-mail',
      icon: Mail,
      action: () => {
        window.open(`mailto:?subject=${encodeURIComponent(listing.title)}&body=${encodeURIComponent(shareUrl)}`)
      },
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      action: () => {
        window.open(`sms:?body=${encodeURIComponent(listing.title + ' ' + shareUrl)}`)
      },
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(listing.title + ' ' + shareUrl)}`)
      },
    },
    {
      id: 'messenger',
      label: 'Messenger',
      icon: MessageSquare,
      action: () => {
        window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=291494419107576&redirect_uri=${encodeURIComponent(shareUrl)}`)
      },
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: FaFacebook,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)
      },
    },
    {
      id: 'twitter',
      label: 'Twitter / X',
      icon: FaXTwitter,
      action: () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(listing.title)}`)
      },
    },
    {
      id: 'embed',
      label: 'Intégrer',
      icon: Code,
      action: handleCopy,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" size="icon-lg" className="rounded-full border-border" aria-label="Partager cette annonce">
          <Share2 className="size-4" />
        </Button>
      } />
      <DialogContent className="sm:max-w-[540px] rounded-3xl p-6 border border-border shadow-2xl bg-card text-card-foreground">
        <DialogHeader className="text-left pb-2">
          <DialogTitle className="font-display text-2xl font-bold tracking-tight text-foreground">
            Partager ce logement
          </DialogTitle>
        </DialogHeader>

        {/* Aperçu du bien (Inspiré Airbnb) */}
        <div className="mt-2 flex items-center gap-4 rounded-2xl border border-border/80 bg-secondary/40 p-3.5">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image
              src={listing.image || '/placeholder.svg'}
              alt={listing.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-sm text-foreground">{listing.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground truncate">
              {listing.type} à {listing.city} · ★ {listing.rating} · {listing.beds} ch · {listing.baths} sdb
            </p>
          </div>
        </div>

        {/* Grille d'options de partage inspirée Airbnb (2 colonnes) */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {shareOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={opt.action}
              className="flex items-center gap-3 rounded-2xl border border-border/80 bg-background px-4 py-3.5 text-left text-sm font-medium transition-all hover:bg-secondary/60 hover:border-border active:scale-[0.98]"
            >
              <opt.icon className="size-4 shrink-0 text-foreground" />
              <span className="truncate text-foreground font-semibold">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Plus d'options (Bouton Partage Natif) */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="mt-3 flex w-full items-center justify-between rounded-2xl border border-border/80 bg-background px-4 py-3.5 text-left text-sm font-medium transition-all hover:bg-secondary/60 hover:border-border active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <MoreHorizontal className="size-4 shrink-0 text-foreground" />
            <span className="font-semibold text-foreground">Plus d&apos;options</span>
          </div>
        </button>

        {/* Floating Pill "Lien copié" inspiré d'Airbnb */}
        {copied && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-semibold text-background shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="size-2.5 stroke-[3]" />
            </span>
            <span>Lien copié dans le presse-papier</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
