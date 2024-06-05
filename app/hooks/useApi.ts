import { useState } from 'react';
import { StatsObject, StatsRequest, UserObject } from '../lib/types/db';
import { ApiUrls } from '../lib/constants/db';

export const useApi = () => {
  const [profile, setProfile] = useState<UserObject | null>(null);
  const [stats, setStats] = useState<StatsObject | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<boolean>(false);

  const fetchData = async (url: string, request: StatsRequest) => {
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
        setApiError('useApi fetchUser Error:' + response.error);
      } else if (response.data) {
        if (url === ApiUrls.users) setProfile(response.data);
        else if (url === ApiUrls.stats) setStats(response.data);
      }

      setIsFetching(false);
    } catch (fetchError) {
      setApiError(JSON.stringify(fetchError));
      setIsFetching(false);
    }
  };

  const updateData = async (url: string, request: StatsRequest) => {
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
