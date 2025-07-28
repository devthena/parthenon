import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

import { Header, Modal } from '@/components';
import { API_URLS } from '@/constants/api';
import { useFetch, useParthenon } from '@/hooks';
import { UserDocument } from '@/interfaces/user';
import { getAuthMethod, withPageAuth } from '@/lib/utils';

import styles from './layout.module.scss';

const ProtectedLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { fetchGet } = useFetch();
  const { modal, setStateUser, user } = useParthenon();
  const { isSignedIn, user: userClerk } = useUser();

  const [isInitialized, setIsInitialized] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!userClerk) return;

    const method = getAuthMethod(userClerk.externalAccounts[0].provider);
    const url = `${API_URLS.USERS}/${userClerk.externalId}?method=${method}`;
    const data = await fetchGet<UserDocument>(url);

    setStateUser(data);
  }, [fetchGet, setStateUser, userClerk]);

  useEffect(() => {
    if (isInitialized) return;
    setIsInitialized(true);

    if (user || !isSignedIn) return;

    fetchUser();
  }, [fetchUser, isInitialized, isSignedIn, user]);

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
