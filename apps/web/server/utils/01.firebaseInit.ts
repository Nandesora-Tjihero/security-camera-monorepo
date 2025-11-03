import { initializeApp, getApp, getApps } from 'firebase-admin/app';

const apps = getApps();
let app: ReturnType<typeof getApp>;

if (!apps.length) {
  app = initializeApp();
}

app = getApps()[0];

export { app as firebaseApp };
