import { NextRequest, NextResponse } from 'next/server';
import admin, { adminAuth, adminDb } from '@/lib/firebase/admin';
import { SignUpSchema } from '@/lib/zod-schemas';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = SignUpSchema.parse(payload);

    const { confirmPassword: _, ...dataForFirebase } = parsed;
    const { email, password, firstName, lastName, phoneNumber } =
      dataForFirebase;

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`.trim(),
      ...(phoneNumber ? { phoneNumber } : {}),
    });

    await adminDb
      .collection('users')
      .doc(userRecord.uid)
      .set({
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
  } catch (error: any) {
    console.error('Error registration Firebase/Zod:', error);

    if (error.issues) {
      return NextResponse.json(
        { message: 'Validation failed (Zod)', details: error.issues },
        { status: 400 }
      );
    }

    if (error.code) {
      const errorMessages: Record<string, string> = {
        'auth/weak-password': 'Password is too short.',
        'auth/invalid-email': 'Incorrect format.',
        'auth/email-already-in-use': 'User with this email already exists.',
      };

      const errorMessage =
        errorMessages[error.code] ?? `Error Firebase: ${error.code}`;

      return NextResponse.json(
        { message: errorMessage, code: error.code },
        { status: 400 }
      );
    }

    const message =
      error.message ?? 'Unable to complete registration right now';
    return NextResponse.json({ message }, { status: 500 });
  }
}
