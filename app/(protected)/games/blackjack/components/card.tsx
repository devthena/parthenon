import { CardSize } from '@/enums/games';
import { PlayCard } from '@/interfaces/games';
import { getSuitSVG } from '@/lib/utils/cards';

import styles from '../styles/card.module.scss';

export const CardBox = ({ rank, size, suit }: PlayCard) => {
  const suitSVG = getSuitSVG(suit);

  let sizeClass = styles.large;
  if (size === CardSize.Medium) sizeClass = styles.medium;
  else if (size === CardSize.Small) sizeClass = styles.small;
  else if (size === CardSize.XSmall) sizeClass = styles.xsmall;

  return (
    <div className={`${styles.card} ${styles[suit]} ${sizeClass}`}>
      <p>{rank}</p>
      {suitSVG}
    </div>
  );
};
