'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Home, MessageSquare, Plus, User } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/useAuthStore'

export type MobileBottomNavProps = {
  onOpenAuth: () => void
}

export function MobileBottomNav({ onOpenAuth }: MobileBottomNavProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    {
      href: '/',
      label: 'Accueil',
      icon: Home,
      exact: true,
    },
    {
      href: '/carte',
      label: 'Carte',
      icon: Compass,
    },
    {
      href: '/publier',
      label: 'Publier',
      icon: Plus,
      isAction: true,
    },
    {
      href: '/messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: '1',
    },
    {
      href: '/tableau-de-bord',
      label: isAuthenticated ? 'Espace' : 'Connexion',
      icon: User,
      requiresAuth: true,
    },
  ]

  if (!mounted) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background avec effet verre et bordure dorée très élégante */}
      <nav
        aria-label="Navigation mobile inférieure"
        className="mx-auto flex h-16 w-full items-center justify-around border-t border-border/80 bg-white/95 px-2 pb-safe backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : item.href !== '/' && pathname.startsWith(item.href)

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative -top-3 flex flex-col items-center justify-center"
              >
                <div className="flex size-13 items-center justify-center rounded-full bg-[#16381e] text-[#c5a059] shadow-lg shadow-[#16381e]/30 ring-4 ring-white transition-all duration-200 group-active:scale-95 group-hover:bg-[#16381e]/90">
                  <Plus className="size-6 stroke-[2.5]" />
                </div>
                <span className="mt-0.5 text-[10px] font-extrabold text-[#16381e]">
                  {item.label}
                </span>
              </Link>
            )
          }

          if (item.requiresAuth && !isAuthenticated) {
            return (
              <button
                key={item.href}
                type="button"
                onClick={onOpenAuth}
                className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 text-muted-foreground transition-colors active:scale-95"
              >
                <item.icon className="size-5 text-[#16381e]/70" />
                <span className="text-[10px] font-medium text-muted-foreground">
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-colors active:scale-95',
                isActive ? 'text-[#16381e]' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <div className="relative">
                <item.icon
                  className={cn(
                    'size-5 transition-transform duration-200',
                    isActive && 'scale-110 text-[#16381e] stroke-[2.5]',
                  )}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium transition-all',
                  isActive ? 'font-bold text-[#16381e]' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 size-1 rounded-full bg-[#c5a059]" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
