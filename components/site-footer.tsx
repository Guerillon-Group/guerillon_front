import Link from 'next/link'
import { Brand } from '@/components/brand'

const columns = [
  {
    title: 'Explorer',
    links: [
      { label: 'Acheter', href: '/' },
      { label: 'Louer', href: '/' },
      { label: 'Carte interactive', href: '/carte' },
      { label: 'Terrains', href: '/' },
    ],
  },
  {
    title: 'Propriétaires',
    links: [
      { label: 'Publier une annonce', href: '/publier' },
      { label: 'Tableau de bord', href: '/tableau-de-bord' },
      { label: 'Estimation gratuite', href: '/publier' },
      { label: 'Devenir agent', href: '/publier' },
    ],
  },
  {
    title: 'Société',
    links: [
      { label: 'À propos', href: '/' },
      { label: 'Vérification des titres', href: '/' },
      { label: 'Presse', href: '/' },
      { label: 'Contact', href: '/' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-[#16381e] text-white">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-14 md:px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Brand invert showTagline />
            <p className="mt-4 text-sm leading-relaxed text-emerald-100/80">
              Le premier réseau d&apos;immobilier d&apos;exception en Afrique. Annonces d&apos;exception, titres fonciers sécurisés et opportunités d&apos;investissement à travers le continent et pour la diaspora.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-bold tracking-[0.1em] text-[#c5a059] uppercase">
                  {col.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-emerald-50/80 transition-colors hover:text-white hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-emerald-900/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-emerald-200/70">
            © {new Date().getFullYear()} MBIYO REAL-ESTATE — Plateforme Immobilière Pan-Africaine
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-xs text-emerald-200/70 transition-colors hover:text-white">
              Confidentialité & Titres
            </Link>
            <Link href="/" className="text-xs text-emerald-200/70 transition-colors hover:text-white">
              Conditions Générales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
