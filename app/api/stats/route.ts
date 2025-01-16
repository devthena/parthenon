import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

import { GameCode } from '@/enums/games';
import { DatabaseCollections } from '@/interfaces/db';
import { UserAuthMethod } from '@/interfaces/user';
import { initDatabase } from '@/lib/db';

const getStats = async (
  method: UserAuthMethod,
  id: string,
  code: GameCode,
  collections: DatabaseCollections
) => {
  let stats = null;

  const user = await collections.users.findOne({ [`${method}_id`]: id });

  if (user?.discord_id) {
    stats = await collections.stats.findOne({ discord_id: user.discord_id });
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
    const collections = await initDatabase();
    if (!collections) responseError = 'No database collections found.';
    else responseData = await getStats(method, id, payload.code, collections);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({
      data: responseData,
      error: responseError,
    });
  }
});
