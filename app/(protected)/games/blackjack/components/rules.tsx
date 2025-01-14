import styles from '../styles/rules.module.scss';

export const Rules = () => {
  return (
    <div className={styles.rules}>
      <h3>HOW TO PLAY</h3>
      <p>Get closer to 21 than the Dealer</p>
      <div className={styles.list}>
        <ul>
          <li>
            <span className={styles.green}>HIT</span> - Draw another card
          </li>
          <li>
            <span className={styles.green}>STAND</span> - Keep your hand and end
            your turn
          </li>
          <li>
            <span className={styles.green}>DOUBLE</span> - Doubled bet and draw
            a last card
          </li>
        </ul>
      </div>
      <h3>GAME RULES</h3>
      <div className={styles.list}>
        <ul>
          <li>Blackjack (exactly 21) is automatic win</li>
          <li>Push (Dealer has same value as you) is a tie</li>
          <li>Bust or Dealer Bust (over 21) means a loss</li>
        </ul>
      </div>
    </div>
  );
};
