import { BlackjackObject } from '@/interfaces/games';
import styles from '../styles/stats.module.scss';

export const Stats = ({ data }: { data: BlackjackObject }) => {
  const winPercentage = !data.totalPlayed
    ? 'N/A'
    : Math.round((data.totalWon / data.totalPlayed) * 100) + '%';

  return (
    <div className={styles.stats}>
      <div className={styles.statsBox}>
        <h3>STATS</h3>
        <p>Win Percentage: {winPercentage}</p>
        <p>Total Blackjacks: {data.totalBlackjack}</p>
        <p>Total Wins: {data.totalWon}</p>
        <p>Total Times Played: {data.totalPlayed}</p>
      </div>
    </div>
  );
};
