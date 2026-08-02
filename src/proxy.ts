import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { isSupabaseConfigured } from '@/lib/supabase/config';
import { updateSession } from '@/lib/supabase/proxy';

export const proxy = async (request: NextRequest): Promise<NextResponse> =>
    isSupabaseConfigured()
        ? await updateSession(request)
        : NextResponse.next({ request });

export const config = {
    matcher: ['/(api(?!/health$)|trpc)(.*)'],
};
