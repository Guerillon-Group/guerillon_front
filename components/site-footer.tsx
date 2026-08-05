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
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-14 md:px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-xs">
            <Brand />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              L&apos;immobilier congolais, enfin lisible. Annonces vérifiées, titres contrôlés, agents certifiés à
              Goma, Bukavu et Kinshasa.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">
                  {col.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/80 transition-colors hover:text-foreground"
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

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Real Estate SARL — Goma, République Démocratique du Congo
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Confidentialité
            </Link>
            <Link href="/" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
