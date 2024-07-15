import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { LoginMethod } from '@/enums/auth';

import {
  ActivityObject,
  StatsObject,
  UserObject,
  UserStateObject,
} from '@/types/db';

const mongodbURI = process.env.MONGODB_URI;
const mongodbName = process.env.MONGODB_NAME;

const actsCollectionName = process.env.MONGODB_COLLECTION_ACTS;
const statsCollectionName = process.env.MONGODB_COLLECTION_STATS;
const usersCollectionName = process.env.MONGODB_COLLECTION_USERS;

if (
  !mongodbURI ||
  !mongodbName ||
  !actsCollectionName ||
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

const getData = async (method: LoginMethod, id: string) => {
  await client.connect();

  const botDB = await client.db(mongodbName);

  const actsCollection = botDB.collection<ActivityObject>(actsCollectionName);
  const statsCollection = botDB.collection<StatsObject>(statsCollectionName);
  const usersCollection = botDB.collection<UserObject>(usersCollectionName);

  const user = await usersCollection.findOne({ [`${method}_id`]: id });

  let acts = null;
  let stats = null;

  if (user?.discord_id) {
    acts = await actsCollection.findOne({ discord_id: user.discord_id });
    stats = await statsCollection.findOne({ discord_id: user.discord_id });
  }

  await client.close();
  return {
    activities: acts ? { stars: acts.str.stars } : null,
    stats,
    user: user
      ? {
          cash: user.cash,
          discord_name: user.discord_name,
          discord_username: user.discord_username,
          twitch_username: user.twitch_username,
          code: user.twitch_id && !user.discord_id ? user.user_id : undefined,
        }
      : null,
  };
};

const saveUser = async (
  method: LoginMethod,
  id: string,
  payload: UserStateObject
) => {
  await client.connect();

  const collection = await client
    .db(mongodbName)
    .collection(usersCollectionName);

  const data = await collection.updateOne(
    { [`${method}_id`]: id },
    { $set: { ...payload } }
  );

  await client.close();
  return data;
};

export const GET = async (request: NextRequest) => {
  const res = new NextResponse();
  const session = await getSession(request, res);

  if (!session) return NextResponse.json({ data: null, error: null }, res);

  const userSub = session.user.sub.split('|');
  const method = userSub[1];
  const id = userSub[2];

  let responseData = null;
  let responseError = null;

  try {
    responseData = await getData(method, id);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({ data: responseData, error: responseError }, res);
  }
};

export const POST = withApiAuthRequired(async (request: NextRequest) => {
  const res = new NextResponse();
  const session = await getSession(request, res);

  if (!session) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, res);
  }

  const userSub = session.user.sub.split('|');
  const method = userSub[1];
  const id = userSub[2];

  let responseData = null;
  let responseError = null;

  const payload = await request.json();

  try {
    responseData = await saveUser(method, id, payload);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({ data: responseData, error: responseError }, res);
  }
});
