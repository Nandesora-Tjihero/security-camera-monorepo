export interface FirestoreAdapter {
  doc(firestore: any, ...pathSegments: string[]): any;
  getDoc(docRef: any): Promise<any>;
  setDoc(docRef: any, data: any): Promise<void>;
  collection(firestore: any, collectionPath: string): any;
  query(collection: any, queryConstraints: any[]): any;
  where(fieldPath: string, opStr: string, value: any): any;
  getDocs(query: any): Promise<any>;
  // Add other methods you need
}
