'use client';

import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import Loading from '../../../components/loading';
import { useApi } from '../../../hooks';
import { ApiUrls } from '../../../lib/constants/db';
import { LoginMethod } from '../../../lib/enums/auth';
import { GameStatus } from '../../../lib/enums/wordle';

import styles from './styles.module.scss';

const Wordle = () => {
  const { apiError, stats, fetchData } = useApi();
  const { user, error, isLoading } = useUser();

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [status, setStatus] = useState(GameStatus.Overview);

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  if (!user || !user.sub) return redirect('/');

  const userSub = user.sub.split('|');
  const userId = userSub[2];
  const loginMethod = userSub[1] as LoginMethod;

  if (!isDataFetched) {
    fetchData(ApiUrls.stats, userId, loginMethod);
    setIsDataFetched(true);
  }

  return (
    <div>
      <h1>Wordle</h1>
      {status === GameStatus.Overview && (
        <button
          className={styles.play}
          onClick={() => setStatus(GameStatus.Start)}>
          PLAY
        </button>
      )}
      {stats && (
        <div>
          <p>Stats: {stats.discord_id}</p>
        </div>
      )}
      {apiError && (
        <div>
          <p>User Stats Fetch Error: {apiError}</p>
        </div>
      )}
    </div>
  );
};

export default Wordle;
