const { onObjectFinalized } = require('firebase-functions/v2/storage');
const { Timestamp } = require('firebase-admin/firestore');
const { db, messaging, storage } = require('../firebase');

const { defineString } = require('firebase-functions/params');

const REGION = defineString('FUNCTIONS_REGION');
const BUCKET_NAME = defineString('STORAGE_BUCKET');


exports.onDetectionImageUploaded = onObjectFinalized({
  region: REGION,
  bucket: BUCKET_NAME,
  maxInstances: 3,
  timeoutSeconds: 30,
}, async (event) => {
  const object = event.data;
  const [_, userId, fileName] = object.name.split('/');
  
  // In tests, we need to explicitly access the bucket defined in .env or passed to firebase-functions-test
  // In production with no args, it uses the default bucket.
  const bucketInstance = process.env.STORAGE_BUCKET ? storage.bucket(process.env.STORAGE_BUCKET) : storage.bucket();
  const file = bucketInstance.file(object.name);

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
    
    // Optimization: Use fileName as Doc ID to prevent duplicates without reading first (Idempotent Write)
    const detectionData = {
      filePath: object.name,
      fileName,
      timestamp: Timestamp.fromMillis(
        Number(fileName.split('_')[1])
      ),
    };

    await Promise.all([
      detectionsRef.doc(fileName).set(detectionData),
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