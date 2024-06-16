'use client';

import Link from 'next/link';
import styles from './page.module.scss';

const Games = () => {
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
