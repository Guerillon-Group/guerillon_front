'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, Plus, User, X } from 'lucide-react'

import { AuthModal } from '@/components/auth/auth-modal'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', label: 'Acheter' },
  { href: '/carte', label: 'Explorer la carte' },
  { href: '/messages', label: 'Messages', badge: '1' },
  { href: '/tableau-de-bord', label: 'Tableau de bord' },
]

export function SiteHeader({ floating = false }: { floating?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const solid = scrolled || !floating

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          solid ? 'glass-panel border-b border-border' : 'border-b border-transparent',
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-6 px-4 md:px-6">
          <Brand />

          <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95',
                    active
                      ? 'bg-secondary text-foreground shadow-xs'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="relative flex size-4 items-center justify-center">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60 opacity-75" />
                      <span className="relative flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-primary-foreground shadow-xs">
                        {item.badge}
                      </span>
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAuthOpen(true)}
              className="hidden h-10 gap-1.5 rounded-full px-4 border-border text-xs font-bold text-[#16381e] hover:bg-secondary md:inline-flex"
            >
              <LogIn className="size-3.5 text-[#c5a059]" />
              Se connecter
            </Button>

            <Button
              nativeButton={false}
              render={<Link href="/publier" />}
              className="hidden h-10 gap-1.5 rounded-full px-4 md:inline-flex bg-[#16381e] text-white hover:bg-[#16381e]/90 text-xs font-bold"
            >
              <Plus className="size-4" />
              Publier une annonce
            </Button>

            <Link
              href="/tableau-de-bord"
              className="hidden size-10 shrink-0 overflow-hidden rounded-full border border-border md:block"
              aria-label="Mon compte"
            >
              <Image
                src="/images/agent-portrait.png"
                alt="Portrait de Sarah Mukendi"
                width={80}
                height={80}
                className="size-full object-cover"
              />
            </Link>

            <Button
              variant="ghost"
              size="icon-lg"
              className="rounded-full md:hidden"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {open && (
          <div className="glass-panel border-t border-border md:hidden">
            <nav aria-label="Navigation mobile" className="mx-auto flex max-w-[1280px] flex-col gap-1 px-4 py-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  setAuthOpen(true)
                }}
                className="mt-2 h-11 gap-1.5 rounded-full font-bold"
              >
                <LogIn className="size-4 text-[#c5a059]" />
                Se connecter
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/publier" />}
                className="mt-1 h-11 gap-1.5 rounded-full bg-[#16381e] text-white"
              >
                <Plus className="size-4" />
                Publier une annonce
              </Button>
            </nav>
          </div>
        )}
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  )
}
