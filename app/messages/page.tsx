import type { Metadata } from 'next'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { MessagingCenter } from '@/components/messages/messaging-center'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Messagerie — Real Estate',
  description: 'Échangez en direct avec vos agents et propriétaires de logements.',
}

export default function MessagesPage() {
  return (
    <ProtectedRoute
      title="Messagerie Privée"
      description="Connectez-vous pour échanger directement avec les propriétaires, agents immobiliers et acheteurs."
    >
      <div className="flex min-h-dvh flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <MessagingCenter />
        </main>
      </div>
    </ProtectedRoute>
  )
}
