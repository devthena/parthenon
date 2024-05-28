import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "../styles/globals.scss";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parthenon",
  description: "Official website of AthenaUS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={figtree.className}>{children}</body>
    </html>
  );
}
