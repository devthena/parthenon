import { CoinIcon } from '../../../../images/icons';
import { WordleStatus } from '../../../../lib/enums/wordle';
import styles from '../styles/notice.module.scss';

interface NoticeProps {
  answer: string;
  currentGuess: string;
  status: WordleStatus;
  reward: number | null;
  onResume: () => void;
}

export const Notice = ({
  answer,
  currentGuess,
  status,
  reward,
  onResume,
}: NoticeProps) => {
  if (
    status === WordleStatus.InvalidGuess ||
    status === WordleStatus.InvalidWord
  ) {
    setTimeout(onResume, 2250);
  }

  return (
    <div className={styles.container}>
      {status === WordleStatus.Answered && (
        <p className={styles.note}>
          Congrats!{' '}
          {reward && (
            <>
              Reward: <span className={styles.reward}>{reward}</span>
              <span className={styles.coin}>
                <CoinIcon />
              </span>
            </>
          )}{' '}
          Press ENTER to play again.
        </p>
      )}
      {status === WordleStatus.Completed && (
        <p className={styles.note}>
          Answer: <span className={styles.answer}>{answer}</span>. Press ENTER
          to play again.
        </p>
      )}
      {status === WordleStatus.InvalidGuess && (
        <p className={`${styles.note} ${styles.noteFade}`}>
          <span className={styles.answer}>{currentGuess}</span>
          <span>does not have enough letters.</span>
        </p>
      )}
      {status === WordleStatus.InvalidWord && (
        <p className={`${styles.note} ${styles.noteFade}`}>
          <span className={styles.answer}>{currentGuess}</span>
          <span>is not in the dictionary.</span>
        </p>
      )}
    </div>
  );
};
