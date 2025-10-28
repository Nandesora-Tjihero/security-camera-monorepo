/*
 * DEPRECATION NOTE
 * ---------------------------------------------------------------------
 * This plugin provided client-side helpers to create and manage FCM
 * notification device-groups by calling the legacy FCM device group REST
 * endpoints. The project now uses a Storage -> Cloud Function -> Notification
 * flow where grouping and notification sending happen server-side.
 *
 * The client-side helpers here are deprecated and kept only for historical
 * reference. Prefer Cloud Function implementations in `sec-funcs/` and
 * server-side endpoints under `server/api/`.
 * ---------------------------------------------------------------------
 */

export default defineNuxtPlugin(async (nuxtApp) => {
  async function createDeviceGroup(
    userId: string,
    registrationTokens: string[]
  ) {
    try {
      const data = await fetch('https://fcm.googleapis.com/fcm/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          access_token_auth: 'true',
        },
        body: JSON.stringify({
          operation: 'create',
          notification_key_name: `appUser-${userId}`,
          registration_ids: registrationTokens,
        }),
      });

      return await data.json();
    } catch (error) {
      console.error('Error creating device group:', error);
    }
  }

  async function addDeviceToGroup(
    userId: string,
    registrationTokens: string[],
    notification_key: string
  ) {
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

  return {
    provide: {
      deviceGroupManager: {
        createDeviceGroup,
      },
    },
  };
});
