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
    <html lang="fr" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
