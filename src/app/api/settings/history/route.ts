
import { NextRequest, NextResponse } from 'next/server';
import admin, { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { Timestamp } from 'firebase-admin/firestore';
import type { TChartPeriod } from '@/types/types';
import { z } from 'zod';

//  Zod walidations for post history data

const SingleStatSchema = z.object({
  date: z.string(),
  timestamp: z.number(), //  Unix timestamp в мілісекундах
  temperature: z.number(),
  humidity: z.number(),
  light: z.number(),
  nutrition: z.number(),
  watering: z.number(),
  vent: z.number(),
});

const MonthlyStatsPayloadSchema = z.object({
  monthlyStats: z.array(SingleStatSchema),
});

// =========================================================
// helpers functions

function getDateRange(period: TChartPeriod) {
  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case 'day':
      startDate.setHours(0, 0, 0, 0); // start of today
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7); //last 7 days
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1); // last mount
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate.setHours(0, 0, 0, 0);
  }

  return { startDate, endDate: now };
}

// =========================================================
// GET:history data retrieval

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    const userId = decodedClaims.uid;

    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || 'day') as TChartPeriod;
    const parameter = searchParams.get('parameter'); //  'light'

    const { startDate, endDate } = getDateRange(period);

    // Query Firestore for history data
    const snapshot = await adminDb
      .collection('settings_history')
      .where('userId', '==', userId)
      .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(startDate))
      .where('timestamp', '<=', admin.firestore.Timestamp.fromDate(endDate))
      .orderBy('timestamp', 'asc')
      .get();

    const historyData = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // transform Firestore Timestamp into ISO string for frontend
        // timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
        timestamp: (data.timestamp as Timestamp).toDate().getTime(),
      };
    });

    let finalData = historyData;
    if (parameter) {
      finalData = historyData.filter((item) => item[parameter] !== undefined);
    }

    return NextResponse.json({
      period,
      parameter: parameter || 'all',
      total: finalData.length,
      data: finalData,
    });
  } catch (error: any) {
    console.error('API GET Error:', error);
    if (error.code === 'auth/session-cookie-expired') {
      return NextResponse.json({ message: 'Session expired' }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// =========================================================
// POST: gtnerated history data for testing

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    const userId = decodedClaims.uid;

    const payload = await request.json();

    // validate Zod
    const { monthlyStats } = MonthlyStatsPayloadSchema.parse(payload);

    const batch = adminDb.batch();
    const historyRef = adminDb.collection('settings_history');

    monthlyStats.forEach((stat) => {
      const docRef = historyRef.doc(); // created new ID for each record
      batch.set(docRef, {
        userId,
        ...stat,
        // transform (ms) to Firestore Timestamp
        timestamp: admin.firestore.Timestamp.fromMillis(stat.timestamp),
      });
    });

    await batch.commit();

    return NextResponse.json(
      {
        message: `Successfully saved ${monthlyStats.length} records.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API POST Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation failed', errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || 'Error saving data' },
      { status: 500 }
    );
  }
}
