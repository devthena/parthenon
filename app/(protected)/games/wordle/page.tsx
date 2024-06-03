'use client';

import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import Loading from '../../../components/loading';
import { GameStatus } from '../../../lib/enums/wordle';

import styles from './styles.module.scss';

const Wordle = () => {
  const { user, error, isLoading } = useUser();

  const [status, setStatus] = useState(GameStatus.Overview);

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  if (!user || !user.sub) return redirect('/');

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
    </div>
  );
};

export default Wordle;
