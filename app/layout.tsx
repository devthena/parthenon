import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';

import type { Metadata } from 'next';
import { Figtree, Nunito, Source_Code_Pro } from 'next/font/google';

import { Footer } from '@/components';
import { ParthenonProvider } from '@/context';

import './globals.scss';
import styles from '@/styles/layout.module.scss';

export const metadata: Metadata = {
  title: 'Parthenon',
  description: 'Official website of AthenaUS',
};

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
  display: 'swap',
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  display: 'swap',
});

const sourceCodePro = Source_Code_Pro({
  variable: '--font-source-code-pro',
  subsets: ['latin'],
  display: 'swap',
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ClerkProvider>
      <ParthenonProvider>
        <html lang="en">
          <head>
            <link rel="icon" href="/favicon.ico" sizes="any" />
          </head>
          <body
            className={`${figtree.variable} ${nunito.variable} ${sourceCodePro.variable}`}>
            <main className={styles.main}>
              <div className={styles.content}>{children}</div>
              <Footer />
            </main>
          </body>
        </html>
        <Analytics />
      </ParthenonProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
