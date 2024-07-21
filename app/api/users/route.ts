import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { UserAuthMethod, UserDocument } from '@/interfaces/user';

const mongodbURI = process.env.MONGODB_URI;
const mongodbName = process.env.MONGODB_NAME;

const usersCollectionName = process.env.MONGODB_COLLECTION_USERS;

if (!mongodbURI || !mongodbName || !usersCollectionName) {
  throw new Error('Missing necessary environment variables');
}

const client = new MongoClient(mongodbURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const getUser = async (method: UserAuthMethod, id: string) => {
  await client.connect();

  const botDB = await client.db(mongodbName);
  const usersCollection = botDB.collection<UserDocument>(usersCollectionName);
  const user = await usersCollection.findOne({ [`${method}_id`]: id });

  await client.close();

  return user
    ? {
        discord_name: user.discord_name,
        discord_username: user.discord_username,
        twitch_username: user.twitch_username,
        cash: user.cash,
        bank: user.bank,
        stars: user.stars,
        code: user.twitch_id && !user.discord_id ? user.user_id : undefined,
      }
    : null;
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
    responseData = await getUser(method, id);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({ data: responseData, error: responseError }, res);
  }
};
