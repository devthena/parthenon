import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { GAME_REWARDS } from '@/constants/games';
import { LoginMethod } from '@/enums/auth';
import { StatsObject, StatsStatePayload, UserObject } from '@/types/db';

const mongodbURI = process.env.MONGODB_URI;
const mongodbName = process.env.MONGODB_NAME;

const statsCollectionName = process.env.MONGODB_COLLECTION_STATS;
const usersCollectionName = process.env.MONGODB_COLLECTION_USERS;

if (
  !mongodbURI ||
  !mongodbName ||
  !statsCollectionName ||
  !usersCollectionName
) {
  throw new Error('Missing necessary environment variables');
}

const client = new MongoClient(mongodbURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const saveStats = async (
  method: LoginMethod,
  id: string,
  payload: StatsStatePayload
) => {
  await client.connect();
  const botDB = await client.db(mongodbName);
  const statsCollection = botDB.collection<StatsObject>(statsCollectionName);
  const usersCollection = botDB.collection<UserObject>(usersCollectionName);

  let discordId = null;

  if (method !== 'discord') {
    const user = await usersCollection.findOne({ [`${method}_id`]: id });

    if (user?.discord_id) discordId = user.discord_id;
  } else {
    discordId = id;
  }

  let data = null;

  if (discordId) {
    data = await statsCollection.updateOne(
      { discord_id: discordId },
      { $set: { discord_id: discordId, ...payload.data } },
      { upsert: true }
    );

    if (payload.key) {
      const rewards = GAME_REWARDS[payload.code];
      const reward = rewards.find(obj => obj.label === payload.key);

      if (reward) {
        await usersCollection.updateOne(
          { discord_id: discordId },
          { $inc: { cash: reward.value } }
        );
      }
    }
  }

  await client.close();
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
    responseData = await saveStats(method, id, payload);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({
      data: responseData,
      error: responseError,
    });
  }
});
