import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { addDays } from 'date-fns';
import { EGrowthStatus } from '@/types/types';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Unauthorized - No session cookie' },
        { status: 401 }
      );
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);

    const userRef = adminDb.collection('users').doc(decodedClaims.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userSnap.data();

    // Перевіряємо, чи настав час збору врожаю
    if (userData?.startDate && userData?.expectedDays && userData?.status === EGrowthStatus.GROWING) {
      const startDate = new Date(userData.startDate);
      const expectedHarvestDate = addDays(startDate, userData.expectedDays);
      const now = new Date();

      // Якщо поточна дата >= очікуваної дати збору, оновлюємо статус
      if (now >= expectedHarvestDate) {
        await userRef.update({
          status: EGrowthStatus.HARVEST,
          updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({
          message: 'Status updated to harvest',
          status: EGrowthStatus.HARVEST,
          shouldUpdateLocal: true,
        });
      }
    }

    return NextResponse.json({
      message: 'No status update needed',
      status: userData?.status,
      shouldUpdateLocal: false,
    });
  } catch (error) {
    console.error('Error checking harvest status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
