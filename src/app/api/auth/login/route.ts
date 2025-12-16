import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { LogInSchema } from '@/lib/zod-schemas';
import type { Timestamp } from 'firebase-admin/firestore';

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

  try {
    const payload = await request.json();
    const { email, password } = LogInSchema.parse(payload);

    const firebaseResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await firebaseResponse.json();

    if (!firebaseResponse.ok) {
      const errorMessage =
        data?.error?.message === 'INVALID_PASSWORD'
          ? 'Invalid email or password'
          : (data?.error?.message ?? 'Unable to login');

      return NextResponse.json({ message: errorMessage }, { status: 401 });
    }

    const { idToken, refreshToken, localId } = data;

    const userDoc = await adminDb.collection('users').doc(localId).get();
    const userProfile = userDoc.exists ? userDoc.data() : null;

    const serializableProfile = userProfile
      ? {
          firstName: userProfile.firstName ?? null,
          lastName: userProfile.lastName ?? null,
          phoneNumber: userProfile.phoneNumber ?? null,
          createdAt: userProfile.createdAt 
            ? (userProfile.createdAt as Timestamp).toDate().toISOString()
            : null,
        }
      : null;

    const response = NextResponse.json({
      user: {
        id: localId,
        email,
        ...serializableProfile,
      },
      token: idToken,
    });

    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };

    response.cookies.set('authToken', idToken, cookieOptions);
    response.cookies.set('refreshToken', refreshToken, cookieOptions);

    return response;
  } catch (error: unknown) {
    console.error('Error while processing login:', error);

    if (error instanceof Error && 'issues' in (error as any)) {
      return NextResponse.json(
        { message: 'Validation failed', details: (error as any).issues },
        { status: 400 }
      );
    }

    const message = (error as any)?.message ?? 'Unexpected login error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
