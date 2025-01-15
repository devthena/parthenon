import { CardSize } from '@/enums/games';
import { CardBoxProps } from '@/interfaces/games';
import { getSuitSVG } from '@/lib/utils/cards';

import styles from '../styles/card.module.scss';

export const CardBox = ({ animate, rank, size, suit }: CardBoxProps) => {
  const suitSVG = getSuitSVG(suit);

  let sizeClass = styles.large;
  if (size === CardSize.Medium) sizeClass = styles.medium;
  else if (size === CardSize.Small) sizeClass = styles.small;
  else if (size === CardSize.XSmall) sizeClass = styles.xsmall;

  const animateClass = animate ? styles.animate : null;

  return (
    <div
      className={`${styles.card} ${styles[suit]} ${sizeClass} ${animateClass}`}>
      <p>{rank}</p>
      {suitSVG}
    </div>
  );
};
