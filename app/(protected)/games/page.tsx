'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { useParthenonState } from '@/context';
import { WordleIcon } from '@/images/icons';

import styles from './page.module.scss';

const Games = () => {
  const { user } = useParthenonState();
  if (!user?.discord_id) redirect('/dashboard');

  return (
    <div className={styles.games}>
      <h1>GAMES</h1>
      <p className={styles.description}>
        Tired of gambling all and losing?
        <br />
        Earn coins by playing some games here!
      </p>
      <div className={styles.grid}>
        <Link className={styles.gridItem} href="/games/wordle">
          <WordleIcon />
          <span>Wordle</span>
        </Link>
      </div>
    </div>
  );
};

export default Games;
