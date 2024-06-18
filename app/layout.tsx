import type { Metadata } from 'next';

import { UserProvider } from '@auth0/nextjs-auth0/client';
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
              <footer className={styles.footer}>
                Made with ♡ by Athena | Build v0.7.1
              </footer>
            </main>
          </ParthenonProvider>
        </UserProvider>
      </body>
    </html>
  );
};

export default RootLayout;
