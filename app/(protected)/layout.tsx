'use client';

import { Header } from '../components';

const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header isProtected={true} />
      {children}
    </>
  );
};

export default ProtectedLayout;
