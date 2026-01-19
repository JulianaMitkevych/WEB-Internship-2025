import { NextRequest, NextResponse } from 'next/server';
import admin, { adminAuth, adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

const SettingUpdateSchema = z.object({
  light: z.union([
    z.string(),
    z.object({
      isEnabled: z.boolean(),
      value: z.string(),
    })
  ]).optional(),
  temperature: z.string().optional(),
  humidity: z.string().optional(),
  nutrition: z.string().optional(),
  vent: z.object({
    isEnabled: z.boolean(),
    value: z.string(),
  }).optional(),
  watering: z.object({
    isEnabled: z.boolean(),
    value: z.string(),
  }).optional(),
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
    const parsed = SettingUpdateSchema.parse(payload);

    // Get existing settings or create new ones
    const settingsRef = adminDb.collection('settings').doc(userId);
    const settingsDoc = await settingsRef.get();

    let currentSettings = {};
    if (settingsDoc.exists) {
      currentSettings = settingsDoc.data() || {};
    }

    // Merge new settings with existing ones
    const updatedSettings = {
      ...currentSettings,
      ...parsed,
      userId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Save to Firestore
    await settingsRef.set(updatedSettings);

    // Also save to settings history for tracking
    await adminDb.collection('settings_history').add({
      userId,
      ...parsed,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { message: 'Settings updated successfully', settings: updatedSettings },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating settings:', error);

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

    const message = error.message ?? 'Unable to update settings';
    return NextResponse.json({ message }, { status: 500 });
  }
}
