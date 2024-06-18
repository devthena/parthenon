import styles from '../styles/rules.module.scss';

export const Rules = () => {
  return (
    <div className={styles.rules}>
      <h3>HOW TO PLAY</h3>
      <p>Guess the Wordle in 6 tries</p>
      <div className={styles.ruleList}>
        <ul>
          <li>Each guess must be a valid 5-letter word</li>
          <li>
            <span className={styles.green}>GREEN</span> is for letters in the
            correct spot
          </li>
          <li>
            <span className={styles.yellow}>YELLOW</span> is for letters in the
            wrong spot
          </li>
          <li>
            <span className={styles.grey}>GREY</span> is for letters that do not
            exist
          </li>
        </ul>
      </div>
    </div>
  );
};
