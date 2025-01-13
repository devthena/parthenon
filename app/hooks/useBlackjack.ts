import { useCallback, useReducer } from 'react';

import { INITIAL_STATE_BLK } from '@/constants/cards';
import { BlackjackStatus } from '@/enums/games';
import { PlayCard } from '@/interfaces/games';

import { createCardDeck, getHandValue, shuffleDeck } from '@/lib/utils/cards';
import { blackjackReducer } from '@/lib/reducers';

export const useBlackjack = () => {
  const [state, dispatch] = useReducer(blackjackReducer, INITIAL_STATE_BLK);

  const onBetChange = useCallback(
    (bet: number | null) => {
      dispatch({ type: 'BET_UPDATE', payload: bet });
    },
    [dispatch]
  );

  const onReset = useCallback(() => {
    dispatch({ type: 'GAME_RESET' });
  }, [dispatch]);

  const onPlay = useCallback(
    (bet: number) => {
      const newDeck = createCardDeck();
      const deck: PlayCard[] = shuffleDeck([...newDeck, ...newDeck]);
      dispatch({ type: 'GAME_START', payload: { bet, deck } });
    },
    [dispatch]
  );

  const onDouble = useCallback(() => {
    dispatch({ type: 'DOUBLE' });
  }, [dispatch]);

  const onHit = useCallback(() => {
    dispatch({ type: 'HIT' });
  }, [dispatch]);

  const onStand = useCallback(() => {
    dispatch({ type: 'STAND' });
  }, [dispatch]);

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

  return {
    ...state,
    isGameOver,
    onBetChange,
    onDouble,
    onHit,
    onReset,
    onStand,
    onPlay,
  };
};
