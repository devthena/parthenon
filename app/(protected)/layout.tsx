import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

import { Header, Modal } from '@/components';
import { API_URLS } from '@/constants/api';
import { useFetch, useParthenon } from '@/hooks';

import { GameDocument } from '@/interfaces/games';
import { StatDocument } from '@/interfaces/stat';
import { UserDocument } from '@/interfaces/user';

import { getAuthMethod, withPageAuth } from '@/lib/utils';

import styles from './layout.module.scss';

const ProtectedLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { fetchGet, fetchGetArray } = useFetch();

  const {
    activeGames,
    isActiveGamesFetched,
    isStatsFetched,
    isUserFetched,
    modal,
    setStateActiveGames,
    setStateStats,
    setStateUser,
    stats,
    user,
  } = useParthenon();

  const { isSignedIn, user: userClerk } = useUser();

  const fetchGames = useCallback(
    async (discordId: string | null) => {
      if (!discordId) return setStateActiveGames([]);

      const url = `${API_URLS.GAMES}/${discordId}`;
      const games = await fetchGetArray<GameDocument>(url);

      setStateActiveGames(games);
    },
    [fetchGetArray]
  );

  const fetchStats = useCallback(
    async (discordId: string | null) => {
      if (!discordId) return;

      const url = `${API_URLS.STATS}/${discordId}`;
      const stats = await fetchGet<StatDocument>(url);

      setStateStats(stats);
    },
    [fetchGet]
  );

  const fetchUser = useCallback(async () => {
    if (!userClerk) return;

    const method = getAuthMethod(userClerk.externalAccounts[0].provider);
    const url = `${API_URLS.USERS}/${userClerk.externalId}?method=${method}`;
    const data = await fetchGet<UserDocument>(url);

    setStateUser(data);
  }, [fetchGet, setStateUser, userClerk]);

  useEffect(() => {
    if (isUserFetched || !isSignedIn) return;
    if (!user) fetchUser();
  }, [fetchUser, isSignedIn, isUserFetched, user]);

  useEffect(() => {
    if (!isUserFetched || !user || isActiveGamesFetched) return;
    if (!activeGames) fetchGames(user.discord_id);
  }, [activeGames, fetchGames, isActiveGamesFetched, isUserFetched, user]);

  useEffect(() => {
    if (!isUserFetched || !user || isStatsFetched) return;
    if (!stats) fetchStats(user.discord_id);
  }, [fetchStats, isStatsFetched, isUserFetched, stats, user]);

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
