'use client';

import { usePathname } from 'next/navigation';
import { Header } from '../components';

import styles from './layout.module.scss';

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  return (
    <>
      <Header pathname={pathname} />
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default PublicLayout;
