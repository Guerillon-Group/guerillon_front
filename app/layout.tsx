import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Hanken_Grotesk, Inter } from 'next/font/google'
import './globals.css'

const _inter = Inter({ subsets: ['latin'] })
const _hanken = Hanken_Grotesk({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Real Estate — Immobilier premium en RDC',
  description:
    "Trouvez, visitez et publiez des biens d'exception à Goma, Bukavu et Kinshasa. Annonces vérifiées, agents certifiés, transactions sereines.",
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
    <html lang="fr" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
