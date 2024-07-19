import { WORD_LENGTH } from '@/constants/wordle';
import { WordleStatus } from '@/enums/wordle';
import { Guess } from '@/types/wordle';

import styles from '../styles/grid.module.scss';

interface GridProps {
  currentTurn: number;
  guesses: Guess[];
  status: WordleStatus;
}

export const AnswerGrid = ({ currentTurn, guesses, status }: GridProps) => {
  return (
    <div className={styles.grid}>
      {guesses.map((guess, index) => {
        const guessArray = guess.word.split('');
        const wordArray = Array(WORD_LENGTH)
          .fill('')
          .map((_l, i) => (guessArray[i] !== undefined ? guessArray[i] : ''));

        const rowClass =
          index === currentTurn &&
          (status === WordleStatus.InvalidGuess ||
            status === WordleStatus.InvalidWord)
            ? styles.row + ' ' + styles.invalid
            : styles.row;

        return (
          <div key={index} className={rowClass}>
            {wordArray.map((letter: string, i: number) => {
              const resultClass = styles.letter + ' ' + styles[guess.result[i]];
              const styleClass =
                index === currentTurn && letter !== ''
                  ? resultClass + ' ' + styles.guessing
                  : resultClass;

              return (
                <div key={i} className={styleClass}>
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
