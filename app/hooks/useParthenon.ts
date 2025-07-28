import { useCallback, useContext } from 'react';

import { GameCode } from '@/enums/games';
import { GameDocument } from '@/interfaces/games';
import { ModalState } from '@/interfaces/modal';
import { UserDocument } from '@/interfaces/user';
import { ParthenonContext } from '@/lib/context';

export const useParthenon = () => {
  const context = useContext(ParthenonContext);

  if (context === undefined) {
    throw new Error(
      'useParthenonState must be used within a ParthenonProvider'
    );
  }

  const { state, dispatch } = context;

  const setStateActiveGame = useCallback(
    (code: GameCode, game: GameDocument | null) => {
      dispatch({
        type: 'SET_ACTIVE_GAME',
        payload: { code, data: game },
      });
    },
    [dispatch]
  );

  const setStateActiveGames = useCallback(
    (games: GameDocument[]) => {
      dispatch({
        type: 'SET_ACTIVE_GAMES',
        payload: games,
      });
    },
    [dispatch]
  );

  const setStateModal = useCallback(
    (modal: Partial<ModalState>) => {
      dispatch({ type: 'SET_MODAL', payload: modal });
    },
    [dispatch]
  );

  const setStateUser = useCallback(
    (user: UserDocument | null) => {
      dispatch({ type: 'SET_USER', payload: user });
    },
    [dispatch]
  );

  return {
    ...state,
    setStateActiveGame,
    setStateActiveGames,
    setStateModal,
    setStateUser,
  };
};
