import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { Timestamp } from 'firebase-admin/firestore';

type PeriodType = 'daily' | 'weekly' | 'monthly';

function getDateRange(period: PeriodType) {
  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case 'daily':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      startDate.setMonth(now.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
  }

  return { startDate, endDate: now };
}

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Unauthorized - No session cookie' },
        { status: 401 }
      );
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    const userId = decodedClaims.uid;

    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || 'daily') as PeriodType;
    const parameter = searchParams.get('parameter'); // light, temperature, humidity, nutrition

    if (!['daily', 'weekly', 'monthly'].includes(period)) {
      return NextResponse.json(
        { message: 'Invalid period. Must be daily, weekly, or monthly' },
        { status: 400 }
      );
    }

    const { startDate, endDate } = getDateRange(period);

    // Query settings history
    const query = adminDb
      .collection('settings_history')
      .where('userId', '==', userId)
      .where('timestamp', '>=', startDate)
      .where('timestamp', '<=', endDate)
      .orderBy('timestamp', 'desc');

    const snapshot = await query.get();
    const historyData = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
      };
    });

    // Group data by parameter if specified
    let filteredData = historyData;
    if (parameter) {
      filteredData = historyData.filter(item => item[parameter] !== undefined);
    }

    // Aggregate data for the period
    const aggregatedData = {
      period,
      parameter: parameter || 'all',
      totalRecords: filteredData.length,
      data: filteredData,
      averages: parameter ? {
        [parameter]: filteredData.length > 0
          ? filteredData.reduce((sum, item) => sum + parseFloat(item[parameter] || '0'), 0) / filteredData.length
          : 0
      } : {},
    };

    return NextResponse.json(aggregatedData);
  } catch (error: any) {
    console.error('Error fetching settings history:', error);

    if (error.code === 'auth/session-cookie-expired') {
      return NextResponse.json(
        { message: 'Session expired' },
        { status: 401 }
      );
    }

    const message = error.message ?? 'Unable to fetch settings history';
    return NextResponse.json({ message }, { status: 500 });
  }
}
