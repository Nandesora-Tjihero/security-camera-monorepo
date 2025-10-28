const notifyDeviceGroupAboutMonitoringStatusChange = require('./notifyDeviceGroupAboutMonitoringStatusChange');
const retrieveNotKey = require('./retrieveNotKey');
const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const getAccessToken = require('./getAccessToken');
const PROJECT_ID = '1092350635908';
const { DeviceGroupManager } = require('./DeviceGroupManager');
const deviceGroupManager = new DeviceGroupManager(PROJECT_ID, getAccessToken);
exports.notifyMonitoringStatusChange = onDocumentUpdated(
  {
    document: 'users/{userId}',
    region: 'europe-west1',
  },
  async (event) => {
    const userData = event.data?.after.data();
    const isMonitoring = userData?.isMonitoring;
    const userId = event.params.userId;
    const accessToken = await deviceGroupManager.getAccessToken();
    try {
      const notification_key = await retrieveNotKey(
        userId,
        accessToken,
        PROJECT_ID
      );
      await notifyDeviceGroupAboutMonitoringStatusChange(
        db,
        userId,
        PROJECT_ID,
        isMonitoring,
        notification_key.notification_key
      );
    } catch (e) {
      console.error(
        'Error sending isMonitoring message to FCM backend: ' + e.code
      );
    }
  }
);
