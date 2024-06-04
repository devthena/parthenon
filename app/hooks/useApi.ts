import { useState } from 'react';
import { LoginMethod } from '../lib/enums/auth';
import { StatsObject, UserObject } from '../lib/types/db';
import { ApiUrls } from '../lib/constants/db';

export const useApi = () => {
  const [profile, setProfile] = useState<UserObject | null>(null);
  const [stats, setStats] = useState<StatsObject | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchData = async (url: string, id: string, method: LoginMethod) => {
    setIsFetching(true);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, method }),
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

  return { apiError, isFetching, profile, stats, fetchData };
};
