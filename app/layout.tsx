import type { Metadata } from 'next';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Analytics } from '@vercel/analytics/react';

import { Footer } from './components';
import { ParthenonProvider } from './context';

import './globals.scss';
import styles from './styles/layout.module.scss';

export const metadata: Metadata = {
  title: 'Parthenon',
  description: 'Official website of AthenaUS',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <UserProvider>
          <ParthenonProvider>
            <main className={styles.main}>
              <div className={styles.content}>{children}</div>
              <Footer />
            </main>
          </ParthenonProvider>
        </UserProvider>
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
