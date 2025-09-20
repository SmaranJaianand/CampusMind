import { getApps, initializeApp, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { ServiceAccount } from 'firebase-admin/app';

function getAdminApp() {
    if (getApps().some(app => app.name === 'admin-app')) {
        return getApp('admin-app');
    }

    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountString) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Admin features will be limited.");
    }

    try {
        const serviceAccount: ServiceAccount = JSON.parse(serviceAccountString);
        return initializeApp({
            credential: cert(serviceAccount),
        }, 'admin-app');
    } catch (error) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
        throw new Error("Failed to initialize Firebase Admin SDK.");
    }
}

const adminApp = getAdminApp();
const auth = getAuth(adminApp);

export { adminApp, auth };
