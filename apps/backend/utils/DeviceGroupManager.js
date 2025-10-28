/*
 * LEGACY DEVICE GROUP MANAGER
 * ---------------------------------------------------------------------
 * This class wraps the legacy FCM device-group management endpoints. It is
 * kept for historical reference but the recommended architecture now
 * triggers notifications from Cloud Functions after Storage events.
 
 * ---------------------------------------------------------------------
 */

exports.DeviceGroupManager = class DeviceGroupManager {
  constructor(PROJECT_ID, getAccessToken) {
    this.PROJECT_ID = PROJECT_ID;
    this.getAccessToken = getAccessToken;
  }
  async createDeviceGroup(userId, registrationTokens) {

    const data = JSON.stringify({
      operation: 'create',
      notification_key_name: `appUser-${userId}`,
      registration_ids: registrationTokens,
    });

    const accessToken = await this.getAccessToken();
    const HOST = 'fcm.googleapis.com';
    const PATH = '/fcm/notification';

    const options = {
      hostname: HOST,
      path: PATH,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        access_token_auth: true,
        project_id: this.PROJECT_ID,
      },
    };
    const https = require('https');
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', async () => {
          console.log('Device group response o: ', responseData);
          const _responseData = JSON.parse(responseData);
          if (
            _responseData.error &&
            _responseData.error === 'notification_key already exists'
          ) {
            // retrieve the notification key
            const notification_key = await this.retrieveNotificationKey(
              userId,
              accessToken,
              this.PROJECT_ID
            );
            await this.addDeviceToGroup(
              userId,
              registrationTokens,
              notification_key.notification_key
            );
            resolve(notification_key);
          }

          _responseData.notification_key = _responseData.notification_key;
          resolve(_responseData);
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.write(data);
      req.end();
    });
  }

  async retrieveNotificationKey(userId, accessToken, PROJECT_ID) {
    const options = {
      hostname: 'fcm.googleapis.com',
      path: `/fcm/notification?notification_key_name=appUser-${userId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        access_token_auth: true,
        Authorization: `Bearer ${accessToken}`,
        project_id: this.PROJECT_ID,
      },
    };
    const https = require('https');
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
      request.write(JSON.stringify({}));
      request.end();
    });
  }

  async addDeviceToGroup(userId, registrationTokens, notification_key) {
    try {
      const data = await fetch('https://fcm.googleapis.com/fcm/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          access_token_auth: 'true',
        },
        body: JSON.stringify({
          operation: 'add',
          notification_key_name: `appUser-${userId}`,
          notification_key: notification_key,
          registration_ids: registrationTokens,
        }),
      });

      return await data.json();
    } catch (error) {
      console.error('Error adding device to group:', error);
    }
  }
};
