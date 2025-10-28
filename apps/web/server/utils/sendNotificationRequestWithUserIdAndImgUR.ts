import { getFirestore } from 'firebase-admin/firestore';
import { firebaseApp } from './01.firebaseInit';
import { getMessaging } from 'firebase-admin/messaging';

const db = getFirestore(firebaseApp);
const messaging = getMessaging(firebaseApp);

async function notifyUserViaFCM(userId: string, imgURL: string) {
  // get registration token for user from cache first, if not found then get from Firestore

  const doc = await db.collection('fcmTokens').doc(userId).get(); // cache miss
  const tokens = doc.data()?.tokens;
  console.log('Tokens:', tokens[tokens.length - 1]);

  const notificationRequestMessage = {
    notification: {
      title: 'Person detected',
      body: 'A person has been detected in your home',
    },
    data: {
      imgURL: imgURL,
    },
    token: tokens[tokens.length - 1],
  };
  try {
    const messageId = await messaging.send(notificationRequestMessage);
    // save to Firestore under the registration token
  } catch (e: any) {
    console.error('Error sending message to FCM backend: ' + JSON.stringify(e));
  }
}

export { notifyUserViaFCM };
