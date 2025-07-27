import { NextRequest, NextResponse } from 'next/server';
import { User } from '@clerk/nextjs/server';

import { GameCode } from '@/enums/games';
import { DatabaseCollections } from '@/interfaces/db';
import { UserAuthMethod } from '@/interfaces/user';

import { initDatabase } from '@/lib/db';
import { withApiAuth } from '@/lib/utils';

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

export const POST = withApiAuth(async (request: NextRequest, user: User) => {
  const method = user.externalAccounts[0].provider.replace(
    'oauth_',
    ''
  ) as UserAuthMethod;

  const id = user.externalAccounts[0].externalId;

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
