import {
  CollectionReference,
  DocumentReference,
  getFirestore,
} from 'firebase-admin/firestore';

const adminFirestoreAdapter: FirestoreAdapter = {
  doc: (
    firestore: ReturnType<typeof getFirestore>,
    ...pathSegments: string[]
  ) => firestore.doc(pathSegments.join('/')),

  getDoc: (docRef: DocumentReference) => docRef.get(),

  setDoc: (docRef: DocumentReference, data: any) =>
    docRef.set(data).then(() => {}),
  collection: (
    firestore: ReturnType<typeof getFirestore>,
    collectionPath: string
  ) => firestore.collection(collectionPath),
  query: (
    collection: CollectionReference,
    queryConstraints: [
      string | FirebaseFirestore.FieldPath,
      FirebaseFirestore.WhereFilterOp,
      any
    ]
  ) => {
    const [fieldPath, opStr, value] = queryConstraints;
    return collection.where(fieldPath, opStr, value);
  },
  where: (
    fieldPath: string | FirebaseFirestore.FieldPath,
    opStr: string,
    value: any
  ) => [fieldPath, opStr, value],
  getDocs: (query: any) => query.get(),
  // Add other methods you need
};

const firestore = getFirestore(firebaseApp);

export const getFirestoreClient = (): IDatabaseService => {
  return firestoreDB(firestore, adminFirestoreAdapter) as IDatabaseService;
};
