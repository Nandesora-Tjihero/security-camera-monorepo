const { onDocumentUpdated } = require('firebase-functions/v2/firestore');

const fetch = require('node-fetch');

const { config } = require('dotenv');
config()
const REGION = process.env.FUNCTIONS_REGION;
const API_URL = process.env.NUXT_SSE_API_URL || 'http://localhost:3000/api/notifications-device';

exports.updateTokens = onDocumentUpdated(
  {
    document: 'users/{userId}',
    region: REGION,
    maxInstances: 3,
    timeoutSeconds: 10,
  },
  async (event) => {
    const userId = event.params.userId;
    const before = event.data?.before.data()?.tokens || [];
    const after = event.data?.after.data()?.tokens || [];

    if (JSON.stringify(before) === JSON.stringify(after)) {
      console.log('No token changes detected for', userId);
      return;
    }

    console.log(`🔄 Tokens updated for ${userId}. Notifying SSE relay...`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, tokens: after }),
        signal: controller.signal,
      });
      console.log(`✅ Notified Nuxt SSE relay for ${userId}`);
    } catch (e) {
      console.error('Error notifying Nuxt SSE relay:', e);
    } finally {
      clearTimeout(timeout);
    }
  }
);