import { NextResponse, NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value;

  const response = NextResponse.json({ success: true });

  const clearCookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  };

  response.cookies.set('authToken', '', clearCookieOptions);
  response.cookies.set('refreshToken', '', clearCookieOptions);

  if (authToken) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(authToken);
      const uid = decodedToken.uid;
      await adminAuth.revokeRefreshTokens(uid);
    } catch (error) {
      console.error('Failed to revoke refresh tokens:', error);
    }
  }

  return response;
}
