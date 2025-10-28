export interface INotificationService {
  requestUserPermission(): Promise<boolean>;
  registerDeviceForPushNotifications(userId: string): Promise<void>;
  unregisterDeviceFromPushNotifications(): Promise<void>;
}
