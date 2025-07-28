import { NextResponse } from 'next/server';
import { User } from '@clerk/nextjs/server';

import { UserAuthMethod } from '@/interfaces/user';
import { connectDatabase } from '@/lib/database';
import { withApiAuth } from '@/lib/utils';
import { getUser } from '@/services/user';

type RequestParams = {
  params: {
    id: string;
  };
};

/**
 * GET /api/users/:id
 */
export const GET = withApiAuth(
  async (request: Request, { params }: RequestParams) => {
    const { id } = await params;

    const { searchParams } = new URL(request.url);
    const method = searchParams.get('method') || 'discord';

    try {
      await connectDatabase();
      const data = await getUser(id, method as UserAuthMethod);

      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
);
