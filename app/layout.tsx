import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';

import { UserProvider } from '@auth0/nextjs-auth0/client';

import './globals.scss';
import styles from './styles/layout.module.scss';

export const metadata: Metadata = {
  title: 'Parthenon',
  description: 'Official website of AthenaUS',
};

const figtree = Figtree({ subsets: ['latin'] });

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
      <UserProvider>
        <body className={figtree.className}>
          <main className={styles.main}>
            <div className={styles.content}>{children}</div>
            <footer className={styles.footer}>
              Made with ♡ by Athena | Build v0.3.0
            </footer>
          </main>
        </body>
      </UserProvider>
    </html>
  );
};

export default RootLayout;
