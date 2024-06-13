import { useState } from 'react';
import { StatsObject, UserObject } from '../lib/types/api';
import { ApiUrl } from '../lib/enums/api';
import { LoginMethod } from '../lib/enums/auth';
import { GameCode } from '../lib/enums/games';

export const useApi = () => {
  const [profile, setProfile] = useState<UserObject | null>(null);
  const [stats, setStats] = useState<StatsObject | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<boolean>(false);

  const fetchData = async (
    url: ApiUrl,
    payload: {
      id: string;
      method?: LoginMethod;
      code?: GameCode;
    }
  ) => {
    setIsFetching(true);

    const apiUrl = payload.method
      ? `${url}/${payload.method}/${payload.id}`
      : `${url}/${payload.code}/${payload.id}`;

    try {
      const res = await fetch(apiUrl);
      const response = await res.json();

      if (response.error) {
        setApiError('useApi fetchUser Error:' + response.error);
      } else if (response.data) {
        if (url === ApiUrl.Users) setProfile(response.data);
        else if (url === ApiUrl.Stats) setStats(response.data);
      }

      setIsFetching(false);
    } catch (fetchError) {
      setApiError(JSON.stringify(fetchError));
      setIsFetching(false);
    }
  };

  const updateData = async (url: string, request: StatsObject | UserObject) => {
    setIsFetching(true);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const response = await res.json();

      if (response.error) {
        setApiError('useApi updateData Error:' + response.error);
      } else if (response.data) {
        setApiSuccess(true);
      }

      setIsFetching(false);
    } catch (fetchError) {
      setApiError(JSON.stringify(fetchError));
      setIsFetching(false);
    }
  };

  return {
    apiError,
    apiSuccess,
    isFetching,
    profile,
    stats,
    fetchData,
    updateData,
  };
};
