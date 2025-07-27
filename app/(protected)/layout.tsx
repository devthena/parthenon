import { useEffect } from 'react';

import { Header, Modal } from '@/components';
import { useParthenonState } from '@/context';
import { useApi } from '@/hooks';

import { ApiUrl } from '@/enums/api';
import { UserObject } from '@/interfaces/user-old';
import { withPageAuth } from '@/lib/utils';

import styles from './layout.module.scss';

const ProtectedLayout = async ({
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

  return await withPageAuth(children => {
    return (
      <>
        <Header />
        <div className={styles.container}>{children}</div>
        {modal.isOpen && <Modal />}
      </>
    );
  }, children);
};

export default ProtectedLayout;
