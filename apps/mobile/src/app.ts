import { computed, createApp, ref, registerElement } from 'nativescript-vue';

registerElement(
  'GoogleSignInButton',
  () => require('@nativescript/google-signin').GoogleSignInButton
);

import index from './pages/index.vue';
import '@nativescript/firebase-messaging';
import '@nativescript/firebase-auth';

import { firebaseUtils } from './utils/firebaseHelpers';
import { initServices } from './boot/services';
import { usePreferences } from './boot/usePreferences';

import DrawerPlugin from '@nativescript-community/ui-drawer/vue3';

import { initFirebase } from './boot/firebase';
import { firebase } from '@nativescript/firebase-core';
import { IDetection } from './core/models';

try {
  await initFirebase();

  const { authService, databaseService, notificationService } = initServices();

  const prefs = usePreferences();

  firebaseUtils.handleAuthStateChange((user) => {
    if (!user) {
      prefs.clearUser();
      authService.user.value = null;
    } else {
      prefs.setUserId(user.uid);
      authService.user.value = authService.convertToScUser(user);
      console.log('User is signed in!');
    }
  });

  firebaseUtils.handleDeviceTokenChange((token) => {
    console.log('Device token changed:', token);
  });

  const auth = firebase().auth();

  const detections = ref<IDetection[]>([]);

  if (auth.currentUser?.uid) {
    const detectionsRef = firebase()
      .firestore()
      .collection(`users/${auth.currentUser.uid}/detections`)
      .orderBy('timestamp', 'desc')
      .limit(5);

    detectionsRef.onSnapshot(
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          seconds: doc.data().timestamp.nanoseconds,
        }));
        console.log('tss', data[0]?.timestamp.seconds);
        detections.value = data;
      },
      (err) => {
        console.log(`snapshot`, err);
      }
    );
  }

  const app = createApp(index);

  app
    .provide('authService', authService)
    .provide('databaseService', databaseService)
    .provide('notificationService', notificationService)
    .provide('detections', detections)
    .provide('appearance', ref(prefs.getAppearance()))
    .use(DrawerPlugin);

  app.start();
} catch (error) {
  console.error('App initialization failed:', error);
}
