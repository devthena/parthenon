import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { LoginMethod } from '../../lib/enums/auth';
import { StatsObject } from '../../lib/types/db';

const mongodbCollection = process.env.MONGODB_COLLECTION_STATS ?? '';
const mongodbName = process.env.MONGODB_NAME;
const mongodbURI = process.env.MONGODB_URI ?? '';

const client = new MongoClient(mongodbURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const getStats = async (id: string, method: LoginMethod) => {
  await client.connect();

  const idField = method + '_id';

  const collection = await client
    .db(mongodbName)
    .collection<StatsObject>(mongodbCollection);
  const data = await collection.findOne({ [idField]: id });

  await client.close();
  return data;
};

export async function POST(request: NextRequest) {
  let responseData = null;
  let responseError = null;

  const { id, method } = await request.json();

  try {
    responseData = await getStats(id, method);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({ data: responseData, error: responseError });
  }
}
