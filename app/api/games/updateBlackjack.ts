import { Collection } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

import { INITIAL_STATS } from '@/constants/stats';

import { GameDocument } from '@/interfaces/games';
import { StatsDocument } from '@/interfaces/statistics';
import { UserDocument } from '@/interfaces/user';

import { BlackjackStatus, GameCode } from '@/enums/games';
import { decrypt } from '@/lib/utils/encryption';

export const updateBlackjack = async (
  discordId: string,
  sessionCode: string,
  game: GameDocument,
  statsCollection: Collection<StatsDocument>,
  usersCollection: Collection<UserDocument>,
  deleteGame: (key: string) => void
) => {
  let stats = INITIAL_STATS[GameCode.Blackjack];

  const statusString = decrypt(sessionCode);
  const status = statusString.split('-')[0];
  const isDouble = statusString.split('-')[1] === 'double';

  const statsDoc = await statsCollection.findOne({
    discord_id: discordId,
  });

  if (statsDoc && statsDoc[GameCode.Blackjack]) {
    stats = statsDoc[GameCode.Blackjack];
  }

  const bet = parseInt(game.data.bet as string, 10);

  if (status === BlackjackStatus.Blackjack) {
    const reward = isDouble ? bet + bet * 2 : bet + Math.round(bet * 1.5);

    await usersCollection.updateOne(
      { discord_id: discordId },
      { $inc: { cash: reward } }
    );

    await statsCollection.updateOne(
      { discord_id: discordId },
      {
        $set: {
          [GameCode.Blackjack]: {
            totalBlackjack: stats.totalBlackjack + 1,
            totalPlayed: stats.totalPlayed + 1,
            totalWon: stats.totalWon + 1,
          },
        },
      },
      { upsert: true }
    );

    await deleteGame(game.key);
  } else if (
    status === BlackjackStatus.Win ||
    status === BlackjackStatus.DealerBust
  ) {
    const reward = isDouble ? bet + bet * 2 : bet * 2;

    await usersCollection.updateOne(
      { discord_id: discordId },
      { $inc: { cash: reward } }
    );

    await statsCollection.updateOne(
      { discord_id: discordId },
      {
        $set: {
          [GameCode.Blackjack]: {
            ...stats,
            totalPlayed: stats.totalPlayed + 1,
            totalWon: stats.totalWon + 1,
          },
        },
      },
      { upsert: true }
    );

    await deleteGame(game.key);
  } else if (status === BlackjackStatus.Push) {
    await usersCollection.updateOne(
      { discord_id: discordId },
      { $inc: { cash: bet } }
    );

    await statsCollection.updateOne(
      { discord_id: discordId },
      {
        $set: {
          [GameCode.Blackjack]: {
            ...stats,
            totalPlayed: stats.totalPlayed + 1,
          },
        },
      },
      { upsert: true }
    );

    await deleteGame(game.key);
  } else {
    if (isDouble) {
      await usersCollection.updateOne(
        { discord_id: discordId },
        { $inc: { cash: -bet } }
      );
    }

    await statsCollection.updateOne(
      { discord_id: discordId },
      {
        $set: {
          [GameCode.Blackjack]: {
            ...stats,
            totalPlayed: stats.totalPlayed + 1,
          },
        },
      },
      { upsert: true }
    );

    await deleteGame(game.key);
  }

  return { key: uuidv4() };
};
