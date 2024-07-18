import { useCallback, useState } from 'react';

import { INITIAL_STATS } from '@/constants/stats';

import { ApiDataType, ApiUrl } from '@/enums/api';
import { GameCode } from '@/enums/games';

import { GamePayload, GameStateObject } from '@/types/games';
import { DataObject, StatsStateObject } from '@/types/db';

interface ApiState {
  dataGame: GameStateObject | null;
  dataUser: DataObject | null;
  dataStats: StatsStateObject | null;
  error: string | null;
  isFetched: boolean;
  isLoading: boolean;
}

type ApiPostPayload = GamePayload | { code: GameCode };

const initialState = {
  dataGame: null,
  dataUser: null,
  dataStats: null,
  error: null,
  isFetched: false,
  isLoading: false,
};

export const useApi = () => {
  const [data, setData] = useState<ApiState>(initialState);

  const fetchGetData = useCallback(async (url: ApiUrl) => {
    setData(prev => ({
      ...prev,
      isFetched: false,
      isLoading: true,
    }));

    try {
      const res = await fetch(url);

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const response = await res.json();

      setData(prev => ({
        ...prev,
        dataUser: response.data,
        isFetched: true,
        isLoading: false,
      }));
    } catch (error) {
      console.error(error);
    }
  }, []);

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
                dataGame: { [payload.code]: response.data.key },
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
                  [payload.code]: response.data,
                },
                isFetched: true,
                isLoading: false,
              }));
            } else {
              setData(prev => ({
                ...prev,
                dataStats: {
                  [payload.code]: INITIAL_STATS[payload.code],
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
    []
  );

  return {
    ...data,
    fetchGetData,
    fetchPostData,
  };
};
