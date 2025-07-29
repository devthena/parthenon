'use client';

import { Header } from '@/components';
import styles from './layout.module.scss';

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default PublicLayout;
