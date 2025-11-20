import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import { FieldValue } from '@nativescript/firebase-firestore';
import { IDetection } from '../models';

export interface IDatabaseService {
  getUserById(userId: string): Promise<any>;

  saveTokenToDatabaseForUser(data: {
    userId: string;
    token: string;
  }): Promise<void>;

  getUserDetections(userId: string): Promise<IDetection[]>;
}

export class FirestoreDatabaseService implements IDatabaseService {
  constructor() {
    if (__DEV__) {
      // firebase().firestore().useEmulator('10.0.2.2', 8080);
    }
  }

  async getUserById(userId: string): Promise<any> {
    try {
      const db = firebase().firestore();
      const userRef = db.collection('users').doc(userId);

      // 1️⃣ Fetch user document
      const userSnap = await userRef.get();
      if (!userSnap.exists) {
        console.warn(`User not found: ${userId}`);
        return null;
      }

      const userData = userSnap.data() || {};

      // 2️⃣ Fetch detections subcollection (it may not exist yet)
      const detectionsSnap = await userRef
        .collection('detections')
        .orderBy('timestamp', 'desc')
        .limit(5)
        .get();

      // 3️⃣ Convert safely
      const detections = detectionsSnap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          seconds: d.timestamp?.seconds ?? null,
        };
      });

      // 4️⃣ Combine results
      return {
        ...userData,
        detections, // Will just be [] if collection doesn’t exist yet
      };
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

  async getUserDetections(userId: string): Promise<IDetection[]> {
    let detections: IDetection[] = [];

    try {
      detections = await this.getUserById(userId);
      console.log('detections:', detections);
    } catch (error) {
      console.error('Error retrieving user detections: ', error);
    }

    return detections;
  }
}
