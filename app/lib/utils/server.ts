import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser, User } from '@clerk/nextjs/server';
import { RequestParams } from '@/interfaces/api';

export const withApiAuth = (
  handler: (
    req: NextRequest,
    params: RequestParams,
    user: User
  ) => Promise<Response>
) => {
  return async (req: NextRequest, params: RequestParams) => {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userClerk = await currentUser();

    return handler(req, params, userClerk!);
  };
};

export const withPageAuth = async <T>(
  handler: (children: React.ReactNode) => T | Promise<T>,
  children: React.ReactNode
) => {
  const { userId } = await auth();

  if (!userId) redirect('/');

  return handler(children);
};
