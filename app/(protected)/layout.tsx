'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

import { Header, Loading } from '@/components';
import { useParthenonState } from '@/context';
import { useApi } from '@/hooks';

import { ApiDataType, ApiUrl } from '@/enums/api';
import { DataObject } from '@/types/db';

import styles from './layout.module.scss';

const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { data, isProcessed, fetchData } = useApi();
  const { isFetched, isLoading, user, onSetLoading, onSetData } =
    useParthenonState();

  useEffect(() => {
    if (user) return;

    onSetLoading();

    const getData = async () => {
      await fetchData(ApiUrl.Users, ApiDataType.Users);
    };

    getData();
  }, []);

  useEffect(() => {
    if (!isProcessed) return;

    if (data?.data) {
      onSetData(data.data as DataObject);
    } else {
      onSetData(null);
    }
  }, [data, isProcessed, onSetData]);

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
