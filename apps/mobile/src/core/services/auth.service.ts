import { ScUser } from '../../../../security-camera/core/models/user.model';

import { firebase } from '@nativescript/firebase-core';
import { GoogleAuthProvider, User, Auth } from '@nativescript/firebase-auth';
import { GoogleSignin } from '@nativescript/google-signin';
import { IAuthService } from '../contracts/auth.contract';
import { ref } from 'nativescript-vue';

export class AuthServiceGoogle implements IAuthService {
  user = ref<ScUser | null>(null);
  constructor() {
    // Use emulator only in dev mode
    if (__DEV__) {
      // firebase().auth().useEmulator('10.0.2.2', 9099);
    }
  }
  // Sign-in using Google and return a platform-agnostic domain user (ScUser)
  async signInWithGoogle(): Promise<ScUser | undefined> {
    try {
      await GoogleSignin.configure({});

      const user = await GoogleSignin.signIn();
      let credential;
      if (__DEV__) {
        credential = GoogleAuthProvider.credential(
          user.idToken,
          user.accessToken
          // '{"sub": "abc123", "email": "otter.raccoon.764@example.com", "email_verified": true}'
          // this 👇🏻 is obtained from user signed in via web emulator
          // 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJuYW1lIjoiQ2hpY2tlbiBHcmFzcyIsImVtYWlsIjoiY2hpY2tlbi5ncmFzcy42MDNAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXV0aF90aW1lIjoxNzYwMjAwNDcxLCJ1c2VyX2lkIjoicFdmd3ltYkNRNExHRmo5aExqeUFaRVZES0Z3SSIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiY2hpY2tlbi5ncmFzcy42MDNAZXhhbXBsZS5jb20iXSwiZ29vZ2xlLmNvbSI6WyI2Mzg5MzY5NjIyNjU0MDQ4ODU2MTk0NDIwNTAzMTUzOTQ3MTk2MDI1Il19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9LCJpYXQiOjE3NjAyMDA0NzEsImV4cCI6MTc2MDIwNDA3MSwiYXVkIjoic2VjdXJpdHktY2FtZXJhLWE0MTNlIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3NlY3VyaXR5LWNhbWVyYS1hNDEzZSIsInN1YiI6InBXZnd5bWJDUTRMR0ZqOWhManlBWkVWREtGd0kifQ.',
          // undefined as any
        );
      } else {
        credential = GoogleAuthProvider.credential(
          user.idToken,
          user.accessToken
        );
      }
      const userCredential = await firebase()
        .auth()
        .signInWithCredential(credential);
      console.log('User signed in with Google:', userCredential.user?.email);

      return this.convertToScUser(userCredential.user);
    } catch (error: any) {
      // Error 10 typically indicates a DEVELOPER_ERROR from Google Play Services
      // (most often due to missing SHA-1 on the Android OAuth client in Firebase).
      const message = error?.message || error?.toString?.() || 'Unknown error';
      console.error('Failed to sign in with Google:', message);
      if (typeof message === 'string' && message.includes('10')) {
        console.error(
          'Hint: Ensure your Android app SHA-1 is added in Firebase project settings and the google-services.json is updated.'
        );
      }
    }
  }

  convertToScUser(user: User): ScUser {
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
    };
  }

  async signOut(): Promise<void> {
    await firebase().auth().signOut();
  }
}
