import { RailCardSkeleton } from '@/components/home/listing-skeleton'

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-16 md:px-6" aria-busy="true">
      <span className="sr-only">Chargement de la page</span>

      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4">
        <div className="skeleton h-9 w-4/5 rounded-lg" />
        <div className="skeleton h-4 w-2/5 rounded-md" />
      </div>

      <div className="skeleton mx-auto mt-8 h-[74px] max-w-[1060px] rounded-xl" />

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-28 rounded-full" />
        ))}
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <RailCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
