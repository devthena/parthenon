'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Loading } from '../../components';

import styles from './page.module.scss';

const Games = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  if (!user) return redirect('/');

  return (
    <div className={styles.games}>
      <h1 className={styles.title}>GAMES</h1>
      <p className={styles.description}>
        Tired of gambling all and losing? Erase your debts (and more) here!
      </p>
      <div className={styles.grid}>
        <Link className={styles.gridItem} href="/games/wordle">
          <span>Wordle</span>
        </Link>
      </div>
    </div>
  );
};

export default Games;
