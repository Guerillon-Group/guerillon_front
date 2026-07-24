import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/providers/query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ImmoApp - Vente et Location d\'Immeubles',
  description: 'Trouvez, louez ou vendez vos biens immobiliers en toute simplicité.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
