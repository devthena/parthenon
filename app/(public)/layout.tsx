'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Header, Loading } from '../components';

import styles from './layout.module.scss';

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, error, isLoading } = useUser();

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Header isProtected={!!user} />
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.container}>{children}</div>
      )}
    </>
  );
};

export default PublicLayout;
