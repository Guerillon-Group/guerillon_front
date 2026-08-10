import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Brand({
  className,
  invert = false,
  showTagline = false,
}: {
  className?: string
  invert?: boolean
  showTagline?: boolean
}) {
  return (
    <Link
      href="/"
      className={cn('group flex items-center gap-3 transition-opacity hover:opacity-90', className)}
      aria-label="MBIYO REAL-ESTATE, retour à l'accueil"
    >
      <div
        className={cn(
          'relative flex size-10 shrink-0 items-center justify-center rounded-xl p-1 shadow-sm transition-transform duration-300 group-hover:scale-105',
          invert ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-[#16381e] text-white shadow-[#16381e]/20',
        )}
      >
        <Image
          src="/logo-mbiyo.svg"
          alt="MBIYO Real Estate Logo"
          width={36}
          height={36}
          className="size-full object-contain"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            'font-display text-lg font-extrabold tracking-wider leading-none',
            invert ? 'text-white' : 'text-[#16381e]',
          )}
        >
          MBIYO
        </span>
        <span
          className={cn(
            'text-[10px] font-bold tracking-[0.25em] leading-tight uppercase',
            invert ? 'text-[#c5a059]' : 'text-[#c5a059]',
          )}
        >
          REAL-ESTATE
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium text-muted-foreground mt-0.5">
            L'Immobilier d'Exception en Afrique
          </span>
        )}
      </div>
    </Link>
  )
}
