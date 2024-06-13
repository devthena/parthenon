import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { ApiUrl } from '../lib/enums/api';
import { GameCode } from '../lib/enums/games';
import { WordleObject } from '../lib/types/api';

import { useApi } from './useApi';

export const useStats = () => {
  const { apiError, stats, fetchData, updateData } = useApi();
  const { user } = useUser();

  const [wordleStats, setWordleStats] = useState<WordleObject>({
    currentStreak: 0,
    distribution: new Array(6).fill(0),
    maxStreak: 0,
    totalPlayed: 0,
    totalWon: 0,
  });

  useEffect(() => {
    if (stats) setWordleStats(stats.wordle);
  }, [stats]);

  const userSub = user?.sub?.split('|');
  const userId = userSub ? userSub[2] : null;

  const getWordleStats = async () => {
    if (userId) {
      await fetchData(ApiUrl.Stats, {
        id: userId,
        code: GameCode.Wordle,
      });
    }
  };

  const saveStats = async (stats: WordleObject) => {
    if (userId) {
      await updateData(ApiUrl.Stats, {
        user_id: userId,
        wordle: stats,
      });
    }
  };

  const updateWordleStats = (finalTurn: number) => {
    /**
     * @todo: fix the function below being called twice
     *        without adding the isSaving condition
     */

    let isSaving = true;

    setWordleStats(prev => {
      const updatedUserStats = { ...prev };

      if (isSaving) {
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

        saveStats(updatedUserStats);
        isSaving = false;
      }

      return updatedUserStats;
    });
  };

  return {
    apiError,
    getWordleStats,
    setWordleStats,
    updateWordleStats,
    wordleStats,
  };
};
