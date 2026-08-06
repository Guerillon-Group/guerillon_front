/** Squelettes affichés pendant le chargement d'un rail ou d'une grille. */
export function RailCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col">
      <div className="skeleton aspect-[4/3] w-full rounded-xl" />
      <div className="skeleton mt-4 h-5 w-3/4 rounded-md" />
      <div className="skeleton mt-2 h-4 w-1/2 rounded-md" />
      <div className="skeleton mt-4 h-5 w-2/5 rounded-md" />
    </div>
  )
}

export function RailSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul aria-hidden="true" className="mt-6 flex gap-5 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="w-[78vw] shrink-0 sm:w-[44vw] lg:w-[calc((100%-3.75rem)/4)]">
          <RailCardSkeleton />
        </li>
      ))}
    </ul>
  )
}

export function CompactCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex items-center gap-4 rounded-xl bg-secondary p-3">
      <div className="skeleton size-24 shrink-0 rounded-lg sm:size-28" />
      <div className="min-w-0 flex-1">
        <div className="skeleton h-4 w-3/5 rounded-md" />
        <div className="skeleton mt-2 h-3.5 w-2/5 rounded-md" />
        <div className="skeleton mt-3 h-3.5 w-24 rounded-md" />
      </div>
    </div>
  )
}
