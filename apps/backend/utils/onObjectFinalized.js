const { onObjectFinalized } = require('firebase-functions/v2/storage');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
const { getStorage } = require('firebase-admin/storage');

const { config } = require('dotenv');
config()

const REGION = process.env.FUNCTIONS_REGION;
const BUCKET_NAME = process.env.BUCKET_NAME;

const db = getFirestore();
const messaging = getMessaging();
const storage = getStorage();

exports.onDetectionImageUploaded = onObjectFinalized({
  region: REGION,
  bucket: BUCKET_NAME,
  maxInstances: 3,
  timeoutSeconds: 30,
}, async (event) => {
  const object = event.data;
  const [_, userId, fileName] = object.name.split('/');
  const file = storage.bucket().file(object.name);

  console.log(`📸 New detection image uploaded for user: ${userId}`);

  try {
    const [imageUrl, userSnap] = await Promise.all([
      getFileDownloadURL(file),
      db.collection('users').doc(userId).get(),
    ]);

    if (!userSnap.exists) {
      console.warn(`User ${userId} not found`);
      return;
    }

    const userData = userSnap.data();
    const token = userData?.tokens?.[userData.tokens.length - 1]; // Get the latest token
    if (!token) {
      console.warn(`No FCM token for user ${userId}`);
      return;
    }

    const detectionsRef = db.collection('users').doc(userId).collection('detections');
    const existing = await detectionsRef.where('fileName', '==', fileName).limit(1).get();

    if (!existing.empty) {
      console.log(`🟡 Detection ${fileName} already exists. Skipping duplicate.`);
      return;
    }

    const detectionData = {
      imageUrl,
      fileName,
      timestamp: Timestamp.fromMillis(
        Number(fileName.split('_')[1])
      ),
    };

    await Promise.all([
      detectionsRef.add(detectionData),
      sendPushNotification(token, imageUrl),   // notify device
    ]);

    console.log(`✅ Image URL saved and notification sent for ${userId}`);

  } catch (err) {
    console.error('🔥 Error handling upload:', err);
  }
});

async function sendPushNotification(token, imageUrl) {
  console.log('🚀 Sending push notification to token:', token);
  const payload = {
    token,
    notification: {
      title: 'Motion detected!',
      body: 'Tap to view the image.',
    },
    data: {
      imageUrl,
    },
    android: {
      priority: 'high',
    },
  };

  try {
    const response = await messaging.send(payload);
    console.log('✅ Push notification sent:', response);
  } catch (error) {
    console.error('❌ Error sending push notification:', error);
  }
}

async function getFileDownloadURL(file) {
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1h
  });
  return url;
}