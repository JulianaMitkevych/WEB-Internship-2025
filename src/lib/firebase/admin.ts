// import * as admin from 'firebase-admin';

// const getPrivateKey = (): string | null => {
//   const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
//   if (!privateKey) {
//     console.error('FIREBASE_ADMIN_PRIVATE_KEY not found in the environment!');
//     return null;
//   }
//   return privateKey.replace(/\\n/g, '\n');
// };

// const validateEnvVariables = (): void => {
//   const requiredVars = [
//     'FIREBASE_ADMIN_PROJECT_ID',
//     'FIREBASE_ADMIN_CLIENT_EMAIL',
//     'FIREBASE_ADMIN_PRIVATE_KEY',
//   ];

//   const missing = requiredVars.filter((varName) => !process.env[varName]);

//   if (missing.length > 0) {
//     throw new Error(
//       `Missing required Firebase Admin environment variables: ${missing.join(', ')}`
//     );
//   }
// };

// if (!admin.apps.length) {
//   validateEnvVariables();

//   const adminConfig: admin.ServiceAccount = {
//     projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
//     clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
//     privateKey: getPrivateKey()!,
//   };

//   admin.initializeApp({
//     credential: admin.credential.cert(adminConfig),
//   });
// }

// export const adminAuth = admin.auth();
// export const adminDb = admin.firestore();
// export default admin;
// lib/firebase/admin.ts
import * as admin from 'firebase-admin';
import serviceAccount from '../../../serviceAccountKey.json';

// console.log('Content of serviceAccount (after import):', serviceAccount); 
// console.log('Type of serviceAccount:', typeof serviceAccount); 

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully using serviceAccountKey.json');
  } catch (error) {
    console.error(' FATAL ERROR: Failed to initialize Firebase Admin SDK from serviceAccountKey.json');
    console.error('Detailed Error:', error);
    throw new Error(`Firebase Admin SDK initialization failed: ${(error as Error).message}`);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;
