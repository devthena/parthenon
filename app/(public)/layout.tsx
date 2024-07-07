'use client';

import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Header } from '../components';
import { useApi } from '../hooks';
import { useParthenonState } from '../context';

import { ApiUrl } from '../lib/enums/api';
import { LoginMethod } from '../lib/enums/auth';
import { DataObject } from '../lib/types/db';

import styles from './layout.module.scss';

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { data, dataProcessed, fetchData } = useApi();
  const { user: userAuth0 } = useUser();
  const { user, onSetLoading, onSetData } = useParthenonState();

  useEffect(() => {
    if (!userAuth0 || !userAuth0.sub || user) return;

    onSetLoading();

    const userSub = userAuth0.sub.split('|');
    const userId = userSub[2];
    const loginMethod = userSub[1] as LoginMethod;

    const getUser = async () => {
      await fetchData(`${ApiUrl.Users}/${loginMethod}/${userId}`);
    };

    getUser();
  }, [user, userAuth0, fetchData, onSetLoading]);

  useEffect(() => {
    if (!dataProcessed) return;

    if (data) {
      onSetData(data as DataObject);
    } else {
      onSetData(null);
    }
  }, [data, dataProcessed, onSetData]);

  return (
    <>
      <Header />
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default PublicLayout;
