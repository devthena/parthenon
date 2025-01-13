import { Collection } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

import { INITIAL_STATS } from '@/constants/stats';
import { MAX_ATTEMPTS, WORDLE_REWARDS } from '@/constants/wordle';

import { GameDocument } from '@/interfaces/games';
import { StatsDocument } from '@/interfaces/statistics';
import { UserDocument } from '@/interfaces/user';

import { GameCode } from '@/enums/games';
import { decrypt } from '@/lib/utils/encryption';

export const updateWordle = async (
  discordId: string,
  sessionCode: string,
  game: GameDocument,
  gamesCollection: Collection<GameDocument>,
  statsCollection: Collection<StatsDocument>,
  usersCollection: Collection<UserDocument>,
  deleteGame: (key: string) => void
) => {
  let data = null;

  const guess = decrypt(sessionCode);

  const newGuesses: string[] = [...(game.data.guesses as string[]), guess];

  const isWin = guess === game.data.answer;
  const isAttempt = newGuesses.length < MAX_ATTEMPTS;

  if (isWin) {
    let stats = INITIAL_STATS[GameCode.Wordle];

    const statsDoc = await statsCollection.findOne({
      discord_id: discordId,
    });

    if (statsDoc && statsDoc[GameCode.Wordle]) {
      stats = statsDoc[GameCode.Wordle];
    }

    await usersCollection.updateOne(
      { discord_id: discordId },
      { $inc: { cash: WORDLE_REWARDS[newGuesses.length - 1] } }
    );

    // update the user game stats
    const newDistribution = [...stats.distribution];
    newDistribution[newGuesses.length - 1] += 1;

    await statsCollection.updateOne(
      { discord_id: discordId },
      {
        $set: {
          [GameCode.Wordle]: {
            currentStreak: stats.currentStreak + 1,
            distribution: newDistribution,
            maxStreak: Math.max(stats.maxStreak, stats.currentStreak + 1),
            totalPlayed: stats.totalPlayed + 1,
            totalWon: stats.totalWon + 1,
          },
        },
      },
      { upsert: true }
    );

    data = {
      key: uuidv4(),
    };

    await deleteGame(game.key);
  } else if (isAttempt) {
    data = { key: uuidv4() };
    await gamesCollection.updateOne(
      { discord_id: discordId, key: game.key },
      {
        $set: {
          key: data.key,
          data: {
            ...game.data,
            guesses: newGuesses,
          },
        },
      }
    );
  } else {
    // add to total times played for a loss
    let stats = INITIAL_STATS[GameCode.Wordle];

    const statsDoc = await statsCollection.findOne({
      discord_id: discordId,
    });

    if (statsDoc && statsDoc[GameCode.Wordle]) {
      stats = statsDoc[GameCode.Wordle];
    }

    await statsCollection.updateOne(
      { discord_id: discordId },
      {
        $set: {
          [GameCode.Wordle]: {
            ...stats,
            currentStreak: 0,
            totalPlayed: stats.totalPlayed + 1,
          },
        },
      }
    );

    data = { key: uuidv4() };
    await deleteGame(game.key);
  }

  return data;
};