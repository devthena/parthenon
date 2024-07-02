import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { DataObject, UserObject } from '../../../../lib/types/db';

const mongodbCollection = process.env.MONGODB_COLLECTION_USERS ?? '';
const mongodbName = process.env.MONGODB_NAME;
const mongodbURI = process.env.MONGODB_URI ?? '';

const client = new MongoClient(mongodbURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const getUser = async (id: string) => {
  await client.connect();

  const collection = await client
    .db(mongodbName)
    .collection<UserObject>(mongodbCollection);
  const data = await collection.findOne({ twitch_id: id });

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
  };
  let responseError = null;

  try {
    responseData.user = await getUser(params.id);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({ data: responseData, error: responseError });
  }
}
