'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, LogIn, ShieldAlert, Sparkles } from 'lucide-react'

import { AuthModal } from '@/components/auth/auth-modal'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/useAuthStore'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

interface ProtectedRouteProps {
  children: React.ReactNode
  title?: string
  description?: string
  redirectToHome?: boolean
}

export function ProtectedRoute({
  children,
  title = 'Connexion requise',
  description = 'Cette page est réservée aux utilisateurs connectés sur MBIYO REAL-ESTATE.',
  redirectToHome = false,
}: ProtectedRouteProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(true)

  const { isAuthenticated, isLoading, isInitialized, initializeAuth } = useAuthStore()

  useEffect(() => {
    setMounted(true)
    if (!isInitialized) {
      initializeAuth()
    }
  }, [isInitialized, initializeAuth])

  useEffect(() => {
    if (mounted && isInitialized && !isLoading && !isAuthenticated && redirectToHome) {
      router.replace('/')
    }
  }, [mounted, isInitialized, isLoading, isAuthenticated, redirectToHome, router])

  if (!mounted || isLoading || !isInitialized) {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <main className="flex flex-1 items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="absolute size-full animate-ping rounded-full bg-primary/20" />
              <Sparkles className="size-6 text-[#c5a059]" />
            </div>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              Vérification de votre session MBIYO...
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (redirectToHome) {
      return null
    }

    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-secondary text-primary shadow-inner">
              <Lock className="size-8 text-[#c5a059]" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {description} Connectez-vous ou créez un compte gratuitement pour accéder à votre espace MBIYO.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={() => setAuthModalOpen(true)}
                size="lg"
                className="gap-2 rounded-full bg-[#16381e] px-8 text-sm font-bold text-[#c5a059] shadow-md hover:bg-[#16381e]/90"
              >
                <LogIn className="size-4" />
                Se connecter / S&apos;inscrire
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldAlert className="size-4 text-primary" />
              <span>Accès sécurisé & confidentiel certifié MBIYO</span>
            </div>
          </div>
        </main>
        <SiteFooter />

        <AuthModal
          open={authModalOpen}
          onOpenChange={setAuthModalOpen}
        />
      </div>
    )
  }

  return <>{children}</>
}
