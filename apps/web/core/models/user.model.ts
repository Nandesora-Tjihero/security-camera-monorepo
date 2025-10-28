import type { IdTokenResult } from 'firebase/auth';
import type { ISubscription } from '../contracts';

export interface ScUser {
  uid: string;
  email: string;
  displayName: string;
  subscriptionId?: ISubscription;
  tokens?: string[];
}

// const googleUser: User = {
//   uid: '12345',
//   displayName: 'Test User',
//   email: 'testuser@gmail.com',
//   photoURL: 'https://example.com/photo.jpg',
//   providerData: [
//     {
//       uid: '12345',
//       phoneNumber: null,
//       providerId: 'google.com',
//       displayName: 'Test User',
//       email: 'testuser@gmail.com',
//       photoURL: 'https://example.com/photo.jpg',
//     },
//   ],
//   refreshToken: 'mock-refresh-token',
//   emailVerified: true,

//   getIdToken: async () => {
//     return Promise.resolve('mock-id-token');
//   },
//   isAnonymous: false,
//   metadata: {
//     creationTime: '2023-01-01T00:00:00.000Z',
//     lastSignInTime: '2023-01-01T00:00:00.000Z',
//   },
//   tenantId: null,
//   delete: function (): Promise<void> {
//     throw new Error('Function not implemented.');
//   },
//   getIdTokenResult: function (forceRefresh?: boolean): Promise<IdTokenResult> {
//     throw new Error('Function not implemented.');
//   },
//   reload: function (): Promise<void> {
//     throw new Error('Function not implemented.');
//   },
//   toJSON: function (): object {
//     throw new Error('Function not implemented.');
//   },
//   phoneNumber: null,
//   providerId: '',
// };
export interface GoogleUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerData: Array<{
    uid: string;
    phoneNumber: string | null;
    providerId: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  }>;
  refreshToken: string;
  emailVerified: boolean;

  getIdToken: () => Promise<string>;
  isAnonymous: boolean;
  metadata: {
    creationTime: string | null;
    lastSignInTime: string | null;
  };
  tenantId: string | null;
  delete: () => Promise<void>;
  getIdTokenResult: (forceRefresh?: boolean) => Promise<IdTokenResult>;
  reload: () => Promise<void>;
  toJSON: () => object;
  phoneNumber: string | null;
  providerId: string;
}
