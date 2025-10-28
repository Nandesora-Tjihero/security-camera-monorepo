import {
  initializeApp,
  cert,
  getApp,
  getApps,
  ServiceAccount,
} from 'firebase-admin/app';
import serviceAccount from '../../security-camera-a413e-firebase-adminsdk-fbsvc-9239d5d459.json' assert { type: 'json' };

// const serviceAccount = JSON.parse(
//   useRuntimeConfig().firebaseAdminServiceAccountKey
// );
const apps = getApps();
let app: ReturnType<typeof getApp>;
if (!apps.length) {
  app = initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });
}
app = getApps()[0];

export { app as firebaseApp };
