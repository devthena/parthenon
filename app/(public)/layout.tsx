'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Header } from '../components';

import styles from './layout.module.scss';

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = useUser();

  return (
    <>
      <Header hasAuth={!!user} />
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default PublicLayout;
