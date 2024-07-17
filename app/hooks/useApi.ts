import { useCallback, useState } from 'react';
import { ApiDataType, ApiUrl } from '@/enums/api';
import { ApiStateObject, StatsStatePayload } from '@/types/db';
import { GamePayload, GameStateObject } from '@/types/games';

interface ApiState {
  data: ApiStateObject | null;
  error: string | null;
  isLoading: boolean;
  isProcessed: boolean;
}

const initialState = {
  data: null,
  error: null,
  isLoading: false,
  isProcessed: false,
};

export const useApi = () => {
  const [apiData, setApiData] = useState<ApiState>(initialState);

  const fetchData = useCallback(async (url: string, type: ApiDataType) => {
    setApiData(prev => ({
      ...prev,
      isLoading: true,
      isProcessed: false,
      error: null,
    }));

    try {
      const res = await fetch(url);

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const response = await res.json();

      setApiData({
        data: {
          type,
          data: response.data,
        },
        error: null,
        isLoading: false,
        isProcessed: true,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchGameData = useCallback(
    async (
      url: ApiUrl,
      type: ApiDataType,
      payload: GamePayload,
      hasLoading?: boolean
    ) => {
      setApiData(prev => ({
        ...prev,
        isLoading: hasLoading ?? false,
        isProcessed: false,
        error: null,
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

        setApiData({
          data: {
            type,
            data: response.data
              ? {
                  [payload.code]: response.data.key,
                }
              : {},
          },
          error: null,
          isLoading: false,
          isProcessed: true,
        });
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const saveStatsData = useCallback(
    async (url: ApiUrl, payload: StatsStatePayload) => {
      setApiData(prev => ({
        ...prev,
        isLoading: false,
        isProcessed: false,
        error: null,
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

        setApiData({
          data: null,
          error: null,
          isLoading: false,
          isProcessed: true,
        });
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  return {
    ...apiData,
    fetchData,
    fetchGameData,
    saveStatsData,
  };
};
