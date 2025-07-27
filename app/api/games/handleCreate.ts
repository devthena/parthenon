import { v4 as uuidv4 } from 'uuid';

import { GameCode } from '@/enums/games';
import { decrypt } from '@/lib/utils/encryption';

import { DatabaseCollections } from '@/interfaces/db';
import { GamePayload } from '@/interfaces/games';
import { UserAuthMethod } from '@/interfaces/user-old';

export const handleCreateGame = async (
  method: UserAuthMethod,
  id: string,
  payload: GamePayload,
  collections: DatabaseCollections
) => {
  let discordId = null;

  let user = await collections.users.findOne({ [`${method}_id`]: id });
  if (!user) return null;

  if (method !== 'discord') {
    if (user.discord_id) discordId = user.discord_id;
  } else {
    discordId = id;
  }

  if (!discordId) return null;
  if (!payload.data.sessionKey) return null;

  let gameData = {};
  const newKey = uuidv4();

  // save the initial game data for Wordle
  if (payload.code === GameCode.Wordle) {
    gameData = {
      answer: decrypt(payload.data.sessionKey),
      guesses: [],
    };
  }

  // update the user cash for playing Blackjack
  else if (payload.code === GameCode.Blackjack) {
    const betString = decrypt(payload.data.sessionKey);
    const bet = parseInt(betString, 10);

    await collections.users.updateOne(
      { discord_id: discordId },
      { $inc: { cash: -bet } }
    );

    gameData = {
      bet: bet,
    };
  }

  await collections.games.updateOne(
    { discord_id: discordId, code: payload.code },
    {
      $set: {
        key: newKey,
        data: { ...gameData },
      },
    },
    { upsert: true }
  );

  return {
    key: newKey,
  };
};
