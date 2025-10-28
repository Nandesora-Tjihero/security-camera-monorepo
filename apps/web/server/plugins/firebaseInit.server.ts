import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { notifyUserViaFCM } from '../utils/sendNotificationRequestWithUserIdAndImgUR';

export default defineNitroPlugin(async (nitroApp) => {
  // onDocumentUpdated('/users/{userId}/isMonitoring', async (event) => {
  //   const isMonitoring = event.data?.after.data();
  //   const userId = event.params.userId;
  //   const doc = await db.collection('fcmTokens').doc(userId).get();
  //   const token = doc.data()?.token;
  //   const notificationRequestMessage = {
  //     notification: {
  //       title: 'Monitoring status changed',
  //       body: isMonitoring
  //         ? 'Monitoring has been enabled'
  //         : 'Monitoring has been disabled',
  //     },
  //     token,
  //   };
  //   try {
  //     const messageId = await messaging.send(notificationRequestMessage);
  //   } catch (e: any) {
  //     console.error(
  //       'Error sending isMonitoring message to FCM backend: ' + e.code
  //     );
  //   }
  // });
});
