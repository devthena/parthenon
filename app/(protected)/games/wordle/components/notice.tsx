import { WordleStatus } from '../../../../lib/enums/wordle';
import { NoticeProps } from '../../../../lib/types/wordle';

import styles from '../styles/notice.module.scss';

export const Notice = ({ word, status }: NoticeProps) => {
  return (
    <div className={styles.container}>
      {status === WordleStatus.Answered && (
        <p className={styles.note}>Good job! Press ENTER to play again.</p>
      )}
      {status === WordleStatus.Completed && (
        <p className={styles.note}>
          Answer: <span className={styles.answer}>{word}</span>. Press ENTER to
          play again.
        </p>
      )}
      {status === WordleStatus.InvalidTurn && (
        <p className={`${styles.note} ${styles.noteFade}`}>
          Not enough letters
        </p>
      )}
      {status === WordleStatus.InvalidWord && (
        <p className={`${styles.note} ${styles.noteFade}`}>Not in word list</p>
      )}
    </div>
  );
};
