import { CoinIcon } from '@/images/icons';
import styles from '../styles/balance.module.scss';

export const Balance = ({
  bet,
  cash,
  disabled = false,
  onUpdate,
}: {
  bet: number | null;
  cash: number;
  disabled?: boolean;
  onUpdate: Function;
}) => {
  const betValue = !bet || bet < 1 ? '' : bet;

  return (
    <div className={styles.balance}>
      <div className={styles.betBox}>
        <span>BET:</span>
        <input
          disabled={disabled}
          max={cash}
          min={1}
          onChange={e => {
            if (e.target.value === '') return onUpdate(null);

            const newBet = parseInt(e.target.value, 10);

            if (isNaN(newBet)) return onUpdate(null);
            else if (newBet > 0) onUpdate(newBet);
          }}
          type="number"
          value={betValue}
        />
      </div>
      <div className={styles.balanceBox}>
        <span>CASH BALANCE:</span>
        <span className={styles.cash}>{cash}</span>
        <CoinIcon />
      </div>
    </div>
  );
};
