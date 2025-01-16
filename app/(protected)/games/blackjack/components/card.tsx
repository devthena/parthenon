import { CardSize } from '@/enums/games';
import { CardBoxProps } from '@/interfaces/games';
import { getSuitSVG } from '@/lib/utils/cards';

import styles from '../styles/card.module.scss';

export const CardBox = ({ order, animate, rank, size, suit }: CardBoxProps) => {
  const suitSVG = getSuitSVG(suit);

  let sizeClass = styles.large;

  if (size === CardSize.Medium) sizeClass = styles.medium;
  else if (size === CardSize.Small) sizeClass = styles.small;
  else if (size === CardSize.XSmall) sizeClass = styles.xsmall;

  let animateClass = '';

  if (order > -1) {
    animateClass += styles[`order-${order}`];

    if (animate === 'up') {
      animateClass += ` ${styles.animateUp}`;
    } else if (animate === 'down') {
      animateClass += ` ${styles.animateDown}`;
    }
  } else {
    animateClass += styles.active;
  }

  return (
    <div
      className={`${styles.card} ${styles[suit]} ${sizeClass} ${animateClass}`}>
      <p>{rank}</p>
      {suitSVG}
    </div>
  );
};
