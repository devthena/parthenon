'use client';

import Image from 'next/image';

import { useParthenonState } from '../../context';
import { Loading } from '../../components';
import { CoinIcon } from '../../icons';

import { AccountLinked, Instructions, Register } from './components';

import styles from './page.module.scss';
import { useUser } from '@auth0/nextjs-auth0/client';

const Dashboard = () => {
  const { user: userAuth0 } = useUser();
  const { isFetched, user } = useParthenonState();

  let displayName = '';

  if (user) {
    if (user.discord_name) displayName = `, ${user.discord_name}`;
    else if (user.discord_username) displayName = `, ${user.discord_username}`;
    else if (user.twitch_username) displayName = `, ${user.twitch_username}`;
  }

  const renderRightSection = () => {
    if (!isFetched) return <Loading />;

    if (!user) {
      if (isFetched) return <Register />;
      return;
    }

    if (user.discord_id) {
      if (user.twitch_id) {
        return (
          <AccountLinked
            discord={user.discord_username ?? 'Discord'}
            twitch={user.twitch_username ?? 'Twitch'}
          />
        );
      } else {
        return <Instructions />;
      }
    } else {
      return user.twitch_id && <Instructions code={user.user_id} />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.info}>
        <h1>Welcome{displayName}!</h1>
        <div className={styles.bio}>
          <figure className={styles.avatar}>
            {userAuth0?.picture && (
              <Image
                alt="Avatar"
                height={200}
                priority
                src={userAuth0.picture}
                width={200}
              />
            )}
          </figure>
          <div className={styles.balance}>
            <div className={styles.item}>
              <p className={styles.label}>
                <span>POINTS</span>
                <span>{user ? user.cash : 0}</span>
              </p>
              <CoinIcon />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.status}>{renderRightSection()}</div>
    </div>
  );
};

export default Dashboard;
