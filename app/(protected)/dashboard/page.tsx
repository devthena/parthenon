'use client';

import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Loading } from '../../components';
import { useApi } from '../../hooks';
import { CoinIcon } from '../../icons';

import { ApiUrl } from '../../lib/enums/api';
import { LoginMethod } from '../../lib/enums/auth';

import { AccountLinked, Instructions, Register } from './components';

import styles from './page.module.scss';

const Dashboard = () => {
  const { data, dataLoading, dataError, fetchData } = useApi();
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (!user || !user.sub) return;

    const userSub = user.sub.split('|');
    const userId = userSub[2];
    const loginMethod = userSub[1] as LoginMethod;

    const getUser = async () => {
      await fetchData(`${ApiUrl.Users}/${loginMethod}/${userId}`);
    };

    getUser();
  }, [user, fetchData]);

  if (!user && !isLoading) return redirect('/');

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  let displayName = '';

  if (data?.discord_name) displayName = `, ${data?.discord_name}`;
  else if (data?.discord_username) displayName = `, ${data?.discord_username}`;
  else if (data?.twitch_username) displayName = `, ${data?.twitch_username}`;

  return (
    <>
      <div className={styles.dashboard}>
        <div className={styles.info}>
          {user && (
            <>
              <h1>Welcome{displayName}!</h1>
              <div className={styles.bio}>
                {user.picture && (
                  <figure className={styles.avatar}>
                    <Image
                      alt="Avatar"
                      height={200}
                      priority
                      src={user.picture}
                      width={200}
                    />
                  </figure>
                )}
                <div className={styles.balance}>
                  {!data && dataLoading && <Loading />}
                  {data && (
                    <div className={styles.item}>
                      <p className={styles.label}>
                        <span>POINTS</span>
                        <span>{data ? data.cash : 0}</span>
                      </p>
                      <CoinIcon />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className={styles.status}>
          {!data && dataLoading && <Loading />}
          {!data && !dataLoading && <Register />}
          {data && data.discord_id && !data.twitch_id && <Instructions />}
          {data && data.twitch_id && !data.discord_id && (
            <Instructions code={data.user_id} />
          )}
          {data && data.discord_id && data.twitch_id && (
            <AccountLinked
              discord={data.discord_username ?? 'Discord'}
              twitch={data.twitch_username ?? 'Twitch'}
            />
          )}
        </div>
      </div>
      {dataError && <p>User Fetch Error: {dataError}</p>}
    </>
  );
};

export default Dashboard;
