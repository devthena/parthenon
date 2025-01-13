import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { GameCode } from '@/enums/games';

import { GameDocument, GamePayload } from '@/interfaces/games';
import { StatsDocument } from '@/interfaces/statistics';
import { UserAuthMethod, UserDocument } from '@/interfaces/user';

import { dbClientPromise } from '@/lib/db';
import { decrypt } from '@/lib/utils/encryption';

import { updateWordle } from './updateWordle';

const mongodbName = process.env.MONGODB_NAME;

const gamesCollectionName = process.env.MONGODB_COLLECTION_GAMES;
const statsCollectionName = process.env.MONGODB_COLLECTION_STATS;
const usersCollectionName = process.env.MONGODB_COLLECTION_USERS;

if (
  !mongodbName ||
  !gamesCollectionName ||
  !statsCollectionName ||
  !usersCollectionName
) {
  throw new Error('Missing necessary environment variables');
}

const updateGame = async (
  method: UserAuthMethod,
  id: string,
  payload: GamePayload
) => {
  const client = await dbClientPromise;
  const botDB = await client.db(mongodbName);

  const gamesCollection = botDB.collection<GameDocument>(gamesCollectionName);
  const statsCollection = botDB.collection<StatsDocument>(statsCollectionName);
  const usersCollection = botDB.collection<UserDocument>(usersCollectionName);

  let discordId = null;

  let user = await usersCollection.findOne({ [`${method}_id`]: id });
  if (!user) return null;

  if (method !== 'discord') {
    if (user.discord_id) discordId = user.discord_id;
  } else {
    discordId = id;
  }

  if (!discordId) return null;

  let data = null;

  const deleteGame = async (key: string) => {
    await gamesCollection.deleteOne({
      discord_id: discordId,
      key: key,
    });
  };

  const createGame = async () => {
    if (!payload.data.sessionKey) return {};

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

      await usersCollection.updateOne(
        { discord_id: discordId },
        { $set: { cash: user.cash - bet } }
      );

      gameData = {
        bet: bet,
      };
    }

    await gamesCollection.insertOne({
      discord_id: discordId,
      key: newKey,
      code: payload.code,
      data: { ...gameData },
    });

    return {
      key: newKey,
    };
  };

  const game = await gamesCollection.findOne({
    discord_id: discordId,
    code: payload.code,
  });

  if (game) {
    if (!payload.key) {
      await deleteGame(game.key);
      data = await createGame();

      return data;
    }

    // make sure that the game key and payload key matches
    if (game.key !== payload.key) return null;

    // handle submission for Wordle game
    if (payload.code === GameCode.Wordle) {
      updateWordle(
        discordId,
        payload.data.sessionCode,
        game,
        gamesCollection,
        statsCollection,
        usersCollection,
        deleteGame
      );
    }

    // handle submission for Blackjack game
    else if (payload.code === GameCode.Blackjack) {
    }
  } else {
    data = await createGame();
  }

  return data;
};

export const POST = withApiAuthRequired(async (request: NextRequest) => {
  const res = new NextResponse();
  const session = await getSession(request, res);

  if (!session) {
    return NextResponse.json({ data: null, error: 'Unauthorized' });
  }

  const userSub = session.user.sub.split('|');
  const method = userSub[1];
  const id = userSub[2];

  let responseData = null;
  let responseError = null;

  const payload = await request.json();

  try {
    responseData = await updateGame(method, id, payload);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({
      data: responseData,
      error: responseError,
    });
  }
});
