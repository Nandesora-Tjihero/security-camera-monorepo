import type { DetectionRecord } from '~/core/models/detection.model';
import type { FirestoreAdapter } from './types/firestore-adapter';
import type { ScUser } from '~/core/models/user.model';
import type { IDatabaseService } from '~/core/contracts/database.contract';

export const firestoreDB = (firestore: any, adapter: FirestoreAdapter) => {
  /**
   * Generic function to add data to a specific document for a user.
   * @param {*} data - The data to add.
   * @param {*} docId - The document ID.
   * @param {*} userId - The user ID.
   */
  async function addDataToDocForUser(
    docId: string,
    userId: string,
    data: { [key: string]: any }
  ) {
    const userDocRef = adapter.doc(firestore, docId, userId);
    const userDocData = await adapter.getDoc(userDocRef);

    if (userDocData.exists()) {
      let user = userDocData.data();
      user = { ...user, ...data };

      adapter.setDoc(userDocRef, user).catch((error) => {
        console.error('Error writing document: ' + userId, error);
      });
    }
  }

  async function getDataFromDocForUser(
    docId: string,
    userId: string,
    key: string
  ) {
    const userDocRef = adapter.doc(firestore, docId, userId);
    const userDocData = await adapter.getDoc(userDocRef);

    if (userDocData.exists()) {
      const user = userDocData.data();
      return user[key];
    } else {
      return null;
    }
  }

  async function createUser(data: ScUser) {
    const userDocRef = adapter.doc(firestore, 'users', data.uid);

    adapter.setDoc(userDocRef, data).catch((error) => {
      console.error('Error writing document: ' + data.uid, error);
    });
  }

  async function getUserById(userId: string) {
    const userDocRef = adapter.doc(firestore, 'users', userId);

    const docSnap = await adapter.getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data as ScUser;
    } else {
      return null;
    }
  }

  async function getUserByEmail(email: string) {
    const usersCollection = adapter.collection(firestore, 'users');
    const query = adapter.query(usersCollection, ['email', '==', email]);

    try {
      const querySnapshot = await adapter.getDocs(query);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return {
          uid: userDoc.id,
          email: userDoc.data().email,
          displayName: userDoc.data().displayName,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async function saveCustomerId(userId: string, customerId: string) {
    const userDocRef = adapter.doc(firestore, 'users', userId);
    const userDoc = await adapter.getDoc(userDocRef);
    if (userDoc.exists) {
      const user = userDoc.data();
      user.customerId = customerId;
      adapter.setDoc(userDocRef, user).catch((error) => {
        console.error('Error writing document: ' + userId, error);
      });
    }
  }

  async function getCustomerId(userId: string) {
    const userDocRef = adapter.doc(firestore, 'users', userId);
    const docSnap = await adapter.getDoc(userDocRef);

    if (docSnap.exists()) {
      return docSnap.data().customerId;
    } else {
      return null;
    }
  }

  async function saveUserSubscription(userId: string, subscription: any) {
    const userDocRef = adapter.doc(firestore, 'users', userId);
    const userDoc = await adapter.getDoc(userDocRef);
    if (userDoc.exists()) {
      const user = userDoc.data();
      user.subscription = JSON.stringify(subscription);
      adapter.setDoc(userDocRef, user).catch((error) => {
        console.error('Error writing document subscription: ' + userId, error);
      });
    }
  }

  async function getSubscription(userId: string) {
    const userDocRef = adapter.doc(firestore, 'users', userId);
    const docSnap = await adapter.getDoc(userDocRef);

    if (docSnap.exists()) {
      const subscription = docSnap.data().subscription;
      return subscription ? JSON.parse(subscription) : null;
    } else {
      return null;
    }
  }

  async function hasUserUsedFreeTrial(userId: string) {
    try {
      const subscription = await getSubscription(userId);
      return subscription ? subscription.hasUsedFreeTrial : false;
    } catch (error) {
      console.error('Error checking free trial usage:', error);
      return false;
    }
  }

  async function saveDetectionForUser(
    userId: string,
    detection: DetectionRecord
  ) {
    const userDocRef = adapter.doc(firestore, 'users', userId);
    const userDoc = await adapter.getDoc(userDocRef);
    if (userDoc.exists()) {
      const user = userDoc.data();
      user.detection = detection;
      adapter.setDoc(userDocRef, user).catch((error) => {
        console.error('Error writing document detection: ' + userId, error);
      });
    } else {
      console.error('User document does not exist: ' + userId);
    }
  }

  async function getDetectionsByUser(
    userId: string,
    startTime?: number,
    endTime?: number,
    offset?: number,
    limit?: number
  ) {
    // Not implemented in Firestore stub
    return [];
  }

  const firestoreDB: IDatabaseService = {
    addDataToDocForUser,
    createUser,
    getUserById,
    getUserByEmail,
    saveUserSubscription,
    getSubscription,
    hasUserUsedFreeTrial,
    saveCustomerId,
    getDataFromDocForUser,
    getDetectionsByUser,
    saveDetectionForUser,
  };

  return firestoreDB;
};
