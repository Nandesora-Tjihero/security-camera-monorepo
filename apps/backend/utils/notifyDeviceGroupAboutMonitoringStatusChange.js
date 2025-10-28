const saveDeviceGroupKeyToFirestore = require('./saveDeviceGroupKeyToFirestore');
const getAccessToken = require('./getAccessToken');
const https = require('https');

async function notifyDeviceGroupAboutMonitoringStatusChange(
  db,
  userId,
  PROJECT_ID,
  isMonitoring,
  notification_key
) {
  const doc = await db.collection('users').doc(userId).get();
  const notificationObj = doc.data()?.notification_key;
  const HOST = 'fcm.googleapis.com';
  console.log('PROJECT_ID: ', PROJECT_ID);
  const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';

  const accessToken = await getAccessToken();
  console.log('Access token in device group notification: ', accessToken);
  const options = {
    hostname: HOST,
    path: PATH,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  const request = https.request(options, async function (resp) {
    resp.setEncoding('utf8');
    let responseData = '';
    resp.on('data', function (data) {
      console.log('Message sent to Firebase for delivery, response:');
      console.log(data);
      responseData += data;
    });
    resp.on('end', function () {
      console.log('End of response from Firebase');
      console.log('Response data: ', JSON.parse(responseData));
    });
  });

  request.on('error', function (err) {
    console.log('Unable to send message to Firebase');
    console.log(err);
  });

  const fcmMessage = {
    message: {
      token: notification_key,
      notification: {
        title: 'Monitoring Status Change',
        body: `${isMonitoring}`,
      },
    },
  };
  request.write(JSON.stringify(fcmMessage));
  request.end();
}

module.exports = notifyDeviceGroupAboutMonitoringStatusChange;
