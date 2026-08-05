'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export function ListingGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0)
  const total = images.length

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
        <Image
          src={images[index] || '/placeholder.svg'}
          alt={`${title} — photo ${index + 1} sur ${total}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Photo précédente"
              className="glass-panel absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
            >
              <ChevronLeft className="size-5 text-foreground" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Photo suivante"
              className="glass-panel absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
            >
              <ChevronRight className="size-5 text-foreground" />
            </button>
            <span className="glass-panel absolute bottom-3 right-3 rounded-full px-3 py-1 text-xs font-medium text-foreground">
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="hide-scrollbar flex gap-3 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Voir la photo ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors',
                i === index ? 'border-foreground' : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <Image src={src || '/placeholder.svg'} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
