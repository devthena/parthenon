import { useCallback, useEffect, useState } from 'react';

import { useParthenonState } from '@/context';

import { GAME_OVER_STATUS_BLK } from '@/constants/cards';
import { BlackjackStatus, GameCode } from '@/enums/games';
import { PlayCard } from '@/interfaces/games';
import { getBlackjackResult, getHandValue } from '@/lib/utils/cards';

import { Balance } from './balance';
import { CardBox } from './card';

import styles from '../styles/game.module.scss';

export const GameTable = ({
  bet,
  cash,
  deckSize,
  dealerHand,
  playerHand,
  status,
  updateGame,
  onBetChange,
  onDouble,
  onHit,
  onPlay,
  onStand,
}: {
  bet: number | null;
  cash: number;
  deckSize: number;
  dealerHand: PlayCard[];
  playerHand: PlayCard[];
  status: BlackjackStatus;
  updateGame: (status: BlackjackStatus, isDouble: boolean) => Promise<void>;
  onBetChange: (bet: number | null) => void;
  onDouble: () => void;
  onHit: () => void;
  onPlay: (bet: number) => void;
  onStand: () => void;
}) => {
  const { user, stats, onSetStats, onSetUser } = useParthenonState();

  const [isDouble, setIsDouble] = useState(false);

  const handleDouble = useCallback(async () => {
    if (isDouble) return;
    await setIsDouble(true);
    onDouble();
  }, [onDouble]);

  const gameOver = GAME_OVER_STATUS_BLK.includes(status);

  useEffect(() => {
    if (!user || !user.discord_username || !stats[GameCode.Blackjack] || !bet)
      return;

    if (GAME_OVER_STATUS_BLK.includes(status)) {
      updateGame(status, isDouble);

      const newStats = {
        totalBlackjack: stats[GameCode.Blackjack].totalBlackjack,
        totalPlayed: stats[GameCode.Blackjack].totalPlayed + 1,
        totalWon: stats[GameCode.Blackjack].totalWon,
      };

      if (status === BlackjackStatus.Blackjack) {
        onSetStats({
          [GameCode.Blackjack]: {
            ...newStats,
            totalBlackjack: newStats.totalBlackjack + 1,
            totalWon: newStats.totalWon + 1,
          },
        });

        const reward = bet + Math.round(bet * 1.5);

        onSetUser({
          ...user,
          cash: user.cash + reward,
        });
      } else if (
        status === BlackjackStatus.Win ||
        status === BlackjackStatus.DealerBust
      ) {
        onSetStats({
          [GameCode.Blackjack]: {
            ...newStats,
            totalWon: newStats.totalWon + 1,
          },
        });

        const reward = bet * 2;

        onSetUser({
          ...user,
          cash: user.cash + reward,
        });
      } else if (status === BlackjackStatus.Push) {
        onSetUser({
          ...user,
          cash: user.cash + bet,
        });
      }
    }
  }, [status]);

  return (
    <div className={styles.game}>
      <div className={styles.board}>
        <p className={styles.deck}>Deck: {deckSize}</p>
        <div className={styles.dealer}>
          <div>
            <p className={styles.name}>Dealer</p>
            <p className={styles.value}>{getHandValue(dealerHand)}</p>
          </div>
          <div className={styles.cards}>
            {dealerHand.map((card, i) => (
              <CardBox
                key={i}
                small={dealerHand.length > 5}
                suit={card.suit}
                rank={card.rank}
              />
            ))}
          </div>
        </div>
        {!gameOver && (
          <div className={styles.actions}>
            <button disabled={!bet || bet > cash} onClick={handleDouble}>
              DOUBLE
            </button>
            <button onClick={onHit}>HIT</button>
            <button onClick={onStand}>STAND</button>
          </div>
        )}
        {gameOver && (
          <div className={styles.result}>
            <div>
              <p>RESULT: {getBlackjackResult(status)}</p>
              <button
                disabled={!bet || bet > cash}
                onClick={() => {
                  if (bet) onPlay(bet);
                }}>
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
        <div className={styles.player}>
          <div>
            <p className={styles.name}>
              {user?.discord_name || user?.twitch_username || 'Player'}
            </p>
            <p className={styles.value}>{getHandValue(playerHand)}</p>
          </div>
          <div className={styles.cards}>
            {playerHand.map((card, i) => (
              <CardBox
                key={i}
                small={playerHand.length > 5}
                suit={card.suit}
                rank={card.rank}
              />
            ))}
          </div>
        </div>
      </div>
      <Balance
        bet={bet}
        cash={cash}
        disabled={!gameOver}
        onUpdate={onBetChange}
      />
    </div>
  );
};
