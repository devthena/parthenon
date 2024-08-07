import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

import { GameCode } from '@/enums/games';
import { StatsDocument } from '@/interfaces/statistics';
import { UserAuthMethod, UserDocument } from '@/interfaces/user';
import { dbClientPromise } from '@/lib/db';

const mongodbName = process.env.MONGODB_NAME;
const statsCollectionName = process.env.MONGODB_COLLECTION_STATS;
const usersCollectionName = process.env.MONGODB_COLLECTION_USERS;

if (!mongodbName || !statsCollectionName || !usersCollectionName) {
  throw new Error('Missing necessary environment variables');
}

const getStats = async (method: UserAuthMethod, id: string, code: GameCode) => {
  const client = await dbClientPromise;
  const botDB = await client.db(mongodbName);

  const statsCollection = botDB.collection<StatsDocument>(statsCollectionName);
  const usersCollection = botDB.collection<UserDocument>(usersCollectionName);

  const user = await usersCollection.findOne({ [`${method}_id`]: id });

  let stats = null;

  if (user?.discord_id) {
    stats = await statsCollection.findOne({ discord_id: user.discord_id });
  }

  if (!stats) return null;

  return stats[code] ?? null;
};

export const POST = withApiAuthRequired(async (request: NextRequest) => {
  const res = new NextResponse();
  const session = await getSession(request, res);

  if (!session) {
    return NextResponse.json({ data: null, error: 'Unauthorized' });
  }

  const userSub = session.user.sub.split('|');
  const method = userSub[1];
  const id = userSub[2];

  let responseData = null;
  let responseError = null;

  const payload = await request.json();

  try {
    responseData = await getStats(method, id, payload.code);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({
      data: responseData,
      error: responseError,
    });
  }
});
