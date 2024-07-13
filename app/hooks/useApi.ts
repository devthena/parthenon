import { useCallback, useState } from 'react';
import { ApiUrl } from '@/enums/api';
import { StatsObject, UserObject } from '@/types/db';

interface ApiState {
  data: { [key: string]: any } | null;
  dataLoading: boolean;
  dataError: string | null;
  dataProcessed: boolean;
}

const initialState = {
  data: null,
  dataError: null,
  dataLoading: false,
  dataProcessed: false,
};

export const useApi = () => {
  const [apiData, setApiData] = useState<ApiState>(initialState);

  const fetchData = useCallback(async (url: string) => {
    setApiData(prev => ({ ...prev, dataLoading: true, dataError: null }));

    try {
      const res = await fetch(url);
      const response = await res.json();

      if (!res.ok) throw new Error('Hook Error: useApi (fetchData)');

      setApiData({
        data: response.data,
        dataError: null,
        dataLoading: false,
        dataProcessed: true,
      });
    } catch (error) {
      throw new Error('Hook Error: useApi (fetchData)');
    }
  }, []);

  const saveData = useCallback(
    async (url: ApiUrl, payload: StatsObject | UserObject) => {
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

        if (!res.ok) throw new Error('Hook Error: useApi (saveData)');

        setApiData({
          data: response.data,
          dataError: null,
          dataLoading: false,
          dataProcessed: true,
        });
      } catch (error) {
        throw new Error('Hook Error: useApi (saveData)');
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
