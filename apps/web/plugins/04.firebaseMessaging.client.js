/*
 * DEPRECATION NOTE
 * ---------------------------------------------------------------------
 * This client-side messaging plugin contains legacy helpers for registering
 * tokens and handling FCM messages in the client. The project now uses the
 * flow: Storage -> Cloud Function -> Notification. Token lifecycle and
 * notification sending are handled server-side / in Cloud Functions.
 *
 * The file is kept for reference only and is not required by the updated
 * architecture. Consider removing it once Cloud Functions are fully
 * deployed and in use.
 *
 * See: `sec-funcs/*`, `server/utils/sendNotificationRequestWithUserIdAndImgUR.ts`
 * for the current notification flow.
 * ---------------------------------------------------------------------
 */

import { getToken, onMessage, getMessaging } from 'firebase/messaging';
// import { getMessaging } from 'firebase/messaging/sw';
export default defineNuxtPlugin(async (nuxtApp) => {
  // const messaging = getMessaging(nuxtApp.$firebase.app);
  // const firestoreDB = nuxtApp.$firestoreDB;
  // const notifications = nuxtApp.$notifications;

  const notificationsPermissionStatus = await navigator.permissions.query({
    name: 'notifications',
  });


  // notificationsPermissionStatus.onchange = async (ev) => {
  //   if (ev.target.name === 'notifications') {
  //     console.log(
  //       'Notification permission status changed to: ',
  //       ev.target.state
  //     );
  //     if (ev.target.state === 'granted') {
  //       // await notifyMe();
  //     } else {
  //       await updateTokenInFirestore(null);
  //     }
  //   }
  // };

  // onMessage(messaging, async (payload) => {
  //   console.log('Message received. ', payload.notification.title);
  //   if (payload.notification.title == 'Monitoring Status Change') {
  //     let isMonitoring = payload.notification.body;
  //     isMonitoring = isMonitoring === 'true' ? true : false;
  //     const $bus = nuxtApp.$bus;
  //     $bus.emit('monitoring-status-changed', isMonitoring);
  //     // notifications.notifyUser('Monitoring status changed', isMonitoring);
  //   } else if (payload.notification.title == 'FCM tokens list updated') {
  //     const $bus = nuxtApp.$bus;
  //     $bus.emit('fcm-tokens-list-updated', payload.notification.body);
  //   } else {
  //     console.log('Notification received: ', payload);
  //     clearNuxtState('notification');

  //     useState('notification', () => payload);
  //     await navigateTo('/detected-person');
  //   }
  // });

  // async function notifyMe() {
  //   console.log('Checking notification permission...');
  //   if (Notification.permission == 'granted') {
  //     let registrationToken = await getRegistrationToken();
  //     if (registrationToken) {
  //       console.log('Registration token available: ', registrationToken);

  //       await updateTokenInFirestore(registrationToken).catch((error) => {
  //         console.error('Error updating token in Firestore: ', error);
  //       });
  //     } else {
  //       console.log('No registration token available.');
  //       const permission = await Notification.requestPermission();
  //       if (permission === 'granted') {
  //         console.log('Permission granted.');
  //         registrationToken = await getRegistrationToken();
  //         await updateTokenInFirestore(registrationToken);
  //       }
  //     }
  //   } else if (Notification.permission === 'default') {
  //     console.log('Requesting notification permission...');
  //     const permission = await requestPermission();
  //     if (permission === 'granted') {
  //       console.log('Permission granted.');
  //       let registrationToken = await getRegistrationToken();
  //       await updateTokenInFirestore(registrationToken);
  //     }
  //   } else {
  //     if (Notification.permission === 'denied') {
  //       console.error('User has blocked notifications.');
  //       alert('Grant permission to receive notifications.');
  //     }
  //   }
  // }
  // async function updateTokenInFirestore(token) {
  //   await firestoreDB.addDataToDocForUser(
  //     { token: token ? token : '' },
  //     'fcmTokens',
  //     useState('user').value.uid
  //   );
  // }

  // async function requestPermission() {
  //   try {
  //     const permission = await Notification.requestPermission();
  //     return permission;
  //   } catch (error) {
  //     console.error('Error requesting notification permission: ', error);
  //   }
  // }

  // async function getRegistrationToken() {
  //   try {
  //     const runtimeConfig = useRuntimeConfig();
  //     const currentToken = await getToken(messaging, {
  //       vapidKey: runtimeConfig.public.vapidKey,
  //     });
  //     if (currentToken) {
  //       return currentToken;
  //     } else {
  //       console.log(
  //         'No registration token available. Request permission to generate one.'
  //       );
  //       return null;
  //     }
  //   } catch (error) {
  //     if (error.code == 'messaging/permission-blocked') {
  //       console.error('User has blocked notifications.');
  //       alert('Grant permission to receive notifications.');
  //     }
  //     console.error('An error occurred while retrieving token. ', error);
  //   }
  // }


  return {
    provide: {
      messaging: {
        // notifyMe,
      },
    },
  };
});
