import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { StatsObject } from '../../../lib/types/db';
import { GameCode } from '../../../lib/enums/games';

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

const getStats = async (code: string, id: string) => {
  await client.connect();

  const collection = await client
    .db(mongodbName)
    .collection<StatsObject>(mongodbCollection);
  const data = await collection.findOne({
    user_id: id,
    code: code as GameCode,
  });

  await client.close();
  return data;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  let responseData = null;
  let responseError = null;

  try {
    responseData = await getStats(params.slug[0], params.slug[1]);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({ data: responseData, error: responseError });
  }
}
