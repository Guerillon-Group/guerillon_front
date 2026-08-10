import type { Metadata } from 'next'

import { MessagingCenter } from '@/components/messages/messaging-center'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Messagerie — Real Estate',
  description: 'Échangez en direct avec vos agents et propriétaires de logements.',
}

export default function MessagesPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <MessagingCenter />
      </main>
    </div>
  )
}
