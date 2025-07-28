import { NextRequest, NextResponse } from 'next/server';

import { RequestParams } from '@/interfaces/api';
import { connectDatabase } from '@/lib/database';
import { withApiAuth } from '@/lib/utils';
import { getActiveGames } from '@/services/game';

export const GET = withApiAuth(
  async (_request: NextRequest, { params }: RequestParams) => {
    const { id } = await params;

    try {
      await connectDatabase();

      const games = await getActiveGames(id);
      return NextResponse.json(games);
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
);
