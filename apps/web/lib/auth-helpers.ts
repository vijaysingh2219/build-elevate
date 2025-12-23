import { auth } from '@workspace/auth';
import { NextResponse } from 'next/server';

export async function requireAuth(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return {
    error: null,
    session,
  };
}
