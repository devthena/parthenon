import { User } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { UserAuthMethod } from '@/interfaces/user';
import { DatabaseCollections } from '@/interfaces/db';

import { initDatabase } from '@/lib/db';
import { withApiAuth } from '@/lib/utils';

const getUser = async (
  method: UserAuthMethod,
  id: string,
  collections: DatabaseCollections
) => {
  const user = await collections.users.findOne({ [`${method}_id`]: id });

  return user
    ? {
        discord_name: user.discord_name,
        discord_username: user.discord_username,
        twitch_username: user.twitch_username,
        cash: user.cash,
        bank: user.bank,
        stars: user.stars,
        code: user.twitch_id && !user.discord_id ? user.user_id : undefined,
      }
    : null;
};

export const GET = withApiAuth(async (_request: NextRequest, user: User) => {
  const method = user.externalAccounts[0].provider.replace(
    'oauth_',
    ''
  ) as UserAuthMethod;

  const id = user.externalAccounts[0].externalId;

  let responseData = null;
  let responseError = null;

  try {
    const collections = await initDatabase();
    if (!collections) responseError = 'No database collections found.';
    else responseData = await getUser(method, id, collections);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({ data: responseData, error: responseError });
  }
});
