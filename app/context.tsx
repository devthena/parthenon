'use client';

import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';

import {
  ActivityStateObject,
  DataObject,
  StatsStateObject,
  UserStateObject,
} from '@/types/db';

import { GameStateObject } from '@/types/games';

interface ParthenonState {
  isFetched: boolean;
  isLoading: boolean;
  activities: ActivityStateObject | null;
  games: GameStateObject;
  stats: StatsStateObject;
  user: UserStateObject | null;
}

type ParthenonAction =
  | { type: 'set_loading' }
  | { type: 'set_data'; payload: DataObject | null }
  | { type: 'set_game'; payload: GameStateObject }
  | { type: 'set_stats'; payload: StatsStateObject }
  | { type: 'set_user'; payload: UserStateObject };

const initialState: ParthenonState = {
  isFetched: false,
  isLoading: false,
  activities: null,
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
    case 'set_loading':
      return {
        ...state,
        isLoading: true,
      };
    case 'set_data':
      return {
        ...state,
        isLoading: false,
        isFetched: true,
        activities: action.payload?.activities ?? null,
        user: action.payload?.user ?? null,
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

  const onSetLoading = useCallback(() => {
    dispatch({ type: 'set_loading' });
  }, [dispatch]);

  const onSetData = useCallback(
    (data: DataObject | null) => {
      dispatch({ type: 'set_data', payload: data });
    },
    [dispatch]
  );

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
    (user: UserStateObject) => {
      dispatch({ type: 'set_user', payload: user });
    },
    [dispatch]
  );

  return {
    ...state,
    onSetLoading,
    onSetData,
    onSetGame,
    onSetStats,
    onSetUser,
  };
};

export { ParthenonProvider, useParthenonState };
