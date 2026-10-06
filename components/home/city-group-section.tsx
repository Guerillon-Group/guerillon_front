'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Building2 } from 'lucide-react'

import { Reveal } from '@/components/reveal'

type CityInfo = {
  name: string
  province: string
  districts: string
  image: string
  slug: string
  accentColor?: string
}

const featuredCities: CityInfo[] = [
  {
    name: 'Goma',
    province: 'Nord-Kivu',
    districts: 'Himbi, Lac Vert, Ndosho, Karisimbi',
    image: '/images/appartement-goma.png',
    slug: 'Goma',
  },
  {
    name: 'Kinshasa',
    province: 'Kinshasa',
    districts: 'Gombe, Ngaliema, Kintambo, Maagne',
    image: '/images/salon-interieur.png',
    slug: 'Kinshasa',
  },
  {
    name: 'Bukavu',
    province: 'Sud-Kivu',
    districts: 'Ibanda, Muhungu, La Botte, Kadutu',
    image: '/images/appartement-goma.png',
    slug: 'Bukavu',
  },
  {
    name: 'Lubumbashi',
    province: 'Haut-Katanga',
    districts: 'Golf, Kampemba, Lubumbashi Centre',
    image: '/images/salon-interieur.png',
    slug: 'Lubumbashi',
  },
]

interface CityGroupSectionProps {
  onSelectCity?: (city: string) => void
  selectedCity?: string
}

export function CityGroupSection({ onSelectCity, selectedCity }: CityGroupSectionProps) {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 pt-14 md:px-6 md:pt-20">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#16381e] uppercase tracking-wider">
            <MapPin className="size-3.5 text-[#c5a059]" />
            <span>Sous-groupes Villes & Quartiers</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground md:text-[30px]">
            Explorez les appartements par ville
          </h2>
        </div>
        <p className="text-xs text-muted-foreground max-w-md">
          Sélectionnez une ville pour consulter directement les logements disponibles dans ses principaux quartiers.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featuredCities.map((city, index) => {
          const isSelected = selectedCity === city.name
          return (
            <Reveal key={city.name} delay={index * 80}>
              <div
                className={`group relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 ${
                  isSelected
                    ? 'border-[#16381e] bg-[#16381e]/5 ring-2 ring-[#16381e]/20 shadow-md'
                    : 'border-border/80 bg-card hover:border-[#16381e]/40 hover:shadow-lg'
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={city.image}
                    alt={`Appartements disponibles à ${city.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-[#16381e] shadow-xs">
                    {city.province}
                  </div>
                </div>

                <div className="flex flex-col justify-between p-5 flex-1">
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground group-hover:text-[#16381e] transition-colors">
                      {city.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {city.districts}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3">
                    <Link
                      href={`/carte?q=${encodeURIComponent(city.name)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16381e] hover:underline"
                    >
                      <Building2 className="size-3.5" />
                      Voir les biens →
                    </Link>

                    {onSelectCity && (
                      <button
                        type="button"
                        onClick={() => onSelectCity(isSelected ? 'Tout' : city.name)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-[#16381e] text-white'
                            : 'bg-secondary text-foreground hover:bg-[#16381e] hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Filtré ✓' : 'Filtrer ici'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
