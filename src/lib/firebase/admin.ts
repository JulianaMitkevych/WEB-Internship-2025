import * as admin from 'firebase-admin';
import serviceAccount from '../../../serviceAccountKey.json';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log(
      'Firebase Admin SDK initialized successfully using serviceAccountKey.json'
    );
  } catch (error) {
    console.error(
      ' FATAL ERROR: Failed to initialize Firebase Admin SDK from serviceAccountKey.json'
    );
    console.error('Detailed Error:', error);
    throw new Error(
      `Firebase Admin SDK initialization failed: ${(error as Error).message}`
    );
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;
