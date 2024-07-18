'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

import { Header, Loading } from '@/components';
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
  const { isFetched, isLoading, user, onSetData, onSetLoading } =
    useParthenonState();

  useEffect(() => {
    if (user) return;

    onSetLoading();

    const getData = async () => {
      await fetchGetData(ApiUrl.Users);
    };

    getData();
  }, []);

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
      {isLoading && (
        <div className={styles.loading}>
          <Loading />
        </div>
      )}
      {isFetched && <div className={styles.container}>{children}</div>}
    </>
  );
};

export default withPageAuthRequired(ProtectedLayout);
