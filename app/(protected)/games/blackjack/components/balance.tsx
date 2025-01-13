import { useBlackjack } from '@/hooks';
import { CoinIcon } from '@/images/icons';

import styles from '../styles/balance.module.scss';

export const Balance = ({
  disabled = false,
  cash,
}: {
  disabled?: boolean;
  cash: number;
}) => {
  const { bet, updateBet } = useBlackjack();

  const betValue = !bet || bet < 1 ? '' : bet;

  return (
    <div className={styles.balance}>
      <div className={styles.betBox}>
        <span>BET:</span>
        <input
          disabled={disabled}
          type="number"
          onChange={e => {
            if (e.target.value === '') return updateBet(null);

            const newBet = parseInt(e.target.value, 10);
            if (newBet > 0) updateBet(newBet);
          }}
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
