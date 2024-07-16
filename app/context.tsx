'use client';

import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';

import { GAME_REWARDS } from '@/constants/games';
import { ApiUrl } from '@/enums/api';
import { GameCode } from '@/enums/games';
import { useApi } from '@/hooks';

import {
  ActivityStateObject,
  DataObject,
  StatsStateObject,
  UserStateObject,
} from '@/types/db';

interface ParthenonState {
  isFetched: boolean;
  isLoading: boolean;
  activities: ActivityStateObject | null;
  stats: StatsStateObject;
  user: UserStateObject | null;
}

type ParthenonAction =
  | { type: 'set_loading' }
  | { type: 'set_data'; payload: DataObject | null }
  | { type: 'set_stats'; payload: StatsStateObject }
  | { type: 'set_user'; payload: UserStateObject };

const initialState: ParthenonState = {
  isFetched: false,
  isLoading: false,
  activities: null,
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
    case 'set_data':
      return {
        ...state,
        isLoading: false,
        isFetched: true,
        activities: action.payload?.activities ?? null,
        user: action.payload?.user ?? null,
      };
    case 'set_loading':
      return {
        ...state,
        isLoading: true,
      };
    case 'set_stats':
      return {
        ...state,
        stats: action.payload,
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

  const saveStats = useCallback(
    async (code: GameCode, reward?: number) => {
      const rewards = GAME_REWARDS[code];

      let rewardKey = reward
        ? rewards.find(obj => obj.value === reward)
        : undefined;

      try {
        const payload = {
          code,
          key: rewardKey?.label,
          data: {
            [code]: state.stats?.[code],
          },
        };

        await saveData(ApiUrl.Stats, payload);
      } catch (error) {
        console.error(error);
      }
    },
    [state.stats, saveData]
  );

  return {
    ...state,
    onSetLoading,
    onSetData,
    onSetStats,
    onSetUser,
    saveStats,
  };
};

export { ParthenonProvider, useParthenonState };
