import { useCallback, useEffect, useReducer } from 'react';

import { initialStats } from '../lib/constants/stats';
import { ApiUrl } from '../lib/enums/api';
import { WordleObject } from '../lib/types/wordle';
import { GameCode } from '../lib/enums/games';

import { useApi } from './useApi';

interface StatsState {
  stats: WordleObject | null;
  statsFetchLoading: boolean;
  statsSaveLoading: boolean;
  statsError: string | null;
}

type StatsAction =
  | { type: 'fetch' }
  | { type: 'fetch_ok'; payload: WordleObject }
  | { type: 'fetch_error'; error: string }
  | { type: 'save' }
  | { type: 'save_ok' }
  | { type: 'save_error'; error: string }
  | { type: 'update_stats'; payload: WordleObject };

const statsReducer = (state: StatsState, action: StatsAction): StatsState => {
  switch (action.type) {
    case 'fetch':
      return {
        ...state,
        statsFetchLoading: true,
        statsError: null,
      };
    case 'save':
      return {
        ...state,
        statsSaveLoading: true,
        statsError: null,
      };
    case 'fetch_ok':
      return {
        ...state,
        statsFetchLoading: false,
        stats: action.payload,
        statsError: null,
      };
    case 'save_ok':
      return {
        ...state,
        statsSaveLoading: false,
        statsError: null,
      };
    case 'fetch_error':
    case 'save_error':
      return {
        ...state,
        statsFetchLoading: false,
        statsSaveLoading: false,
        statsError: action.error,
      };
    case 'update_stats':
      return {
        ...state,
        stats: action.payload,
      };
    default:
      return {
        ...state,
        statsFetchLoading: false,
        statsSaveLoading: false,
        statsError: 'Unhandled action type.',
      };
  }
};

const initialState: StatsState = {
  stats: null,
  statsFetchLoading: false,
  statsSaveLoading: false,
  statsError: null,
};

export const useStats = (code: GameCode) => {
  const { data, dataLoading, dataError, fetchData, saveData } = useApi();
  const [state, dispatch] = useReducer(statsReducer, initialState);

  const fetchStats = useCallback(
    async (discordId: string) => {
      dispatch({ type: 'fetch' });

      try {
        await fetchData(`${ApiUrl.Stats}/${code}/${discordId}`);
      } catch (error) {
        dispatch({ type: 'fetch_error', error: JSON.stringify(error) });
        throw new Error('Hook Error: useStats (fetchStats)');
      }
    },
    [code, fetchData]
  );

  const saveStats = useCallback(
    async (discordId: string) => {
      if (!state.stats) return;
      dispatch({ type: 'save' });

      try {
        await saveData(ApiUrl.Stats, {
          discord_id: discordId,
          code: code,
          data: state.stats,
        });

        dispatch({ type: 'save_ok' });
      } catch (error) {
        dispatch({ type: 'save_error', error: JSON.stringify(error) });
        throw new Error('Hook Error: useStats (fetchStats)');
      }
    },
    [code, state.stats, saveData]
  );

  const updateStats = useCallback((stats: WordleObject) => {
    dispatch({ type: 'update_stats', payload: stats });
  }, []);

  useEffect(() => {
    if (dataLoading) return;
    if (dataError) return dispatch({ type: 'fetch_error', error: dataError });

    if (state.statsFetchLoading) {
      if (data) {
        dispatch({ type: 'fetch_ok', payload: data.data });
      } else {
        dispatch({ type: 'fetch_ok', payload: initialStats[code] });
      }
    } else if (state.statsSaveLoading) {
      dispatch({ type: 'save_ok' });
    }
  }, [
    code,
    data,
    dataError,
    dataLoading,
    state.statsFetchLoading,
    state.statsSaveLoading,
  ]);

  return {
    ...state,
    fetchStats,
    saveStats,
    updateStats,
  };
};
