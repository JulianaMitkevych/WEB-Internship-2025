import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { EGrowthStatus } from '@/types/types';

type UpdateGrowthDateRequest = {
  startDate: string;
  expectedDays: number;
  status: EGrowthStatus;
};

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

    const { startDate, expectedDays, status }: UpdateGrowthDateRequest = await request.json();

    // Валідація даних
    if (!startDate || !expectedDays || expectedDays <= 0) {
      return NextResponse.json(
        { message: 'Invalid data provided' },
        { status: 400 }
      );
    }

    // Отримуємо поточні дані користувача
    const userRef = adminDb.collection('users').doc(decodedClaims.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userSnap.data();
    const isNewSetup = !userData?.startDate; // чи це перше налаштування

    // Розрахунок поточного дня вирощування
    let growthDay = 1;
    if (!isNewSetup) {
      // Якщо це оновлення існуючого вирощування, зберігаємо поточний день
      const startDateObj = new Date(startDate);
      const now = new Date();
      growthDay = Math.max(1, Math.floor((now.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    }

    // Оновлюємо дані користувача в Firestore
    await userRef.update({
      startDate,
      expectedDays,
      status: status || EGrowthStatus.GROWING,
      growthDay,
      totalGrowthDays: expectedDays,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: isNewSetup ? 'Growth date set successfully' : 'Growth date updated successfully',
      startDate,
      expectedDays,
      status: status || EGrowthStatus.GROWING,
      isNewSetup,
    });
  } catch (error) {
    console.error('Error updating growth date:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
