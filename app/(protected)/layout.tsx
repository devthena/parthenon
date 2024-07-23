'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

import { Header, Modal } from '@/components';
import { useParthenonState } from '@/context';
import { useApi } from '@/hooks';

import { ApiUrl } from '@/enums/api';
import { UserObject } from '@/interfaces/user';

import styles from './layout.module.scss';

const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { dataUser, isFetched: isApiFetched, fetchGetData } = useApi();
  const { isFetched, modal, user, onInitUser, onSetLoading } =
    useParthenonState();

  useEffect(() => {
    if (user || isFetched) return;

    onSetLoading();

    const getUser = async () => {
      await fetchGetData(ApiUrl.Users);
    };

    getUser();
  }, [isFetched, user, fetchGetData, onSetLoading]);

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
      {modal.isOpen && <Modal />}
    </>
  );
};

export default withPageAuthRequired(ProtectedLayout);
