import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_WEB_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_WEB_API_KEY;

export async function POST(request: NextRequest) {
  if (!FIREBASE_WEB_API_KEY) {
    return NextResponse.json(
      {
        message:
          'Missing NEXT_PUBLIC_FIREBASE_WEB_API_KEY environment variable',
      },
      { status: 500 }
    );
  }

  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: 'Refresh token not found' },
      { status: 401 }
    );
  }

  try {
    const tokenRefreshResponse = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_WEB_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      }
    );

    const data = await tokenRefreshResponse.json();

    if (!tokenRefreshResponse.ok) {
      console.error('Firebase token refresh failed:', data.error);

      const unauthorizedResponse = NextResponse.json(
        { message: 'Invalid or expired refresh token. Please log in again.' },
        { status: 401 }
      );
      unauthorizedResponse.cookies.set('authToken', '', { maxAge: 0 });
      unauthorizedResponse.cookies.set('refreshToken', '', { maxAge: 0 });

      return unauthorizedResponse;
    }

    const { id_token: newIdToken, refresh_token: newRefreshToken } = data;

    const response = NextResponse.json(
      { message: 'Token refreshed successfully' },
      { status: 200 }
    );

    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    };

    response.cookies.set('authToken', newIdToken, cookieOptions);
    if (newRefreshToken) {
      response.cookies.set('refreshToken', newRefreshToken, cookieOptions);
    }

    return response;
  } catch (error) {
    console.error('Unexpected error during token refresh:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
