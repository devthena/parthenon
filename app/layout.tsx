import type { Metadata } from "next";
import { Figtree } from "next/font/google";

import { UserProvider } from "@auth0/nextjs-auth0/client";

import "./globals.scss";
import styles from "./index.module.scss";

export const metadata: Metadata = {
  title: "Parthenon",
  description: "Official website of AthenaUS",
};

const figtree = Figtree({ subsets: ["latin"] });

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <UserProvider>
        <body className={figtree.className}>
          <main className={styles.main}>{children}</main>
        </body>
      </UserProvider>
    </html>
  );
};

export default RootLayout;
