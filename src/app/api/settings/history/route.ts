// import { NextRequest, NextResponse } from 'next/server';
// import { adminAuth, adminDb } from '@/lib/firebase/admin';
// import type { Timestamp } from 'firebase-admin/firestore';

// type PeriodType = 'daily' | 'weekly' | 'monthly';

// function getDateRange(period: PeriodType) {
//   const now = new Date();
//   const startDate = new Date();

//   switch (period) {
//     case 'daily':
//       startDate.setHours(0, 0, 0, 0);
//       break;
//     case 'weekly':
//       startDate.setDate(now.getDate() - 7);
//       startDate.setHours(0, 0, 0, 0);
//       break;
//     case 'monthly':
//       startDate.setMonth(now.getMonth() - 1);
//       startDate.setHours(0, 0, 0, 0);
//       break;
//   }

//   return { startDate, endDate: now };
// }

// export async function GET(request: NextRequest) {
//   try {
//     const sessionCookie = request.cookies.get('session')?.value;

//     if (!sessionCookie) {
//       return NextResponse.json(
//         { message: 'Unauthorized - No session cookie' },
//         { status: 401 }
//       );
//     }

//     const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
//     const userId = decodedClaims.uid;

//     const { searchParams } = new URL(request.url);
//     const period = (searchParams.get('period') || 'daily') as PeriodType;
//     const parameter = searchParams.get('parameter'); // light, temperature, humidity, nutrition

//     if (!['daily', 'weekly', 'monthly'].includes(period)) {
//       return NextResponse.json(
//         { message: 'Invalid period. Must be daily, weekly, or monthly' },
//         { status: 400 }
//       );
//     }

//     const { startDate, endDate } = getDateRange(period);

//     // Query settings history
//     const query = adminDb
//       .collection('settings_history')
//       .where('userId', '==', userId)
//       .where('timestamp', '>=', startDate)
//       .where('timestamp', '<=', endDate)
//       .orderBy('timestamp', 'desc');

//     const snapshot = await query.get();
//     const historyData = snapshot.docs.map(doc => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         ...data,
//         timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
//       };
//     });

//     // Group data by parameter if specified
//     let filteredData = historyData;
//     if (parameter) {
//       filteredData = historyData.filter(item => item[parameter] !== undefined);
//     }

//     // Aggregate data for the period
//     const aggregatedData = {
//       period,
//       parameter: parameter || 'all',
//       totalRecords: filteredData.length,
//       data: filteredData,
//       averages: parameter ? {
//         [parameter]: filteredData.length > 0
//           ? filteredData.reduce((sum, item) => sum + parseFloat(item[parameter] || '0'), 0) / filteredData.length
//           : 0
//       } : {},
//     };

//     return NextResponse.json(aggregatedData);
//   } catch (error: any) {
//     console.error('Error fetching settings history:', error);

//     if (error.code === 'auth/session-cookie-expired') {
//       return NextResponse.json(
//         { message: 'Session expired' },
//         { status: 401 }
//       );
//     }

//     const message = error.message ?? 'Unable to fetch settings history';
//     return NextResponse.json({ message }, { status: 500 });
//   }
// }

// app/api/settings/history/route.ts

import { NextRequest, NextResponse } from 'next/server';
import admin, { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { Timestamp } from 'firebase-admin/firestore';
import type { TChartPeriod } from '@/types/types';
import { z } from 'zod';

// =========================================================
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
        timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
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