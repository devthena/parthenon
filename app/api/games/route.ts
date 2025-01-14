import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

import { GameCode, GameRequestType } from '@/enums/games';

import { GameDocument, GamePayload } from '@/interfaces/games';
import { StatsDocument } from '@/interfaces/statistics';
import { UserAuthMethod, UserDocument } from '@/interfaces/user';

import { dbClientPromise } from '@/lib/db';

import { handleCreateGame } from './handleCreate';
import { updateBlackjack } from './updateBlackjack';
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

const getCollections = async () => {
  const client = await dbClientPromise;
  const botDB = await client.db(mongodbName);

  const gamesCollection = botDB.collection<GameDocument>(gamesCollectionName);
  const statsCollection = botDB.collection<StatsDocument>(statsCollectionName);
  const usersCollection = botDB.collection<UserDocument>(usersCollectionName);

  return {
    games: gamesCollection,
    stats: statsCollection,
    users: usersCollection,
  };
};

const handleUpdateGame = async (
  method: UserAuthMethod,
  id: string,
  payload: GamePayload
) => {
  const client = await dbClientPromise;
  const botDB = await client.db(mongodbName);

  const gamesCollection = botDB.collection<GameDocument>(gamesCollectionName);
  const statsCollection = botDB.collection<StatsDocument>(statsCollectionName);
  const usersCollection = botDB.collection<UserDocument>(usersCollectionName);

  let data = null;
  let discordId = null;

  let user = await usersCollection.findOne({ [`${method}_id`]: id });
  if (!user) return null;

  if (method !== 'discord') {
    if (user.discord_id) discordId = user.discord_id;
  } else {
    discordId = id;
  }

  if (!discordId) return null;

  const game = await gamesCollection.findOne({
    discord_id: discordId,
    code: payload.code,
  });

  if (!game) return null;

  // make sure that the game key and payload key matches
  if (game.key !== payload.key) return null;

  const deleteGame = async (key: string) => {
    await gamesCollection.deleteOne({
      discord_id: discordId,
      key: key,
    });
  };

  // handle submission for Wordle game
  if (payload.code === GameCode.Wordle) {
    data = updateWordle(
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
    data = updateBlackjack(
      discordId,
      payload.data.sessionCode,
      game,
      statsCollection,
      usersCollection,
      deleteGame
    );
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
    const collections = await getCollections();

    if (payload.type === GameRequestType.Create) {
      responseData = await handleCreateGame(method, id, payload, collections);
    } else if (payload.type === GameRequestType.Update) {
      responseData = await handleUpdateGame(method, id, payload);
    }
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({
      data: responseData,
      error: responseError,
    });
  }
});
