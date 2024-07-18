'use client';

import { useEffect } from 'react';

import { Header } from '@/components';
import { useParthenonState } from '@/context';
import { useApi } from '@/hooks';

import { ApiUrl } from '@/enums/api';
import { DataObject } from '@/types/db';

import styles from './layout.module.scss';

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { dataUser, isFetched, fetchGetData } = useApi();
  const { user, onSetData, onSetLoading } = useParthenonState();

  useEffect(() => {
    if (user) return;

    onSetLoading();

    const getData = async () => {
      await fetchGetData(ApiUrl.Users);
    };

    getData();
  }, []);

  useEffect(() => {
    if (!isFetched) return;

    if (dataUser) {
      onSetData(dataUser as DataObject);
    } else {
      onSetData(null);
    }
  }, [dataUser, isFetched, onSetData]);

  return (
    <>
      <Header />
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default PublicLayout;
