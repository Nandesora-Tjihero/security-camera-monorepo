import { vi } from 'vitest';
import type { IDatabaseService } from '#shared/core/contracts/database.contract';

// vi.mock('~/plugins/firebaseFunctions.ts', () => ({
//   default: vi.fn(() => ({
//     provide: {
//       functions: {},
//     },
//   })),
// }));
// // test/setup.ts

// vi.mock('firebase/app', () => ({
//   initializeApp: vi.fn(),
//   getApp: vi.fn(),
//   getApps: vi.fn(() => []),
// }));

// vi.mock('firebase/auth', () => ({
//   getAuth: vi.fn(),
//   onAuthStateChanged: vi.fn(),
// }));

// vi.mock('firebase/firestore', () => ({
//   getFirestore: vi.fn(),
//   doc: vi.fn((...args: any[]) => ({ id: 'mock-doc', data: () => ({}) })),
//   getDoc: vi.fn(async (ref: any) => ({
//     exists: () => false,
//     data: () => ({}),
//   })),
//   setDoc: vi.fn(async (ref: any, data: any) => ({ ...data })),
//   collection: vi.fn(() => ({ path: 'mock-collection' })),
//   query: vi.fn((collectionRef: any, constraints: any) => ({
//     _constraints: constraints,
//   })),
//   where: vi.fn((fieldPath: any, opStr: any, value: any) => [
//     fieldPath,
//     opStr,
//     value,
//   ]),
//   getDocs: vi.fn(async (query: any) => ({ empty: true, docs: [] })),
// }));

// vi.mock('firebase/storage', () => ({
//   getStorage: vi.fn(),
// }));

// vi.mock('@/plugins/01.firebaseInit', () => ({
//   default: vi.fn(() => ({
//     provide: {
//       firebase: {
//         app: {},
//         auth: {},
//         firestore: {},
//         storage: {},
//         getCurrentUser: vi.fn(() => Promise.resolve(null)),
//       },
//     },
//   })),
// }));

// vi.mock('~/plugins/01.firebaseInit', () => ({
//   default: vi.fn(() => ({
//     provide: {
//       firebase: {
//         app: {},
//         auth: {},
//         firestore: {},
//         storage: {},
//         getCurrentUser: vi.fn(() => Promise.resolve(null)),
//       },
//     },
//   })),
// }));

// vi.mock('~/plugins/02.firebaseAuth.client.ts', () => {
//   const googleUser = {
//     uid: '12345',
//     displayName: 'Test User',
//     email: 'testuser@gmail.com',
//     photoURL: 'https://example.com/testuser.jpg',
//     providerId: 'google.com',
//     emailVerified: true,
//   };
//   return {
//     default: vi.fn(() => ({
//       provide: {
//         firebaseAuth: {
//           signInWithGoogle: vi.fn(async () => Promise.resolve(googleUser)),
//           convertToScUser: vi.fn((user) => ({
//             uid: user.uid,
//             email: user.email,
//             displayName: user.displayName,
//           })),
//           signOut: vi.fn(),
//         },
//       },
//     })),
//   };
// });

// vi.mock('~/plugins/03.firebaseFirestore.client.ts', () => {
//   // Mock all methods from shared/firestore.ts
//   return {
//     default: vi.fn(() => ({
//       provide: {
//         firestoreDB: {
//           addDataToDocForUser: vi.fn(),
//           createUser: vi.fn(async (user) => Promise.resolve({ ...user })),
//           getUserById: vi.fn(async (userId) => {
//             if (userId === '12345') {
//               return Promise.resolve({
//                 uid: '12345',
//                 email: 'testuser@gmail.com',
//                 displayName: 'Test User',
//               });
//             }
//             return Promise.resolve(null);
//           }),
//           getUserByEmail: vi.fn(),
//           saveUserSubscription: vi.fn(),
//           getSubscription: vi.fn(),
//           hasUserUsedFreeTrial: vi.fn(),
//           saveCustomerId: vi.fn(),
//           getDataFromDocForUser: vi.fn(),
//           getDetectionsByUser: vi.fn(),
//           saveDetectionForUser: vi.fn(),
//         },
//       },
//     })),
//   };
// });

// vi.mock('~/plugins/03.firebaseFirestore.client.ts', () => ({
//   default: vi.fn(() => ({
//     provide: {
//       firestoreDB: {
//         addDataToDocForUser: vi.fn(),
//         createUser: vi.fn(async (user) => Promise.resolve({ ...user })),
//         getUserById: vi.fn(async (userId) => {
//           if (userId === '12345') {
//             return Promise.resolve({
//               uid: '12345',
//               email: 'testuser@gmail.com',
//               displayName: 'Test User',
//             });
//           }
//           return Promise.resolve(null);
//         }),
//         getUserByEmail: vi.fn(),
//         saveUserSubscription: vi.fn(),
//         getSubscription: vi.fn(),
//         hasUserUsedFreeTrial: vi.fn(),
//         saveCustomerId: vi.fn(),
//         getDataFromDocForUser: vi.fn(),
//         getDetectionsByUser: vi.fn(),
//         saveDetectionForUser: vi.fn(),
//       },
//     },
//   })),
// }));

