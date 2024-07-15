import { useCallback, useState } from 'react';
import { ApiUrl } from '@/enums/api';
import { StatsObject, UserStateObject } from '@/types/db';

interface ApiState {
  data: { [key: string]: any } | null;
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

  const fetchData = useCallback(async (url: string) => {
    setApiData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await fetch(url);
      const response = await res.json();

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      setApiData({
        data: response.data,
        error: null,
        isLoading: false,
        isProcessed: true,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const saveData = useCallback(
    async (url: ApiUrl, payload: StatsObject | UserStateObject) => {
      setApiData(prev => ({ ...prev, dataLoading: true, dataError: null }));

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const response = await res.json();

        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

        setApiData({
          data: response.data,
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
    saveData,
  };
};
