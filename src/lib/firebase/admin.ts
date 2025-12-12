import * as admin from 'firebase-admin';

const getPrivateKey = (): string | null => {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!privateKey) {
    console.error('FIREBASE_ADMIN_PRIVATE_KEY not found in the environment!');
    return null;
  }
  return privateKey.replace(/\\n/g, '\n');
};

const validateEnvVariables = (): void => {
  const requiredVars = [
    'FIREBASE_ADMIN_PROJECT_ID',
    'FIREBASE_ADMIN_CLIENT_EMAIL',
    'FIREBASE_ADMIN_PRIVATE_KEY',
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required Firebase Admin environment variables: ${missing.join(', ')}`
    );
  }
};

if (!admin.apps.length) {
  validateEnvVariables();

  const adminConfig: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
    privateKey: getPrivateKey()!,
  };

  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;
