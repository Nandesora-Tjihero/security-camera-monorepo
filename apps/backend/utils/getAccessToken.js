// const { google } = require('googleapis');
// async function getAccessToken() {
//   const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
//   const SCOPES = [MESSAGING_SCOPE];
//   return new Promise(function (resolve, reject) {
//     const key = require('../security-camera-4324d.json');
//     const jwtClient = new google.auth.JWT(
//       key.client_email,
//       null,
//       key.private_key,
//       SCOPES,
//       null
//     );
//     jwtClient.authorize(function (err, tokens) {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(tokens.access_token);
//     });
//   });
// }

// module.exports = getAccessToken;
