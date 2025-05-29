import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: 'Token not provided' }, { status: 400 });
  }

  // Simpan token ke cookie HTTP-only
  (await cookies()).set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });

  return NextResponse.json({ success: true });
}
