import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING';
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pin = process.env.ADMIN_PIN || 'MISSING';

  return NextResponse.json({
    supabaseUrl: url,
    hasAnonKey: hasKey,
    adminPin: pin === '6779' ? 'CORRECT' : 'WRONG/MISSING',
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd()
  });
}
