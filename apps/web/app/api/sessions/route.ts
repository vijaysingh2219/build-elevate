import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@workspace/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { error, session } = await requireAuth(req);
    if (error) return error;

    const sessions = await prisma.session.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({
      sessions,
      currentSessionId: session.session.id,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
