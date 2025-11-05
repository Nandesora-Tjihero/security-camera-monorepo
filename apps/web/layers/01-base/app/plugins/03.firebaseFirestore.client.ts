import {
  connectFirestoreEmulator,
  doc,
  getDoc,
  setDoc,
  collection,
} from 'firebase/firestore';
import type { FirestoreAdapter } from '../../shared/types/firestore-adapter';
import { firestoreDB } from '~~/shared/firestore';

const clientFirestoreAdapter: FirestoreAdapter = {
  doc,
  getDoc,
  setDoc,
  collection,
  query: (collection, queryConstraints) => {
    const [fieldPath, opStr, value] = queryConstraints;
    return collection.where(fieldPath, opStr, value);
  },
  where: (fieldPath, opStr, value) => [fieldPath, opStr, value],
  getDocs: (query) => query.get(),
  // Add other methods you need
};
export default defineNuxtPlugin((nuxtApp) => {
  const firestore = (nuxtApp.$firebase as { firestore: any }).firestore;
  //connectFirestoreEmulator(firestore, '127.0.0.1', 8080);

  const dB = firestoreDB(firestore, clientFirestoreAdapter);

  return {
    provide: {
      firestoreDB: dB,
    },
  };
});
