import { firebase } from '@nativescript/firebase-core';
import type { IDetection } from '~/core/models';

const initializeApp = async () => {
  const { firebase } = await import('@nativescript/firebase-core');
  await firebase().initializeApp();
  return firebase;
};

const handleAuthStateChange = async (callback: (user: any) => void) => {
  const firebase = await initializeApp();
  firebase()
    .auth()
    .addAuthStateChangeListener((user) => {
      callback(user);
    });
};

const handleDeviceTokenChange = async (callback: (token: string) => void) => {
  try {
    const firebase = await initializeApp();
    firebase()
      .messaging()
      .onToken((token) => {
        callback(token);
      });
  } catch (error) {}
};

const handleMessageReceived = async (callback: (message: any) => void) => {
  try {
    const firebase = await initializeApp();
    firebase()
      .messaging()
      .onMessage((message) => {
        callback(message);
      });
  } catch (error) {
    console.error('Error handling message received:', error);
  }
};
const handleNotificationTap = async (callback: (message: any) => void) => {
  try {
    const firebase = await initializeApp();
    firebase()
      .messaging()
      .onNotificationTap((message) => {
        callback(message);
      });
  } catch (error) {
    console.error('Error handling notification tap:', error);
  }
};

const handleDetectionsChange = (
  userId: string | undefined,
  callback: (data: any) => void
) => {
  if (userId) {
    const detectionsRef = firebase()
      .firestore()
      .collection(`users/${userId}/detections`)
      .orderBy('timestamp', 'desc')
      .limit(5);

    detectionsRef.onSnapshot(
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(data);
      },
      (err) => {
        console.log(`snapshot`, err);
      }
    );
  }
};

export const firebaseUtils = {
  initializeApp,
  handleAuthStateChange,
  handleMessageReceived,
  handleNotificationTap,
  handleDeviceTokenChange,
  handleDetectionsChange,
};
