import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import { FieldValue } from '@nativescript/firebase-firestore';

export interface IDatabaseService {
  getUserById(userId: string): Promise<any>;

  saveTokenToDatabaseForUser(data: {
    userId: string;
    token: string;
  }): Promise<void>;
}

export class FirestoreDatabaseService implements IDatabaseService {
  constructor() {
    if (__DEV__) {
      // firebase().firestore().useEmulator('10.0.2.2', 8080);
    }
  }

  async getUserById(userId: string): Promise<any> {
    try {
      const userDoc = await firebase()
        .firestore()
        .collection('users')
        .doc(userId)
        .get();
      return userDoc.data();
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async saveTokenToDatabaseForUser(data: {
    userId: string;
    token: string;
  }): Promise<void> {
    try {
      await firebase()
        .firestore()
        .collection('users')
        .doc(data.userId)
        .update({
          tokens: FieldValue.arrayUnion([data.token]),
        });
      console.log(
        `Token ${data.token} saved to database for user ${data.userId}.`
      );
    } catch (error) {
      console.error('Error saving token to database:', error);
    }
  }
}
