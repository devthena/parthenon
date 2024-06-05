import { useState } from 'react';
import { useApi } from './useApi';
import { StatsWordleObject } from '../lib/types/db';

export const useStats = () => {
  // const { data, fetchApi, postApi } = useApi();

  const [wordleStats, setWordleStats] = useState<StatsWordleObject>({
    currentStreak: 0,
    distribution: new Array(6).fill(0),
    maxStreak: 0,
    totalPlayed: 0,
    totalWon: 0,
  });

  const saveStats = async (stats: StatsWordleObject) => {
    console.log('saveStats', stats);
    // await postApi(apiUrls.stats, {
    //   type: authType,
    //   [`${authType}_id`]: userId,
    //   wordle: stats,
    // });
  };

  const updateWordleStats = (finalTurn: number) => {
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

      saveStats(updatedUserStats);
      return updatedUserStats;
    });
  };

  return {
    setWordleStats,
    updateWordleStats,
    wordleStats,
  };
};
