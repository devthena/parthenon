import { WordleStatus } from '../../../../lib/enums/wordle';
import { AnswerGridProps } from '../../../../lib/types/wordle';

import styles from '../styles/grid.module.scss';

export const AnswerGrid = ({
  colors,
  guesses,
  status,
  turn,
}: AnswerGridProps) => {
  return (
    <div className={styles.grid}>
      {Object.values(guesses).map((guess, i) => {
        const colorArray = Object.values(colors)[i];
        const lastTurn = turn - 1;

        let styleNamesRow = styles.row;

        if (
          lastTurn === i &&
          (status === WordleStatus.InvalidTurn ||
            status === WordleStatus.InvalidWord)
        ) {
          styleNamesRow = `${styles.row} ${styles.invalid}`;
        }

        return (
          <div className={styleNamesRow} key={i}>
            {guess.map((letter, j) => {
              let styleNames = styles.letter;

              if (colorArray[j].length > 0) {
                styleNames = `${styles.letter} ${styles[colorArray[j]]}`;
              } else if (letter.length > 0) {
                styleNames = `${styles.letter} ${styles.guessing}`;
              }

              return (
                <div className={styleNames} key={j}>
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
