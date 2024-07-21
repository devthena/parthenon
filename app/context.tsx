'use client';

import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';

import { UserObject } from '@/interfaces/user';
import { StatsStateObject } from '@/types/db';
import { GameStateObject } from '@/types/games';

interface ParthenonState {
  isFetched: boolean;
  isLoading: boolean;
  games: GameStateObject;
  stats: StatsStateObject;
  user: UserObject | null;
}

type ParthenonAction =
  | { type: 'init_user'; payload: UserObject | null }
  | { type: 'set_loading' }
  | { type: 'set_game'; payload: GameStateObject }
  | { type: 'set_stats'; payload: StatsStateObject }
  | { type: 'set_user'; payload: UserObject };

const initialState: ParthenonState = {
  isFetched: false,
  isLoading: false,
  games: {},
  stats: {},
  user: null,
};

const ParthenonContext = createContext<
  { state: ParthenonState; dispatch: Dispatch<ParthenonAction> } | undefined
>(undefined);

const reducer = (
  state: ParthenonState,
  action: ParthenonAction
): ParthenonState => {
  switch (action.type) {
    case 'init_user':
      return {
        ...state,
        isFetched: true,
        isLoading: false,
        user: action.payload,
      };
    case 'set_loading':
      return {
        ...state,
        isLoading: true,
      };
    case 'set_game':
      return {
        ...state,
        games: {
          ...state.games,
          ...action.payload,
        },
      };
    case 'set_stats':
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload,
        },
      };
    case 'set_user':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const ParthenonProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ParthenonContext.Provider value={{ state, dispatch }}>
      {children}
    </ParthenonContext.Provider>
  );
};

const useParthenonState = () => {
  const context = useContext(ParthenonContext);

  if (context === undefined) {
    throw new Error(
      'useParthenonState must be used within a ParthenonProvider'
    );
  }

  const { state, dispatch } = context;

  const onInitUser = useCallback(
    (user: UserObject | null) => {
      dispatch({ type: 'init_user', payload: user });
    },
    [dispatch]
  );

  const onSetLoading = useCallback(() => {
    dispatch({ type: 'set_loading' });
  }, [dispatch]);

  const onSetGame = useCallback(
    (game: GameStateObject) => {
      dispatch({ type: 'set_game', payload: game });
    },
    [dispatch]
  );

  const onSetStats = useCallback(
    (stats: StatsStateObject) => {
      dispatch({ type: 'set_stats', payload: stats });
    },
    [dispatch]
  );

  const onSetUser = useCallback(
    (user: UserObject) => {
      dispatch({ type: 'set_user', payload: user });
    },
    [dispatch]
  );

  return {
    ...state,
    onInitUser,
    onSetLoading,
    onSetGame,
    onSetStats,
    onSetUser,
  };
};

export { ParthenonProvider, useParthenonState };