// vi.mock('@/plugins/03.firebaseFirestore.client', () => ({
//   default: vi.fn(() => ({
//     provide: {
//       firestoreDB: {
//         addDataToDocForUser: vi.fn(),
//         createUser: vi.fn(async (user) => Promise.resolve({ ...user })),
//         getUserById: vi.fn(async (userId) => {
//           if (userId === '12345') {
//             return Promise.resolve({
//               uid: '12345',
//               email: 'testuser@gmail.com',
//               displayName: 'Test User',
//             });
//           }
//           return Promise.resolve(null);
//         }),
//         getUserByEmail: vi.fn(),
//         saveUserSubscription: vi.fn(),
//         getSubscription: vi.fn(),
//         hasUserUsedFreeTrial: vi.fn(),
//         saveCustomerId: vi.fn(),
//         getDataFromDocForUser: vi.fn(),
//         getDetectionsByUser: vi.fn(),
//         saveDetectionForUser: vi.fn(),
//       },
//     },
//   })),
// }));
// vi.mock('~/plugins/firebaseStorage.client.ts', () => ({
//   default: vi.fn(() => ({
//     provide: {
//       firebaseStorage: {
//         uploadImage: vi.fn(),
//         getImageUrl: vi.fn(),
//       },
//     },
//   })),
// }));

// Deterministic service mocks inside the factory

// const MockDetectionOrchestrator = vi.fn(function (
//   this: any,
//   detectionService?: any,
//   storageService?: any,
//   detectionCooldownMs?: number
// ) {
//   // store constructor args on the instance for assertions
//   this._detectionService = detectionService;
//   this._storageService = storageService;
//   this._cooldown = detectionCooldownMs ?? 10000;

//   // instance spies
//   this.startMonitoring = vi.fn(
//     async (video?: HTMLVideoElement, userId?: string) => {
//       this.__video = video;
//       this.__userId = userId;
//     }
//   );

//   this.stopMonitoring = vi.fn(() => {
//     this.__video = null;
//     this.__userId = null;
//   });

//   this.onPersonDetected = vi.fn((cb: (imageUrl: string) => void) => {
//     this._personCb = cb;
//   });

//   // test helper to simulate a detection callback
//   this.triggerPersonDetected = vi.fn(async (imageUrl: string) => {
//     if (typeof this._personCb === 'function') {
//       await this._personCb(imageUrl);
//     }
//   });
// });

import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';
import { createFetch } from 'ofetch';

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  (globalThis as any).$fetch = createFetch();
});

// Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers());

vi.mock('#layers/01-base/app/utils/services', async () => {
  const mockGetUserById = vi.fn(async (uid: string) => null);
  const mockCreateUser = vi.fn(async (user: any) => ({ ...user }));
  const mockGetSubscription = vi.fn(async (uid: string) => null);

  const mockSignInWithGoogle = vi.fn(async () => ({
    uid: '12345',
    email: 'testuser@gmail.com',
    displayName: 'Test User',
    getIdToken: vi.fn(async () => 'mock-id-token'),
  }));
  const mockConvertToScUser = vi.fn((user: any) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  }));

  return {
    getDatabaseService: vi.fn(() => ({
      getUserById: mockGetUserById,
      createUser: mockCreateUser,
      getSubscription: mockGetSubscription,
    })),
    getAuthService: vi.fn(() => ({
      signInWithGoogle: mockSignInWithGoogle,
      convertToScUser: mockConvertToScUser,
    })),
    getBillingService: vi.fn(() => ({ createCheckoutSession: vi.fn() })),
    getStorageService: vi.fn(() => ({
      uploadImage: vi.fn(async (userId: string, blob: Blob) => {
        return `https://storage.service/${userId}/image.jpg`;
      }),
      getImageUrl: vi.fn(),
    })),
    getDetectionService: vi.fn(() => ({
      startDetection: vi.fn(async (video: HTMLVideoElement) => {}),
      stopDetection: vi.fn(() => {}),
      onDetection: vi.fn(),
    })),
    DetectionOrchestrator: vi.fn(function (
      this: any,
      detectionService?: any,
      storageService?: any,
      detectionCooldownMs?: number
    ) {
      // store constructor args on the instance for assertions
      this._detectionService = detectionService;
      this._storageService = storageService;
      this._cooldown = detectionCooldownMs ?? 10000;

      // instance spies
      this.startMonitoring = vi.fn(
        async (video?: HTMLVideoElement, userId?: string) => {
          this.__video = video;
          this.__userId = userId;
        }
      );

      this.stopMonitoring = vi.fn(() => {
        this.__video = null;
        this.__userId = null;
      });

      this.onPersonDetected = vi.fn((cb: (imageUrl: string) => void) => {
        this._personCb = cb;
      });

      // test helper to simulate a detection callback
      this.triggerPersonDetected = vi.fn(async (imageUrl: string) => {
        if (typeof this._personCb === 'function') {
          await this._personCb(imageUrl);
        }
      });
    }),
  };
});
