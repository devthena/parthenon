import type { Metadata } from 'next';
import { UserProvider } from '@auth0/nextjs-auth0/client';

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
      <UserProvider>
        <body>
          <main className={styles.main}>
            <div className={styles.content}>{children}</div>
            <footer className={styles.footer}>
              Made with ♡ by Athena | Build v0.4.2
            </footer>
          </main>
        </body>
      </UserProvider>
    </html>
  );
};

export default RootLayout;
