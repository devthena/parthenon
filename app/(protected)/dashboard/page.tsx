'use client';

import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Loading } from '../../components';
import { useApi } from '../../hooks';
import { CoinIcon } from '../../icons';

import { ApiUrls } from '../../lib/constants/db';
import { LoginMethod } from '../../lib/enums/auth';

import { Register } from './components';
import styles from './page.module.scss';
import { Instructions } from './components/instructions';

const Dashboard = () => {
  const { apiError, isFetching, profile, fetchData } = useApi();
  const { user, error, isLoading } = useUser();

  const [isDataFetched, setIsDataFetched] = useState(false);

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  if (!user || !user.sub) return redirect('/');

  const userSub = user.sub.split('|');
  const userId = userSub[2];
  const loginMethod = userSub[1] as LoginMethod;

  if (!isDataFetched) {
    fetchData(ApiUrls.users, {
      id: userId,
      method: loginMethod,
    });

    setIsDataFetched(true);
  }

  return (
    <>
      <div className={styles.dashboard}>
        <div className={styles.info}>
          {user && (
            <>
              <h1>
                Welcome,{' '}
                {profile?.discord_name ||
                  profile?.twitch_username ||
                  user.nickname ||
                  user.name}
                !
              </h1>
              <div className={styles.bio}>
                {user.picture && (
                  <figure className={styles.avatar}>
                    <Image
                      alt="Avatar"
                      height={200}
                      src={user.picture}
                      width={200}
                    />
                  </figure>
                )}
                <div className={styles.balance}>
                  {!profile && isFetching && <Loading />}
                  {!isFetching && (
                    <div className={styles.item}>
                      <p className={styles.label}>
                        <span>POINTS</span>
                        <span>{profile ? profile.cash : 0}</span>
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
          {!profile && isFetching && <Loading />}
          {!profile && !isFetching && <Register />}
          {profile && profile.discord_id && !profile.twitch_id && (
            <Instructions />
          )}
          {profile && profile.twitch_id && !profile.discord_id && (
            <Instructions code={profile.user_id} />
          )}
          {profile && profile.discord_id && profile.twitch_id && (
            <div>
              <h2>Accounts Linked!</h2>
              <p>Discord: {profile.discord_username}</p>
              <p>Twitch: {profile.twitch_username}</p>
            </div>
          )}
        </div>
      </div>
      {apiError && (
        <div>
          <p>User Data Fetch Error: {apiError}</p>
        </div>
      )}
    </>
  );
};

export default Dashboard;
