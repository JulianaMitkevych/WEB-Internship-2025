// import * as admin from 'firebase-admin';

// const getPrivateKey = (): string | null => {
//   const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
//   if (!privateKey) {
//     console.error('FIREBASE_ADMIN_PRIVATE_KEY not found in the invironment!');
//     return null;
//   }
//   return privateKey.replace(/\\n/g, '\n');
// };

// const adminConfig: admin.ServiceAccount = {
//   projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
//   clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
//   privateKey: getPrivateKey() ?? '',
// };

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(adminConfig),
//   });
// }

// export const adminAuth = admin.auth();
// export const adminDb = admin.firestore();
// export default admin;
