import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Real Estate — Immobilier premium en RDC',
  description:
    "Trouvez, visitez et publiez des biens d'exception à Goma, Bukavu et Kinshasa. Annonces vérifiées, agents certifiés, transactions sereines.",
  icons: {
    icon: [
      {
        url: '/IMG_6123.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/IMG_6123.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo-mbiyo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/IMG_6123.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f9fafb',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="bg-background overflow-x-hidden" suppressHydrationWarning>
      <body className="font-sans antialiased pb-16 md:pb-0 w-full max-w-full overflow-x-hidden" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
