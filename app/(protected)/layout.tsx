'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Header, Loading } from '../components';
import { useParthenonState } from '../context';
import { useApi } from '../hooks';

import { ApiUrl } from '../lib/enums/api';
import { LoginMethod } from '../lib/enums/auth';
import { UserObject } from '../lib/types/db';

import styles from './layout.module.scss';

const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { data, dataError, dataProcessed, fetchData } = useApi();
  const { user, isLoading, error } = useUser();
  const { onSetLoading, onSetUser } = useParthenonState();

  useEffect(() => {
    if (!user || !user.sub) return;

    onSetLoading();

    const userSub = user.sub.split('|');
    const userId = userSub[2];
    const loginMethod = userSub[1] as LoginMethod;

    const getUser = async () => {
      await fetchData(`${ApiUrl.Users}/${loginMethod}/${userId}`);
    };

    getUser();
  }, [user, fetchData, onSetLoading]);

  useEffect(() => {
    if (!dataProcessed) return;

    if (data) {
      onSetUser(data as UserObject);
    } else {
      onSetUser(null);
    }
  }, [data, dataProcessed, onSetUser]);

  if (!user && !isLoading) return redirect('/');

  if (isLoading)
    return (
      <div className={styles.loading}>
        <Loading />
      </div>
    );

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Header hasAuth={!!user} />
      <div className={styles.container}>{children}</div>
      {dataError && <p>Hook Error (useApi): {dataError}</p>}
    </>
  );
};

export default ProtectedLayout;
