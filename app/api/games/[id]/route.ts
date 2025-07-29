import { NextRequest, NextResponse } from 'next/server';

import { RequestParams } from '@/interfaces/api';
import { connectDatabase } from '@/lib/database';
import { withApiAuth } from '@/lib/server';
import { deleteActiveGame, getActiveGames } from '@/services/games';
import { GameCode } from '@/enums/games';

export const GET = withApiAuth(
  async (
    _request: NextRequest,
    context: { params: { [key: string]: string } }
  ) => {
    const { id } = await context.params;

    try {
      await connectDatabase();

      const games = await getActiveGames(id);
      return NextResponse.json(games);
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
);

export const DELETE = withApiAuth(
  async (
    request: NextRequest,
    context: { params: { [key: string]: string } }
  ) => {
    const { id } = await context.params;

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) return NextResponse.json(null);

    try {
      await connectDatabase();

      const games = await deleteActiveGame(id, code as GameCode);
      return NextResponse.json(games);
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
);
