import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { ApiUrls } from '../lib/constants/db';
import { LoginMethod } from '../lib/enums/auth';
import { StatsWordleObject } from '../lib/types/db';

import { useApi } from './useApi';
import { RequestType } from '../lib/enums/db';

export const useStats = () => {
  const { apiError, stats, fetchData, updateData } = useApi();
  const { user } = useUser();

  const userSub = user?.sub?.split('|');
  const userId = userSub ? userSub[2] : null;
  const loginMethod = userSub ? (userSub[1] as LoginMethod) : null;

  const [wordleStats, setWordleStats] = useState<StatsWordleObject>({
    currentStreak: 0,
    distribution: new Array(6).fill(0),
    maxStreak: 0,
    totalPlayed: 0,
    totalWon: 0,
  });

  const getWordleStats = async () => {
    if (userId && loginMethod) {
      await fetchData(ApiUrls.stats, {
        type: RequestType.Read,
        payload: {
          id: userId,
          method: loginMethod,
        },
      });
    }
  };

  const saveStats = async (stats: StatsWordleObject) => {
    await updateData(ApiUrls.stats, {
      type: RequestType.Update,
      payload: {
        [`${loginMethod}_id`]: userId,
        wordle: stats,
      },
    });
  };

  const updateWordleStats = (finalTurn: number) => {
    /**
     * @todo: fix the function below being called twice
     *        without adding the isSaving condition
     */

    let isSaving = true;

    setWordleStats(prev => {
      const updatedUserStats = { ...prev };
      updatedUserStats.totalPlayed += 1;

      if (finalTurn > 6) {
        updatedUserStats.currentStreak = 0;
      } else {
        updatedUserStats.currentStreak += 1;
        updatedUserStats.distribution[finalTurn - 1] += 1;
        updatedUserStats.totalWon += 1;

        if (updatedUserStats.currentStreak > updatedUserStats.maxStreak) {
          updatedUserStats.maxStreak += 1;
        }
      }

      if (isSaving) {
        saveStats(updatedUserStats);
        isSaving = false;
      }
      return updatedUserStats;
    });
  };

  useEffect(() => {
    if (stats) setWordleStats(stats.wordle);
  }, [stats]);

  return {
    apiError,
    getWordleStats,
    setWordleStats,
    updateWordleStats,
    wordleStats,
  };
};
