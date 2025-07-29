import { NextRequest, NextResponse } from 'next/server';

import { connectDatabase } from '@/lib/database';
import { withApiAuth } from '@/lib/server';
import { getStats } from '@/services/stat';

export const GET = withApiAuth(
  async (_request: NextRequest, context: { params: { id: string } }) => {
    const { id } = await context.params;

    try {
      await connectDatabase();

      const stats = await getStats(id);
      return NextResponse.json(stats);
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
);
