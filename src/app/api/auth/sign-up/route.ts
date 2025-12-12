import { NextRequest, NextResponse } from 'next/server';

import admin, { adminAuth, adminDb } from '@/lib/firebase/admin';
import { SignUpSchema } from '@/lib/zod-schemas';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = SignUpSchema.parse(payload);
    const { email, password, firstName, lastName, phoneNumber } = parsed;

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`.trim(),
      ...(phoneNumber ? { phoneNumber } : {}),
    });

    await adminDb.collection('users').doc(userRecord.uid).set({
      firstName,
      lastName,
      phoneNumber: phoneNumber ?? null,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        uid: userRecord.uid,
        email: userRecord.email,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && 'issues' in (error as any)) {
      return NextResponse.json(
        { message: 'Validation failed', details: (error as any).issues },
        { status: 400 }
      );
    }

    const message =
      (error as any)?.message ?? 'Unable to complete registration right now';

    return NextResponse.json({ message }, { status: 500 });
  }
}

