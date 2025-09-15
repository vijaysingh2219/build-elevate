import { handlers } from '@/lib/auth';
import type { NextRequest } from 'next/server';

type AppRouteHandlerFn = (req: NextRequest) => Promise<Response>;

export const GET: AppRouteHandlerFn = handlers.GET;
export const POST: AppRouteHandlerFn = handlers.POST;
