import { BlackjackObject } from '@/interfaces/games';
import styles from '../styles/stats.module.scss';

export const Stats = ({ data }: { data: BlackjackObject }) => {
  return (
    <div className={styles.stats}>
      <div className={styles.statsBox}>
        <h3>STATS</h3>
        <p>Total Blackjacks: {data.totalBlackjack}</p>
        <p>Total Wins: {data.totalWon}</p>
        <p>Total Times Played: {data.totalPlayed}</p>
      </div>
    </div>
  );
};
