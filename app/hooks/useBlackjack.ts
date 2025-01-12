import { useCallback, useReducer } from 'react';

import { INITIAL_STATE_BLK } from '@/constants/cards';
import { BlackjackStatus } from '@/enums/games';
import { PlayCard } from '@/interfaces/games';

import { getHandValue, shuffleDeck } from '@/lib/utils/cards';
import { blackjackReducer } from '@/lib/reducers';

export const useBlackjack = () => {
  const [state, dispatch] = useReducer(blackjackReducer, INITIAL_STATE_BLK);

  const updateBet = useCallback(
    (bet: number) => {
      dispatch({ type: 'BET_UPDATE', payload: bet });
    },
    [dispatch]
  );

  const resetGame = useCallback(() => {
    dispatch({ type: 'GAME_RESET' });
  }, [dispatch]);

  const startGame = useCallback(
    (bet: number) => {
      const deck: PlayCard[] = shuffleDeck();
      dispatch({ type: 'GAME_START', payload: { bet, deck } });
    },
    [dispatch]
  );

  const isGameOver = useCallback(() => {
    const playerHandValue = getHandValue(state.playerHand);
    const dealerHandValue = getHandValue(state.dealerHand);

    if (playerHandValue > 21) {
      dispatch({ type: 'GAME_END', payload: BlackjackStatus.Bust });
    } else if (dealerHandValue > 21) {
      dispatch({ type: 'GAME_END', payload: BlackjackStatus.DealerBust });
    } else if (playerHandValue === 21) {
      dispatch({ type: 'GAME_END', payload: BlackjackStatus.Blackjack });
    } else if (dealerHandValue >= 17 && dealerHandValue > playerHandValue) {
      dispatch({ type: 'GAME_END', payload: BlackjackStatus.Lose });
    } else if (dealerHandValue >= 17 && playerHandValue > dealerHandValue) {
      dispatch({ type: 'GAME_END', payload: BlackjackStatus.Win });
    } else if (dealerHandValue >= 17 && dealerHandValue === playerHandValue) {
      dispatch({ type: 'GAME_END', payload: BlackjackStatus.Push });
    }
  }, [dispatch, state.dealerHand, state.playerHand]);

  const playerDouble = useCallback(() => {
    dispatch({ type: 'DOUBLE' });
  }, [dispatch]);

  const playerHit = useCallback(() => {
    dispatch({ type: 'HIT' });
  }, [dispatch]);

  const playerStand = useCallback(() => {
    dispatch({ type: 'STAND' });
  }, [dispatch]);

  return {
    ...state,
    isGameOver,
    playerDouble,
    playerHit,
    playerStand,
    resetGame,
    startGame,
    updateBet,
  };
};
