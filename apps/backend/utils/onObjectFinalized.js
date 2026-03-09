const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { Timestamp } = require("firebase-admin/firestore");
const { db, messaging, storage } = require("../firebase");

const { defineString } = require("firebase-functions/params");

const REGION = defineString("FUNCTIONS_REGION");
const BUCKET_NAME = defineString("STORAGE_BUCKET");

exports.onDetectionImageUploaded = onObjectFinalized(
  {
    region: REGION,
    bucket: BUCKET_NAME,
    maxInstances: 3,
    timeoutSeconds: 30,
  },
  async (event) => {
    const object = event.data;
    const [_, userId, fileName] = object.name.split("/");

    // In tests, we need to explicitly access the bucket defined in .env or passed to firebase-functions-test
    // In production with no args, it uses the default bucket.
    const bucketInstance = process.env.STORAGE_BUCKET
      ? storage.bucket(process.env.STORAGE_BUCKET)
      : storage.bucket();
    const file = bucketInstance.file(object.name);

    console.log(`📸 New detection image uploaded for user: ${userId}`);

    try {
      const [imageUrl, userSnap] = await Promise.all([
        getFileDownloadURL(file),
        db.collection("users").doc(userId).get(),
      ]);

      if (!userSnap.exists) {
        console.warn(`User ${userId} not found`);
        return;
      }

      const userData = userSnap.data();
      const tokens = userData?.tokens || [];
      if (tokens.length === 0) {
        console.warn(`No FCM tokens for user ${userId}`);
        return;
      }

      const detectionsRef = db
        .collection("users")
        .doc(userId)
        .collection("detections");

      // Optimization: Use fileName as Doc ID to prevent duplicates without reading first (Idempotent Write)
      const detectionData = {
        filePath: object.name,
        fileName,
        timestamp: Timestamp.fromMillis(Number(fileName.split("_")[1])),
      };

      await Promise.all([
        detectionsRef.doc(fileName).set(detectionData),
        sendPushNotifications(tokens, imageUrl), // notify all devices
      ]);

      // PERFORMANCE MEASUREMENT: Notification Latency
      // Time from 'upload complete' (object.timeCreated) to 'notification sent' (now)
      const uploadTime = new Date(object.timeCreated).getTime(); // provided by Cloud Storage trigger
      const notificationTime = Date.now();
      const latencyMs = notificationTime - uploadTime;

      console.log(
        JSON.stringify({
          severity: "INFO",
          message: "Performance Measurement: Notification Latency",
          eventId: event.id,
          metric: {
            name: "notification_latency",
            valueMs: latencyMs,
            success: true,
            targetMs: 3000,
            meetsTarget: latencyMs <= 3000,
          },
        }),
      );

      console.log(
        `✅ Image URL saved and notifications sent for ${userId} to ${tokens.length} devices (Latency: ${latencyMs}ms)`,
      );
    } catch (err) {
      console.error("🔥 Error handling upload:", err);

      // Log failed metric if possible (though we might not have reached notification stage)
      console.log(
        JSON.stringify({
          severity: "ERROR",
          message: "Performance Measurement: Notification Latency Failed",
          metric: {
            name: "notification_latency",
            success: false,
          },
        }),
      );
    }
  },
);

async function sendPushNotifications(tokens, imageUrl) {
  const message = {
    tokens,
    notification: {
      title: "Motion detected!",
      body: "Tap to view the image.",
    },
    data: {
      imageUrl,
    },
    android: {
      priority: "high",
    },
  };

  try {
    const response = await messaging.sendEachForMulticast(message);
    console.log(`✅ Push notifications sent: ${response.successCount} successful, ${response.failureCount} failed`);
    return response;
  } catch (error) {
    console.error("❌ Error sending push notifications:", error);
    throw error;
  }
}

async function getFileDownloadURL(file) {
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 60 * 60 * 1000, // 1h
  });
  return url;
}
