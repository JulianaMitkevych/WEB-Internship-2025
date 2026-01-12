import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'No session cookie found' },
        { status: 401 }
      );
    }

    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    if (!decodedClaims) {
      return NextResponse.json(
        { message: 'Invalid session cookie' },
        { status: 401 }
      );
    }

    const localId = decodedClaims.uid;
    const email = decodedClaims.email;

    // Get user profile from database
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

    return NextResponse.json({
      user: {
        id: localId,
        email,
        ...serializableProfile,
      },
      message: 'Session is valid',
    });
  } catch (error: any) {
    console.error('Error validating session:', error);

    if (error.code === 'auth/session-cookie-expired') {
      return NextResponse.json(
        { message: 'Session expired' },
        { status: 401 }
      );
    }

    if (error.code === 'auth/session-cookie-revoked') {
      return NextResponse.json(
        { message: 'Session revoked' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Session validation failed' },
      { status: 500 }
    );
  }
}

