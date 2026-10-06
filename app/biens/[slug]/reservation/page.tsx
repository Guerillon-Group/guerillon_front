import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BookingModal } from '@/components/booking-modal'
import { PurchaseModal } from '@/components/purchase-modal'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getListingAsync } from '@/lib/properties'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingAsync(slug)
  const isSale = listing?.status === 'À vendre' || listing?.transactionType === 'sale'

  return {
    title: listing
      ? `${isSale ? "Acheter" : "Réserver"} ${listing.title} — MBIYO Real Estate`
      : 'Réservation — MBIYO Real Estate',
  }
}

/** Page dédiée : elle conserve l'état du parcours tant que l'utilisateur y reste. */
export default async function ReservationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const listing = await getListingAsync(slug)

  if (!listing) notFound()

  const isSale = listing.status === 'À vendre' || listing.transactionType === 'sale'

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        {isSale ? (
          <PurchaseModal listing={listing} variant="page" />
        ) : (
          <BookingModal listing={listing} variant="page" />
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
