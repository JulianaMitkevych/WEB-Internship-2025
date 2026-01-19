import { NextRequest, NextResponse } from 'next/server';
import admin, { adminAuth, adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

const UpdateCropTypeSchema = z.object({
  cropType: z.enum(['Microgreens', 'Herbs', 'Vegetables', "Mushroom's", 'Flowering Plants']),
});

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
    const userId = decodedClaims.uid;

    const payload = await request.json();
    const parsed = UpdateCropTypeSchema.parse(payload);
    const { cropType } = parsed;

    // Update user document with cropType
    await adminDb
      .collection('users')
      .doc(userId)
      .update({
        cropType,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return NextResponse.json(
      { message: 'Crop type updated successfully', cropType },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating crop type:', error);

    if (error.issues) {
      return NextResponse.json(
        { message: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    if (error.code === 'auth/session-cookie-expired') {
      return NextResponse.json(
        { message: 'Session expired' },
        { status: 401 }
      );
    }

    const message = error.message ?? 'Unable to update crop type';
    return NextResponse.json({ message }, { status: 500 });
  }
}
