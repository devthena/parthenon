import { useCallback, useState } from 'react';

import { INITIAL_STATS } from '@/constants/stats';

import { GameCode } from '@/enums/games';

import { GamePayload, GameObject } from '@/interfaces/games';
import { StatsObject } from '@/interfaces/stat';

interface ApiState {
  dataGame: GameObject | null;
  dataStats: StatsObject | null;
  isFetched: boolean;
  isLoading: boolean;
}

type ApiPostPayload = GamePayload | { code: GameCode };

const initialState = {
  dataGame: null,
  dataUser: null,
  dataStats: null,
  isFetched: false,
  isLoading: false,
};

/**
 * @todo: FILE TO BE DELETED
 */
export const useApi = () => {
  const [data, setData] = useState<ApiState>(initialState);

  const fetchPostData = useCallback(
    async (
      url: ApiUrl,
      type: ApiDataType,
      payload: ApiPostPayload,
      noLoad?: boolean
    ) => {
      setData(prev => ({
        ...prev,
        isFetched: false,
        isLoading: !noLoad,
      }));

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

        const response = await res.json();

        switch (type) {
          case ApiDataType.Games:
            if (response.data) {
              setData(prev => ({
                ...prev,
                dataGame: {
                  ...data.dataGame,
                  [payload.code]: response.data.key,
                },
                error: response.data.error ?? null,
                isFetched: true,
                isLoading: false,
              }));
            } else {
              setData(prev => ({
                ...prev,
                isFetched: true,
                isLoading: false,
              }));
            }
            break;
          case ApiDataType.Stats:
            if (response.data) {
              setData(prev => ({
                ...prev,
                dataStats: {
                  ...data.dataStats,
                  [payload.code]: response.data,
                },
                isFetched: true,
                isLoading: false,
              }));
            } else {
              setData(prev => ({
                ...prev,
                dataStats: {
                  ...data.dataStats,
                  [payload.code]: INITIAL_STATS[payload.code as GameCode],
                },
                isFetched: true,
                isLoading: false,
              }));
            }
            break;
        }
      } catch (error) {
        console.error(error);
      }
    },
    [data.dataGame, data.dataStats]
  );

  return {
    ...data,
    fetchPostData,
  };
};
