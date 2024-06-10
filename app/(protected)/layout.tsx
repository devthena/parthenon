'use client';

import { Header } from '../components';

const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <Header isProtected={true} />
      {children}
    </div>
  );
};

export default ProtectedLayout;
