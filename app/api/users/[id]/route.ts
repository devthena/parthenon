import { NextResponse } from 'next/server';

import { UserAuthMethod } from '@/interfaces/user';

import { connectDatabase } from '@/lib/database';
import { withApiAuth } from '@/lib/server';

import { getUser } from '@/services/user';

/**
 * GET /api/users/:id
 */
export const GET = withApiAuth(
  async (request: Request, context: { params: { id: string } }) => {
    const { id } = await context.params;
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
