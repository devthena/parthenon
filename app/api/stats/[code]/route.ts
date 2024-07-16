import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { LoginMethod } from '@/enums/auth';
import { StatsObject, UserObject } from '@/types/db';
import { GameCode } from '@/enums/games';

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

const getStats = async (method: LoginMethod, id: string, code: string) => {
  await client.connect();

  const botDB = await client.db(mongodbName);

  const statsCollection = botDB.collection<StatsObject>(statsCollectionName);
  const usersCollection = botDB.collection<UserObject>(usersCollectionName);

  const user = await usersCollection.findOne({ [`${method}_id`]: id });

  let stats = null;

  if (user?.discord_id) {
    stats = await statsCollection.findOne({ discord_id: user.discord_id });
  }

  await client.close();

  if (!stats) return null;

  return stats[code as GameCode] ?? null;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: { code: string } }
) => {
  const res = new NextResponse();
  const session = await getSession(request, res);

  if (!session) return NextResponse.json({ data: null, error: null }, res);

  const userSub = session.user.sub.split('|');
  const method = userSub[1];
  const id = userSub[2];

  let responseData = null;
  let responseError = null;

  try {
    responseData = await getStats(method, id, params.code);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({ data: responseData, error: responseError }, res);
  }
};
