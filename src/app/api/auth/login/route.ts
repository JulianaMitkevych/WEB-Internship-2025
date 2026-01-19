import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { Timestamp } from 'firebase-admin/firestore';

const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: NextRequest) {
  try {
    let payload;
    try {
      payload = await request.json();
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: 'Invalid request body. Expected JSON.' },
        { status: 400 }
      );
    }

    const idToken = payload?.idToken;

    if (!idToken) {
      return NextResponse.json(
        { message: 'ID Token is missing' },
        { status: 400 }
      );
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_COOKIE_MAX_AGE * 1000,
    });

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const localId = decodedToken.uid;
    const email = decodedToken.email;

    const userDoc = await adminDb.collection('users').doc(localId).get();
    const userProfile = userDoc.exists ? userDoc.data() : null;

    const serializableProfile = userProfile
      ? {
          firstName: userProfile.firstName ?? null,
          lastName: userProfile.lastName ?? null,
          phoneNumber: userProfile.phoneNumber ?? null,
          cropType: userProfile.cropType ?? null,
          createdAt: userProfile.createdAt
            ? (userProfile.createdAt as Timestamp).toDate().toISOString()
            : null,
          startDate: userProfile.startDate ?? null,
          expectedDays: userProfile.expectedDays ?? null,
          status: userProfile.status ?? null,
          growthDay: userProfile.growthDay ?? null,
          totalGrowthDays: userProfile.totalGrowthDays ?? null,
        }
      : null;

    const response = NextResponse.json({
      user: {
        id: localId,
        email,
        ...serializableProfile,
      },
      message: 'Successfully logged in with Session Cookie',
    });

    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_COOKIE_MAX_AGE,
    };

    response.cookies.set('session', sessionCookie, cookieOptions);

    return response;
  } catch (error: any) {
    console.error('Error while processing session login:', error);

    if (error.code === 'auth/invalid-argument') {
      return NextResponse.json(
        { message: 'Invalid ID Token or token expired' },
        { status: 401 }
      );
    }

    const message = error?.message ?? 'Unexpected login error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
