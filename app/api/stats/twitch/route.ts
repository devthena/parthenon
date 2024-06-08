import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { StatsPayload } from '../../../lib/types/api';

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

const saveStats = async (req: StatsPayload) => {
  await client.connect();

  const collection = await client.db(mongodbName).collection(mongodbCollection);

  const data = await collection.updateOne(
    { twitch_id: req.twitch_id },
    { $set: { ...req } },
    { upsert: true }
  );

  await client.close();
  return data;
};

export async function POST(request: NextRequest) {
  let responseData = null;
  let responseError = null;

  const payload = await request.json();

  try {
    responseData = await saveStats(payload);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({ data: responseData, error: responseError });
  }
}
