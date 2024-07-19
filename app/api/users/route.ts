import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { LoginMethod } from '@/enums/auth';
import { ActivityObject, UserObject, UserStateObject } from '@/types/db';

const mongodbURI = process.env.MONGODB_URI;
const mongodbName = process.env.MONGODB_NAME;

const actsCollectionName = process.env.MONGODB_COLLECTION_ACTS;
const usersCollectionName = process.env.MONGODB_COLLECTION_USERS;

if (
  !mongodbURI ||
  !mongodbName ||
  !actsCollectionName ||
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
  const usersCollection = botDB.collection<UserObject>(usersCollectionName);

  const user = await usersCollection.findOne({ [`${method}_id`]: id });

  const acts = user?.discord_id
    ? await actsCollection.findOne({ discord_id: user.discord_id })
    : null;

  await client.close();
  return {
    activities: acts ? { stars: acts.str.stars } : null,
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
