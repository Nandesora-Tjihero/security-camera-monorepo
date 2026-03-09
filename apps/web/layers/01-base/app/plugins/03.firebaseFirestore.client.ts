import {
  connectFirestoreEmulator,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  type WhereFilterOp,
} from "firebase/firestore";
import type { FirestoreAdapter } from "~~/shared/types/firestore-adapter";
import { firestoreDB } from "~~/shared/firestore";

const clientFirestoreAdapter: FirestoreAdapter = {
  doc,
  getDoc,
  setDoc,
  collection,
  query: (collectionRef, queryConstraints) => {
    const [fieldPath, opStr, value] = queryConstraints;
    return query(
      collectionRef,
      where(fieldPath, opStr as WhereFilterOp, value),
    );
  },
  where: (fieldPath, opStr, value) =>
    where(fieldPath, opStr as WhereFilterOp, value),
  getDocs: (queryRef) => getDocs(queryRef),
  // Add other methods you need
};
export default defineNuxtPlugin((nuxtApp) => {
  const firestore = (nuxtApp.$firebase as { firestore: any }).firestore;
  const config = useRuntimeConfig();

  if (import.meta.client && config.public.useEmulators) {
    connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
  }

  const dB = firestoreDB(firestore, clientFirestoreAdapter);

  return {
    provide: {
      firestoreDB: dB,
    },
  };
});
