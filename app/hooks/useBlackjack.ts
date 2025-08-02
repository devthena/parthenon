'use client';

import { useCallback, useReducer } from 'react';

import { INITIAL_STATE_BLK } from '@/constants/cards';
import { PlayCard } from '@/interfaces/games';
import { createCardDeck, shuffleDeck } from '@/lib/utils/cards';
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

  const onSetStatus = useCallback(() => {
    dispatch({ type: 'SET_STATUS' });
  }, []);

  const onDouble = useCallback(() => {
    dispatch({ type: 'DOUBLE' });
  }, [dispatch]);

  const onHit = useCallback(() => {
    dispatch({ type: 'HIT' });
  }, [dispatch]);

  const onStand = useCallback(() => {
    dispatch({ type: 'STAND' });
  }, [dispatch]);

  return {
    ...state,
    onBetChange,
    onDouble,
    onHit,
    onReset,
    onSetStatus,
    onStand,
    onPlay,
  };
};
