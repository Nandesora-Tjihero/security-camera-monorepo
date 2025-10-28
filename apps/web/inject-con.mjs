import fs from 'fs';
import path from 'path';

const env = process.env;
console.log('env', env.NUXT_PUBLIC_API_KEY);
const config = {
  apiKey: env.NUXT_PUBLIC_API_KEY,
  authDomain: env.NUXT_PUBLIC_AUTH_DOMAIN,
  projectId: env.NUXT_PUBLIC_PROJECT_ID,
  storageBucket: env.NUXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: env.NUXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: env.NUXT_PUBLIC_APP_ID,
  measurementId: env.NUXT_PUBLIC_MEASUREMENT_ID,
};
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swTemplate = fs.readFileSync(
  path.resolve(__dirname, 'firebase-messaging-sw.template.js'),
  'utf8'
);
const configStr = JSON.stringify(config);
const swContent = swTemplate
  .replace('__FIREBASE_CONFIG__', configStr)
  .replace('NUXT_VAPID_KEY', env.NUXT_VAPID_KEY);
fs.writeFileSync(
  path.resolve(__dirname, 'public/firebase-messaging-sw.js'),
  swContent,
  {
    encoding: 'utf8',
  }
);
