'use client';

import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

import { Header, Loading } from '@/components';
import { useParthenonState } from '@/context';
import { useApi } from '@/hooks';

import { ApiUrl } from '@/enums/api';
import { LoginMethod } from '@/enums/auth';
import { DataObject } from '@/types/db';

import styles from './layout.module.scss';

const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { data, dataError, dataProcessed, fetchData } = useApi();
  const { user: userAuth0, isLoading: isAuth0Loading } = useUser();
  const { isFetched, isLoading, user, onSetLoading, onSetData } =
    useParthenonState();

  useEffect(() => {
    if (!userAuth0 || !userAuth0.sub || user) return;

    onSetLoading();

    const userSub = userAuth0.sub.split('|');
    const userId = userSub[2];
    const loginMethod = userSub[1] as LoginMethod;

    const getData = async () => {
      await fetchData(`${ApiUrl.Users}/${loginMethod}/${userId}`);
    };

    getData();
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
      {isAuth0Loading ||
        (isLoading && (
          <div className={styles.loading}>
            <Loading />
          </div>
        ))}
      {isFetched && <div className={styles.container}>{children}</div>}
      {dataError && <p>Hook Error (useApi): {dataError}</p>}
    </>
  );
};

export default withPageAuthRequired(ProtectedLayout);
