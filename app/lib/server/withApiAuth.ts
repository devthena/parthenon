import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs/server';

export const withApiAuth = (
  handler: (
    req: NextRequest,
    context: { params: { id: string } }
  ) => Promise<NextResponse>
) => {
  return async (req: NextRequest, context: { params: { id: string } }) => {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(req, context);
  };
};
