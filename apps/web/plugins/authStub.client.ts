import type { IdTokenResult, User } from 'firebase/auth';
import type { IAuthService } from '~/core/contracts/auth.contract';

export default defineNuxtPlugin((nuxtApp) => {
  const mockUser: User = {
    uid: '12345',
    displayName: 'Test User',
    email: 'testuser@gmail.com',
    photoURL: 'https://example.com/photo.jpg',
    providerData: [
      {
        uid: '12345',
        phoneNumber: null,
        providerId: 'google.com',
        displayName: 'Test User',
        email: 'testuser@gmail.com',
        photoURL: 'https://example.com/photo.jpg',
      },
    ],
    refreshToken: 'mock-refresh-token',
    emailVerified: true,

    getIdToken: async () => {
      return Promise.resolve('mock-id-token');
    },
    isAnonymous: false,
    metadata: {
      creationTime: '2023-01-01T00:00:00.000Z',
      lastSignInTime: '2023-01-01T00:00:00.000Z',
    },
    tenantId: null,
    delete: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
    getIdTokenResult: function (
      forceRefresh?: boolean
    ): Promise<IdTokenResult> {
      throw new Error('Function not implemented.');
    },
    reload: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
    toJSON: function (): object {
      throw new Error('Function not implemented.');
    },
    phoneNumber: null,
    providerId: '',
  };
  const authService: IAuthService = {
    async signInWithGoogle() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockUser as User);
        }, 1000);
      });
    },

    convertToScUser(user: User) {
      return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
      };
    },

    async signOut() {
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    },
  };

  return {
    provide: {
      firebaseStubAuthService: authService,
    },
  };
});
