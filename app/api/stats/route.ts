import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

import { RequestType } from '../../lib/enums/db';

import {
  StatsObject,
  StatsReadPayload,
  StatsUpdatePayload,
} from '../../lib/types/db';

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

const getStats = async (req: StatsReadPayload) => {
  await client.connect();

  const idField = req.method + '_id';

  const collection = await client
    .db(mongodbName)
    .collection<StatsObject>(mongodbCollection);

  const data = await collection.findOne({ [idField]: req.id });

  await client.close();
  return data;
};

const saveStats = async (req: StatsUpdatePayload) => {
  await client.connect();

  const idField = req.discord_id ? 'discord_id' : 'twitch_id';
  const idValue = req.discord_id || req.twitch_id;

  if (!idField) return null;

  const collection = await client.db(mongodbName).collection(mongodbCollection);

  const data = await collection.updateOne(
    { [idField]: idValue },
    {
      $set: {
        ...req,
      },
    },
    { upsert: true }
  );

  await client.close();
  return data;
};

export async function POST(request: NextRequest) {
  let responseData = null;
  let responseError = null;

  const { type, payload } = await request.json();

  try {
    switch (type) {
      case RequestType.Read:
        responseData = await getStats(payload);
        break;
      case RequestType.Update:
        responseData = await saveStats(payload);
        break;
    }
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({ data: responseData, error: responseError });
  }
}
