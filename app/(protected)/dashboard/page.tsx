'use client';

import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Loading } from '../../components';
import { useApi } from '../../hooks';
import { ApiUrls } from '../../lib/constants/db';
import { LoginMethod } from '../../lib/enums/auth';

import styles from './page.module.scss';
import { CoinIcon } from '../../icons';

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
            <div className={styles.bio}>
              <h1>
                Welcome,{' '}
                {profile?.discord_name ||
                  profile?.twitch_username ||
                  user.nickname ||
                  user.name}
                !
              </h1>
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
            </div>
          )}
          {!profile && isFetching && <Loading />}
          {profile && (
            <div className={styles.balance}>
              <p className={styles.cash}>
                <span>Points: {profile.cash}</span>
                <CoinIcon />
              </p>
            </div>
          )}
        </div>
        <div className={styles.status}>
          {!profile && !isFetching && (
            <div>
              <p>
                Start earning points by participating in AthenaUS Twitch chat
                and Discord server!
              </p>
            </div>
          )}
          {profile && profile.twitch_id && !profile.discord_id && (
            <div>
              <p>Link your Twitch and Discord accounts!</p>
              <p>Copy the code below:</p>
              <code>{profile.user_id}</code>
              <p>
                In the Discord server, use the /link command and enter the code.
              </p>
              <p>
                The bot will give you a confirmation once both accounts are
                linked.
              </p>
              <p>
                Note: Should you need to unlink your accounts, use /unlink in
                the server.
              </p>
            </div>
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
