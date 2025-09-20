import { getApps, initializeApp, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { ServiceAccount } from 'firebase-admin/app';

// This will be null if the key is not set.
let adminApp = null; 

try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountString) {
        const serviceAccount: ServiceAccount = JSON.parse(serviceAccountString);
        if (getApps().some(app => app.name === 'admin-app')) {
            adminApp = getApp('admin-app');
        } else {
            adminApp = initializeApp({
                credential: cert(serviceAccount),
            }, 'admin-app');
        }
    } else {
        console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Admin features will be limited.");
    }
} catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    // Don't re-throw the error, just let adminApp be null.
}

// Conditionally export auth
const auth = adminApp ? getAuth(adminApp) : null;

export { adminApp, auth };
