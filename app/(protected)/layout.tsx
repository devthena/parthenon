'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

import { Header } from '@/components';
import { useParthenonState } from '@/context';
import { useApi } from '@/hooks';

import { ApiUrl } from '@/enums/api';

import styles from './layout.module.scss';
import { DataObject } from '@/types/db';

const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { dataUser, isFetched: isApiFetched, fetchGetData } = useApi();
  const { isFetched, user, onSetData, onSetLoading } = useParthenonState();

  useEffect(() => {
    if (user || isFetched) return;

    onSetLoading();

    const getData = async () => {
      await fetchGetData(ApiUrl.Users);
    };

    getData();
  }, [isFetched, user, fetchGetData, onSetLoading]);

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

export default withPageAuthRequired(ProtectedLayout);
