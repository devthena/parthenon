import { useCallback, useEffect, useReducer } from 'react';

import { initialStats } from '../lib/constants/stats';
import { ApiUrl } from '../lib/enums/api';
import { WordleObject } from '../lib/types/wordle';
import { GameCode } from '../lib/enums/games';

import { useApi } from './useApi';

interface StatsState {
  stats: WordleObject | null;
  statsLoading: boolean;
  statsError: string | null;
}

type StatsAction =
  | { type: 'fetch' }
  | { type: 'fetch_ok'; payload: WordleObject }
  | { type: 'fetch_error'; error: string }
  | { type: 'save' }
  | { type: 'save_ok'; payload: WordleObject }
  | { type: 'save_error'; error: string };

const statsReducer = (state: StatsState, action: StatsAction): StatsState => {
  switch (action.type) {
    case 'fetch':
    case 'save':
      return {
        ...state,
        statsLoading: true,
        statsError: null,
      };
    case 'fetch_ok':
    case 'save_ok':
      return {
        ...state,
        statsLoading: false,
        stats: action.payload,
        statsError: null,
      };
    case 'fetch_error':
    case 'save_error':
      return {
        ...state,
        statsLoading: false,
        statsError: action.error,
      };
    default:
      return {
        ...state,
        statsLoading: false,
        statsError: 'Unhandled action type.',
      };
  }
};

const initialState: StatsState = {
  stats: null,
  statsLoading: false,
  statsError: null,
};

export const useStats = (code: GameCode) => {
  const { data, dataLoading, dataError, fetchData, saveData } = useApi();

  const [state, dispatch] = useReducer(statsReducer, initialState);

  const fetchStats = useCallback(
    async (userId: string) => {
      dispatch({ type: 'fetch' });

      try {
        await fetchData(`${ApiUrl.Stats}/${code}/${userId}`);
      } catch (error) {
        dispatch({ type: 'fetch_error', error: JSON.stringify(error) });
        throw new Error('Hook Error: useStats (fetchStats)');
      }
    },
    [code, fetchData]
  );

  const saveStats = useCallback(
    async (userId: string) => {
      if (!state.stats) return;
      dispatch({ type: 'save' });

      try {
        await saveData(ApiUrl.Stats, {
          user_id: userId,
          code: code,
          data: state.stats,
        });

        dispatch({ type: 'save_ok', payload: state.stats });
      } catch (error) {
        dispatch({ type: 'save_error', error: JSON.stringify(error) });
        throw new Error('Hook Error: useStats (fetchStats)');
      }
    },
    [code, state.stats, saveData]
  );

  useEffect(() => {
    if (!dataLoading || state.stats) return;
    if (dataError) return dispatch({ type: 'fetch_error', error: dataError });

    if (data) {
      dispatch({ type: 'fetch_ok', payload: data as WordleObject });
    } else {
      dispatch({ type: 'fetch_ok', payload: initialStats[code] });
    }
  }, [code, data, dataError, dataLoading, state.stats]);

  return {
    ...state,
    fetchStats,
    saveStats,
  };
};
