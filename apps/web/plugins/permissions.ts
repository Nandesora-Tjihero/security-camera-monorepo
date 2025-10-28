export default defineNuxtPlugin(async (nuxtApp) => {
  async function getNotificationsPermissionStatus() {
    const notificationPermissionStatus = await navigator.permissions.query({
      name: "notifications",
    });
    return new Promise((resolve) => {
      notificationPermissionStatus.onchange = () => {
        resolve(notificationPermissionStatus.state);
        // emit("notificationsPermissionStatusChanged", notificationPermissionStatus.state);
      };
      resolve(notificationPermissionStatus.state);
    });
  }

  async function requestNotificationsPermission() {
    const permissionStatus = await navigator.permissions.query({
      name: "notifications",
    });

    if (permissionStatus.state === "granted") {
      return;
    }
    console.log("Requesting notifications permission");
    await Notification.requestPermission();
  }

  return {
    provide: {
      notifications: {
        getNotificationsPermissionStatus,
        requestNotificationsPermission,
      },
    },
  };
});
