import { useCallback } from 'react';

export const useFetch = () => {
  /**
   * fetchDelete
   */
  const fetchDelete = useCallback(async <T>(url: string): Promise<T | null> => {
    try {
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) throw new Error('Parthenon: DELETE Request Failed');

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  /**
   * fetchGet
   */
  const fetchGet = useCallback(async <T>(url: string): Promise<T | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Parthenon: GET Request Failed');

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  /**
   * fetchPatch
   */
  const fetchPatch = useCallback(
    async <T>(url: string, payload: T): Promise<T | null> => {
      try {
        const response = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Parthenon: PATCH Request Failed');

        const data = await response.json();
        return data as T;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    []
  );

  /**
   * fetchPost
   */
  const fetchPost = useCallback(
    async <T>(url: string, payload: Partial<T>): Promise<T | null> => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Parthenon: POST Request Failed');

        const data = await response.json();
        return data as T;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    []
  );

  return { fetchDelete, fetchGet, fetchPatch, fetchPost };
};
