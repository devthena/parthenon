import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { DataObject, StarObject, UserObject } from '../../../../lib/types/db';

const starCollection = process.env.MONGODB_COLLECTION_STARS ?? '';
const userCollection = process.env.MONGODB_COLLECTION_USERS ?? '';
const mongodbName = process.env.MONGODB_NAME;
const mongodbURI = process.env.MONGODB_URI ?? '';

const client = new MongoClient(mongodbURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const getStars = async (id: string) => {
  await client.connect();

  const collection = await client
    .db(mongodbName)
    .collection<StarObject>(starCollection);
  const data = await collection.findOne({ discord_id: id });

  await client.close();
  return data;
};

const getUser = async (id: string) => {
  await client.connect();

  const collection = await client
    .db(mongodbName)
    .collection<UserObject>(userCollection);
  const data = await collection.findOne({ discord_id: id });

  await client.close();
  return data;
};

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  let responseData: DataObject = {
    user: null,
    stars: null,
  };
  let responseError = null;

  try {
    responseData.user = await getUser(params.id);
    responseData.stars = await getStars(params.id);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({ data: responseData, error: responseError });
  }
}
