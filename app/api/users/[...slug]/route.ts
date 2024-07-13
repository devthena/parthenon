import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { LoginMethod } from '@/enums/auth';
import { StarObject, StatsObject, UserObject } from '@/types/db';

const mongodbURI = process.env.MONGODB_URI;
const mongodbName = process.env.MONGODB_NAME;

const starsCollectionName = process.env.MONGODB_COLLECTION_STARS;
const statsCollectionName = process.env.MONGODB_COLLECTION_STATS;
const usersCollectionName = process.env.MONGODB_COLLECTION_USERS;

if (
  !mongodbURI ||
  !mongodbName ||
  !starsCollectionName ||
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

  const starsCollection = botDB.collection<StarObject>(starsCollectionName);
  const statsCollection = botDB.collection<StatsObject>(statsCollectionName);
  const usersCollection = botDB.collection<UserObject>(usersCollectionName);

  const user = await usersCollection.findOne({ [`${method}_id`]: id });

  let stars = null;
  let stats = null;

  if (user?.discord_id) {
    stars = await starsCollection.findOne({ discord_id: user.discord_id });
    stats = await statsCollection.findOne({ discord_id: user.discord_id });
  }

  await client.close();
  return { stars, stats, user };
};

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: { slug: string[] };
  }
) {
  let responseData = null;
  let responseError = null;

  try {
    responseData = await getData(params.slug[0] as LoginMethod, params.slug[1]);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({ data: responseData, error: responseError });
  }
}
