'use client';

import { Header } from '../components';

import styles from './layout.module.scss';

const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header isProtected={true} />
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default ProtectedLayout;
