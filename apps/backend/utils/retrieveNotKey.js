const https = require('https');
async function retrieveNotKey(userId, accessToken, PROJECT_ID) {
  const options = {
    hostname: 'fcm.googleapis.com',
    path: `/fcm/notification?notification_key_name=appUser-${userId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      access_token_auth: true,
      Authorization: `Bearer ${accessToken}`,
      project_id: PROJECT_ID,
    },
  };
  return new Promise((resolve, reject) => {
    const request = https.request(options, function (resp) {
      resp.setEncoding('utf8');
      let responseData = '';
      resp.on('data', function (data) {
        responseData += data;
      });
      resp.on('end', function () {
        const _responseData = JSON.parse(responseData);
        _responseData.notification_key = _responseData.notification_key;
        resolve(_responseData);
      });
    });

    request.on('error', function (err) {
      console.log('Unable to retrieve notification key');
      console.log(err);
      reject(err);
    });
    request.write('');
    request.end();
  });
}

module.exports = retrieveNotKey;
