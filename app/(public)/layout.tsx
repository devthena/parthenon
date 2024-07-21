'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

import { Header } from '@/components';
import { useParthenonState } from '@/context';
import { useApi } from '@/hooks';

import { ApiUrl } from '@/enums/api';
import { UserObject } from '@/interfaces/user';

import styles from './layout.module.scss';

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { dataUser, isFetched: isApiFetched, fetchGetData } = useApi();
  const { isFetched, user, onInitUser } = useParthenonState();
  const { user: userAuth0 } = useUser();

  useEffect(() => {
    if (!userAuth0 || user || isFetched) return;

    const getUser = async () => {
      await fetchGetData(ApiUrl.Users);
    };

    getUser();
  }, [isFetched, user, userAuth0, fetchGetData]);

  useEffect(() => {
    if (!isApiFetched) return;

    if (dataUser) {
      onInitUser(dataUser as UserObject);
    } else {
      onInitUser(null);
    }
  }, [dataUser, isApiFetched, onInitUser]);

  return (
    <>
      <Header />
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default PublicLayout;
