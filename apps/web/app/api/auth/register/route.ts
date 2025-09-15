import { getUsernameFromEmail, hashToken, loginSchema } from '@workspace/utils';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../packages/db/src';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedFields = loginSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const { email, password, username } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashToken(password);
    await prisma.user.create({
      data: {
        email,
        username: username || getUsernameFromEmail(email) || 'guest user',
        password: passwordHash,
        emailVerified: new Date(), // NOTE: Remove this line when email verification is implemented
      },
    });

    // NOTE: Email verification is not yet implemented

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.error('[REGISTER]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
