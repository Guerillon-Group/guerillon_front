import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Brand({
  className,
  invert = false,
}: {
  className?: string
  invert?: boolean
}) {
  return (
    <Link
      href="/"
      className={cn('group flex items-center gap-2.5', className)}
      aria-label="Real Estate, retour à l'accueil"
    >
      <span
        className={cn(
          'flex size-8 items-center justify-center rounded-md transition-transform duration-200 group-hover:-translate-y-px',
          invert ? 'bg-background text-foreground' : 'bg-primary text-primary-foreground',
        )}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
          <path
            d="M3 11.2 12 4l9 7.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6.5 12.8V20h11v-7.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </span>
      <span
        className={cn(
          'font-display text-[15px] leading-none font-semibold tracking-tight',
          invert ? 'text-background' : 'text-foreground',
        )}
      >
        Real Estate
      </span>
    </Link>
  )
}
