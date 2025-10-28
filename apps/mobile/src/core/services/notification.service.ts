import { INotificationService } from '../contracts';
import { firebase } from '@nativescript/firebase-core';

import '@nativescript/firebase-messaging';
import { IDatabaseService } from './database.service';
import { AuthorizationStatus } from '@nativescript/firebase-messaging';

export class FirebaseNotificationService implements INotificationService {
  constructor(private databaseService: IDatabaseService) {}

  async requestUserPermission() {
    const authStatus = await firebase()
      .messaging()
      .requestPermission({
        ios: {
          alert: true,
        },
      });
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);

      const didRegister = await firebase()
        .messaging()
        .registerDeviceForRemoteMessages();
    }
    return enabled;
  }

  async registerDeviceForPushNotifications(userId: string): Promise<void> {
    try {
      // Get the device token
      const token = await firebase().messaging().getToken();
      await this.databaseService.saveTokenToDatabaseForUser({
        userId,
        token,
      });
    } catch (error) {
      console.error('Error registering device for push notifications:', error);
    }
  }

  async unregisterDeviceFromPushNotifications(): Promise<void> {
    // Implementation for unregistering device from push notifications
  }
}
