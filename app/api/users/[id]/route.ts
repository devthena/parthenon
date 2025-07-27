import { NextResponse } from 'next/server';
import { User } from '@clerk/nextjs/server';

import { connectDatabase } from '@/lib/database';
import { withApiAuth } from '@/lib/utils';
import { getUser } from '@/services/user';
import { UserAuthMethod } from '@/interfaces/user';

type RequestParams = {
  params: {
    id: string;
  };
};

/**
 * GET /api/users/:id
 */
export const GET = withApiAuth(
  async (_request: Request, { params }: RequestParams, user: User) => {
    const { id } = await params;

    const method = user.externalAccounts[0].provider.replace(
      'oauth_',
      ''
    ) as UserAuthMethod;

    try {
      await connectDatabase();
      const data = await getUser(id, method);

      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
);
