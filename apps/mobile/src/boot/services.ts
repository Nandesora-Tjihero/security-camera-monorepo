import { firebase } from '@nativescript/firebase-core';
import {
  AuthServiceGoogle,
  FirestoreDatabaseService,
  FirebaseNotificationService,
} from '~/core/services';

export const initServices = () => {
  const databaseService = new FirestoreDatabaseService();
  const notificationService = new FirebaseNotificationService(databaseService);
  const authService = new AuthServiceGoogle();

  return {
    authService,
    databaseService,
    notificationService,
  };
};
