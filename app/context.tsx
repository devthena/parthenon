'use client';

import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';

import { INITIAL_STATS } from '@/constants/stats';
import { ApiUrl } from '@/enums/api';
import { useApi } from '@/hooks';

import {
  DataObject,
  StarObject,
  StatsObject,
  UserStateObject,
} from '@/types/db';

interface ParthenonState {
  isFetched: boolean;
  isLoading: boolean;
  stars: StarObject | null;
  stats: StatsObject;
  user: UserStateObject | null;
}

type ParthenonAction =
  | { type: 'set_loading' }
  | { type: 'set_data'; payload: DataObject | null }
  | { type: 'update_stats'; payload: StatsObject }
  | { type: 'update_user'; payload: UserStateObject | null };

const initialState: ParthenonState = {
  isFetched: false,
  isLoading: false,
  stars: null,
  stats: INITIAL_STATS,
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
    case 'set_data':
      return {
        ...state,
        isLoading: false,
        isFetched: true,
        stars: action.payload?.stars ?? null,
        stats: action.payload?.stats ?? state.stats,
        user: action.payload?.user ?? null,
      };
    case 'set_loading':
      return {
        ...state,
        isLoading: true,
      };
    case 'update_stats':
      return {
        ...state,
        stats: action.payload,
      };
    case 'update_user':
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
  const { saveData } = useApi();

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

  const onUpdateStats = useCallback(
    (stats: StatsObject) => {
      dispatch({ type: 'update_stats', payload: stats });
    },
    [dispatch]
  );

  const onUpdateUser = useCallback(
    (user: UserStateObject | null) => {
      dispatch({ type: 'update_user', payload: user });
    },
    [dispatch]
  );

  const saveStats = useCallback(async () => {
    if (!state.stats.discord_id.length) return;
    try {
      const { _id, ...modifiedStats } = state.stats;
      await saveData(ApiUrl.Stats, modifiedStats);
    } catch (error) {
      console.error(error);
    }
  }, [state.stats, saveData]);

  const saveUser = useCallback(async () => {
    if (!state.user) return;
    try {
      await saveData(ApiUrl.Users, state.user);
    } catch (error) {
      console.error(error);
    }
  }, [state.user, saveData]);

  return {
    ...state,
    onSetLoading,
    onSetData,
    onUpdateStats,
    onUpdateUser,
    saveStats,
    saveUser,
  };
};

export { ParthenonProvider, useParthenonState };
