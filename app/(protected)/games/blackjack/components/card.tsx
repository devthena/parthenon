import { PlayCard } from '@/interfaces/games';
import { getSuitSVG } from '@/lib/utils/cards';

import styles from '../styles/card.module.scss';

export const CardBox = ({ rank, small, suit }: PlayCard) => {
  const suitSVG = getSuitSVG(suit);
  const smallClass = small ? styles.small : '';

  return (
    <div className={`${styles.card} ${styles[suit]} ${smallClass}`}>
      <p>{rank}</p>
      {suitSVG}
    </div>
  );
};
