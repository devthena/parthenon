import { useState } from 'react';
import {
  FetchPayload,
  PostPayload,
  StatsObject,
  UserObject,
} from '../lib/types/api';
import { ApiUrls } from '../lib/constants/db';

export const useApi = () => {
  const [profile, setProfile] = useState<UserObject | null>(null);
  const [stats, setStats] = useState<StatsObject | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<boolean>(false);

  const fetchData = async (url: string, payload: FetchPayload) => {
    setIsFetching(true);

    try {
      const res = await fetch(`${url}/${payload.method}/${payload.id}`);
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

  const updateData = async (url: string, request: PostPayload) => {
    setIsFetching(true);

    try {
      const res = await fetch(`${url}/${request.method}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request.payload),
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
