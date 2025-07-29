import { NextRequest, NextResponse } from 'next/server';

import { RequestParams } from '@/interfaces/api';
import { connectDatabase } from '@/lib/database';
import { withApiAuth } from '@/lib/server';
import { getStats } from '@/services/stat';

export const GET = withApiAuth(
  async (_request: NextRequest, { params }: RequestParams) => {
    const { id } = await params;

    try {
      await connectDatabase();

      const stats = await getStats(id);
      return NextResponse.json(stats);
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
);
