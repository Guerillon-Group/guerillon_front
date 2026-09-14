import type { Metadata } from 'next'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { PublishWizard } from '@/components/publish/publish-wizard'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Publier une annonce — Real Estate',
  description:
    'Mettez votre bien en ligne en cinq étapes : type, localisation sur la carte, caractéristiques, photos et publication vérifiée.',
}

export default function PublishPage() {
  return (
    <ProtectedRoute
      title="Publier une annonce"
      description="Connectez-vous pour pouvoir publier et soumettre une annonce immobilière sur la plateforme MBIYO."
    >
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">
          <PublishWizard />
        </main>
        <SiteFooter />
      </div>
    </ProtectedRoute>
  )
}
