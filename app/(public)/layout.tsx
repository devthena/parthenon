'use client';

import { useEffect } from 'react';

import { Header } from '@/components';
import { useParthenonState } from '@/context';
import { useApi } from '@/hooks';

import { ApiUrl } from '@/enums/api';
import { DataObject } from '@/types/db';

import styles from './layout.module.scss';
import { useUser } from '@auth0/nextjs-auth0/client';

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { dataUser, isFetched: isApiFetched, fetchGetData } = useApi();
  const { isFetched, user, onSetData } = useParthenonState();
  const { user: userAuth0 } = useUser();

  useEffect(() => {
    if (!userAuth0 || user || isFetched) return;

    const getData = async () => {
      await fetchGetData(ApiUrl.Users);
    };

    getData();
  }, [isFetched, user, userAuth0, fetchGetData]);

  useEffect(() => {
    if (!isApiFetched) return;

    if (dataUser) {
      onSetData(dataUser as DataObject);
    } else {
      onSetData(null);
    }
  }, [dataUser, isApiFetched, onSetData]);

  return (
    <>
      <Header />
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default PublicLayout;
