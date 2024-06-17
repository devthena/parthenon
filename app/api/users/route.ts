import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { UserObject } from '../../lib/types/db';

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

const saveUser = async (payload: UserObject) => {
  await client.connect();

  const collection = await client.db(mongodbName).collection(mongodbCollection);

  const data = await collection.updateOne(
    { user_id: payload.user_id },
    { $set: { ...payload } },
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
    responseData = await saveUser(payload);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({ data: responseData, error: responseError });
  }
}
