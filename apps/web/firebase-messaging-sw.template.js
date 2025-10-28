// importScripts(
//   'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js'
// );
// importScripts(
//   'https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js'
// );


// // Initialize the Firebase app in the service worker by passing in
// // your app's Firebase config object.
// // https://firebase.google.com/docs/web/setup#config-object
// let firebaseConfig = '__FIREBASE_CONFIG__';
// firebaseConfig = JSON.parse(firebaseConfig);
// console.log(firebaseConfig);

// const firebaseApp = firebase.initializeApp(firebaseConfig);

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = firebase.messaging();

// messaging.onMessage(async (payload) => {
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

// self.addEventListener('notificationclick', (event) => {
//   event.waitUntil(handleNotificationClick(event));
// });

// async function handleNotificationClick(event) {
//   self.clients.matchAll().then((clients) => {
//     clients.forEach((client) => {
//       client.postMessage({
//         type: 'NOTIFICATION_CLICK',
//         data: event.notification,
//       });
//     });
//   });
// }
// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     '[firebase-messaging-sw.js] Received background message ',
//     payload
//   );

//   // Customize notification here
//   const notificationTitle = 'Person Detected';
//   const notificationOptions = {
//     body: 'Person Detected',
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
